/*!
 * contact-form.js — accessible contact form with inline validation.
 *
 * Works with the markup in index.html (#contactForm) and the settings in
 * assets/js/contact-config.js. Everything is plain ES5 + promises so the file
 * runs in every browser the rest of the site supports.
 *
 * What it does
 *  - inline, per-field validation (ARIA friendly, no third party plugin)
 *  - honeypot + time-trap + per-browser throttle spam protection
 *  - optional hCaptcha challenge when a site key is configured
 *  - posts to a JSON endpoint, with automatic retry of failed sends
 *  - falls back to the visitor's mail client when delivery is unavailable
 */
(function (window, document) {
  "use strict";

  /* ----------------------------------------------------------------------
   * configuration
   * -------------------------------------------------------------------- */
  var DEFAULT_CONFIG = {
    endpoint: "https://api.web3forms.com/submit",
    accessKey: "",
    email: "",
    subject: "New enquiry from the portfolio website",
    fromName: "Portfolio website",
    limits: { minFillSeconds: 4, throttleSeconds: 45, minMessageLength: 10, maxMessageLength: 2000 },
    captcha: { provider: "hcaptcha", siteKey: "" },
    offlineQueue: { enabled: true, key: "portfolio.pendingMessages", max: 10 },
    fallbackMailto: true,
    messages: {}
  };

  var THROTTLE_KEY = "portfolio.lastContactAt";
  var REQUEST_TIMEOUT = 15000;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function merge(target, source) {
    var out = {}, key;
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) { out[key] = target[key]; }
    }
    for (key in source) {
      if (!Object.prototype.hasOwnProperty.call(source, key)) { continue; }
      var value = source[key];
      if (value && typeof value === "object" && !Array.isArray(value) && typeof out[key] === "object") {
        out[key] = merge(out[key], value);
      } else if (value !== undefined && value !== null && value !== "") {
        out[key] = value;
      }
    }
    return out;
  }

  var userConfig = window.PORTFOLIO_CONTACT_CONFIG || {};
  var config = merge(merge(DEFAULT_CONFIG, userConfig), {});
  config.messages = merge(DEFAULT_CONFIG.messages, userConfig.messages || {});
  var M = config.messages;

  /* ----------------------------------------------------------------------
   * field definitions — one entry per form field that carries a rule
   * -------------------------------------------------------------------- */
  var FIELDS = [
    { id: "name",    label: "First name", rule: { required: true, minLength: 2 } },
    { id: "L_name",  label: "Last name",  rule: { required: true, minLength: 1 } },
    { id: "email",   label: "Email",      rule: { required: true, email: true } },
    { id: "message", label: "Message",    rule: { required: true, minLength: config.limits.minMessageLength } }
  ];

  var form = document.getElementById("contactForm");
  if (!form) { return; }

  var alertBox = document.getElementById("msgSubmit");
  var submitBtn = document.getElementById("form-submit");
  var startedField = document.getElementById("form-started");
  var honeypot = document.getElementById("website");
  var consent = document.getElementById("consent");
  var messageField = document.getElementById("message");
  var messageCount = document.getElementById("message-count");

  /* ----------------------------------------------------------------------
   * small helpers
   * -------------------------------------------------------------------- */
  function text(value) { return (value || "").trim(); }

  function fieldEl(field) { return document.getElementById(field.id); }

  function errorEl(field) { return document.getElementById("error-" + field.id); }

  function setError(field, message) {
    var input = fieldEl(field), box = errorEl(field);
    if (!input) { return; }
    if (message) {
      input.setAttribute("aria-invalid", "true");
      input.classList.add("has-error");
      if (box) { box.textContent = message; box.hidden = false; }
    } else {
      input.removeAttribute("aria-invalid");
      input.classList.remove("has-error");
      if (box) { box.textContent = ""; box.hidden = true; }
    }
  }

  function validateField(field) {
    var input = fieldEl(field);
    var value = input ? text(input.value) : "";
    var rule = field.rule;
    if (rule.required && !value) { return field.label + " is required."; }
    if (value && rule.minLength && value.length < rule.minLength) {
      return field.label + " should be at least " + rule.minLength + " characters.";
    }
    if (value && rule.email && !EMAIL_RE.test(value)) {
      return "Enter a valid email address, for example name@example.com.";
    }
    return "";
  }

  /* ----------------------------------------------------------------------
   * optional captcha (only rendered when a site key is configured)
   * -------------------------------------------------------------------- */
  var captchaToken = "";

  function loadCaptcha() {
    if (!config.captcha.siteKey) { return; }
    var slot = document.getElementById("captcha-slot");
    if (!slot) { return; }
    slot.hidden = false;
    var script = document.createElement("script");
    script.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = function () {
      if (window.hcaptcha && typeof window.hcaptcha.render === "function") {
        window.hcaptcha.render(slot, {
          sitekey: config.captcha.siteKey,
          callback: function (token) { captchaToken = token; },
          "expired-callback": function () { captchaToken = ""; }
        });
      }
    };
    document.head.appendChild(script);
  }

  /* ----------------------------------------------------------------------
   * spam protection — honeypot, time trap and per browser throttle
   * -------------------------------------------------------------------- */
  function botSignal() {
    if (honeypot && text(honeypot.value)) { return "honeypot"; }
    var started = startedField ? parseInt(startedField.value, 10) : 0;
    if (started && (Date.now() - started) / 1000 < config.limits.minFillSeconds) { return "too-fast"; }
    return "";
  }

  function isThrottled() {
    try {
      var last = parseInt(window.localStorage.getItem(THROTTLE_KEY) || "0", 10);
      return !!last && (Date.now() - last) / 1000 < config.limits.throttleSeconds;
    } catch (e) { return false; }
  }

  function stampThrottle() {
    try { window.localStorage.setItem(THROTTLE_KEY, String(Date.now())); } catch (e) { /* private mode */ }
  }

  /* ----------------------------------------------------------------------
   * offline queue — failed or offline sends are retried automatically
   * -------------------------------------------------------------------- */
  function readQueue() {
    if (!config.offlineQueue.enabled) { return []; }
    try {
      var parsed = JSON.parse(window.localStorage.getItem(config.offlineQueue.key) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }

  function writeQueue(list) {
    if (!config.offlineQueue.enabled) { return; }
    try {
      window.localStorage.setItem(config.offlineQueue.key, JSON.stringify(list.slice(-config.offlineQueue.max)));
    } catch (e) { /* quota or private mode — nothing else to do */ }
  }

  function queueMessage(payload) {
    var list = readQueue();
    payload.queuedAt = new Date().toISOString();
    list.push(payload);
    writeQueue(list);
  }

  /* ----------------------------------------------------------------------
   * local message log — lets the admin inbox list what this browser sent
   * -------------------------------------------------------------------- */
  var MESSAGE_LOG_KEY = "portfolio.messageLog";
  var MESSAGE_LOG_MAX = 50;

  function logMessage(payload, state) {
    try {
      var list = JSON.parse(window.localStorage.getItem(MESSAGE_LOG_KEY) || "[]");
      if (!Array.isArray(list)) { list = []; }
      list.push({
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        message: payload.message,
        state: state || "sent",
        sentAt: new Date().toISOString()
      });
      window.localStorage.setItem(MESSAGE_LOG_KEY, JSON.stringify(list.slice(-MESSAGE_LOG_MAX)));
    } catch (e) { /* quota exceeded or private mode */ }
  }

  function readMessageLog() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(MESSAGE_LOG_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }

  /* ----------------------------------------------------------------------
   * payload + delivery
   * -------------------------------------------------------------------- */
  function collect() {
    var data = {
      subject: config.subject,
      from_name: config.fromName,
      page_url: window.location.href
    };
    FIELDS.forEach(function (field) {
      var input = fieldEl(field);
      if (input) { data[input.name] = text(input.value); }
    });
    if (config.accessKey) { data.access_key = config.accessKey; }
    if (captchaToken) { data["h-captcha-response"] = captchaToken; }
    return data;
  }

  function buildMailtoUrl(data) {
    var body = [
      "Name: " + text(data.first_name + " " + (data.last_name || "")),
      "Email: " + (data.email || ""),
      "",
      data.message || ""
    ].join("\n");
    return "mailto:" + config.email +
      "?subject=" + encodeURIComponent(config.subject) +
      "&body=" + encodeURIComponent(body);
  }

  function postMessage(payload) {
    return new Promise(function (resolve, reject) {
      if (!config.accessKey || !config.endpoint || typeof window.fetch !== "function") {
        reject({ code: "not-configured" });
        return;
      }
      var controller = typeof window.AbortController === "function" ? new window.AbortController() : null;
      var timer = window.setTimeout(function () { if (controller) { controller.abort(); } }, REQUEST_TIMEOUT);
      window.fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined
      }).then(function (response) {
        window.clearTimeout(timer);
        return response.json().catch(function () { return {}; }).then(function (body) {
          if (response.ok && (!body || body.success !== false)) { resolve(body || {}); return; }
          reject({ code: "http", status: response.status, body: body });
        });
      }).catch(function (error) {
        window.clearTimeout(timer);
        reject({ code: "network", error: error });
      });
    });
  }

  /* ----------------------------------------------------------------------
   * status UI helpers
   * -------------------------------------------------------------------- */
  function showAlert(kind, message) {
    if (!alertBox) { return; }
    alertBox.className = "contact-alert " + kind;
    alertBox.textContent = message;
  }

  function clearAlert() {
    if (!alertBox) { return; }
    alertBox.className = "contact-alert hidden";
    alertBox.textContent = "";
  }

  function setBusy(busy) {
    if (!submitBtn) { return; }
    submitBtn.disabled = !!busy;
    submitBtn.classList.toggle("is-busy", !!busy);
    submitBtn.setAttribute("aria-busy", busy ? "true" : "false");
    var label = submitBtn.querySelector(".btn-label");
    if (label) { label.textContent = busy ? "Sending…" : "Send Message"; }
  }

  function shake() {
    form.classList.remove("form-shake");
    void form.offsetWidth; /* restart the animation */
    form.classList.add("form-shake");
    window.setTimeout(function () { form.classList.remove("form-shake"); }, 600);
  }

  function setConsentError(message) {
    var box = document.getElementById("error-consent");
    if (!box) { return; }
    box.textContent = message || "";
    box.hidden = !message;
  }

  function validateAll() {
    var firstInvalid = null;
    FIELDS.forEach(function (field) {
      var message = validateField(field);
      setError(field, message);
      if (message && !firstInvalid) { firstInvalid = field; }
    });
    if (consent && !consent.checked) {
      setConsentError("Please accept the privacy note so I can reply to you.");
      if (!firstInvalid) { firstInvalid = { id: "consent" }; }
    } else {
      setConsentError("");
    }
    return firstInvalid;
  }

  /* ----------------------------------------------------------------------
   * submit flow
   * -------------------------------------------------------------------- */
  function handleSubmit(event) {
    event.preventDefault();
    clearAlert();

    var invalid = validateAll();
    if (invalid) {
      shake();
      var el = document.getElementById(invalid.id);
      if (el && typeof el.focus === "function") { el.focus(); }
      showAlert("is-error", "Please check the highlighted fields before sending.");
      return;
    }

    if (isThrottled()) {
      showAlert("is-warning", M.throttled);
      return;
    }

    /* Bots that fill the hidden field or post instantly get a friendly answer,
       but nothing is sent and nothing is stored. */
    if (botSignal()) {
      form.reset();
      showAlert("is-success", M.success);
      return;
    }

    var payload = collect();
    setBusy(true);
    showAlert("is-info", M.sending);

    postMessage(payload).then(function () {
      stampThrottle();
      logMessage(payload, "sent");
      form.reset();
      resetCounters();
      showAlert("is-success", M.success);
    }).catch(function (reason) {
      stampThrottle();
      if (reason && reason.code === "not-configured") {
        if (config.fallbackMailto) {
          logMessage(payload, "mailto");
          window.location.href = buildMailtoUrl(payload);
          showAlert("is-info", M.mailtoOpened);
        } else {
          logMessage(payload, "queued");
          queueMessage(payload);
          showAlert("is-warning", M.queued);
        }
        return;
      }
      logMessage(payload, "queued");
      queueMessage(payload);
      if (typeof window.navigator.onLine === "boolean" && !window.navigator.onLine) {
        showAlert("is-warning", M.queued);
        return;
      }
      showAlert("is-error", M.failed);
      if (config.fallbackMailto && alertBox) {
        var link = document.createElement("a");
        link.href = buildMailtoUrl(payload);
        link.className = "contact-alert-link";
        link.textContent = " Send it with my mail app instead →";
        alertBox.appendChild(link);
      }
    }).then(function () {
      setBusy(false);
    });
  }

  /* ----------------------------------------------------------------------
   * automatic retry of queued messages
   * -------------------------------------------------------------------- */
  function retryQueue() {
    var list = readQueue();
    if (!list.length || !config.accessKey || typeof window.fetch !== "function") { return; }
    if (typeof window.navigator.onLine === "boolean" && !window.navigator.onLine) { return; }

    var pending = list.slice();

    function attempt(index) {
      if (index >= list.length) { writeQueue(pending); return; }
      postMessage(list[index]).then(function () {
        pending = pending.filter(function (item) { return item !== list[index]; });
        attempt(index + 1);
      }).catch(function () {
        attempt(index + 1);
      });
    }

    attempt(0);
  }

  function resetCounters() {
    if (messageCount) { messageCount.textContent = "0"; }
  }

  /* ----------------------------------------------------------------------
   * wiring
   * -------------------------------------------------------------------- */
  function init() {
    if (startedField) { startedField.value = String(Date.now()); }

    FIELDS.forEach(function (field) {
      var input = fieldEl(field);
      if (!input) { return; }
      input.addEventListener("blur", function () { setError(field, validateField(field)); });
      input.addEventListener("input", function () {
        if (input.classList.contains("has-error")) { setError(field, validateField(field)); }
      });
    });

    if (messageField && messageCount) {
      var update = function () {
        var length = messageField.value.length;
        messageCount.textContent = String(length);
        if (messageCount.parentNode) {
          messageCount.parentNode.classList.toggle("is-near-limit", length > config.limits.maxMessageLength * 0.85);
        }
      };
      messageField.addEventListener("input", update);
      messageField.addEventListener("keyup", update);
      update();
    }

    if (consent) {
      consent.addEventListener("change", function () {
        if (consent.checked) { setConsentError(""); }
      });
    }

    form.addEventListener("submit", handleSubmit);
    window.addEventListener("online", retryQueue);
    loadCaptcha();
    window.setTimeout(retryQueue, 2500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Exposed so the admin inbox and automated checks can reuse this logic. */
  window.PortfolioContact = {
    config: config,
    validate: validateField,
    queue: { read: readQueue, write: writeQueue, retry: retryQueue },
    messages: { read: readMessageLog, log: logMessage }
  };
}(window, document));

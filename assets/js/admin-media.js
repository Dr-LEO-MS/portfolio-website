/*!
 * admin-media.js — Media Studio and Messages inbox for the portfolio admin.
 *
 * Everything runs in the browser: images are decoded, edited on a canvas and
 * re-encoded locally, then handed to the visitor as a download. Nothing is
 * uploaded anywhere. Contact form messages are read from the same localStorage
 * keys the public site writes to (see assets/js/contact-form.js).
 */
(function (window, document) {
  "use strict";

  var KEY_LIBRARY = "portfolio.mediaLibrary";
  var KEY_MESSAGE_LOG = "portfolio.messageLog";
  var KEY_QUEUE = "portfolio.pendingMessages";
  var MAX_BYTES = 8 * 1024 * 1024;
  var LIBRARY_ITEMS = 24;

  /* ----------------------------------------------------------------------
   * tiny helpers
   * -------------------------------------------------------------------- */
  function el(id) { return document.getElementById(id); }

  function fmtBytes(bytes) {
    bytes = Number(bytes) || 0;
    if (bytes < 1024) { return bytes + " B"; }
    if (bytes < 1024 * 1024) { return (bytes / 1024).toFixed(1) + " KB"; }
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function fmtDate(value) {
    var date = value ? new Date(value) : new Date();
    if (isNaN(date.getTime())) { return "-"; }
    return date.toLocaleString();
  }

  function escapeHtml(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function status(node, kind, message) {
    if (!node) { return; }
    node.className = "import-status " + (kind || "");
    node.textContent = message;
    node.classList.remove("hidden");
  }

  function hide(node) {
    if (node) { node.classList.add("hidden"); }
  }

  function readJson(key, fallback) {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(key) || "null");
      return parsed === null ? fallback : parsed;
    } catch (e) { return fallback; }
  }

  function writeJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false; /* quota exceeded or private mode */
    }
  }

  function downloadBlob(blob, fileName) {
    var url = window.URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () { window.URL.revokeObjectURL(url); }, 4000);
  }

  /* ----------------------------------------------------------------------
   * security: only accept real images (magic-byte sniffing, not the MIME type
   * the browser reports nor the file extension)
   * -------------------------------------------------------------------- */
  function sniffImageType(buffer) {
    var bytes = new Uint8Array(buffer.slice(0, 16));

    function startsWith(signature, offset) {
      offset = offset || 0;
      for (var i = 0; i < signature.length; i++) {
        if (bytes[offset + i] !== signature[i]) { return false; }
      }
      return true;
    }

    if (startsWith([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) { return "image/png"; }
    if (startsWith([0xFF, 0xD8, 0xFF])) { return "image/jpeg"; }
    if (startsWith([0x47, 0x49, 0x46, 0x38])) { return "image/gif"; }
    if (startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8)) { return "image/webp"; }
    return "";
  }

  function extensionFor(mime, sourceName) {
    if (mime === "image/webp") { return ".webp"; }
    if (mime === "image/jpeg") { return ".jpg"; }
    if (mime === "image/png") { return ".png"; }
    var dot = String(sourceName || "").lastIndexOf(".");
    return dot === -1 ? ".png" : String(sourceName).slice(dot);
  }

  function baseName(name) {
    return String(name || "image")
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "image";
  }

  /* ----------------------------------------------------------------------
   * Media Studio — state and rendering
   * -------------------------------------------------------------------- */
  var state = {
    source: null,
    fileName: "",
    sourceSize: 0,
    sourceType: "",
    rotation: 0,
    flipH: false,
    flipV: false,
    aspect: "free",
    filter: "none",
    format: "image/webp",
    quality: 82,
    maxWidth: 1200
  };

  var FILTERS = {
    none: "none",
    warm: "saturate(1.15) sepia(0.18) contrast(1.04)",
    cool: "saturate(1.05) hue-rotate(12deg) brightness(1.02)",
    mono: "grayscale(1) contrast(1.06)",
    punch: "contrast(1.22) saturate(1.15)",
    soft: "contrast(0.92) brightness(1.05) saturate(0.95)"
  };

  function aspectRatio(aspect) {
    if (aspect === "1:1") { return 1; }
    if (aspect === "4:3") { return 4 / 3; }
    if (aspect === "3:2") { return 3 / 2; }
    if (aspect === "16:9") { return 16 / 9; }
    return 0; /* free */
  }

  /* Rotate (and flip vertically) the original into a fresh canvas so cropping
     uses simple axis-aligned maths. */
  function rotatedCanvas() {
    var source = state.source;
    var width = source.naturalWidth || source.width;
    var height = source.naturalHeight || source.height;
    var swapped = state.rotation % 180 !== 0;

    var canvas = document.createElement("canvas");
    canvas.width = swapped ? height : width;
    canvas.height = swapped ? width : height;

    var ctx = canvas.getContext("2d");
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(state.rotation * Math.PI / 180);
    ctx.drawImage(source, -width / 2, -height / 2);
    return canvas;
  }

  /* Centre crop box for the requested aspect ratio. */
  function cropBox(width, height) {
    var ratio = aspectRatio(state.aspect);
    if (!ratio) { return { x: 0, y: 0, w: width, h: height }; }

    var boxW = width;
    var boxH = Math.round(width / ratio);
    if (boxH > height) {
      boxH = height;
      boxW = Math.round(height * ratio);
    }
    return {
      x: Math.round((width - boxW) / 2),
      y: Math.round((height - boxH) / 2),
      w: boxW,
      h: boxH
    };
  }

  /* Output size after the max-width constraint. */
  function outputSize() {
    var rotated = rotatedCanvas();
    var box = cropBox(rotated.width, rotated.height);
    var scale = Math.min(1, state.maxWidth / box.w);
    return {
      width: Math.max(1, Math.round(box.w * scale)),
      height: Math.max(1, Math.round(box.h * scale)),
      box: box,
      rotated: rotated
    };
  }

  /* Compose the final pixels into the supplied canvas. */
  function compose(target) {
    var info = outputSize();
    target.width = info.width;
    target.height = info.height;

    var ctx = target.getContext("2d");
    ctx.clearRect(0, 0, target.width, target.height);
    if (state.format === "image/jpeg") {
      ctx.fillStyle = "#ffffff"; /* JPEG has no alpha */
      ctx.fillRect(0, 0, target.width, target.height);
    }

    ctx.save();
    if (typeof ctx.filter === "string") { ctx.filter = FILTERS[state.filter] || "none"; }
    ctx.translate(target.width / 2, target.height / 2);
    ctx.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1);
    ctx.translate(-target.width / 2, -target.height / 2);
    ctx.drawImage(
      info.rotated,
      info.box.x, info.box.y, info.box.w, info.box.h,
      0, 0, target.width, target.height
    );
    ctx.restore();
    return { width: target.width, height: target.height };
  }

  function paintPreview() {
    var canvas = el("media-canvas");
    if (!canvas || !state.source) { return; }

    var composed = document.createElement("canvas");
    var size = compose(composed);

    canvas.width = composed.width;
    canvas.height = composed.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(composed, 0, 0);

    var meta = el("media-meta");
    if (meta) {
      meta.textContent = composed.width + " x " + composed.height + " px  ·  source " +
        fmtBytes(state.sourceSize) + " (" + state.sourceType.replace("image/", "").toUpperCase() + ")";
    }

    var nameField = el("media-dest");
    if (nameField) {
      nameField.placeholder = "assets/images/projects/" + baseName(state.fileName) +
        extensionFor(state.format, state.fileName);
    }
    return size;
  }

  function supportsWebp() {
    try {
      var canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
    } catch (e) { return false; }
  }

  function effectiveFormat() {
    if (state.format === "image/webp" && !supportsWebp()) { return "image/jpeg"; }
    return state.format;
  }

  function encodeCanvas(canvas) {
    var format = effectiveFormat();
    var quality = format === "image/png" ? undefined : state.quality / 100;

    return new Promise(function (resolve, reject) {
      if (typeof canvas.toBlob === "function") {
        canvas.toBlob(function (blob) {
          if (blob) { resolve({ blob: blob, format: format }); }
          else { reject(new Error("encode-failed")); }
        }, format, quality);
        return;
      }
      /* very old browsers: build a blob from a data URL */
      try {
        var dataUrl = canvas.toDataURL(format, quality);
        var binary = window.atob(dataUrl.split(",")[1]);
        var buffer = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) { buffer[i] = binary.charCodeAt(i); }
        resolve({ blob: new window.Blob([buffer], { type: format }), format: format });
      } catch (error) {
        reject(error);
      }
    });
  }

  /* ----------------------------------------------------------------------
   * file intake
   * -------------------------------------------------------------------- */
  function loadFile(file, statusNode, onDone) {
    if (!file || !/^image\//.test(file.type || "")) {
      status(statusNode, "error", "Skipped “" + escapeHtml(file ? file.name : "file") +
        "” — that is not an image.");
      if (onDone) { onDone(false); }
      return;
    }
    if (file.size > MAX_BYTES) {
      status(statusNode, "error", "“" + escapeHtml(file.name) + "” is " + fmtBytes(file.size) +
        ". Please keep studio files under " + fmtBytes(MAX_BYTES) + ".");
      if (onDone) { onDone(false); }
      return;
    }

    var reader = new window.FileReader();
    reader.onload = function () {
      var buffer = reader.result;
      var sniffed = sniffImageType(buffer);
      if (!sniffed) {
        status(statusNode, "error", "“" + escapeHtml(file.name) +
          "” does not look like a real PNG, JPEG, GIF or WebP file, so it was rejected.");
        if (onDone) { onDone(false); }
        return;
      }

      var image = new window.Image();
      image.onload = function () {
        state.source = image;
        state.fileName = file.name || "image";
        state.sourceSize = file.size;
        state.sourceType = sniffed;
        state.rotation = 0;
        state.flipH = false;
        state.flipV = false;
        state.filter = "none";

        var editorWrap = el("media-editor-wrap");
        var exportWrap = el("media-export-wrap");
        if (editorWrap) { editorWrap.classList.remove("hidden"); }
        if (exportWrap) { exportWrap.classList.remove("hidden"); }

        paintPreview();
        status(statusNode, "success", "Loaded “" + escapeHtml(file.name) + "” (" +
          image.naturalWidth + " x " + image.naturalHeight + " px, " + fmtBytes(file.size) + ").");
        if (onDone) { onDone(true); }
      };
      image.onerror = function () {
        status(statusNode, "error", "“" + escapeHtml(file.name) + "” could not be decoded.");
        if (onDone) { onDone(false); }
      };
      var url = window.URL.createObjectURL(file);
      image.onload = (function (original) {
        return function () {
          window.URL.revokeObjectURL(url);
          original.apply(this, arguments);
        };
      }(image.onload));
      image.src = url;
    };
    reader.onerror = function () {
      status(statusNode, "error", "The file could not be read from disk.");
      if (onDone) { onDone(false); }
    };
    reader.readAsArrayBuffer(file);
  }

  /* ----------------------------------------------------------------------
   * studio library (metadata + small previews, kept in localStorage)
   * -------------------------------------------------------------------- */
  function readLibrary() {
    var list = readJson(KEY_LIBRARY, []);
    return Array.isArray(list) ? list : [];
  }

  function writeLibrary(list) {
    if (!writeJson(KEY_LIBRARY, list.slice(-LIBRARY_ITEMS))) {
      /* quota: try again with metadata only */
      var trimmed = list.slice(-LIBRARY_ITEMS).map(function (item) {
        return { name: item.name, path: item.path, bytes: item.bytes, width: item.width,
                 height: item.height, format: item.format, createdAt: item.createdAt };
      });
      writeJson(KEY_LIBRARY, trimmed);
    }
  }

  function addToLibrary(record) {
    var list = readLibrary();
    list.push(record);
    writeLibrary(list);
    renderLibrary();
    updateQuota();
  }

  function localStorageUsage() {
    var total = 0;
    try {
      for (var i = 0; i < window.localStorage.length; i++) {
        var key = window.localStorage.key(i);
        var value = window.localStorage.getItem(key) || "";
        total += (key.length + value.length) * 2; /* UTF-16 */
      }
    } catch (e) { /* private mode */ }
    return total;
  }

  function each(list, fn) {
    Array.prototype.forEach.call(list, fn);
  }

  function renderLibrary() {
    var wrap = el("media-library");
    if (!wrap) { return; }

    var list = readLibrary();
    if (!list.length) {
      wrap.innerHTML = '<p class="media-empty">Nothing exported yet. Optimise an image above and it will ' +
        'appear here with its path and size.</p>';
      return;
    }

    wrap.innerHTML = list.map(function (item, index) {
      var thumb = item.preview
        ? '<img src="' + item.preview + '" alt="">'
        : '<span class="media-thumb-fallback"><i class="fa fa-file-image-o" aria-hidden="true"></i></span>';
      return '<article class="media-item">' +
        '<div class="media-thumb">' + thumb + '</div>' +
        '<div class="media-item-body">' +
          '<strong>' + escapeHtml(item.name) + '</strong>' +
          '<span class="media-item-meta">' + fmtBytes(item.bytes) + ' &middot; ' +
            (item.width || "?") + '&times;' + (item.height || "?") + ' &middot; ' +
            escapeHtml(String(item.format || "").replace("image/", "")) + '</span>' +
          '<code>' + escapeHtml(item.path) + '</code>' +
          '<span class="media-item-date">' + fmtDate(item.createdAt) + '</span>' +
        '</div>' +
        '<div class="media-item-actions">' +
          '<button type="button" class="btn btn-sm btn-outline btn-lib-copy" data-index="' + index + '">' +
            '<i class="fa fa-clipboard"></i> Copy path</button>' +
          '<button type="button" class="btn btn-sm btn-outline btn-lib-apply" data-index="' + index + '">' +
            '<i class="fa fa-check"></i> Apply</button>' +
          '<button type="button" class="btn btn-sm btn-danger btn-lib-del" data-index="' + index + '" ' +
            'aria-label="Remove from library"><i class="fa fa-times"></i></button>' +
        '</div>' +
      '</article>';
    }).join("");

    each(wrap.querySelectorAll(".btn-lib-copy"), function (btn) {
      btn.addEventListener("click", function () {
        copyText(list[Number(btn.getAttribute("data-index"))].path, btn);
      });
    });

    each(wrap.querySelectorAll(".btn-lib-apply"), function (btn) {
      btn.addEventListener("click", function () {
        var index = Number(btn.getAttribute("data-index"));
        applyToSlot(list[index].path, el("media-slot") ? el("media-slot").value : "");
      });
    });

    each(wrap.querySelectorAll(".btn-lib-del"), function (btn) {
      btn.addEventListener("click", function () {
        var items = readLibrary();
        items.splice(Number(btn.getAttribute("data-index")), 1);
        writeLibrary(items);
        renderLibrary();
        updateQuota();
      });
    });
  }

  function updateQuota() {
    var fill = el("quota-fill");
    var text = el("quota-text");
    var used = localStorageUsage();
    var quota = 5 * 1024 * 1024; /* typical localStorage ceiling per origin */
    var percent = Math.min(100, Math.round((used / quota) * 100));

    if (fill) {
      fill.style.width = percent + "%";
      fill.className = percent > 85 ? "is-high" : (percent > 60 ? "is-mid" : "");
    }
    if (text) {
      text.textContent = fmtBytes(used) + " of roughly " + fmtBytes(quota) + " browser storage in use (" +
        percent + "%). Library previews are small — exported files live in your downloads folder.";
    }

    if (window.navigator.storage && typeof window.navigator.storage.estimate === "function" && text) {
      window.navigator.storage.estimate().then(function (estimate) {
        if (!estimate || !estimate.quota) { return; }
        text.textContent = fmtBytes(used) + " of roughly " + fmtBytes(quota) +
          " browser storage in use · device quota " + fmtBytes(estimate.quota) +
          " (" + fmtBytes(estimate.usage || 0) + " already used by this site).";
      }).catch(function () { /* not supported */ });
    }
  }

  function copyText(value, sourceButton) {
    function done(ok) {
      if (!sourceButton) { return; }
      var original = sourceButton.innerHTML;
      sourceButton.innerHTML = ok
        ? '<i class="fa fa-check"></i> Copied'
        : '<i class="fa fa-times"></i> Copy failed';
      window.setTimeout(function () { sourceButton.innerHTML = original; }, 1800);
    }

    if (window.navigator.clipboard && window.navigator.clipboard.writeText) {
      window.navigator.clipboard.writeText(value).then(function () { done(true); }, function () { done(false); });
      return;
    }

    try {
      var area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "readonly");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
      done(true);
    } catch (e) { done(false); }
  }

  /* Point one of the site's image slots at a newly exported file. */
  function slotFieldId(slot) {
    if (slot === "modal0") { return "modal-0"; }
    if (slot === "modal1") { return "modal-1"; }
    return slot;
  }

  function applyToSlot(path, slot) {
    var statusNode = el("media-status");
    if (!path) { return; }
    if (!slot) {
      status(statusNode, "info", "Saved to the library. Choose a slot under “Apply to” to point the site at it.");
      return;
    }

    var api = window.PortfolioAdmin;
    var settings = api && api.getSettings ? api.getSettings() : readJson("portfolio_customization_settings", {});
    settings.images = settings.images || {};
    settings.images[slot] = path;

    if (api && typeof api.save === "function") {
      api.save();
    } else {
      writeJson("portfolio_customization_settings", settings);
    }

    var suffix = slotFieldId(slot);
    var input = el("img-ref-" + suffix);
    if (input) { input.value = path; }
    var thumb = el("img-thumb-" + suffix);
    if (thumb) {
      thumb.src = path;
      thumb.style.display = "";
    }

    status(statusNode, "success", "Slot “" + slot + "” now points at " + path +
      ". Upload the exported file to that path, then reload the site.");
  }

  function bindClick(id, handler) {
    var node = el(id);
    if (node) { node.addEventListener("click", handler); }
  }

  /* ----------------------------------------------------------------------
   * export: encode the composed canvas, download it and remember the result
   * -------------------------------------------------------------------- */
  function doExport() {
    var statusNode = el("media-status");
    if (!state.source) {
      status(statusNode, "error", "Load an image before exporting.");
      return;
    }

    var canvas = document.createElement("canvas");
    compose(canvas);
    status(statusNode, "info", "Encoding " + canvas.width + " x " + canvas.height + " px…");

    encodeCanvas(canvas).then(function (result) {
      var extension = extensionFor(result.format, state.fileName);
      var field = el("media-dest");
      var typed = field && field.value.trim();
      var path = typed || ("assets/images/projects/" + baseName(state.fileName) + extension);
      if (path.slice(-extension.length).toLowerCase() !== extension) { path += extension; }

      var fileName = path.split("/").pop();
      downloadBlob(result.blob, fileName);

      /* small preview so the library stays well inside the storage quota */
      var preview = document.createElement("canvas");
      var scale = Math.min(1, 260 / canvas.width);
      preview.width = Math.max(1, Math.round(canvas.width * scale));
      preview.height = Math.max(1, Math.round(canvas.height * scale));
      preview.getContext("2d").drawImage(canvas, 0, 0, preview.width, preview.height);

      addToLibrary({
        name: fileName,
        path: path,
        bytes: result.blob.size,
        width: canvas.width,
        height: canvas.height,
        format: result.format,
        createdAt: new Date().toISOString(),
        preview: preview.toDataURL("image/jpeg", 0.6)
      });

      var saving = state.sourceSize > 0 ? Math.round((1 - (result.blob.size / state.sourceSize)) * 100) : 0;
      status(statusNode, "success", "Exported " + fileName + " — " + fmtBytes(result.blob.size) +
        (saving > 0 ? " (" + saving + "% lighter than the source file)" : "") +
        ". The download has started; the file is also in the library below.");

      var slot = el("media-slot") ? el("media-slot").value : "";
      if (slot) { applyToSlot(path, slot); }
    }).catch(function () {
      status(statusNode, "error", "This browser could not encode the image. Try JPEG or PNG.");
    });
  }

  /* ----------------------------------------------------------------------
   * studio wiring
   * -------------------------------------------------------------------- */
  function wireStudio() {
    var dropzone = el("media-dropzone");
    var fileInput = el("media-file-input");
    var statusNode = el("media-status");
    if (!dropzone || !fileInput) { return; }

    function handleFiles(files) {
      if (!files || !files.length) { return; }
      var queue = Array.prototype.slice.call(files);
      var index = 0;
      (function next() {
        if (index >= queue.length) { return; }
        loadFile(queue[index++], statusNode, function () { next(); });
      }());
    }

    dropzone.addEventListener("click", function () { fileInput.click(); });
    dropzone.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fileInput.click();
      }
    });
    fileInput.addEventListener("change", function () {
      handleFiles(fileInput.files);
      fileInput.value = "";
    });

    ["dragenter", "dragover"].forEach(function (name) {
      dropzone.addEventListener(name, function (event) {
        event.preventDefault();
        dropzone.classList.add("is-dragover");
      });
    });
    ["dragleave", "dragend", "drop"].forEach(function (name) {
      dropzone.addEventListener(name, function (event) {
        event.preventDefault();
        dropzone.classList.remove("is-dragover");
      });
    });
    dropzone.addEventListener("drop", function (event) {
      var transfer = event.dataTransfer;
      if (transfer && transfer.files && transfer.files.length) { handleFiles(transfer.files); }
    });

    var format = el("media-format");
    if (format) {
      state.format = format.value;
      format.addEventListener("change", function () { state.format = format.value; paintPreview(); });
    }

    var crop = el("media-crop");
    if (crop) {
      crop.addEventListener("change", function () { state.aspect = crop.value; paintPreview(); });
    }

    var look = el("media-filter");
    if (look) {
      look.addEventListener("change", function () { state.filter = look.value; paintPreview(); });
    }

    var width = el("media-width");
    if (width) {
      width.addEventListener("input", function () {
        state.maxWidth = Number(width.value) || 1200;
        var label = el("media-width-val");
        if (label) { label.textContent = width.value + " px"; }
        paintPreview();
      });
    }

    var quality = el("media-quality");
    if (quality) {
      quality.addEventListener("input", function () {
        state.quality = Number(quality.value) || 82;
        var label = el("media-quality-val");
        if (label) { label.textContent = quality.value + "%"; }
      });
    }

    function rotate(step) {
      state.rotation = (state.rotation + step + 360) % 360;
      paintPreview();
    }

    bindClick("media-rotate-left", function () { rotate(-90); });
    bindClick("media-rotate-right", function () { rotate(90); });
    bindClick("media-flip-h", function () { state.flipH = !state.flipH; paintPreview(); });
    bindClick("media-flip-v", function () { state.flipV = !state.flipV; paintPreview(); });

    bindClick("media-reset", function () {
      state.rotation = 0;
      state.flipH = false;
      state.flipV = false;
      state.filter = "none";
      state.aspect = "free";
      if (look) { look.value = "none"; }
      if (crop) { crop.value = "free"; }
      paintPreview();
      status(statusNode, "info", "Edits reset. The original pixels are untouched.");
    });

    bindClick("media-download", doExport);

    bindClick("media-copy", function () {
      var field = el("media-dest");
      var value = field && field.value.trim() ? field.value.trim() : (field ? field.placeholder : "");
      copyText(value, el("media-copy"));
    });

    bindClick("media-save-slot", function () {
      var field = el("media-dest");
      var value = field && field.value.trim() ? field.value.trim() : (field ? field.placeholder : "");
      applyToSlot(value, el("media-slot") ? el("media-slot").value : "");
    });
  }

  /* ----------------------------------------------------------------------
   * messages inbox — reads the same keys contact-form.js writes
   * -------------------------------------------------------------------- */
  function readMessageLog() {
    var log = readJson(KEY_MESSAGE_LOG, []);
    return Array.isArray(log) ? log : [];
  }

  function readPendingQueue() {
    var queue = readJson(KEY_QUEUE, []);
    return Array.isArray(queue) ? queue : [];
  }

  function inboxBadge() {
    var badge = el("inbox-badge");
    if (!badge) { return; }
    var count = readMessageLog().length + readPendingQueue().length;
    badge.textContent = String(count);
    badge.classList.toggle("hidden", count === 0);
  }

  function senderName(item) {
    var name = [item.first_name, item.last_name].filter(function (part) { return !!part; }).join(" ").trim();
    return name || "Unknown sender";
  }

  function messageText(item) {
    return [
      "Name: " + senderName(item),
      "Email: " + (item.email || "-"),
      "Received: " + fmtDate(item.sentAt || item.queuedAt || item.createdAt),
      "",
      item.message || ""
    ].join("\n");
  }

  function messageCard(item, kind, originalIndex) {
    var email = item.email || "";
    var body = item.message || "";
    var reply = email
      ? 'mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent("Re: your message on the portfolio")
      : "";

    return '<article class="inbox-item is-' + kind + '">' +
      '<header>' +
        '<strong>' + escapeHtml(senderName(item)) + '</strong>' +
        '<span class="inbox-tag">' + (kind === "pending" ? "waiting" : "sent") + '</span>' +
        '<span class="inbox-date">' + fmtDate(item.sentAt || item.queuedAt || item.createdAt) + '</span>' +
      '</header>' +
      '<p class="inbox-email">' + (email ? '<a href="' + escapeHtml(reply) + '">' + escapeHtml(email) + '</a>' : "no email given") + '</p>' +
      '<p class="inbox-body">' + escapeHtml(body).replace(/\n/g, "<br>") + '</p>' +
      '<div class="inbox-actions">' +
        '<button type="button" class="btn btn-sm btn-outline btn-msg-copy" data-kind="' + kind +
          '" data-index="' + originalIndex + '"><i class="fa fa-clipboard"></i> Copy</button>' +
        '<button type="button" class="btn btn-sm btn-danger ' +
          (kind === "pending" ? 'btn-queue-del" title="Remove from the offline queue' : 'btn-msg-del') +
          '" data-index="' + originalIndex + '"><i class="fa fa-trash"></i> ' +
          (kind === "pending" ? "Drop" : "Delete") + '</button>' +
      '</div>' +
    '</article>';
  }

  function renderInbox() {
    var list = el("inbox-list");
    var counter = el("inbox-count");
    if (!list) { return; }

    var log = readMessageLog();
    var pending = readPendingQueue();

    if (counter) {
      counter.textContent = log.length + " logged · " + pending.length + " waiting to send";
    }

    if (!log.length && !pending.length) {
      list.innerHTML = '<p class="media-empty">No messages yet. Enquiries made through the contact form on ' +
        'this browser will be listed here.</p>';
      inboxBadge();
      return;
    }

    var html = "";
    pending.forEach(function (item, index) { html += messageCard(item, "pending", index); });
    log.slice().reverse().forEach(function (item, index) {
      html += messageCard(item, "sent", log.length - 1 - index);
    });
    list.innerHTML = html;

    each(list.querySelectorAll(".btn-msg-copy"), function (btn) {
      btn.addEventListener("click", function () {
        var kind = btn.getAttribute("data-kind");
        var index = Number(btn.getAttribute("data-index"));
        var source = kind === "pending" ? readPendingQueue() : readMessageLog();
        if (source[index]) { copyText(messageText(source[index]), btn); }
      });
    });

    each(list.querySelectorAll(".btn-msg-del"), function (btn) {
      btn.addEventListener("click", function () {
        var items = readMessageLog();
        items.splice(Number(btn.getAttribute("data-index")), 1);
        writeJson(KEY_MESSAGE_LOG, items);
        renderInbox();
      });
    });

    each(list.querySelectorAll(".btn-queue-del"), function (btn) {
      btn.addEventListener("click", function () {
        var items = readPendingQueue();
        items.splice(Number(btn.getAttribute("data-index")), 1);
        writeJson(KEY_QUEUE, items);
        renderInbox();
      });
    });

    inboxBadge();
  }

  /* ----------------------------------------------------------------------
   * inbox actions: retry the queue, export a CSV, clear the local log
   * -------------------------------------------------------------------- */
  function contactSettings() {
    return window.PORTFOLIO_CONTACT_CONFIG || {};
  }

  function retryPending() {
    var statusNode = el("inbox-status");
    var config = contactSettings();
    var queue = readPendingQueue();

    if (!queue.length) {
      status(statusNode, "info", "Nothing is waiting — the offline queue is empty.");
      return;
    }
    if (!config.endpoint || !config.accessKey) {
      status(statusNode, "error", "Retrying needs a Web3Forms access key in assets/js/contact-config.js.");
      return;
    }
    if (typeof window.fetch !== "function") {
      status(statusNode, "error", "This browser cannot send queued messages automatically.");
      return;
    }

    status(statusNode, "info", "Sending " + queue.length + " waiting message(s)…");

    var log = readMessageLog();
    var remaining = [];
    var index = 0;

    (function next() {
      if (index >= queue.length) {
        writeJson(KEY_QUEUE, remaining);
        writeJson(KEY_MESSAGE_LOG, log.slice(-50));
        renderInbox();
        status(statusNode, remaining.length ? "error" : "success",
          remaining.length
            ? remaining.length + " message(s) could not be delivered yet — they stay in the queue."
            : "All waiting messages have been delivered.");
        return;
      }

      var item = queue[index++];
      var payload = {
        access_key: config.accessKey,
        subject: config.subject || "Portfolio enquiry",
        from_name: config.fromName || "Portfolio website",
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        message: item.message,
        queued_at: item.queuedAt || ""
      };

      window.fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      }).then(function (response) {
        if (!response.ok) { throw new Error("http " + response.status); }
        log.push({
          first_name: item.first_name,
          last_name: item.last_name,
          email: item.email,
          message: item.message,
          sentAt: new Date().toISOString(),
          source: "retry"
        });
        next();
      }).catch(function () {
        remaining.push(item);
        next();
      });
    }());
  }

  function csvCell(value) {
    var text = String(value === undefined || value === null ? "" : value).replace(/\r?\n/g, " ");
    /* neutralise spreadsheet formula injection */
    if (/^[=+\-@]/.test(text)) { text = "'" + text; }
    return '"' + text.replace(/"/g, '""') + '"';
  }

  function exportCsv() {
    var statusNode = el("inbox-status");
    var log = readMessageLog();
    var pending = readPendingQueue();

    if (!log.length && !pending.length) {
      status(statusNode, "info", "There is nothing to export yet.");
      return;
    }

    var rows = [["status", "timestamp", "first_name", "last_name", "email", "message"]];
    pending.forEach(function (item) {
      rows.push(["waiting", item.queuedAt || "", item.first_name || "", item.last_name || "",
        item.email || "", item.message || ""]);
    });
    log.forEach(function (item) {
      rows.push(["sent", item.sentAt || "", item.first_name || "", item.last_name || "",
        item.email || "", item.message || ""]);
    });

    var csv = rows.map(function (row) { return row.map(csvCell).join(","); }).join("\r\n");
    var stamp = new Date().toISOString().slice(0, 10);
    downloadBlob(new window.Blob([csv], { type: "text/csv;charset=utf-8" }),
      "portfolio-messages-" + stamp + ".csv");

    status(statusNode, "success", "Exported " + (rows.length - 1) + " message(s) as a CSV file.");
  }

  function wireInbox() {
    var statusNode = el("inbox-status");

    bindClick("btn-inbox-retry", retryPending);
    bindClick("btn-inbox-export", exportCsv);
    bindClick("btn-inbox-clear", function () {
      if (!window.confirm("Delete every message in the local log? Waiting messages are kept in the queue.")) {
        return;
      }
      writeJson(KEY_MESSAGE_LOG, []);
      renderInbox();
      status(statusNode, "success", "The local message log has been cleared.");
    });
  }

  /* ----------------------------------------------------------------------
   * init
   * -------------------------------------------------------------------- */
  function init() {
    wireStudio();
    wireInbox();
    renderLibrary();
    renderInbox();
    updateQuota();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Exposed for automated checks and for console debugging. */
  window.AdminMedia = {
    state: state,
    compose: compose,
    exportImage: doExport,
    applyToSlot: applyToSlot,
    library: { read: readLibrary, render: renderLibrary },
    inbox: { read: readMessageLog, render: renderInbox, retry: retryPending, exportCsv: exportCsv }
  };
}(window, document));

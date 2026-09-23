# Contact form setup

The contact form is fully client-side: markup in `index.html`, configuration in
`assets/js/contact-config.js`, behaviour in `assets/js/contact-form.js`.
There is no PHP, no Node server and no build step — which also means the site
can keep living on GitHub Pages.

---

## 1. How a message travels

```
visitor fills #contactForm
        │
        ├─ inline validation  (contact-form.js)      → field level errors, ARIA wired
        ├─ honeypot  (#website hidden field)         → bots fill it, humans cannot
        ├─ time trap (form_started timestamp)        → "too fast" submissions are dropped
        ├─ throttle  (localStorage, 45 s)            → one message per browser per window
        │
        ▼
POST JSON → contact-config.js endpoint (Web3Forms)
        │
        ├─ success → message is emailed, copy appended to portfolio.messageLog
        └─ failure → message stored in portfolio.pendingMessages and retried
                     automatically (on "online" and on next page load), with a
                     mailto: fallback offered in the UI
```

Nothing is stored on a server you have to run. The delivery service does the
sending, and the browser keeps a local copy so the Admin **Messages Inbox** can
show what happened.

---

## 2. Connect your inbox (2 minutes)

1. Open <https://web3forms.com> and enter the address that should receive the
   enquiries (`mssubhash07@gmail.com` by default).
2. Copy the **access key** it gives you.
3. Paste it into `assets/js/contact-config.js`:

```js
window.PORTFOLIO_CONTACT_CONFIG = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: 'YOUR-ACCESS-KEY-HERE',   // <-- the only required change
  email: 'mssubhash07@gmail.com',      // used by the mailto: fallback
  ...
};
```

The access key is public by design — it can only send mail to the inbox it was
created for, so it is safe to commit.

**Before the key is set** the form still works: it opens the visitor's mail
client with the message pre-filled and logs the attempt as `mailto` in the
Admin inbox. No enquiry is lost while you are still setting things up.

---

## 3. Optional: hCaptcha

Want a visible challenge on top of the invisible protections?

```js
captcha: {
  provider: 'hcaptcha',
  siteKey: 'your-hcaptcha-site-key'
}
```

The widget is only injected when a site key is present, and the token is sent as
`h-captcha-response` with the message.

---

## 4. Tuning behaviour

| Setting | Default | What it does |
|---|---|---|
| `limits.minFillSeconds` | `4` | Anything submitted faster is treated as a bot (silently accepted, never sent). |
| `limits.throttleSeconds` | `45` | Minimum wait between two submissions from one browser. |
| `limits.minMessageLength` | `10` | Shortest accepted message; shown as an inline error. |
| `limits.maxMessageLength` | `2000` | Matches `maxlength` on the textarea and the live counter. |
| `offlineQueue.enabled` | `true` | Store failed/offline messages and retry them. |
| `offlineQueue.max` | `10` | Queue length cap (oldest entries drop off). |
| `fallbackMailto` | `true` | Offer the "send with my mail app" link when delivery fails. |
| `messages.*` | — | All visitor-facing copy, kept out of the logic. |

---

## 5. Admin: Messages Inbox

Open `Admin.html` → **Messages Inbox** (unlock with your admin password first).

- **Sent** entries come from `portfolio.messageLog` — every message this browser
  delivered (or handed to the mail client).
- **Waiting** entries come from `portfolio.pendingMessages` — the retry queue.
- **Retry pending** re-sends the queue using the same endpoint/access key.
- **Export CSV** downloads both lists (formula-injection safe) for archiving.
- **Clear log** removes the local copy only; the queue is preserved.

> Note: because the log lives in `localStorage`, it is per browser and per
> device. It is a convenience inbox, not a replacement for the emails
> themselves — which is exactly why delivery matters.

---

## 6. Accessibility notes

- `novalidate` on the form: validation messages are our own, so they are
  announced through `aria-describedby` + `aria-live` instead of browser bubbles.
- Every invalid field gets `aria-invalid="true"` and an inline `.field-error`.
- The status banner (`#msgSubmit`) is `role="status" aria-live="polite"`.
- The submit button reports `aria-busy` and swaps its label while sending.
- Focus moves to the first invalid field when submission fails.
- All animations around the form respect `prefers-reduced-motion`.

---

## 7. Testing checklist

1. `python -m http.server 8000` and open <http://localhost:8000>.
2. Submit with an empty form → inline errors, focus on *First name*.
3. Type an invalid email → error appears on blur, clears while typing.
4. Submit a valid message → banner shows *"Sending your message…"* then success.
5. Turn on **Offline** in DevTools → submit → message is queued
   (`localStorage.portfolio.pendingMessages`) and the banner says so.
6. Go back online → the queue retries automatically.
7. Open `Admin.html` → Messages Inbox → the message is listed; *Export CSV* works.
8. Submit twice within 45 s → the second attempt is politely throttled.

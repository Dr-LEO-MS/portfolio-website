/*!
 * contact-config.js — settings for the portfolio contact form.
 *
 * Everything the contact form needs lives here so the behaviour can be tuned
 * without touching contact-form.js.
 *
 * HOW EMAIL DELIVERY WORKS
 * ------------------------
 * 1. Create a free form endpoint at https://web3forms.com (or any service that
 *    accepts a JSON POST) and paste the public access key below.
 * 2. Until an access key is present the form automatically degrades to the
 *    "open your mail client" behaviour, so the site never loses a lead.
 *
 * The access key is a *public* key: it is only allowed to send mail to the
 * inbox it was created for, which is why it is safe to commit it here.
 */
window.PORTFOLIO_CONTACT_CONFIG = {
  /* Mail delivery --------------------------------------------------------- */
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: '',                       // <-- paste your Web3Forms access key here
  email: 'mssubhash07@gmail.com',      // fallback inbox for the mailto: fallback
  subject: 'New enquiry from the portfolio website',
  fromName: 'Portfolio website',

  /* Message rules --------------------------------------------------------- */
  limits: {
    minFillSeconds: 4,                 // submissions faster than this look automated
    throttleSeconds: 45,               // wait time between two submissions per browser
    minMessageLength: 10,
    maxMessageLength: 2000
  },

  /* Optional captcha ------------------------------------------------------
   * Add an hCaptcha site key to render an extra challenge inside the form.
   * Leave it empty to rely on the honeypot + timing + throttle layers.      */
  captcha: {
    provider: 'hcaptcha',
    siteKey: ''
  },

  /* Never lose a message: keep failed sends in localStorage and retry ------ */
  offlineQueue: {
    enabled: true,
    key: 'portfolio.pendingMessages',
    max: 10
  },

  /* Show a "your mail app will open" fallback when delivery fails --------- */
  fallbackMailto: true,

  /* Copy shown to the visitor --------------------------------------------- */
  messages: {
    sending: 'Sending your message…',
    success: 'Thank you! Your message has been sent — I usually reply within 24 hours.',
    queued: 'You appear to be offline. Your message is saved and will be sent automatically.',
    throttled: 'You just sent a message. Please wait a moment before sending another one.',
    failed: 'Sorry, the message could not be sent right now. Please email mssubhash07@gmail.com or try again.',
    mailtoOpened: 'Opening your email app — press Send there to deliver your message.'
  }
};

# Subhash M — Portfolio Website

A responsive, single-page portfolio website for **Subhash M**, a Python Full Stack Developer from Villupuram, Tamil Nadu. The site showcases projects, skills, education, and a contact form that submits via `mailto:` — so it works completely as a **static site** (no backend required) and can be hosted on GitHub Pages.

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Project Sections](#project-sections)
- [Contact Form](#contact-form)
- [SEO & Accessibility](#seo--accessibility)
- [Customization](#customization)
- [Deployment](#deployment)
- [License](#license)
- [Credits](#credits)

## Live Demo

The site is published at: **https://dr-leo-ms.github.io/portfolio-website/**

## Features

- **Fully responsive** layout built on Bootstrap 4 with a custom responsive layer
- **Dark-themed** design (`dark-vertion black-bg`) optimized for a developer portfolio
- **Animated on scroll** using WOW.js + Animate.css
- **One-page navigation** with smooth scrolling and active-link highlighting via jQuery One Page Nav
- **Project gallery** with Fancybox lightbox previews
- **Skills visualization** — responsive progress bars and circular progress indicators
- **Static-friendly contact form** — uses `mailto:` so there's no server-side processing required
- **SEO-optimized** with Open Graph / Twitter Card meta tags, structured JSON-LD data, `robots.txt`, and `sitemap.xml`
- **Accessibility conscious** — skip link, keyboard focus styles, ARIA attributes, and semantic HTML
- **Print styles** included for offline reading

## Tech Stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| Markup      | HTML5                                            |
| Styling     | CSS3, Bootstrap 4, Animate.css                   |
| Icons       | Font Awesome 4.7.0                               |
| Scripting   | JavaScript (ES5+), jQuery                        |
| Animation   | WOW.js, Animate.css                              |
| Carousels   | Owl Carousel 2                                   |
| Lightbox    | Fancybox                                          |
| Progress    | circle-progress.js                               |
| Navigation  | jQuery One Page Nav (jquery.nav.js)              |
| Hosting     | GitHub Pages                                    |

## Project Architecture

```
portfolio-website/
├── index.html              # Single-page portfolio markup
├── robots.txt              # Search-engine crawl directives + sitemap reference
├── sitemap.xml             # Sitemap for search engines
├── .gitignore              # Ignores OS/editor noise and local tooling files
├── README.md               # This file
│
├── assets/
│   ├── css/
│   │   ├── styles.css              # Core template styles
│   │   ├── responsive.css          # Breakpoint overrides
│   │   ├── custom.css              # Project-level polish (accessibility, print, fixes)
│   │   └── colors/
│   │       ├── blue-munsell.css    # Active accent palette (swappable)
│   │       ├── blue.css
│   │       ├── green.css
│   │       ├── orange.css
│   │       ├── purple.css
│   │       ├── slate.css
│   │       └── yellow.css
│   ├── js/
│   │   └── custom-scripts.js       # All interactive behavior (guarded for static use)
│   │
│   ├── plugins/
│   │   ├── css/                    # Plugin stylesheets (Bootstrap, Owl, Animate, Fancybox)
│   │   └── js/                     # Plugin scripts (jQuery, Popper, Bootstrap, Owl, WOW, etc.)
│   │
│   ├── icons/                      # Font Awesome assets
│   └── images/                     # Hero photo, about illustration, project screenshots, favicon
│       └── portfolio/              # Project gallery images
│
└── demo/                           # Demo-only color switcher (not used in production)
```

## Getting Started

### Prerequisites

No build step or package manager is needed. The site is plain HTML, CSS, and JavaScript.

- A modern browser (Chrome, Firefox, Edge, Safari)
- A web server (for local preview, any static server works)

### Local Preview

Because the contact form and plugins read files relative to the project root, it's best to preview with a local server rather than `file://`.

Using Python:

```bash
cd /path/to/portfolio-website
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

Or with Node.js (if you have `http-server` installed):

```bash
npx http-server .
```

## Configuration

Before deploying, update these values for your own use:

1. **Personal details** — `index.html`
   - `<title>`, `<meta name="description">`, `<meta name="author">`
   - Open Graph and Twitter Card tags
   - Name, role, contact links, and About text (section headings and paragraphs)
   - Projects section, Skills, Education, and Contact/Footer details

2. **Color accent** — `index.html`
   - Change `assets/css/colors/blue-munsell.css` to one of: `blue`, `green`, `blue-munsell`, `orange`, `purple`, `slate`, or `yellow`.

3. **Email recipient** — `index.html`
   - The contact form `action` and the email links point to `mailto:mssubhash07@gmail.com`. Update all occurrences for your own address.

4. **Canonical URL & sitemap** — `index.html`, `robots.txt`, `sitemap.xml`
   - Point these to your actual GitHub Pages / domain URL.

## Project Sections

The single-page `index.html` is organized into clearly commented sections:

| Section ID      | Anchor    | Description                                         |
|-----------------|-----------|-----------------------------------------------------|
| `#mh-header`    | Header    | Sticky navigation bar with smooth-scroll anchors    |
| `#mh-home`      | Home      | Hero headline, tagline, quick contact, portrait     |
| `#mh-about`     | About     | Bio, skills overview, and tech tags                 |
| `#mh-service`   | Services  | Service cards                                       |
| `#mh-portfolio` | Portfolio | Featured projects with Fancybox image previews      |
| `#mh-skills`    | Skills    | Technical skill bars and professional skill circles |
| `#mh-education` | Education | Academic history and certifications                 |
| `#mh-contact`   | Contact   | Contact details + inline-validated `mailto:` form   |

## Contact Form

The form uses a `mailto:` action with `enctype="text/plain"`, so submitting it opens the visitor's default email client pre-filled with their message. JavaScript (`custom-scripts.js`) adds:

- Inline validation via `validator.min.js` (graceful fallback if the plugin fails to load)
- A confirmation message: *"Opening your email app - press Send there to deliver your message."*
- Keyboard-accessible markup (`aria-label`, `sr-only` labels, `required` attributes)

There is **no `process.php`**, `email.php`, or any server-side script.

## SEO & Accessibility

- Open Graph and Twitter Card meta tags for rich link previews
- `application/ld+json` structured data (`Person` schema) for search engines
- `robots.txt` and `sitemap.xml` for discoverability
- Semantic HTML sectioning with proper heading hierarchy
- Skip-link for keyboard users, visible focus styles, and ARIA attributes
- Print stylesheet for offline reading

## Customization

### Changing the Accent Color

One color palette is loaded at a time. Open `index.html` and change the line in the `<head>`:

```html
<link rel="stylesheet" href="assets/css/colors/blue-munsell.css">
```

Available options: `blue.css`, `green.css`, `blue-munsell.css`, `orange.css`, `purple.css`, `slate.css`, `yellow.css`.

### Typography

Fonts are loaded from Google Fonts in the `<head>` of `index.html`. Replace the Roboto family link if you prefer a different font.

## Deployment

The site is designed for GitHub Pages:

1. Push the repository to GitHub (`https://github.com/Dr-LEO-MS/portfolio-website`).
2. In **Settings → Pages**, set the source to the `main` (or `master`) branch.
3. GitHub Pages serves `index.html` automatically.

The canonical URL, Open Graph image, sitemap, and robots.txt all point to the live URL and should be updated if you fork the project.

## License

This project is based on the **Martan** HTML portfolio template, which is distributed under the MIT License. The custom content (text, images, skill data) is original to Subhash M.

## Credits

- **Template foundation**: [Martan](https://html.design/) HTML5 portfolio template
- **Icons**: [Font Awesome 4.7.0](https://fontawesome.com/)
- **Carousel**: [Owl Carousel 2](https://owlcarousel2.github.io/OwlCarousel2/)
- **Lightbox**: [Fancybox](https://fancyapps.com/fancybox-3/)
- **Animations**: [Animate.css](https://animate.style/) + [WOW.js](https://github.com/mat-sz/iziToast) (via `wow.min.js`)
- **Progress circles**: [circle-progress](https://github.com/komarovsoft/circle-progress)
- **Fonts**: [Google Fonts — Roboto](https://fonts.google.com/specimen/Roboto)


<div align="center">

<!-- Animated header banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0F2027,50:2C5364,100:00C9A7&height=220&section=header&text=Subhash%20M&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Python%20%7C%20Full%20Stack%20Developer&descAlignY=58&descAlign=50" width="100%"/>

<!-- Typing animation -->
<a href="#">
  <img src="https://readme-typing-svg.demolab.com/?lines=Building+full-stack+web+apps;Python+%7C+FastAPI+%7C+Django;AI-powered+integrations;Always+shipping+something+new;Chennai%2C+Tamil+Nadu%2C+India&font=Fira%20Code&center=true&width=600&height=50&color=00C9A7&vCenter=true&size=22&pause=1200"/>
</a>

<br/>

<!-- Badges -->
<p>
  <a href="https://dr-leo-ms.github.io/portfolio-website/"><img src="https://img.shields.io/badge/🌐_Live_Demo-View_Site-00C9A7?style=for-the-badge" alt="Live Demo"/></a>
  <a href="https://github.com/Dr-LEO-MS/portfolio-website/stargazers"><img src="https://img.shields.io/github/stars/Dr-LEO-MS/portfolio-website?style=for-the-badge&color=yellow" alt="Stars"/></a>
  <a href="https://github.com/Dr-LEO-MS/portfolio-website/network/members"><img src="https://img.shields.io/github/forks/Dr-LEO-MS/portfolio-website?style=for-the-badge&color=blue" alt="Forks"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" alt="License"/></a>
</p>

<p>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Bootstrap_4-7952B3?style=flat-square&logo=bootstrap&logoColor=white"/>
  <img src="https://img.shields.io/badge/jQuery-0769AD?style=flat-square&logo=jquery&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white"/>
</p>

</div>

<br/>

## 🌟 Overview

A **responsive, single-page portfolio website** for **Subhash M**, a Python Full Stack Developer from Villupuram, Tamil Nadu. Built to showcase projects, skills, and education — with a contact form that works entirely through `mailto:`, so **no backend is required**. Deployed effortlessly on **GitHub Pages**.

> 💡 Zero build step. Zero server. Just clone, customize, and deploy.

<br/>

## 📸 Preview

<div align="center">
<!-- Replace with actual screenshot/GIF paths once available -->
<img src="assets/images/preview-desktop.png" alt="Desktop preview" width="80%"/>
<br/><br/>
<img src="assets/images/preview-mobile.png" alt="Mobile preview" width="30%"/>
</div>

<br/>

## ✨ Features

| | Feature | Description |
|---|---|---|
| 📱 | **Fully Responsive** | Built on Bootstrap 4 with a custom responsive layer for every screen size |
| 🌙 | **Dark Themed** | Sleek `dark-vertion black-bg` design tailored for a developer portfolio |
| 🎬 | **Scroll Animations** | Smooth entrance animations via WOW.js + Animate.css |
| 🧭 | **One-Page Navigation** | Smooth scrolling with active-link highlighting |
| 🖼️ | **Project Gallery** | Fancybox lightbox previews for project screenshots |
| 📊 | **Skills Visualization** | Animated progress bars and circular skill indicators |
| ✉️ | **Static Contact Form** | `mailto:`-based form — no server-side processing needed |
| 🔍 | **SEO Optimized** | Open Graph, Twitter Cards, JSON-LD, `robots.txt`, `sitemap.xml` |
| ♿ | **Accessible** | Skip links, keyboard focus states, ARIA attributes, semantic HTML |
| 🖨️ | **Print Friendly** | Dedicated print stylesheet for offline reading |

<br/>

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|:---:|:---:|
| **Markup** | HTML5 |
| **Styling** | CSS3 · Bootstrap 4 · Animate.css |
| **Icons** | Font Awesome 4.7.0 |
| **Scripting** | JavaScript (ES5+) · jQuery |
| **Animation** | WOW.js · Animate.css |
| **Carousel** | Owl Carousel 2 |
| **Lightbox** | Fancybox |
| **Progress** | circle-progress.js |
| **Navigation** | jQuery One Page Nav |
| **Hosting** | GitHub Pages |

</div>

<br/>

## 🗂️ Project Architecture

```

portfolio-website/
├── index.html              # Single-page portfolio markup
├── robots.txt              # Crawl directives + sitemap reference
├── sitemap.xml             # Sitemap for search engines
├── .gitignore              # Ignores OS/editor noise
├── README.md               # You are here 📍
│
├── assets/
│   ├── css/
│   │   ├── styles.css              # Core template styles
│   │   ├── responsive.css          # Breakpoint overrides
│   │   ├── custom.css              # Accessibility + print + fixes
│   │   └── colors/                 # Swappable accent palettes
│   │       ├── blue-munsell.css    ⭐ active
│   │       ├── blue.css
│   │       ├── green.css
│   │       ├── orange.css
│   │       ├── purple.css
│   │       ├── slate.css
│   │       └── yellow.css
│   │
│   ├── js/
│   │   └── custom-scripts.js       # All interactive behavior
│   │
│   ├── plugins/
│   │   ├── css/                    # Bootstrap, Owl, Animate, Fancybox
│   │   └── js/                     # jQuery, Popper, Bootstrap, WOW, etc.
│   │
│   ├── icons/                      # Font Awesome assets
│   └── images/                     # Photos, illustrations, favicon
│       └── portfolio/              # Project gallery images
│
└── demo/                           # Demo-only color switcher

```

<br/>

## 🚀 Getting Started

### Prerequisites
No build tools or package managers required — just a modern browser and (optionally) a local static server.

### Run Locally

**Clone the repo**
```

git clone https://github.com/Dr-LEO-MS/portfolio-website.git
cd portfolio-website

```

**Serve with Python**
```

python -m http.server 8000

# open [http://localhost:8000](http://localhost:8000)

```

**...or with Node.js**
```

npx http-server .

```

> ⚠️ Prefer a local server over opening `index.html` directly — the contact form and plugins load assets relative to the project root.

<br/>

## ⚙️ Configuration

Before deploying your own copy, update the following:

<details>
<summary><strong>1️⃣ Personal Details</strong> — <code>index.html</code></summary>
<br/>

- `<title>`, `<meta name="description">`, `<meta name="author">`
- Open Graph & Twitter Card tags
- Name, role, contact links, About text
- Projects, Skills, Education, and Contact/Footer content
</details>

<details>
<summary><strong>2️⃣ Accent Color</strong> — <code>index.html</code></summary>
<br/>

Swap the stylesheet link in `<head>` to one of:
`blue` · `green` · `blue-munsell` · `orange` · `purple` · `slate` · `yellow`
</details>

<details>
<summary><strong>3️⃣ Email Recipient</strong> — <code>index.html</code></summary>
<br/>

Update every `mailto:` occurrence to point to your own email address.
</details>

<details>
<summary><strong>4️⃣ Canonical URL & Sitemap</strong> — <code>index.html</code>, <code>robots.txt</code>, <code>sitemap.xml</code></summary>
<br/>

Point these to your live GitHub Pages URL or custom domain.
</details>

<br/>

## 🧭 Page Sections

| Section | Anchor | Description |
|---|---|---|
| `#mh-header` | Header | Sticky nav bar with smooth-scroll anchors |
| `#mh-home` | Home | Hero headline, tagline, quick contact, portrait |
| `#mh-about` | About | Bio, skills overview, tech tags |
| `#mh-service` | Services | Service cards |
| `#mh-portfolio` | Portfolio | Featured projects with Fancybox previews |
| `#mh-skills` | Skills | Skill bars and circular indicators |
| `#mh-education` | Education | Academic history and certifications |
| `#mh-contact` | Contact | Contact details + validated `mailto:` form |

<br/>

## ✉️ Contact Form

The form submits via `mailto:` with `enctype="text/plain"` — opening the visitor's default email client, pre-filled with their message. `custom-scripts.js` adds:

- ✅ Inline validation via `validator.min.js` (graceful fallback if unavailable)
- 💬 Confirmation prompt: *"Opening your email app — press Send there to deliver your message."*
- ⌨️ Keyboard-accessible markup (`aria-label`, `sr-only`, `required`)

> There is **no** `process.php`, `email.php`, or any server-side script — this stays 100% static.

<br/>

## 🔍 SEO & Accessibility

- Open Graph + Twitter Card meta tags for rich link previews
- `application/ld+json` structured data (`Person` schema)
- `robots.txt` + `sitemap.xml` for discoverability
- Semantic HTML with proper heading hierarchy
- Skip links, visible focus states, ARIA attributes
- Dedicated print stylesheet

<br/>

## 🎨 Customization

**Change accent color** — edit the stylesheet reference in `index.html`:
```html
<link rel="stylesheet" href="assets/css/colors/blue-munsell.css">
```

**Change typography** — swap the Google Fonts `<link>` in `<head>` (default: Roboto).

<br/>

## 📦 Deployment (GitHub Pages)

```mermaid
flowchart LR
    A[Push to GitHub] --> B[Settings → Pages]
    B --> C[Select main branch]
    C --> D[🚀 Live on GitHub Pages]
```

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Set the source branch to `main` (or `master`).
4. GitHub Pages automatically serves `index.html`.

> Don't forget to update the canonical URL, Open Graph image, sitemap, and `robots.txt` if you fork this project.

<br/>

## 📜 License

Built on the **Martan** HTML portfolio template, distributed under the **MIT License**.
All custom content (text, images, skill data) is original to Subhash M.

<br/>

## 🙌 Credits

| Resource | Author |
|---|---|
| Template foundation | [Martan](https://html.design/) |
| Icons | [Font Awesome 4.7.0](https://fontawesome.com/) |
| Carousel | [Owl Carousel 2](https://owlcarousel2.github.io/OwlCarousel2/) |
| Lightbox | [Fancybox](https://fancyapps.com/fancybox-3/) |
| Animations | [Animate.css](https://animate.style/) + WOW.js |
| Progress circles | [circle-progress](https://github.com/komarovsoft/circle-progress) |
| Fonts | [Google Fonts — Roboto](https://fonts.google.com/specimen/Roboto) |

<br/>

<div align="center">

### 📫 Let's Connect

<a href="mailto:mssubhash07@gmail.com"><img src="https://img.shields.io/badge/Email-mssubhash07%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white"/></a>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00C9A7,100:0F2027&height=100&section=footer"/>

</div>

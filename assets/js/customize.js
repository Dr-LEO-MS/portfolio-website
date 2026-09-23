/**
 * Portfolio Customization & Admin Controller
 * Secure client-side settings manager with live preview, crypto auth, and import/export.
 */

(function () {
  'use strict';

  // ==========================================================================
  // Default Settings & Configuration Schema
  // ==========================================================================
  var DEFAULT_SETTINGS = {
    theme: {
      accentColor: '#2196F3',
      fontHeading: 'Roboto',
      fontBody: 'Roboto',
      spacingScale: 1
    },
    animations: {
      reveal: true,
      parallax: true,
      hover: true,
      cursor: true,
      shimmer: true,
      heroFloat: true,
      ripple: true,
      pageEntry: true,
      duration: 0.8,
      intensity: 60,
      stagger: 0.1
    },
    layout: {
      containerWidth: 1140,
      navStyle: 'fixed',
      sectionOrder: ['home', 'about', 'services', 'portfolio', 'skills', 'education', 'gallery', 'cta', 'contact'],
      gridGap: 30,
      topbar: true
    },
    topbar: {
      enabled: true,
      email: 'mssubhash07@gmail.com',
      phone: '+91 7305263247',
      location: 'Villupuram, Tamil Nadu',
      whatsapp: 'https://wa.me/917305263247',
      resumeUrl: 'https://drive.google.com/open?id=1tRNt6tau2rDxyL40dVvEIzJxpE0_4MDm&usp=drive_fs'
    },
    images: {
      hero: 'assets/images/hero.jpg',
      about: 'assets/images/ab-img.png',
      modal0: 'assets/images/pr-0.jpg',
      modal1: 'assets/images/pr-1.jpg'
    },
    projectsList: [
      {
        id: 'fingers',
        title: 'Open Fingers Counter',
        category: 'Computer Vision',
        categoryFilter: 'computer-vision',
        subtitle: 'Python · OpenCV · MediaPipe',
        img: 'assets/images/projects/open-fingers-counter.svg',
        link: 'https://github.com/Dr-LEO-MS/Finger-count-using-camera-py',
        desc: 'A real-time finger counting system with OpenCV and MediaPipe landmark detection.',
        featured: true,
        gallery: true
      },
      {
        id: 'resume',
        title: 'Resume-Ai Builder',
        category: 'Web Applications',
        categoryFilter: 'web-app',
        subtitle: 'JavaScript · AI · ATS Compatible',
        img: 'assets/images/projects/resume-ai.svg',
        link: 'https://github.com/Dr-LEO-MS/Resume-Ai',
        desc: 'An AI powered resume builder with ATS keyword analytics and live export.',
        featured: true,
        gallery: true
      },
      {
        id: 'weather',
        title: 'Weather Prediction App',
        category: 'Python',
        categoryFilter: 'python',
        subtitle: 'Python · Weather APIs · Forecast Model',
        img: 'assets/images/projects/weather-prediction.svg',
        link: 'https://github.com/Dr-LEO-MS/Weather-prediction-python',
        desc: 'A Python weather forecast tool utilizing real-time meteorological API data.',
        featured: true,
        gallery: true
      },
      {
        id: 'portfolio',
        title: 'Developer Portfolio Website',
        category: 'Web Design',
        categoryFilter: 'web-design',
        subtitle: 'HTML5 · CSS3 · Vanilla JS',
        img: 'assets/images/projects/portfolio-website.svg',
        link: 'https://github.com/Dr-LEO-MS/portfolio-website',
        desc: 'Modern, fast personal portfolio featuring live style switches and customizer.',
        featured: true,
        gallery: true
      },
      {
        id: 'fullstack-platform',
        title: 'Full Stack Web Platform',
        category: 'Web Applications',
        categoryFilter: 'web-app',
        subtitle: 'PHP · MySQL · JavaScript',
        img: 'assets/images/projects/full-stack-platform.svg',
        link: 'https://github.com/Dr-LEO-MS',
        desc: 'Full stack responsive web portal with user authentication and database management.',
        featured: false,
        gallery: true
      },
      {
        id: 'gesture-motion',
        title: 'Gesture & Motion Detection',
        category: 'Computer Vision',
        categoryFilter: 'computer-vision',
        subtitle: 'Python · OpenCV · NumPy',
        img: 'assets/images/projects/motion-detection.svg',
        link: 'https://github.com/Dr-LEO-MS',
        desc: 'Real-time motion sensing and gesture tracking pipeline using camera inputs.',
        featured: false,
        gallery: true
      },
      {
        id: 'analytics-dash',
        title: 'Creative Analytics Dashboard',
        category: 'Photography & UI',
        categoryFilter: 'creative',
        subtitle: 'UI/UX · Dashboard · SVG Visuals',
        img: 'assets/images/projects/analytics-dashboard.svg',
        link: 'https://github.com/Dr-LEO-MS',
        desc: 'High-fidelity visual dashboard interface for data monitoring and analytics.',
        featured: false,
        gallery: true
      },
      {
        id: 'data-automation',
        title: 'Data Automation & Scripts',
        category: 'Python',
        categoryFilter: 'python',
        subtitle: 'Python · Automation · ETL',
        img: 'assets/images/projects/automation-scripts.svg',
        link: 'https://github.com/Dr-LEO-MS',
        desc: 'Batch processing, automated web scrapers and task schedulers in Python.',
        featured: false,
        gallery: true
      },
      {
        id: 'visual-media',
        title: 'Visual Media & Graphics',
        category: 'Photography & UI',
        categoryFilter: 'creative',
        subtitle: 'Visual UI · Branding · Assets',
        img: 'assets/images/projects/visual-media.svg',
        link: 'https://github.com/Dr-LEO-MS',
        desc: 'Design assets, iconography and visual media created for modern web interfaces.',
        featured: false,
        gallery: true
      }
    ],
    techSkills: [
      { name: 'Python', percentage: 90 },
      { name: 'HTML5 / CSS3', percentage: 95 },
      { name: 'JavaScript', percentage: 80 },
      { name: 'OpenCV', percentage: 85 },
      { name: 'PHP & MySQL', percentage: 80 },
      { name: 'MediaPipe & AI', percentage: 75 },
      { name: 'Django', percentage: 70 },
      { name: 'React', percentage: 65 }
    ],
    profSkills: [
      { name: 'Communication', percentage: 90 },
      { name: 'Team Work', percentage: 85 },
      { name: 'Project Management', percentage: 80 },
      { name: 'Creativity', percentage: 95 }
    ],
    categories: [
      'All Categories',
      'Computer Vision',
      'Web Applications',
      'Python',
      'Web Design',
      'Photography & UI'
    ],
    content: {
      bioText: "I create clean, modern and responsive web designs that focus on user experience and visual appeal. I enjoy crafting intuitive layouts, smooth interfaces and mobile-friendly pages using HTML, CSS and JavaScript.",
      categoryFilters: "All, Computer Vision, Web Application, Python, Web Design"
    },
    seo: {
      metaTitle: "Subhash M — Software Developer & Web Designer Portfolio",
      metaDesc: "Portfolio of Subhash M, a passionate Software Developer and Web Designer specializing in Python, Computer Vision, and Full Stack Web Development.",
      metaKeywords: "Subhash M, Portfolio, Software Developer, Python, OpenCV, Computer Vision, Full Stack, Web Design, Resume-Ai",
      gaId: "",
      perfMode: false,
      imgQuality: 85
    },
    security: {
      sessionTimeoutMinutes: 15
    }
  };

  var STORAGE_KEY_SETTINGS = 'portfolio_customization_settings';
  var STORAGE_KEY_PWD_HASH = 'portfolio_admin_pwd_hash';
  var STORAGE_KEY_PWD_SALT = 'portfolio_admin_pwd_salt';
  var STORAGE_KEY_SESSION = 'portfolio_admin_session_active';

  var currentSettings = {};
  var sessionTimerInterval = null;
  var sessionExpiresAt = 0;

  // ==========================================================================
  // Cryptography Helpers (Web Crypto API SHA-256 + Salt)
  // ==========================================================================
  function generateSalt() {
    var array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  async function hashPassword(password, salt) {
    var enc = new TextEncoder();
    var data = enc.encode(salt + password);
    var hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    var hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  function checkPasswordComplexity(pwd) {
    if (!pwd || pwd.length < 8) return { score: 0, label: 'Too short (min 8 chars)' };
    var score = 0;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score < 2) return { score: 1, label: 'Weak' };
    if (score === 2 || score === 3) return { score: 2, label: 'Medium' };
    return { score: 3, label: 'Strong' };
  }

  function updateStrengthMeter(elId, complexity) {
    var meter = document.getElementById(elId);
    if (!meter) return;
    meter.className = 'password-strength';
    if (complexity.score === 1) meter.classList.add('strength-weak');
    else if (complexity.score === 2) meter.classList.add('strength-medium');
    else if (complexity.score === 3) meter.classList.add('strength-strong');
    var label = meter.querySelector('.strength-label');
    if (label) label.textContent = complexity.label;
  }

  // ==========================================================================
  // Settings Storage & Sync
  // ==========================================================================
  function loadSettings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (raw) {
        currentSettings = deepMerge(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)), JSON.parse(raw));
      } else {
        currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch (e) {
      currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }

    // Sanitize section order so gallery is always after education
    if (currentSettings.layout && currentSettings.layout.sectionOrder) {
      var defaultOrder = ['home', 'about', 'services', 'portfolio', 'skills', 'education', 'gallery', 'cta', 'contact'];
      var order = currentSettings.layout.sectionOrder.filter(function(k) {
        return defaultOrder.indexOf(k) !== -1;
      });
      if (order.indexOf('gallery') === -1) {
        var eduIdx = order.indexOf('education');
        if (eduIdx !== -1) {
          order.splice(eduIdx + 1, 0, 'gallery');
        } else {
          order.push('gallery');
        }
      }
      if (order.indexOf('gallery') < order.indexOf('education')) {
        order = order.filter(function(k) { return k !== 'gallery'; });
        var eIdx = order.indexOf('education');
        order.splice(eIdx + 1, 0, 'gallery');
      }
      defaultOrder.forEach(function(secKey) {
        if (order.indexOf(secKey) === -1) order.push(secKey);
      });
      currentSettings.layout.sectionOrder = order;
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(currentSettings));
      broadcastSettingsToPreview();
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  function deepMerge(target, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        if (Array.isArray(source[key])) {
          target[key] = source[key].slice();
        } else if (source[key] && typeof source[key] === 'object') {
          target[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
    return target;
  }

  function broadcastSettingsToPreview() {
    var iframe = document.getElementById('preview-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'PORTFOLIO_SETTINGS_UPDATE',
        settings: currentSettings
      }, '*');
    }
  }

  // ==========================================================================
  // Session & Authentication Flow
  // ==========================================================================
  function initAuth() {
    var hash = localStorage.getItem(STORAGE_KEY_PWD_HASH);
    var authScreen = document.getElementById('auth-screen');
    var adminPanel = document.getElementById('admin-panel');
    var setupForm = document.getElementById('setup-form');
    var loginForm = document.getElementById('login-form');

    if (!hash) {
      // First time setup
      setupForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
    } else {
      setupForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
    }

    // Check if session is already active
    var sessionActive = sessionStorage.getItem(STORAGE_KEY_SESSION);
    if (sessionActive === 'true' && hash) {
      unlockAdmin();
    }

    // Setup Form Handler
    setupForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var p1 = document.getElementById('setup-pass').value;
      var p2 = document.getElementById('setup-confirm').value;
      var err = document.getElementById('setup-error');
      err.classList.add('hidden');

      if (p1 !== p2) {
        err.textContent = 'Passwords do not match.';
        err.classList.remove('hidden');
        return;
      }
      var comp = checkPasswordComplexity(p1);
      if (comp.score < 2) {
        err.textContent = 'Password is too weak. Please use letters, numbers, or symbols.';
        err.classList.remove('hidden');
        return;
      }

      var salt = generateSalt();
      var hashed = await hashPassword(p1, salt);
      localStorage.setItem(STORAGE_KEY_PWD_HASH, hashed);
      localStorage.setItem(STORAGE_KEY_PWD_SALT, salt);
      sessionStorage.setItem(STORAGE_KEY_SESSION, 'true');
      unlockAdmin();
    });

    // Login Form Handler
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var input = document.getElementById('login-pass').value;
      var err = document.getElementById('login-error');
      err.classList.add('hidden');

      var storedHash = localStorage.getItem(STORAGE_KEY_PWD_HASH);
      var storedSalt = localStorage.getItem(STORAGE_KEY_PWD_SALT);

      var computed = await hashPassword(input, storedSalt);
      if (computed === storedHash) {
        sessionStorage.setItem(STORAGE_KEY_SESSION, 'true');
        unlockAdmin();
      } else {
        err.textContent = 'Incorrect password. Please try again.';
        err.classList.remove('hidden');
      }
    });

    // Password strength listener for setup
    document.getElementById('setup-pass').addEventListener('input', function () {
      var comp = checkPasswordComplexity(this.value);
      updateStrengthMeter('strength-meter', comp);
    });

    // Logout button
    document.getElementById('btn-logout').addEventListener('click', function () {
      lockAdmin();
    });
  }

  function unlockAdmin() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    resetSessionTimer();
    startSessionTracking();
    populateFormWithSettings();
  }

  function lockAdmin() {
    sessionStorage.removeItem(STORAGE_KEY_SESSION);
    clearInterval(sessionTimerInterval);
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('login-pass').value = '';
    var err = document.getElementById('login-error');
    if (err) err.classList.add('hidden');
  }

  function resetSessionTimer() {
    var minutes = (currentSettings.security && currentSettings.security.sessionTimeoutMinutes) || 15;
    sessionExpiresAt = Date.now() + (minutes * 60 * 1000);
    updateSessionTimerDisplay();
  }

  function updateSessionTimerDisplay() {
    var display = document.getElementById('session-timer');
    if (!display) return;
    var remainingMs = sessionExpiresAt - Date.now();
    if (remainingMs <= 0) {
      lockAdmin();
      return;
    }
    var totalSeconds = Math.floor(remainingMs / 1000);
    var mins = Math.floor(totalSeconds / 60);
    var secs = totalSeconds % 60;
    display.textContent = 'Auto-lock: ' + mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  function startSessionTracking() {
    clearInterval(sessionTimerInterval);
    sessionTimerInterval = setInterval(updateSessionTimerDisplay, 1000);

    var resetOnActivity = function () {
      if (sessionStorage.getItem(STORAGE_KEY_SESSION) === 'true') {
        resetSessionTimer();
      }
    };

    ['mousemove', 'keydown', 'click', 'scroll'].forEach(function (evt) {
      window.addEventListener(evt, resetOnActivity, { passive: true });
    });
  }

  // ==========================================================================
  // Image References Manager
  // ==========================================================================
  function updateImageThumb(inputId, imgId, placeholderId) {
    var input = document.getElementById(inputId);
    var img = document.getElementById(imgId);
    var placeholder = document.getElementById(placeholderId);
    if (!input || !img) return;

    var val = input.value.trim();
    if (val) {
      img.src = val;
      img.style.display = 'block';
      if (placeholder) placeholder.classList.add('hidden');
    } else {
      img.style.display = 'none';
      if (placeholder) placeholder.classList.remove('hidden');
    }
  }

  function populateImageReferences() {
    if (!currentSettings.images) currentSettings.images = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.images));

    var heroInput = document.getElementById('img-ref-hero');
    var aboutInput = document.getElementById('img-ref-about');
    var modal0Input = document.getElementById('img-ref-modal-0');
    var modal1Input = document.getElementById('img-ref-modal-1');

    if (heroInput) {
      heroInput.value = currentSettings.images.hero || 'assets/images/hero.jpg';
      updateImageThumb('img-ref-hero', 'img-thumb-hero', 'placeholder-hero');
    }
    if (aboutInput) {
      aboutInput.value = currentSettings.images.about || 'assets/images/ab-img.png';
      updateImageThumb('img-ref-about', 'img-thumb-about', 'placeholder-about');
    }
    if (modal0Input) {
      modal0Input.value = currentSettings.images.modal0 || 'assets/images/pr-0.jpg';
      updateImageThumb('img-ref-modal-0', 'img-thumb-modal-0', 'placeholder-modal-0');
    }
    if (modal1Input) {
      modal1Input.value = currentSettings.images.modal1 || 'assets/images/pr-1.jpg';
      updateImageThumb('img-ref-modal-1', 'img-thumb-modal-1', 'placeholder-modal-1');
    }
  }

  // ==========================================================================
  // Projects & Gallery Dynamic Management
  // ==========================================================================
  function renderProjectsList() {
    var container = document.getElementById('dynamic-project-list');
    if (!container) return;
    container.innerHTML = '';

    var list = currentSettings.projectsList || [];
    if (!list.length) {
      container.innerHTML = '<p class="setting-hint text-center" style="padding: 20px;">No projects yet. Click "Add New Project" above to create one!</p>';
      return;
    }

    list.forEach(function (proj, index) {
      var card = document.createElement('div');
      card.className = 'dynamic-project-card';
      card.setAttribute('data-index', index);

      var imgPath = proj.img || 'assets/images/projects/resume-ai.svg';
      var category = proj.category || 'General';
      var subtitle = proj.subtitle || '';

      card.innerHTML = `
        <div class="project-thumb-box">
          <img src="${imgPath}" alt="${proj.title}" onerror="this.src='assets/images/projects/resume-ai.svg'">
        </div>
        <div class="project-info-wrap">
          <h5>${proj.title}</h5>
          <div class="project-meta">
            <span class="badge">${category}</span>
            <span>${subtitle}</span>
          </div>
        </div>
        <div class="project-card-actions">
          <label class="toggle-item" style="padding: 6px 10px; margin: 0;" title="Show in Featured Section">
            <input type="checkbox" class="chk-proj-featured" data-index="${index}" ${proj.featured ? 'checked' : ''}>
            <span style="font-size: 11px;">Featured</span>
          </label>
          <label class="toggle-item" style="padding: 6px 10px; margin: 0;" title="Show in Gallery Section">
            <input type="checkbox" class="chk-proj-gallery" data-index="${index}" ${proj.gallery ? 'checked' : ''}>
            <span style="font-size: 11px;">Gallery</span>
          </label>
          <button type="button" class="btn btn-icon btn-del-project" data-index="${index}" title="Delete Project">
            <i class="fa fa-trash" style="color: var(--danger-color);"></i>
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    // Attach listeners
    container.querySelectorAll('.chk-proj-featured').forEach(function (chk) {
      chk.addEventListener('change', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        if (currentSettings.projectsList[idx]) {
          currentSettings.projectsList[idx].featured = this.checked;
          saveSettings();
        }
      });
    });

    container.querySelectorAll('.chk-proj-gallery').forEach(function (chk) {
      chk.addEventListener('change', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        if (currentSettings.projectsList[idx]) {
          currentSettings.projectsList[idx].gallery = this.checked;
          saveSettings();
        }
      });
    });

    container.querySelectorAll('.btn-del-project').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        if (confirm('Are you sure you want to delete "' + currentSettings.projectsList[idx].title + '"?')) {
          currentSettings.projectsList.splice(idx, 1);
          saveSettings();
          renderProjectsList();
        }
      });
    });
  }

  // ==========================================================================
  // Skills Management (Technical & Professional)
  // ==========================================================================
  function renderSkills() {
    renderTechnicalSkills();
    renderProfessionalSkills();
  }

  function renderTechnicalSkills() {
    var container = document.getElementById('dynamic-tech-skills-list');
    if (!container) return;
    container.innerHTML = '';

    var skills = currentSettings.techSkills || [];
    skills.forEach(function (sk, index) {
      var card = document.createElement('div');
      card.className = 'dynamic-skill-card';
      card.innerHTML = `
        <div class="skill-info">
          <div class="skill-title-row">
            <strong>${sk.name}</strong>
            <span id="tech-val-${index}">${sk.percentage}%</span>
          </div>
          <div class="slider-row" style="margin: 4px 0 0;">
            <input type="range" class="tech-skill-slider" data-index="${index}" min="10" max="100" step="5" value="${sk.percentage}">
          </div>
        </div>
        <button type="button" class="btn btn-icon btn-del-tech-skill" data-index="${index}" title="Remove skill">
          <i class="fa fa-times" style="color: var(--danger-color);"></i>
        </button>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.tech-skill-slider').forEach(function (slider) {
      slider.addEventListener('input', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        var val = parseInt(this.value, 10);
        document.getElementById('tech-val-' + idx).textContent = val + '%';
        if (currentSettings.techSkills[idx]) {
          currentSettings.techSkills[idx].percentage = val;
          saveSettings();
        }
      });
    });

    container.querySelectorAll('.btn-del-tech-skill').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        currentSettings.techSkills.splice(idx, 1);
        saveSettings();
        renderTechnicalSkills();
      });
    });
  }

  function renderProfessionalSkills() {
    var container = document.getElementById('dynamic-prof-skills-list');
    if (!container) return;
    container.innerHTML = '';

    var skills = currentSettings.profSkills || [];
    skills.forEach(function (sk, index) {
      var card = document.createElement('div');
      card.className = 'dynamic-skill-card';
      card.innerHTML = `
        <div class="skill-info">
          <div class="skill-title-row">
            <strong>${sk.name}</strong>
            <span id="prof-val-${index}">${sk.percentage}%</span>
          </div>
          <div class="slider-row" style="margin: 4px 0 0;">
            <input type="range" class="prof-skill-slider" data-index="${index}" min="10" max="100" step="5" value="${sk.percentage}">
          </div>
        </div>
        <button type="button" class="btn btn-icon btn-del-prof-skill" data-index="${index}" title="Remove skill">
          <i class="fa fa-times" style="color: var(--danger-color);"></i>
        </button>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.prof-skill-slider').forEach(function (slider) {
      slider.addEventListener('input', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        var val = parseInt(this.value, 10);
        document.getElementById('prof-val-' + idx).textContent = val + '%';
        if (currentSettings.profSkills[idx]) {
          currentSettings.profSkills[idx].percentage = val;
          saveSettings();
        }
      });
    });

    container.querySelectorAll('.btn-del-prof-skill').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        currentSettings.profSkills.splice(idx, 1);
        saveSettings();
        renderProfessionalSkills();
      });
    });
  }

  // ==========================================================================
  // Category Filters Tags Manager
  // ==========================================================================
  function renderCategoryTags() {
    var container = document.getElementById('category-tags-container');
    if (!container) return;
    container.innerHTML = '';

    var cats = currentSettings.categories || DEFAULT_SETTINGS.categories;
    cats.forEach(function (cat, index) {
      var badge = document.createElement('div');
      badge.className = 'tag-badge';
      var isAll = cat.toLowerCase().indexOf('all') !== -1;
      badge.innerHTML = `
        <span>${cat}</span>
        ${!isAll ? `<i class="fa fa-times btn-del-tag" data-index="${index}" title="Remove category"></i>` : ''}
      `;
      container.appendChild(badge);
    });

    container.querySelectorAll('.btn-del-tag').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        currentSettings.categories.splice(idx, 1);
        saveSettings();
        renderCategoryTags();
      });
    });
  }

  // ==========================================================================
  // Form Binding & UI Controllers
  // ==========================================================================
  function populateFormWithSettings() {
    // Theme
    var color = (currentSettings.theme && currentSettings.theme.accentColor) || '#2196F3';
    document.getElementById('custom-accent').value = color;
    document.getElementById('color-hex-label').textContent = color;
    updateActiveColorSwatch(color);

    document.getElementById('font-heading').value = currentSettings.theme.fontHeading;
    document.getElementById('font-body').value = currentSettings.theme.fontBody;
    document.getElementById('spacing-scale').value = currentSettings.theme.spacingScale;
    document.getElementById('spacing-val').textContent = currentSettings.theme.spacingScale + 'x';

    // Animations
    document.getElementById('anim-reveal').checked = currentSettings.animations.reveal;
    document.getElementById('anim-parallax').checked = currentSettings.animations.parallax;
    document.getElementById('anim-hover').checked = currentSettings.animations.hover;
    document.getElementById('anim-cursor').checked = currentSettings.animations.cursor;
    document.getElementById('anim-shimmer').checked = currentSettings.animations.shimmer;
    document.getElementById('anim-hero-float').checked = currentSettings.animations.heroFloat;
    document.getElementById('anim-ripple').checked = currentSettings.animations.ripple;
    document.getElementById('anim-page-entry').checked = currentSettings.animations.pageEntry;

    document.getElementById('anim-speed').value = currentSettings.animations.duration;
    document.getElementById('anim-speed-val').textContent = currentSettings.animations.duration + 's';
    document.getElementById('anim-intensity').value = currentSettings.animations.intensity;
    document.getElementById('anim-intensity-val').textContent = currentSettings.animations.intensity + 'px';
    document.getElementById('anim-stagger').value = currentSettings.animations.stagger;
    document.getElementById('anim-stagger-val').textContent = currentSettings.animations.stagger + 's';

    // Layout & Topbar
    if (document.getElementById('topbar-enable')) {
      document.getElementById('topbar-enable').checked = (currentSettings.layout.topbar !== false);
    }
    if (currentSettings.topbar) {
      if (document.getElementById('topbar-email')) document.getElementById('topbar-email').value = currentSettings.topbar.email || '';
      if (document.getElementById('topbar-phone')) document.getElementById('topbar-phone').value = currentSettings.topbar.phone || '';
      if (document.getElementById('topbar-location')) document.getElementById('topbar-location').value = currentSettings.topbar.location || '';
      if (document.getElementById('topbar-whatsapp')) document.getElementById('topbar-whatsapp').value = currentSettings.topbar.whatsapp || '';
      if (document.getElementById('topbar-resume')) document.getElementById('topbar-resume').value = currentSettings.topbar.resumeUrl || '';
    }

    document.getElementById('container-width').value = currentSettings.layout.containerWidth;
    document.getElementById('container-width-val').textContent = currentSettings.layout.containerWidth + 'px';
    var navRadios = document.getElementsByName('nav-style');
    for (var i = 0; i < navRadios.length; i++) {
      navRadios[i].checked = (navRadios[i].value === currentSettings.layout.navStyle);
    }
    document.getElementById('grid-gap').value = currentSettings.layout.gridGap;
    document.getElementById('grid-gap-val').textContent = currentSettings.layout.gridGap + 'px';
    renderSectionOrder(currentSettings.layout.sectionOrder);

    // Image References
    populateImageReferences();

    // Projects & Gallery
    renderProjectsList();

    // Skills
    renderSkills();

    // Bio & Categories
    document.getElementById('bio-text').value = currentSettings.content.bioText || '';
    renderCategoryTags();

    // SEO
    document.getElementById('meta-title').value = currentSettings.seo.metaTitle;
    document.getElementById('meta-desc').value = currentSettings.seo.metaDesc;
    updateCharCount('meta-desc', 'meta-desc-count', 160);
    document.getElementById('meta-keywords').value = currentSettings.seo.metaKeywords;
    document.getElementById('ga-id').value = currentSettings.seo.gaId;
    document.getElementById('perf-mode').checked = currentSettings.seo.perfMode;
    document.getElementById('img-quality').value = currentSettings.seo.imgQuality;
    document.getElementById('img-quality-val').textContent = currentSettings.seo.imgQuality + '%';

    // Security
    document.getElementById('session-timeout').value = currentSettings.security.sessionTimeoutMinutes;
    document.getElementById('session-timeout-val').textContent = currentSettings.security.sessionTimeoutMinutes + ' min';
  }

  function updateActiveColorSwatch(color) {
    var swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(function (sw) {
      if (sw.getAttribute('data-color').toLowerCase() === color.toLowerCase()) {
        sw.classList.add('active');
      } else {
        sw.classList.remove('active');
      }
    });
  }

  function updateCharCount(inputId, countId, max) {
    var input = document.getElementById(inputId);
    var count = document.getElementById(countId);
    if (input && count) {
      var len = input.value.length;
      count.textContent = len + '/' + max;
      count.style.color = len > max ? '#f44336' : '';
    }
  }

  function renderSectionOrder(orderArray) {
    var list = document.getElementById('section-order');
    if (!list) return;
    list.innerHTML = '';
    var labels = {
      home: 'Home / Hero',
      about: 'About',
      services: 'Services',
      portfolio: 'Featured Projects',
      gallery: 'Gallery',
      skills: 'Skills',
      education: 'Education',
      cta: 'Call to Action',
      contact: 'Contact'
    };
    orderArray.forEach(function (id) {
      var li = document.createElement('li');
      li.setAttribute('data-id', id);
      li.draggable = true;
      li.innerHTML = '<i class="fa fa-arrows"></i> <span>' + (labels[id] || id) + '</span>';
      list.appendChild(li);
    });
    setupDragAndDrop(list);
  }

  function setupDragAndDrop(listEl) {
    var draggingItem = null;

    listEl.querySelectorAll('li').forEach(function (item) {
      item.addEventListener('dragstart', function () {
        draggingItem = item;
        item.classList.add('dragging');
      });

      item.addEventListener('dragend', function () {
        item.classList.remove('dragging');
        draggingItem = null;
        // Collect new order
        var newOrder = [];
        listEl.querySelectorAll('li').forEach(function (li) {
          newOrder.push(li.getAttribute('data-id'));
        });
        currentSettings.layout.sectionOrder = newOrder;
        saveSettings();
      });
    });

    listEl.addEventListener('dragover', function (e) {
      e.preventDefault();
      var afterElement = getDragAfterElement(listEl, e.clientY);
      if (!afterElement) {
        listEl.appendChild(draggingItem);
      } else {
        listEl.insertBefore(draggingItem, afterElement);
      }
    });
  }

  function getDragAfterElement(container, y) {
    var draggableElements = Array.from(container.querySelectorAll('li:not(.dragging)'));
    return draggableElements.reduce(function (closest, child) {
      var box = child.getBoundingClientRect();
      var offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // ==========================================================================
  // Attach Event Handlers
  // ==========================================================================
  function initEventHandlers() {
    // Navigation Sidebar
    var sidebarItems = document.querySelectorAll('.sidebar-nav li');
    sidebarItems.forEach(function (li) {
      li.addEventListener('click', function () {
        sidebarItems.forEach(function (item) { item.classList.remove('active'); });
        li.classList.add('active');
        var secId = li.getAttribute('data-section');
        document.querySelectorAll('.settings-section').forEach(function (sec) {
          sec.classList.add('hidden');
        });
        var activeSec = document.getElementById('sec-' + secId);
        if (activeSec) activeSec.classList.remove('hidden');
      });
    });

    // Mobile sidebar toggle
    var toggleBtn = document.querySelector('.sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        document.getElementById('admin-sidebar').classList.toggle('open');
      });
    }

    // Color swatches
    document.querySelectorAll('.color-swatch').forEach(function (sw) {
      sw.addEventListener('click', function () {
        var color = sw.getAttribute('data-color');
        currentSettings.theme.accentColor = color;
        document.getElementById('custom-accent').value = color;
        document.getElementById('color-hex-label').textContent = color;
        updateActiveColorSwatch(color);
        saveSettings();
      });
    });

    // Custom Color picker
    var customColor = document.getElementById('custom-accent');
    customColor.addEventListener('input', function () {
      var color = this.value;
      currentSettings.theme.accentColor = color;
      document.getElementById('color-hex-label').textContent = color;
      updateActiveColorSwatch(color);
      saveSettings();
    });

    // Font selects
    document.getElementById('font-heading').addEventListener('change', function () {
      currentSettings.theme.fontHeading = this.value;
      saveSettings();
    });
    document.getElementById('font-body').addEventListener('change', function () {
      currentSettings.theme.fontBody = this.value;
      saveSettings();
    });

    // Spacing slider
    var spacingScale = document.getElementById('spacing-scale');
    spacingScale.addEventListener('input', function () {
      document.getElementById('spacing-val').textContent = this.value + 'x';
      currentSettings.theme.spacingScale = parseFloat(this.value);
      saveSettings();
    });

    // Animation toggles
    var animKeys = ['reveal', 'parallax', 'hover', 'cursor', 'shimmer', 'heroFloat', 'ripple', 'pageEntry'];
    animKeys.forEach(function (k) {
      var elId = 'anim-' + (k === 'heroFloat' ? 'hero-float' : (k === 'pageEntry' ? 'page-entry' : k));
      var chk = document.getElementById(elId);
      if (chk) {
        chk.addEventListener('change', function () {
          currentSettings.animations[k] = this.checked;
          saveSettings();
        });
      }
    });

    // Animation sliders
    document.getElementById('anim-speed').addEventListener('input', function () {
      document.getElementById('anim-speed-val').textContent = this.value + 's';
      currentSettings.animations.duration = parseFloat(this.value);
      saveSettings();
    });
    document.getElementById('anim-intensity').addEventListener('input', function () {
      document.getElementById('anim-intensity-val').textContent = this.value + 'px';
      currentSettings.animations.intensity = parseInt(this.value, 10);
      saveSettings();
    });
    document.getElementById('anim-stagger').addEventListener('input', function () {
      document.getElementById('anim-stagger-val').textContent = this.value + 's';
      currentSettings.animations.stagger = parseFloat(this.value);
      saveSettings();
    });

    // Layout & Topbar handlers
    var topbarEnableChk = document.getElementById('topbar-enable');
    if (topbarEnableChk) {
      topbarEnableChk.addEventListener('change', function () {
        currentSettings.layout.topbar = this.checked;
        if (!currentSettings.topbar) currentSettings.topbar = {};
        currentSettings.topbar.enabled = this.checked;
        saveSettings();
      });
    }

    ['topbar-email', 'topbar-phone', 'topbar-location', 'topbar-whatsapp', 'topbar-resume'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function () {
          if (!currentSettings.topbar) currentSettings.topbar = {};
          var key = id.replace('topbar-', '');
          if (key === 'resume') key = 'resumeUrl';
          currentSettings.topbar[key] = this.value;
          saveSettings();
        });
      }
    });

    document.getElementById('container-width').addEventListener('input', function () {
      document.getElementById('container-width-val').textContent = this.value + 'px';
      currentSettings.layout.containerWidth = parseInt(this.value, 10);
      saveSettings();
    });
    document.getElementsByName('nav-style').forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (this.checked) {
          currentSettings.layout.navStyle = this.value;
          saveSettings();
        }
      });
    });
    document.getElementById('grid-gap').addEventListener('input', function () {
      document.getElementById('grid-gap-val').textContent = this.value + 'px';
      currentSettings.layout.gridGap = parseInt(this.value, 10);
      saveSettings();
    });

    // Image Reference Inputs
    ['hero', 'about', 'modal-0', 'modal-1'].forEach(function (key) {
      var inputId = 'img-ref-' + key;
      var imgId = 'img-thumb-' + key;
      var placeholderId = 'placeholder-' + key;
      var input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('input', function () {
          if (!currentSettings.images) currentSettings.images = {};
          var mapKey = key.replace('-', '');
          currentSettings.images[mapKey] = this.value;
          updateImageThumb(inputId, imgId, placeholderId);
          saveSettings();
        });
      }
    });

    var btnResetImg = document.getElementById('btn-reset-images');
    if (btnResetImg) {
      btnResetImg.addEventListener('click', function () {
        currentSettings.images = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.images));
        saveSettings();
        populateImageReferences();
      });
    }

    // Add Project Card Toggles
    var btnToggleAddProj = document.getElementById('btn-toggle-add-project');
    var addProjCard = document.getElementById('add-project-card');
    var btnCancelAddProj = document.getElementById('btn-cancel-add-project');
    if (btnToggleAddProj && addProjCard) {
      btnToggleAddProj.addEventListener('click', function () {
        addProjCard.classList.toggle('hidden');
      });
    }
    if (btnCancelAddProj && addProjCard) {
      btnCancelAddProj.addEventListener('click', function () {
        addProjCard.classList.add('hidden');
      });
    }

    // Add Project Form Submit
    var formAddProj = document.getElementById('form-add-project');
    if (formAddProj) {
      formAddProj.addEventListener('submit', function (e) {
        e.preventDefault();
        var title = document.getElementById('new-proj-title').value.trim();
        var category = document.getElementById('new-proj-category').value;
        var subtitle = document.getElementById('new-proj-subtitle').value.trim();
        var img = document.getElementById('new-proj-img').value.trim();
        var link = document.getElementById('new-proj-link').value.trim();
        var desc = document.getElementById('new-proj-desc').value.trim();
        var isFeatured = document.getElementById('new-proj-featured').checked;
        var isGallery = document.getElementById('new-proj-gallery').checked;

        var catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (catSlug.indexOf('vision') !== -1) catSlug = 'computer-vision';
        else if (catSlug.indexOf('app') !== -1) catSlug = 'web-app';
        else if (catSlug.indexOf('design') !== -1) catSlug = 'web-design';
        else if (catSlug.indexOf('python') !== -1) catSlug = 'python';
        else catSlug = 'creative';

        var newProject = {
          id: 'proj-' + Date.now(),
          title: title,
          category: category,
          categoryFilter: catSlug,
          subtitle: subtitle,
          img: img || 'assets/images/projects/resume-ai.svg',
          link: link || '#',
          desc: desc,
          featured: isFeatured,
          gallery: isGallery
        };

        if (!currentSettings.projectsList) currentSettings.projectsList = [];
        currentSettings.projectsList.unshift(newProject);
        saveSettings();
        renderProjectsList();

        formAddProj.reset();
        addProjCard.classList.add('hidden');
      });
    }

    // Skills Add Card Toggles
    var btnToggleAddTech = document.getElementById('btn-toggle-add-tech-skill');
    var addTechCard = document.getElementById('add-tech-skill-card');
    var btnCancelAddTech = document.getElementById('btn-cancel-add-tech-skill');
    if (btnToggleAddTech && addTechCard) {
      btnToggleAddTech.addEventListener('click', function () {
        addTechCard.classList.toggle('hidden');
      });
    }
    if (btnCancelAddTech && addTechCard) {
      btnCancelAddTech.addEventListener('click', function () {
        addTechCard.classList.add('hidden');
      });
    }

    var techPctSlider = document.getElementById('new-tech-skill-pct');
    if (techPctSlider) {
      techPctSlider.addEventListener('input', function () {
        document.getElementById('new-tech-skill-pct-val').textContent = this.value + '%';
      });
    }

    var formAddTech = document.getElementById('form-add-tech-skill');
    if (formAddTech) {
      formAddTech.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('new-tech-skill-name').value.trim();
        var pct = parseInt(document.getElementById('new-tech-skill-pct').value, 10);
        if (name) {
          if (!currentSettings.techSkills) currentSettings.techSkills = [];
          currentSettings.techSkills.push({ name: name, percentage: pct });
          saveSettings();
          renderTechnicalSkills();
          formAddTech.reset();
          document.getElementById('new-tech-skill-pct-val').textContent = '85%';
          addTechCard.classList.add('hidden');
        }
      });
    }

    // Professional Skills Add Card Toggles
    var btnToggleAddProf = document.getElementById('btn-toggle-add-prof-skill');
    var addProfCard = document.getElementById('add-prof-skill-card');
    var btnCancelAddProf = document.getElementById('btn-cancel-add-prof-skill');
    if (btnToggleAddProf && addProfCard) {
      btnToggleAddProf.addEventListener('click', function () {
        addProfCard.classList.toggle('hidden');
      });
    }
    if (btnCancelAddProf && addProfCard) {
      btnCancelAddProf.addEventListener('click', function () {
        addProfCard.classList.add('hidden');
      });
    }

    var profPctSlider = document.getElementById('new-prof-skill-pct');
    if (profPctSlider) {
      profPctSlider.addEventListener('input', function () {
        document.getElementById('new-prof-skill-pct-val').textContent = this.value + '%';
      });
    }

    var formAddProf = document.getElementById('form-add-prof-skill');
    if (formAddProf) {
      formAddProf.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('new-prof-skill-name').value.trim();
        var pct = parseInt(document.getElementById('new-prof-skill-pct').value, 10);
        if (name) {
          if (!currentSettings.profSkills) currentSettings.profSkills = [];
          currentSettings.profSkills.push({ name: name, percentage: pct });
          saveSettings();
          renderProfessionalSkills();
          formAddProf.reset();
          document.getElementById('new-prof-skill-pct-val').textContent = '85%';
          addProfCard.classList.add('hidden');
        }
      });
    }

    // Add Category Handler
    var btnAddCat = document.getElementById('btn-add-category');
    var inputAddCat = document.getElementById('new-category-input');
    function handleAddCategory() {
      var val = inputAddCat.value.trim();
      if (val) {
        if (!currentSettings.categories) currentSettings.categories = DEFAULT_SETTINGS.categories.slice();
        if (currentSettings.categories.indexOf(val) === -1) {
          currentSettings.categories.push(val);
          saveSettings();
          renderCategoryTags();
        }
        inputAddCat.value = '';
      }
    }
    if (btnAddCat) btnAddCat.addEventListener('click', handleAddCategory);
    if (inputAddCat) {
      inputAddCat.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddCategory();
        }
      });
    }

    // Bio text handler
    document.getElementById('bio-text').addEventListener('input', function () {
      currentSettings.content.bioText = this.value;
      saveSettings();
    });

    // SEO inputs
    document.getElementById('meta-title').addEventListener('input', function () {
      currentSettings.seo.metaTitle = this.value;
      saveSettings();
    });
    var metaDesc = document.getElementById('meta-desc');
    metaDesc.addEventListener('input', function () {
      currentSettings.seo.metaDesc = this.value;
      updateCharCount('meta-desc', 'meta-desc-count', 160);
      saveSettings();
    });
    document.getElementById('meta-keywords').addEventListener('input', function () {
      currentSettings.seo.metaKeywords = this.value;
      saveSettings();
    });
    document.getElementById('ga-id').addEventListener('input', function () {
      currentSettings.seo.gaId = this.value;
      saveSettings();
    });
    document.getElementById('perf-mode').addEventListener('change', function () {
      currentSettings.seo.perfMode = this.checked;
      saveSettings();
    });
    document.getElementById('img-quality').addEventListener('input', function () {
      document.getElementById('img-quality-val').textContent = this.value + '%';
      currentSettings.seo.imgQuality = parseInt(this.value, 10);
      saveSettings();
    });

    // Security - Session timeout slider
    document.getElementById('session-timeout').addEventListener('input', function () {
      document.getElementById('session-timeout-val').textContent = this.value + ' min';
      currentSettings.security.sessionTimeoutMinutes = parseInt(this.value, 10);
      saveSettings();
      resetSessionTimer();
    });

    // Password Change Flow
    var changeForm = document.getElementById('change-pass-form');
    var newPassInput = document.getElementById('new-pass');
    newPassInput.addEventListener('input', function () {
      var comp = checkPasswordComplexity(this.value);
      updateStrengthMeter('change-strength-meter', comp);
    });

    changeForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var cur = document.getElementById('current-pass').value;
      var n1 = document.getElementById('new-pass').value;
      var n2 = document.getElementById('confirm-new-pass').value;
      var err = document.getElementById('change-pass-error');
      var succ = document.getElementById('change-pass-success');
      err.classList.add('hidden');
      succ.classList.add('hidden');

      var storedHash = localStorage.getItem(STORAGE_KEY_PWD_HASH);
      var storedSalt = localStorage.getItem(STORAGE_KEY_PWD_SALT);
      var curHash = await hashPassword(cur, storedSalt);

      if (curHash !== storedHash) {
        err.textContent = 'Current password is incorrect.';
        err.classList.remove('hidden');
        return;
      }
      if (n1 !== n2) {
        err.textContent = 'New passwords do not match.';
        err.classList.remove('hidden');
        return;
      }
      var comp = checkPasswordComplexity(n1);
      if (comp.score < 2) {
        err.textContent = 'New password is too weak. Please use letters, numbers, or symbols.';
        err.classList.remove('hidden');
        return;
      }

      var newSalt = generateSalt();
      var newHash = await hashPassword(n1, newSalt);
      localStorage.setItem(STORAGE_KEY_PWD_HASH, newHash);
      localStorage.setItem(STORAGE_KEY_PWD_SALT, newSalt);

      succ.textContent = 'Password updated successfully!';
      succ.classList.remove('hidden');
      changeForm.reset();
      updateStrengthMeter('change-strength-meter', { score: 0, label: '' });
    });

    // Export Settings
    document.getElementById('btn-export').addEventListener('click', function () {
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentSettings, null, 2));
      var dl = document.createElement('a');
      dl.setAttribute('href', dataStr);
      dl.setAttribute('download', 'portfolio-settings-' + new Date().toISOString().slice(0, 10) + '.json');
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
    });

    // Import Settings
    document.getElementById('btn-import').addEventListener('change', function (e) {
      var file = e.target.files[0];
      var statusEl = document.getElementById('import-status');
      if (!file) return;

      var reader = new FileReader();
      reader.onload = function (evt) {
        try {
          var parsed = JSON.parse(evt.target.result);
          if (parsed && typeof parsed === 'object') {
            currentSettings = deepMerge(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)), parsed);
            saveSettings();
            populateFormWithSettings();
            statusEl.className = 'import-status auth-success';
            statusEl.textContent = 'Settings imported successfully!';
            statusEl.classList.remove('hidden');
          } else {
            throw new Error('Invalid JSON structure');
          }
        } catch (err) {
          statusEl.className = 'import-status auth-error';
          statusEl.textContent = 'Error parsing file. Please select a valid settings JSON.';
          statusEl.classList.remove('hidden');
        }
      };
      reader.readAsText(file);
    });

    // Reset Modal
    var resetModal = document.getElementById('reset-modal');
    document.getElementById('btn-reset').addEventListener('click', function () {
      resetModal.classList.remove('hidden');
    });
    document.getElementById('reset-cancel').addEventListener('click', function () {
      resetModal.classList.add('hidden');
    });
    document.getElementById('reset-confirm').addEventListener('click', function () {
      currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      saveSettings();
      populateFormWithSettings();
      resetModal.classList.add('hidden');
    });

    // Live Preview Toggle Collapse
    var previewToggle = document.getElementById('preview-toggle');
    if (previewToggle) {
      previewToggle.addEventListener('click', function () {
        document.getElementById('admin-preview').classList.toggle('collapsed');
      });
    }

    // When iframe loads, push initial settings
    var iframe = document.getElementById('preview-iframe');
    if (iframe) {
      iframe.addEventListener('load', function () {
        broadcastSettingsToPreview();
      });
    }
  }

  // ==========================================================================
  // Public API for the optional admin tools (Media Studio, Messages inbox)
  // ==========================================================================
  window.PortfolioAdmin = {
    getSettings: function () { return currentSettings; },
    save: saveSettings,
    broadcast: broadcastSettingsToPreview
  };

  // ==========================================================================
  // Initialization
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', function () {
    loadSettings();
    initAuth();
    initEventHandlers();
  });

})();

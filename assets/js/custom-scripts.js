(function($) {
  "use strict";

  $.fn.andSelf = function() {
    return this.addBack.apply(this, arguments);
  };

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // =====================
  // Page Loader
  // =====================
  $(window).on("load", function() {
    var loader = document.querySelector(".section-loader");
    if (loader) {
      loader.classList.add("loaded");
      document.body.classList.add("page-ready");
    }

    var $isotopeContainer = $(".portfolioContainer");
    if ($isotopeContainer.length && typeof $isotopeContainer.isotope === "function") {
      $isotopeContainer.isotope({ filter: "*", animationOptions: { queue: true } });
      $(".portfolio-nav li").click(function() {
        $(".portfolio-nav .current").removeClass("current");
        $(this).addClass("current");
        $isotopeContainer.isotope({ filter: $(this).attr("data-filter"), animationOptions: { queue: true } });
        return false;
      });
    }
  });

  // =====================
  // Scroll-Triggered Reveals (replaces WOW.js)
  // =====================
  function initRevealObserver() {
    if (prefersReducedMotion) {
      document.querySelectorAll("[data-reveal]").forEach(function(el) {
        el.classList.add("revealed");
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseFloat(el.getAttribute("data-reveal-delay")) || 0;
          if (delay > 0) {
            setTimeout(function() { el.classList.add("revealed"); }, delay * 1000);
          } else {
            el.classList.add("revealed");
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    var staggerContainers = document.querySelectorAll("[data-reveal-stagger]");
    staggerContainers.forEach(function(container) {
      var children = container.querySelectorAll("[data-reveal]");
      children.forEach(function(child, i) {
        child.style.setProperty("--reveal-index", i);
      });
    });

    document.querySelectorAll("[data-reveal]").forEach(function(el) {
      observer.observe(el);
    });
  }

  // =====================
  // Section Title Underline Animation
  // =====================
  function initTitleObserver() {
    if (prefersReducedMotion) {
      document.querySelectorAll(".section-title").forEach(function(el) {
        el.classList.add("title-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("title-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll(".section-title").forEach(function(el) {
      observer.observe(el);
    });
  }

  // =====================
  // Skill Bar Animation on Scroll
  // =====================
  function initSkillBars() {
    var bars = document.querySelectorAll(".progressBar");
    if (!bars.length) return;

    bars.forEach(function(bar) {
      var pct = bar.querySelector(".percentagem");
      if (pct) {
        bar._targetWidth = pct.style.width;
        pct.style.width = "0%";
      }
    });

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          var pct = bar.querySelector(".percentagem");
          if (pct && bar._targetWidth) {
            bar.classList.add("animated");
            requestAnimationFrame(function() {
              pct.style.width = bar._targetWidth;
            });
          }
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(function(bar) { observer.observe(bar); });
  }

  // =====================
  // Circle Progress Animation on Scroll
  // =====================
  function initCircleProgress() {
    var circles = document.querySelectorAll(".mh-progress-circle");
    if (!circles.length) return;

    if (typeof ProgressBar !== "undefined" && ProgressBar.Circle) {
      circles.forEach(function(el) {
        el.innerHTML = "";
        var targetPct = parseFloat(el.getAttribute("data-progress")) || 0;
        var bar = new ProgressBar.Circle(el, {
          strokeWidth: 6,
          trailWidth: 6,
          easing: "easeInOut",
          duration: 1400,
          text: {
            value: "0%",
            className: "progressbar-text",
            autoStyle: false
          },
          step: function(state, circle) {
            circle.setText(Math.round(circle.value() * 100) + "%");
          }
        });
        el._progressBar = bar;
        el._targetValue = Math.max(0, Math.min(100, targetPct)) / 100;
      });

      if (prefersReducedMotion) {
        circles.forEach(function(el) {
          if (el._progressBar) {
            el._progressBar.set(el._targetValue);
            el.classList.add("circle-visible", "active");
          }
        });
        return;
      }

      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            if (!el.classList.contains("active") && el._progressBar) {
              el.classList.add("circle-visible", "active");
              el._progressBar.animate(el._targetValue);
            }
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.25 });

      circles.forEach(function(el) { observer.observe(el); });
    }
  }

  // =====================
  // Parallax on Scroll
  // =====================
  function initParallax() {
    if (prefersReducedMotion) return;
    var parallaxEls = document.querySelectorAll("[data-parallax]");
    if (!parallaxEls.length) return;

    var ticking = false;
    function updateParallax() {
      var scrollY = window.pageYOffset;
      parallaxEls.forEach(function(el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        var rect = el.getBoundingClientRect();
        var offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
        el.style.transform = "translate3d(0," + (-offset).toFixed(1) + "px,0)";
      });
      ticking = false;
    }

    window.addEventListener("scroll", function() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // =====================
  // Cursor Glow (desktop only)
  // =====================
  function initCursorGlow() {
    if (prefersReducedMotion) return;
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    var glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    var mx = -500, my = -500;
    document.addEventListener("mousemove", function(e) {
      mx = e.clientX;
      my = e.clientY;
      glow.style.left = mx + "px";
      glow.style.top = my + "px";
    }, { passive: true });
  }

  // =====================
  // Button Ripple Effect
  // =====================
  function initRipple() {
    if (prefersReducedMotion) return;
    $(document).on("click", ".btn.btn-fill", function(e) {
      var $btn = $(this);
      $btn.find(".btn-ripple").remove();
      var offset = $btn.offset();
      var x = e.pageX - offset.left;
      var y = e.pageY - offset.top;
      var ripple = $("<span>", { "class": "btn-ripple" });
      ripple.css({ left: x, top: y, width: 20, height: 20 });
      $btn.append(ripple);
      setTimeout(function() { ripple.remove(); }, 700);
    });
  }

  // =====================
  // Scroll Progress Bar & Back to Top (Sticky Top Bar Section)
  // =====================
  function initScrollProgressAndBackToTop() {
    var progressBar = document.getElementById("scrollProgressBar");
    var backToTopBtn = document.getElementById("backToTop");
    var circle = backToTopBtn ? backToTopBtn.querySelector(".progress-ring-circle") : null;
    var circumference = 2 * Math.PI * 18; // r=18 => ~113.1

    if (circle) {
      circle.style.strokeDasharray = circumference + " " + circumference;
      circle.style.strokeDashoffset = circumference;
    }

    var ticking = false;
    function updateScroll() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = docHeight > 0 ? (scrollY / docHeight) : 0;
      var clampedPercent = Math.min(1, Math.max(0, scrollPercent));

      if (progressBar) {
        progressBar.style.width = (clampedPercent * 100) + "%";
      }

      if (backToTopBtn) {
        if (scrollY > 300) {
          backToTopBtn.classList.add("visible");
        } else {
          backToTopBtn.classList.remove("visible");
        }

        if (circle) {
          var offset = circumference - (clampedPercent * circumference);
          circle.style.strokeDashoffset = offset;
        }
      }

      var header = document.getElementById("mh-header") || document.querySelector(".nav-scroll");
      if (header) {
        if (scrollY >= 40) {
          header.classList.add("nav-strict");
        } else {
          header.classList.remove("nav-strict");
        }
      }

      ticking = false;
    }

    window.addEventListener("scroll", function() {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    }, { passive: true });

    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", function(e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? "auto" : "smooth"
        });
      });
    }
  }

  // =====================
  // Hero Typewriter Effect
  // =====================
  function initTypewriter() {
    var el = document.getElementById("heroTypedText");
    if (!el) return;
    if (prefersReducedMotion) {
      el.textContent = "Python Full Stack Developer";
      return;
    }

    var phrases = [
      "Python Full Stack Developer",
      "Django & REST API Specialist",
      "Computer Vision & AI Explorer",
      "MERN Stack & Web Engineer",
      "M.Sc. CS & Tech (2021-2026)"
    ];

    var phraseIndex = 0;
    var letterIndex = 0;
    var isDeleting = false;
    var typingSpeed = 75;

    function typeLoop() {
      var currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        el.textContent = currentPhrase.substring(0, letterIndex - 1);
        letterIndex--;
        typingSpeed = 35;
      } else {
        el.textContent = currentPhrase.substring(0, letterIndex + 1);
        letterIndex++;
        typingSpeed = 75;
      }

      if (!isDeleting && letterIndex === currentPhrase.length) {
        typingSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && letterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400;
      }

      setTimeout(typeLoop, typingSpeed);
    }

    setTimeout(typeLoop, 800);
  }

  // =====================
  // 3D Card Tilt & Magnetic Effects
  // =====================
  function initCardTilt() {
    if (prefersReducedMotion) return;
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    var tiltCards = document.querySelectorAll("[data-tilt]");
    tiltCards.forEach(function(card) {
      card.addEventListener("mousemove", function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -6;
        var rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = "perspective(1000px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) translateY(-4px) scale3d(1.02, 1.02, 1.02)";
      });

      card.addEventListener("mouseleave", function() {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)";
      });
    });
  }

  // =====================
  // Animated Number Counters
  // =====================
  function initCountUp() {
    var counters = document.querySelectorAll(".count-up");
    if (!counters.length) return;

    if (prefersReducedMotion) {
      counters.forEach(function(el) {
        el.textContent = el.getAttribute("data-target") || el.textContent;
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-target"), 10);
          if (isNaN(target)) return;

          var duration = 1500;
          var startTime = null;

          function animateCount(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var ease = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(ease * target);
            el.textContent = current;

            if (progress < 1) {
              requestAnimationFrame(animateCount);
            } else {
              el.textContent = target;
            }
          }

          requestAnimationFrame(animateCount);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(function(el) { observer.observe(el); });
  }

  // =====================
  // Mobile Nav Toggle
  // =====================
  var overlay = $(".overlay"),
      navc = $(".navbar-collapse");

  $(".navbar-toggler, .navbar-nav li a, .overlay").on("click", function() {
    $(".navbar-toggler").toggleClass("active");
    overlay.toggleClass("active");
    navc.toggleClass("active");
  });

  // =====================
  // One Page Nav
  // =====================
  if ($("#mh-header").length && typeof $.fn.onePageNav === "function") {
    $("#mh-header").onePageNav({
      currentClass: "active",
      changeHash: false,
      scrollSpeed: 750,
      scrollThreshold: 0.5
    });
  }

  $(window).on("load", function() {
    if ($("#mh-header").length && typeof $.fn.onePageNav === "function") {
      $(window).trigger("resize.onePageNav");
    }
  });

  // =====================
  // Fancybox
  // =====================
  if (typeof $.fn.fancybox === "function") {
    $("[data-fancybox]").fancybox({});
  }

  // =====================
  // Nav Fixed on Scroll
  // =====================
  $(window).on("scroll", function() {
    var scroll = $(window).scrollTop();
    if (scroll >= 50) {
      $(".nav-scroll").addClass("nav-strict");
    } else {
      $(".nav-scroll").removeClass("nav-strict");
    }
  });

    // =====================
  // Legacy Owl Carousel (guarded, plugin not loaded)
  // =====================
  var owlGuard = typeof $.fn.owlCarousel === "function";
  function owl(selector, options) {
    var $el = $(selector);
    if (owlGuard && $el.length && !$el.hasClass("owl-loaded") && !$el.hasClass("owl-loading")) {
      try { $el.owlCarousel(options); } catch (e) { /* no-op */ }
    }
  }
  owl("#mh-client-review",           { loop:false, responsiveClass:true, nav:true, autoplay:false, smartSpeed:450, stopOnHover:true, animateIn:"slideInRight", animateOut:"slideOutLeft", autoplayHoverPause:true, responsive:{0:{items:1},768:{items:2},1170:{items:3}} });
  owl(".mh-project-testimonial",     { loop:true, responsiveClass:true, nav:false, dots:false, autoplay:true, smartSpeed:450, stopOnHover:true, animateIn:"slideInRight", animateOut:"slideOutLeft", autoplayHoverPause:true, pagination:false, responsive:{0:{items:1},768:{items:1},1170:{items:1}} });
  owl("#single-project",             { loop:false, responsiveClass:true, nav:false, dots:true, autoplay:false, smartSpeed:450, stopOnHover:true, animateIn:"slideInRight", animateOut:"slideOutLeft", autoplayHoverPause:true, pagination:false, responsive:{0:{items:1},768:{items:1},1170:{items:1}} });
  owl("#mh-single-client-review",    { loop:false, responsiveClass:true, nav:true, autoplay:false, smartSpeed:450, stopOnHover:true, animateIn:"slideInRight", animateOut:"slideOutLeft", autoplayHoverPause:true, responsive:{0:{items:1},768:{items:1},1170:{items:1}} });
  owl("#mh-2-client-review",         { loop:false, responsiveClass:true, nav:true, autoplay:false, smartSpeed:450, stopOnHover:true, animateIn:"slideInRight", animateOut:"slideOutLeft", autoplayHoverPause:true, responsive:{0:{items:1},768:{items:2},1170:{items:2}} });

  // =====================
  // Contact Form
  // =====================
  var contactForm = $("#contactForm");

  function showFieldError() {
    contactForm.addClass("shake animated")
      .one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
        function() { $(this).removeClass("shake animated"); });
  }

  function showMessage(valid, msg) {
    var $msg = $("#msgSubmit");
    if (!$msg.length) return;
    var classes = valid
      ? "h3 text-center fadeInUp animated text-success"
      : "h3 text-center shake animated text-danger";
    $msg.removeClass("hidden fadeInUp shake animated text-success text-danger")
      .addClass(classes).text(msg);
  }

  if (contactForm.length && typeof contactForm.validator === "function") {
    contactForm.validator().on("submit", function(event) {
      if (event.isDefaultPrevented()) {
        showFieldError();
        showMessage(false, "Did you fill in the form properly?");
      } else {
        showMessage(true, "Opening your email app - press Send there to deliver your message.");
      }
    });
  } else if (contactForm.length) {
    contactForm.on("submit", function() {
      showMessage(true, "Opening your email app - press Send there to deliver your message.");
    });
  }

  // =====================
  // Smooth Scroll for anchor links
  // =====================
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener("click", function(e) {
      var hash = this.getAttribute("href");
      if (hash.length <= 1) return;
      var target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });

  // =====================
  // Dynamic Settings & Live Customizer Support
  // =====================
  function applyPortfolioSettings(settings) {
    if (!settings) return;
    var root = document.documentElement;

    // Theme Custom Properties
    if (settings.theme) {
      if (settings.theme.accentColor) {
        root.style.setProperty("--accent-color", settings.theme.accentColor);
      }
      if (settings.theme.fontHeading) {
        root.style.setProperty("--font-heading", "'" + settings.theme.fontHeading + "', sans-serif");
      }
      if (settings.theme.fontBody) {
        root.style.setProperty("--font-body", "'" + settings.theme.fontBody + "', sans-serif");
      }
      if (settings.theme.spacingScale) {
        root.style.setProperty("--spacing-scale", settings.theme.spacingScale);
      }
    }

    // Animation Properties & Toggles
    if (settings.animations) {
      if (settings.animations.duration) {
        root.style.setProperty("--anim-duration", settings.animations.duration + "s");
      }
      if (settings.animations.stagger) {
        root.style.setProperty("--anim-stagger", settings.animations.stagger + "s");
      }
      if (settings.animations.cursor === false) {
        var glow = document.querySelector(".cursor-glow");
        if (glow) glow.style.display = "none";
      } else {
        var glowEl = document.querySelector(".cursor-glow");
        if (glowEl) glowEl.style.display = "";
      }
      if (settings.animations.shimmer === false) {
        var shimmer = document.querySelector(".text-shimmer");
        if (shimmer) shimmer.classList.remove("text-shimmer");
      }
    }

    // Layout & Header Navigation
    if (settings.layout) {
      if (settings.layout.containerWidth) {
        root.style.setProperty("--container-max-width", settings.layout.containerWidth + "px");
      }
      if (settings.layout.gridGap) {
        root.style.setProperty("--grid-gap", settings.layout.gridGap + "px");
      }
      if (settings.layout.sectionOrder && Array.isArray(settings.layout.sectionOrder)) {
        var main = document.querySelector("main");
        if (main) {
          var defaultOrder = ['home', 'about', 'services', 'portfolio', 'skills', 'education', 'gallery', 'cta', 'contact'];
          var sectionMap = {
            home: document.getElementById("mh-home") || document.querySelector(".mh-home-2"),
            about: document.getElementById("mh-about") || document.querySelector(".mh-about"),
            services: document.getElementById("mh-service") || document.querySelector(".mh-service"),
            portfolio: document.getElementById("mh-featured-project") || document.querySelector(".mh-featured-project"),
            skills: document.getElementById("mh-skills") || document.querySelector(".mh-skills"),
            education: document.getElementById("mh-education") || document.querySelector(".mh-education"),
            gallery: document.getElementById("mh-portfolio") || document.querySelector(".mh-portfolio"),
            cta: document.querySelector(".mh-quates"),
            contact: document.getElementById("mh-contact") || document.querySelector(".mh-contact")
          };

          // Sanitize order: ensure 'gallery' is strictly after 'education' and 'home' is at the top
          var cleanOrder = settings.layout.sectionOrder.filter(function(k) {
            return defaultOrder.indexOf(k) !== -1;
          });
          if (cleanOrder.indexOf('gallery') === -1) {
            var eduIdx = cleanOrder.indexOf('education');
            if (eduIdx !== -1) {
              cleanOrder.splice(eduIdx + 1, 0, 'gallery');
            } else {
              cleanOrder.push('gallery');
            }
          }
          if (cleanOrder.indexOf('gallery') < cleanOrder.indexOf('education')) {
            cleanOrder = cleanOrder.filter(function(k) { return k !== 'gallery'; });
            var eIdx = cleanOrder.indexOf('education');
            cleanOrder.splice(eIdx + 1, 0, 'gallery');
          }
          defaultOrder.forEach(function(secKey) {
            if (cleanOrder.indexOf(secKey) === -1) {
              cleanOrder.push(secKey);
            }
          });

          // Only rearrange DOM if order differs from standard DOM sequence
          var isDifferent = false;
          for (var i = 0; i < defaultOrder.length; i++) {
            if (cleanOrder[i] !== defaultOrder[i]) {
              isDifferent = true;
              break;
            }
          }

          if (isDifferent) {
            cleanOrder.forEach(function(key) {
              var sec = sectionMap[key];
              if (sec && sec.parentNode === main) {
                main.appendChild(sec);
              }
            });
          }
        }
      }
    }

    // Topbar & Header Info Updates
    if (settings.topbar) {
      if (settings.topbar.email) {
        var emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(function(emailLink) {
          emailLink.href = 'mailto:' + settings.topbar.email;
          if (emailLink.textContent.indexOf('@') !== -1) {
            emailLink.textContent = settings.topbar.email;
          }
        });
      }
      if (settings.topbar.phone) {
        var phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(function(phoneLink) {
          phoneLink.href = 'tel:' + settings.topbar.phone.replace(/[^0-9+]/g, '');
          if (/[0-9]/.test(phoneLink.textContent)) {
            phoneLink.textContent = settings.topbar.phone;
          }
        });
      }
      if (settings.topbar.whatsapp) {
        var waLinks = document.querySelectorAll('.topbar-social a[href*="wa.me"], a[href*="wa.me"]');
        waLinks.forEach(function(waLink) {
          waLink.href = settings.topbar.whatsapp;
        });
      }
      if (settings.topbar.resumeUrl) {
        var cvLinks = document.querySelectorAll('a[href*="drive.google.com"], .topbar-cv-btn, .nav-cv-btn, .hero-cv-btn, a[aria-label*="Download CV"], a[aria-label*="Download Resume"]');
        cvLinks.forEach(function(link) {
          link.href = settings.topbar.resumeUrl;
        });
      }
    }

    // Image References Updates
    if (settings.images) {
      if (settings.images.hero) {
        var heroImg = document.querySelector('.hero-img .img-border img') || document.getElementById('hero-img');
        if (heroImg) heroImg.src = settings.images.hero;
      }
      if (settings.images.about) {
        var aboutImg = document.querySelector('.mh-about-img img') || document.getElementById('about-img');
        if (aboutImg) aboutImg.src = settings.images.about;
      }
      if (settings.images.modal0) {
        var m0 = document.getElementById("modal-img-0") || document.querySelector('.mh-portfolio-modal-img img:nth-of-type(1)');
        if (m0) m0.src = settings.images.modal0;
      }
      if (settings.images.modal1) {
        var m1 = document.getElementById("modal-img-1") || document.querySelector('.mh-portfolio-modal-img img:nth-of-type(2)');
        if (m1) m1.src = settings.images.modal1;
      }
    }

    // Bio text
    if (settings.content && settings.content.bioText) {
      var bioEl = document.querySelector(".mh-about-inner p");
      if (bioEl) bioEl.textContent = settings.content.bioText;
    }

    // SEO Meta
    if (settings.seo) {
      if (settings.seo.metaTitle) {
        document.title = settings.seo.metaTitle;
      }
      if (settings.seo.metaDesc) {
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute("content", settings.seo.metaDesc);
      }
      if (settings.seo.metaKeywords) {
        var metaKeys = document.querySelector('meta[name="keywords"]');
        if (metaKeys) metaKeys.setAttribute("content", settings.seo.metaKeywords);
      }
    }
  }

  function initSettingsSync() {
    try {
      var saved = localStorage.getItem("portfolio_customization_settings") || localStorage.getItem("portfolio_settings");
      if (saved) {
        applyPortfolioSettings(JSON.parse(saved));
      }
    } catch (e) {
      /* no-op */
    }

    window.addEventListener("message", function(event) {
      if (event.data && event.data.type === "PORTFOLIO_SETTINGS_UPDATE") {
        applyPortfolioSettings(event.data.settings);
      }
    });
  }

  // =====================
  // Init all animation systems on DOMContentLoaded
  // =====================
  $(function() {
    initSettingsSync();
    initRevealObserver();
    initTitleObserver();
    initSkillBars();
    initCircleProgress();
    initParallax();
    initCursorGlow();
    initRipple();
    initScrollProgressAndBackToTop();
    initTypewriter();
    initCardTilt();
    initCountUp();
  });

}(jQuery));

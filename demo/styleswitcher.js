/**
 * Theme & Style Switcher for Portfolio
 * Handles:
 * 1. Dark & Light Mode switching with persistence (localStorage)
 * 2. Accent Color Palette switching with persistence (localStorage)
 * 3. Drawer toggle and outside click closing
 */

(function () {
  "use strict";

  var COLOR_MAP = {
    "blue-munsell": "#2196F3",
    "blue": "#a97afd",
    "green": "#4CAF50",
    "orange": "#ffa500",
    "purple": "#E91E63",
    "slate": "#f6c",
    "yellow": "#188c91",
    "defauld": "#0bceaf"
  };

  /**
   * Set the active stylesheet by title
   */
  window.setActiveStyleSheet = function (title) {
    if (!title) return;
    var links = document.querySelectorAll('link[data-style="color-theme"], link[rel*="stylesheet"][title]');
    links.forEach(function (link) {
      if (link.getAttribute("title")) {
        link.disabled = (link.getAttribute("title") !== title);
      }
    });

    if (COLOR_MAP[title]) {
      document.documentElement.style.setProperty("--accent-color", COLOR_MAP[title]);
    }

    // Update active swatch state
    var swatches = document.querySelectorAll(".demo-style-switch ul.styles li a");
    swatches.forEach(function (a) {
      var swatchTitle = (a.getAttribute("data-color") || a.getAttribute("title") || "").toLowerCase().replace(/\s+/g, "-");
      if (swatchTitle === title.toLowerCase()) {
        a.classList.add("active");
      } else {
        a.classList.remove("active");
      }
    });

    try {
      localStorage.setItem("leo_style_color", title);
    } catch (e) {
      /* no-op */
    }
  };

  /**
   * Set theme mode ('dark' | 'light')
   */
  window.setThemeMode = function (mode) {
    var isDark = mode !== "light";
    var body = document.body;

    if (isDark) {
      body.classList.remove("white-vertion");
      body.classList.add("dark-vertion", "black-bg");
      var metaDark = document.querySelector('meta[name="theme-color"]');
      if (metaDark) metaDark.setAttribute("content", "#100e17");
    } else {
      body.classList.remove("dark-vertion");
      body.classList.add("white-vertion", "black-bg");
      var metaLight = document.querySelector('meta[name="theme-color"]');
      if (metaLight) metaLight.setAttribute("content", "#ffffff");
    }

    var darkBtn = document.getElementById("theme-btn-dark");
    var lightBtn = document.getElementById("theme-btn-light");
    if (darkBtn && lightBtn) {
      darkBtn.classList.toggle("active", isDark);
      lightBtn.classList.toggle("active", !isDark);
      darkBtn.setAttribute("aria-pressed", isDark ? "true" : "false");
      lightBtn.setAttribute("aria-pressed", !isDark ? "true" : "false");
    }

    try {
      localStorage.setItem("leo_theme_mode", isDark ? "dark" : "light");
    } catch (e) {
      /* no-op */
    }
  };

  /**
   * Initialize switcher event handlers and restore preferences
   */
  function initSwitcher() {
    var switcher = document.getElementById("switch-style");
    var toggleBtn = document.getElementById("toggle-switcher");

    if (toggleBtn && switcher) {
      toggleBtn.addEventListener("click", function (e) {
        e.preventDefault();
        switcher.classList.toggle("open");
        var isOpen = switcher.classList.contains("open");
        toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      document.addEventListener("click", function (e) {
        if (switcher.classList.contains("open") && !switcher.contains(e.target)) {
          switcher.classList.remove("open");
          toggleBtn.setAttribute("aria-expanded", "false");
        }
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && switcher.classList.contains("open")) {
          switcher.classList.remove("open");
          toggleBtn.setAttribute("aria-expanded", "false");
          toggleBtn.focus();
        }
      });
    }

    // Theme mode buttons
    var darkBtn = document.getElementById("theme-btn-dark");
    var lightBtn = document.getElementById("theme-btn-light");
    if (darkBtn) {
      darkBtn.addEventListener("click", function () {
        window.setThemeMode("dark");
      });
    }
    if (lightBtn) {
      lightBtn.addEventListener("click", function () {
        window.setThemeMode("light");
      });
    }

    // Restore saved theme mode
    try {
      var savedMode = localStorage.getItem("leo_theme_mode");
      if (savedMode === "light") {
        window.setThemeMode("light");
      } else {
        window.setThemeMode("dark");
      }
    } catch (e) {
      window.setThemeMode("dark");
    }

    // Restore saved accent color
    try {
      var savedColor = localStorage.getItem("leo_style_color");
      if (savedColor && COLOR_MAP[savedColor]) {
        window.setActiveStyleSheet(savedColor);
      } else {
        window.setActiveStyleSheet("blue-munsell");
      }
    } catch (e) {
      window.setActiveStyleSheet("blue-munsell");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSwitcher);
  } else {
    initSwitcher();
  }
})();

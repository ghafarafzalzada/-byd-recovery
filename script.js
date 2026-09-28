/* =========================================================
   Theme changer
   - Defaults to system preference on first visit
   - Remembers user's manual choice in localStorage
   - Reacts to system preference changes if no manual override
   ========================================================= */
(function () {
  var STORAGE_KEY = 'byd-theme';
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getSavedTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function setTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    }
  }

  // Sync button state on load (HTML already applied correct theme via inline script)
  var current = root.getAttribute('data-theme') || getSavedTheme() || getSystemTheme();
  setTheme(current, false);

  // Toggle button
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next, true);
    });
  }

  // Follow system changes only if user has not picked a theme manually
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', function (e) {
    if (!getSavedTheme()) {
      setTheme(e.matches ? 'dark' : 'light', false);
    }
  });
})();

/* =========================================================
   Mobile menu
   ========================================================= */
(function () {
  var menuBtn = document.getElementById('menuBtn');
  var navlinks = document.getElementById('navlinks');

  function closeMenu() {
    if (navlinks) navlinks.classList.remove('open');
  }

  if (menuBtn && navlinks) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      navlinks.classList.toggle('open');
    });

    // Close on link click
    navlinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navlinks.contains(e.target) && e.target !== menuBtn) {
        closeMenu();
      }
    });
  }
})();

/* =========================================================
   Reveal-on-scroll animations
   ========================================================= */
(function () {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  // Fallback for very old browsers
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        // Small stagger for grouped siblings
        var delay = Math.min(i * 60, 240);
        setTimeout(function () {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(function (el) { observer.observe(el); });
})();

/* =========================================================
   Dynamic year in footer
   ========================================================= */
(function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
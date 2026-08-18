/* ==========================================================================
   ENDTECH AI SOLUTIONS — main.js
   Global behaviour: theme, navbar, reveal animations, counters,
   service filtering, project modal, back-to-top, preloader.
   All modules are guard-checked so this file is safe on every page.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initNavbar();
    initReveal();
    initCounters();
    initBackToTop();
    initServiceFilter();
    initProjectModal();
  });

  /* ---------------------------------------------------------------
     1. Page preloader — hidden once assets load (with safety timeout)
  --------------------------------------------------------------- */
  function hidePreloader() {
    var pre = document.getElementById("preloader");
    if (pre) pre.classList.add("hide");
  }
  window.addEventListener("load", hidePreloader);
  setTimeout(hidePreloader, 3500); // fallback if an asset hangs

  /* ---------------------------------------------------------------
     2. Dark / light theme — persisted via localStorage preference
        (UI preference only; no sensitive data stored)
  --------------------------------------------------------------- */
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("endtech-theme"); } catch (e) { /* storage unavailable */ }
    applyTheme(saved === "light" ? "light" : "dark");

    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        applyTheme(next);
        try { localStorage.setItem("endtech-theme", next); } catch (e) { /* ignore */ }
      });
    });

    function applyTheme(mode) {
      document.documentElement.setAttribute("data-theme", mode);
      document.querySelectorAll(".theme-toggle i").forEach(function (icon) {
        icon.className = mode === "light" ? "bi bi-moon-stars" : "bi bi-sun";
      });
    }
  }

  /* ---------------------------------------------------------------
     3. Sticky navbar state + auto-close mobile menu after selection
  --------------------------------------------------------------- */
  function initNavbar() {
    var nav = document.querySelector(".navbar-endtech");
    if (!nav) return;

    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Collapse the mobile menu when a link is tapped
    var collapseEl = document.getElementById("mainNav");
    if (collapseEl) {
      collapseEl.querySelectorAll(".nav-link, .btn-grad").forEach(function (link) {
        link.addEventListener("click", function () {
          if (collapseEl.classList.contains("show")) {
            bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
          }
        });
      });
    }
  }

  /* ---------------------------------------------------------------
     4. Reveal-on-scroll via IntersectionObserver
        Elements: .reveal  |  optional stagger: data-delay="120"
  --------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute("data-delay");
          if (delay) entry.target.style.transitionDelay = delay + "ms";
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------
     5. Animated counters — count up the first time they are visible
        Usage: <span class="counter" data-count="120" data-suffix="+">
  --------------------------------------------------------------- */
  function initCounters() {
    var counters = document.querySelectorAll(".counter");
    if (!counters.length) return;

    var animate = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1800;
      var start = null;

      var step = function (ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------
     6. Back-to-top floating button
  --------------------------------------------------------------- */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    var onScroll = function () { btn.classList.toggle("show", window.scrollY > 500); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------------
     7. Service category filtering (services page)
  --------------------------------------------------------------- */
  function initServiceFilter() {
    var bar = document.querySelector(".filter-bar");
    if (!bar) return;
    var buttons = bar.querySelectorAll(".filter-btn");
    var items = document.querySelectorAll(".filter-item");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        var filter = btn.getAttribute("data-filter");

        items.forEach(function (item) {
          var match = filter === "all" || item.getAttribute("data-category").split(" ").indexOf(filter) !== -1;
          if (match) {
            item.classList.remove("is-hidden");
            item.style.opacity = "0";
            item.style.transform = "translateY(14px)";
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                item.style.opacity = "1";
                item.style.transform = "none";
              });
            });
          } else {
            item.classList.add("is-hidden");
          }
        });
      });
    });
  }

  /* ---------------------------------------------------------------
     8. Project modal — details live in hidden <template> blocks in
        the HTML (SEO-friendly) and are injected into one modal.
  --------------------------------------------------------------- */
  function initProjectModal() {
    var modalEl = document.getElementById("projectModal");
    if (!modalEl) return;
    var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    var body = modalEl.querySelector(".modal-body");
    var title = modalEl.querySelector(".modal-title");

    document.querySelectorAll(".view-project").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = document.querySelector(btn.getAttribute("data-template"));
        if (!target) return;
        title.textContent = btn.getAttribute("data-title") || "Project";
        body.innerHTML = target.innerHTML;
        modal.show();
      });
    });
  }
})();

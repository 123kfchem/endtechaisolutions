/* ==========================================================================
   ENDTECH AI SOLUTIONS — animations.js
   Lightweight hero visuals: AI node-network canvas + code typewriter.
   Both pause when off-screen / tab hidden and respect reduced motion.
   ========================================================================== */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    initNetworkCanvas();
    initTypewriter();
  });

  /* ---------------------------------------------------------------
     1. AI node network — floating nodes with data connections.
        Particle count scales with hero size; DPR capped at 2.
  --------------------------------------------------------------- */
  function initNetworkCanvas() {
    var canvas = document.getElementById("heroNet");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var nodes = [];
    var raf = null;
    var running = false;
    var LINK_DIST = 140;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(rect.width, rect.height);
      if (REDUCED) draw(); // render one static frame only
    }

    function seed(w, h) {
      var count = Math.max(22, Math.min(64, Math.round((w * h) / 24000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 1
        });
      }
    }

    function draw() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;

      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            var alpha = (1 - dist / LINK_DIST) * 0.22;
            ctx.strokeStyle = "rgba(52, 224, 255," + alpha.toFixed(3) + ")";
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach(function (n) {
        ctx.fillStyle = "rgba(96, 165, 250, 0.75)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function tick() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      nodes.forEach(function (n) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });
      draw();
      raf = requestAnimationFrame(tick);
    }

    function start() {
      if (running || REDUCED) return;
      running = true;
      raf = requestAnimationFrame(tick);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : start();
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }, { threshold: 0.02 }).observe(canvas);
    } else {
      start();
    }
  }

  /* ---------------------------------------------------------------
     2. Typewriter — cycles short "system status" lines inside the
        hero code panel (#typeLine).
  --------------------------------------------------------------- */
  function initTypewriter() {
    var el = document.getElementById("typeLine");
    if (!el) return;

    var lines = [
      "> ai.agents.deploy()  ..........  OK",
      "> security.audit.run()  ........  PASSED",
      "> automation.pipeline()  .......  LIVE",
      "> status: engineering the future _"
    ];
    if (REDUCED) { el.textContent = lines[lines.length - 1]; return; }

    var line = 0, char = 0, deleting = false;

    function type() {
      var text = lines[line];
      el.textContent = text.slice(0, char);

      if (!deleting && char < text.length) {
        char++;
        setTimeout(type, 28);
      } else if (!deleting) {
        deleting = true;
        setTimeout(type, 1600);
      } else if (char > 0) {
        char--;
        setTimeout(type, 12);
      } else {
        deleting = false;
        line = (line + 1) % lines.length;
        setTimeout(type, 350);
      }
    }
    type();
  }
})();

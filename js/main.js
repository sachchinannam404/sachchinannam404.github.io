/**
 * Portfolio interactions + theme toggle + cinematic mouse-trail hero
 * Hero canvas ported from divyashrma18/batman (vite-project/src/components/Hero.jsx)
 */

(function () {
  "use strict";

  const THEME_KEY = "portfolio-theme";

  // Year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // —— Theme toggle (dark / light) ——
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return "dark";
  }

  function applyTheme(theme) {
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    localStorage.setItem(THEME_KEY, theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      );
      themeToggle.setAttribute(
        "title",
        theme === "light" ? "Dark mode" : "Light mode"
      );
      const icon = themeToggle.querySelector(".theme-icon");
      if (icon) icon.textContent = theme === "light" ? "🌙" : "☀️";
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.classList.contains("light") ? "dark" : "light";
      applyTheme(next);
    });
  }

  // Header scroll state
  const header = document.querySelector(".header");
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  // Particles
  const particlesContainer = document.getElementById("particles");
  if (particlesContainer) {
    const count = Math.min(45, Math.floor(window.innerWidth / 22));
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 8 + Math.random() * 14 + "s";
      p.style.animationDelay = Math.random() * 10 + "s";
      p.style.width = p.style.height = 1 + Math.random() * 2.5 + "px";
      particlesContainer.appendChild(p);
    }
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll(
    ".timeline-item, .achieve-card, .skill-category, .about-text, .about-card"
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.65s ease, transform 0.65s ease";
    observer.observe(el);
  });

  // ── Cinematic mouse-trail canvas hero ──────────────────────────
  // Images from the reference project (public on GitHub)
  const IMG_BOTTOM =
    "https://raw.githubusercontent.com/divyashrma18/batman/main/vite-project/public/images/twoo.jpg";
  const IMG_TOP =
    "https://raw.githubusercontent.com/divyashrma18/batman/main/vite-project/public/images/one.jpg";

  const hero = document.querySelector(".cinematic-hero");
  const canvas = document.getElementById("heroCanvas");
  if (!hero || !canvas) return;

  const ctx = canvas.getContext("2d");
  const TRAIL_LENGTH = 60;
  const HEAD_RADIUS = 180;

  const mouse = { x: -9999, y: -9999 };
  const smooth = { x: -9999, y: -9999 };
  const trail = [];

  const bottom = new Image();
  const topImg = new Image();
  bottom.crossOrigin = "anonymous";
  topImg.crossOrigin = "anonymous";
  bottom.src = IMG_BOTTOM;
  topImg.src = IMG_TOP;

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  // Also support touch
  hero.addEventListener(
    "touchmove",
    (e) => {
      if (!e.touches[0]) return;
      const rect = hero.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    },
    { passive: true }
  );

  let rafId = 0;

  function draw() {
    const { width, height } = canvas;

    smooth.x += (mouse.x - smooth.x) * 0.13;
    smooth.y += (mouse.y - smooth.y) * 0.13;

    trail.unshift({ x: smooth.x, y: smooth.y });
    if (trail.length > TRAIL_LENGTH) trail.length = TRAIL_LENGTH;

    ctx.clearRect(0, 0, width, height);

    // Base layer (bottom image)
    if (bottom.complete && bottom.naturalWidth) {
      ctx.drawImage(bottom, 0, 0, width, height);
    } else {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);
    }

    // Offscreen mask for top image revealed by trail
    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = height;
    const off = offscreen.getContext("2d");

    for (let i = 0; i < trail.length; i++) {
      const t = 1 - i / trail.length;
      const r = HEAD_RADIUS * (0.25 + 0.75 * t);
      const alpha = Math.pow(t, 1.5);
      off.beginPath();
      off.arc(trail[i].x, trail[i].y, r, 0, Math.PI * 2);
      off.fillStyle = `rgba(0,0,0,${alpha})`;
      off.fill();
    }

    off.globalCompositeOperation = "source-in";
    if (topImg.complete && topImg.naturalWidth) {
      off.drawImage(topImg, 0, 0, width, height);
    }

    ctx.drawImage(offscreen, 0, 0);

    // Cursor head glow — red / gold bat-signal tint
    if (trail.length > 0) {
      const head = trail[0];
      const glow = ctx.createRadialGradient(
        head.x,
        head.y,
        0,
        head.x,
        head.y,
        HEAD_RADIUS * 1.4
      );
      glow.addColorStop(0, "rgba(192, 0, 26, 0.28)");
      glow.addColorStop(0.45, "rgba(201, 164, 74, 0.12)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(head.x, head.y, HEAD_RADIUS * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    rafId = requestAnimationFrame(draw);
  }

  let loaded = 0;
  const onLoad = () => {
    if (++loaded === 2) draw();
  };
  bottom.onload = onLoad;
  topImg.onload = onLoad;
  // Fallback if images already cached
  if (bottom.complete) onLoad();
  if (topImg.complete) onLoad();

  // Clean up on page hide (optional)
  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(rafId);
  });
})();

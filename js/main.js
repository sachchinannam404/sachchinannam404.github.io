/**
 * Portfolio interactions + theme toggle
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
    return "dark"; // default: black & red dark theme
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
      themeToggle.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
      themeToggle.setAttribute("title", theme === "light" ? "Dark mode" : "Light mode");
      const icon = themeToggle.querySelector(".theme-icon");
      if (icon) icon.textContent = theme === "light" ? "🌙" : "☀️";
    }
  }

  // Apply early (also set in <head> inline script to avoid flash)
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
})();

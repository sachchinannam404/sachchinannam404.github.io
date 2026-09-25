/**
 * Sachchin Annam — Cinematic Enterprise Architecture Portfolio
 * Features:
 *  - Procedural atmospheric hero canvas + mouse trail
 *  - Interactive Architecture Blueprints Modal
 *  - Real-time Skills Matrix Search & Domain Filtering
 *  - Technical Insights Article Reader
 *  - Web Audio API Dark Ambient Synth Generator
 *  - Command Palette (Cmd+K / Ctrl+K)
 *  - vCard (.vcf) Generator & Direct Transmission Handler
 *  - Scroll Spy & Circular Progress Back-to-Top
 *  - Live Mumbai (IST) Clock
 */

(function () {
  "use strict";

  const THEME_KEY = "portfolio-theme";
  const root = document.documentElement;

  // —— 1. Year in footer ——
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // —— 2. Live Mumbai (IST) Clock ——
  const clockEl = document.getElementById("heroLiveClock");
  function updateISTClock() {
    if (!clockEl) return;
    try {
      const now = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      const istString = new Intl.DateTimeFormat("en-GB", options).format(now);
      clockEl.textContent = `MUMBAI IST ${istString}`;
    } catch (e) {
      clockEl.textContent = "MUMBAI · INDIA";
    }
  }
  updateISTClock();
  setInterval(updateISTClock, 1000);

  // —— 3. Theme Toggle (dark / light) ——
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

  // —— 4. Header Scroll State & Scroll Spy ——
  const header = document.getElementById("siteHeader");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const backToTopBtn = document.getElementById("backToTopFloat");
  const progressRing = document.getElementById("progressRing");
  const CIRCLE_CIRCUMFERENCE = 125.66; // 2 * PI * 20

  function onScroll() {
    const scrollY = window.scrollY;

    // Header blur state
    if (header) {
      if (scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // Back to top & circular progress
    if (backToTopBtn && progressRing) {
      const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollY > 300) {
        backToTopBtn.classList.remove("hidden");
        const progress = Math.min(1, Math.max(0, scrollY / (totalDocHeight || 1)));
        const offset = CIRCLE_CIRCUMFERENCE - progress * CIRCLE_CIRCUMFERENCE;
        progressRing.style.strokeDashoffset = offset;
      } else {
        backToTopBtn.classList.add("hidden");
      }
    }

    // Scroll spy
    let currentId = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = sec.getAttribute("id");
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${currentId}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Ambient particles in background
  const particlesContainer = document.getElementById("particles");
  if (particlesContainer) {
    const count = Math.min(40, Math.floor(window.innerWidth / 26));
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 9 + Math.random() * 15 + "s";
      p.style.animationDelay = Math.random() * 10 + "s";
      p.style.width = p.style.height = 1 + Math.random() * 2.2 + "px";
      particlesContainer.appendChild(p);
    }
  }

  // —— 5. Cinematic Atmospheric Hero Canvas ——
  const hero = document.querySelector(".cinematic-hero");
  const canvas = document.getElementById("heroCanvas");

  if (hero && canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = hero.offsetWidth);
    let height = (canvas.height = hero.offsetHeight);

    const mouse = { x: width * 0.5, y: height * 0.4 };
    const smooth = { x: width * 0.5, y: height * 0.4 };
    const trail = [];
    const TRAIL_LENGTH = 55;
    const HEAD_RADIUS = 180;

    // External image assets
    const IMG_BOTTOM =
      "https://raw.githubusercontent.com/divyashrma18/batman/main/vite-project/public/images/twoo.jpg";
    const IMG_TOP =
      "https://raw.githubusercontent.com/divyashrma18/batman/main/vite-project/public/images/one.jpg";

    const bottom = new Image();
    const topImg = new Image();
    bottom.crossOrigin = "anonymous";
    topImg.crossOrigin = "anonymous";
    bottom.src = IMG_BOTTOM;
    topImg.src = IMG_TOP;

    let imagesLoaded = false;
    let loadedCount = 0;
    const onImgLoad = () => {
      loadedCount++;
      if (loadedCount >= 2) imagesLoaded = true;
    };
    bottom.onload = onImgLoad;
    topImg.onload = onImgLoad;
    if (bottom.complete && bottom.naturalWidth) loadedCount++;
    if (topImg.complete && topImg.naturalWidth) loadedCount++;
    if (loadedCount >= 2) imagesLoaded = true;

    // Atmospheric raindrops array
    const RAIN_COUNT = 65;
    const rain = [];
    for (let i = 0; i < RAIN_COUNT; i++) {
      rain.push({
        x: Math.random() * width,
        y: Math.random() * height,
        len: 12 + Math.random() * 20,
        speed: 6 + Math.random() * 8,
        alpha: 0.15 + Math.random() * 0.25
      });
    }

    // Procedural Gothic Skyline generation
    const skylineBars = [];
    const barCount = 36;
    for (let i = 0; i < barCount; i++) {
      skylineBars.push({
        hFraction: 0.25 + Math.random() * 0.45,
        hasAntenna: Math.random() > 0.65,
        antennaH: 25 + Math.random() * 50
      });
    }

    function handleResize() {
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    }
    window.addEventListener("resize", handleResize);

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

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

    function renderAtmosphericCanvas() {
      smooth.x += (mouse.x - smooth.x) * 0.12;
      smooth.y += (mouse.y - smooth.y) * 0.12;

      trail.unshift({ x: smooth.x, y: smooth.y });
      if (trail.length > TRAIL_LENGTH) trail.length = TRAIL_LENGTH;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Base Layer
      if (imagesLoaded && bottom.complete && bottom.naturalWidth) {
        ctx.drawImage(bottom, 0, 0, width, height);
      } else {
        // Procedural Gotham Night Sky with red atmospheric gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, "#020202");
        bgGrad.addColorStop(0.5, "#080305");
        bgGrad.addColorStop(0.85, "#150205");
        bgGrad.addColorStop(1, "#030303");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Ambient Red Fog at horizon
        const fogGrad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.75,
          40,
          width * 0.5,
          height * 0.75,
          width * 0.7
        );
        fogGrad.addColorStop(0, "rgba(192, 0, 26, 0.28)");
        fogGrad.addColorStop(0.6, "rgba(122, 0, 15, 0.12)");
        fogGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, 0, width, height);

        // Draw Procedural Gothic Skyscrapers
        const barWidth = width / barCount;
        for (let i = 0; i < barCount; i++) {
          const item = skylineBars[i];
          const bH = height * item.hFraction;
          const bX = i * barWidth;
          const bY = height - bH;

          ctx.fillStyle = i % 2 === 0 ? "#060606" : "#090909";
          ctx.fillRect(bX, bY, barWidth + 1, bH);

          // Antenna spire
          if (item.hasAntenna) {
            ctx.strokeStyle = "#1a0808";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(bX + barWidth * 0.5, bY);
            ctx.lineTo(bX + barWidth * 0.5, bY - item.antennaH);
            ctx.stroke();

            // Beacon light
            ctx.fillStyle = "rgba(232, 0, 31, 0.75)";
            ctx.beginPath();
            ctx.arc(bX + barWidth * 0.5, bY - item.antennaH, 2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Subtle lighted windows
          ctx.fillStyle = "rgba(201, 164, 74, 0.15)";
          for (let row = 0; row < 6; row++) {
            if ((i + row) % 3 === 0) {
              ctx.fillRect(bX + 4, bY + 20 + row * 18, 3, 5);
            }
          }
        }
      }

      // 2. Draw Atmospheric Rain
      ctx.strokeStyle = "rgba(220, 220, 240, 0.18)";
      ctx.lineWidth = 1;
      for (let i = 0; i < RAIN_COUNT; i++) {
        const r = rain[i];
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - 2, r.y + r.len);
        ctx.stroke();

        r.y += r.speed;
        r.x -= 1;
        if (r.y > height) {
          r.y = -r.len;
          r.x = Math.random() * width;
        }
      }

      // 3. Mouse-trail mask reveal (if top image loaded)
      if (imagesLoaded && topImg.complete && topImg.naturalWidth) {
        const offscreen = document.createElement("canvas");
        offscreen.width = width;
        offscreen.height = height;
        const off = offscreen.getContext("2d");

        for (let i = 0; i < trail.length; i++) {
          const t = 1 - i / trail.length;
          const r = HEAD_RADIUS * (0.25 + 0.75 * t);
          const alpha = Math.pow(t, 1.4);
          off.beginPath();
          off.arc(trail[i].x, trail[i].y, r, 0, Math.PI * 2);
          off.fillStyle = `rgba(0,0,0,${alpha})`;
          off.fill();
        }

        off.globalCompositeOperation = "source-in";
        off.drawImage(topImg, 0, 0, width, height);

        ctx.drawImage(offscreen, 0, 0);
      }

      // 4. Cursor Spotlight / Bat-Signal Glow
      if (trail.length > 0) {
        const head = trail[0];
        const glow = ctx.createRadialGradient(
          head.x,
          head.y,
          0,
          head.x,
          head.y,
          HEAD_RADIUS * 1.5
        );
        glow.addColorStop(0, "rgba(232, 0, 31, 0.32)");
        glow.addColorStop(0.4, "rgba(201, 164, 74, 0.14)");
        glow.addColorStop(0.8, "rgba(122, 0, 15, 0.05)");
        glow.addColorStop(1, "rgba(0,0,0,0)");

        ctx.beginPath();
        ctx.arc(head.x, head.y, HEAD_RADIUS * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Architectural crosshair at mouse
        ctx.strokeStyle = "rgba(201, 164, 74, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(head.x - 14, head.y);
        ctx.lineTo(head.x + 14, head.y);
        ctx.moveTo(head.x, head.y - 14);
        ctx.lineTo(head.x, head.y + 14);
        ctx.stroke();
      }

      rafId = requestAnimationFrame(renderAtmosphericCanvas);
    }

    renderAtmosphericCanvas();

    window.addEventListener("beforeunload", () => {
      cancelAnimationFrame(rafId);
    });
  }

  // —— 6. Solutions Filter & Blueprint Modal ——
  const filterTabs = document.querySelectorAll(".filter-tab");
  const solutionCards = document.querySelectorAll(".solution-card");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const filterVal = tab.getAttribute("data-filter");
      solutionCards.forEach((card) => {
        const cat = card.getAttribute("data-category");
        if (filterVal === "all" || cat === filterVal) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // Blueprint Data Repository
  const blueprintsData = {
    "sol-1": {
      kicker: "Power Platform & Dataverse Blueprint",
      title: "Global Multi-Tier Approval & Fulfillment Engine",
      summary:
        "Designed to orchestrate multi-national vendor requisitions, compliance approvals, and order fulfillment across 4 continental regions for Ingram Micro.",
      layers: [
        {
          title: "Presentation & Client Interface",
          desc: "Role-based Model-Driven Apps with custom Fluent UI page components and reactive Canvas screens for warehouse dock operators."
        },
        {
          title: "Transactional Data Architecture (Dataverse)",
          desc: "Relational entity model utilizing hierarchical business units, column-level security for financial audits, and virtual tables connecting SAP."
        },
        {
          title: "Process Orchestration & Automated Flows",
          desc: "Multi-stage Power Automate cloud flows utilizing service principals, Azure Key Vault credential isolation, and automated retry mechanisms with circuit-breaker logging."
        },
        {
          title: "Enterprise Governance & Audit",
          desc: "Automated solution packaging via Power Platform CLI (PAC), multi-environment pipelines (Dev -> Test -> UAT -> Prod), and automated DLP policy enforcement."
        }
      ],
      metrics: [
        { value: "50,000+", label: "Daily System Events" },
        { value: "99.98%", label: "Pipeline Availability" },
        { value: "65%", label: "Reduction in Approval Latency" }
      ]
    },
    "sol-2": {
      kicker: "SharePoint Modernization Blueprint",
      title: "SharePoint 2013/2010 to Modern M365 Transformation",
      summary:
        "A structured migration and modernization strategy transferring legacy on-premises SharePoint farms with heavy CSR/JSLink scripts into cloud-native SPFx and Microsoft Lists.",
      layers: [
        {
          title: "Legacy Assessment & Discovery",
          desc: "Automated inventory of custom full-trust WSP solutions, custom field types, JSLink scripts, and deeply nested SharePoint lists."
        },
        {
          title: "SPFx Modernization & Component Architecture",
          desc: "Re-engineered custom client views into TypeScript + React SPFx Application Customizers and Web Parts running within tenant App Catalogs."
        },
        {
          title: "Data Migration & Content Integrity",
          desc: "Zero-downtime phased migration using SharePoint Migration Tool (SPMT) with metadata preservation, version history, and permission ACL mapping."
        },
        {
          title: "Modern Governance & Hub Topology",
          desc: "Organized flat site architecture connected via SharePoint Hub Sites, unified Microsoft Search schemas, and automated site provisioning policies."
        }
      ],
      metrics: [
        { value: "100%", label: "Zero Data Loss Cutover" },
        { value: "3.2x", label: "Page Load Speed Boost" },
        { value: "15+", label: "SPFx Web Parts Deployed" }
      ]
    },
    "sol-3": {
      kicker: "Fabric Lakehouse & Telemetry Blueprint",
      title: "Microsoft Fabric OneLake & Power BI Unified Lakehouse",
      summary:
        "Consolidated heterogeneous data silos spanning operational Dataverse tables, ERP databases, and logistics feeds into a centralized Microsoft Fabric Lakehouse.",
      layers: [
        {
          title: "Ingestion & OneLake Synchronization",
          desc: "Continuous Delta Lake ingestion leveraging Microsoft Fabric Shortcuts and native Dataverse Link to Fabric (Synapse Link evolution)."
        },
        {
          title: "Semantic Layer & DAX Modeling",
          desc: "Standardized gold-tier star schemas with high-performance DAX measures, dynamic time intelligence, and granular Row-Level Security (RLS)."
        },
        {
          title: "Direct Lake Real-Time Consumption",
          desc: "Power BI reports powered by Direct Lake mode, querying millions of rows with the speed of Import mode and zero scheduled data refresh delays."
        }
      ],
      metrics: [
        { value: "Sub-Second", label: "Dashboard Interaction" },
        { value: "8+", label: "Unified Data Streams" },
        { value: "Executive", label: "Daily Adoption" }
      ]
    },
    "sol-4": {
      kicker: "ALM & CoE Governance Blueprint",
      title: "Enterprise Low-Code Governance & Automated ALM Pipelines",
      summary:
        "Engineered the Center of Excellence (CoE) framework and Azure DevOps automated deployment gateways for hundreds of citizen and pro developers.",
      layers: [
        {
          title: "Environment Hierarchy & Routing",
          desc: "Rigorous segmentation of Developer personal sandboxes, shared integration environments, UAT staging, and locked Production instances."
        },
        {
          title: "Automated Solution Verification",
          desc: "Azure DevOps pipelines running Power Platform Solution Checker, static analysis, connector compliance, and automated component unpacking into Git."
        },
        {
          title: "Data Loss Prevention (DLP) Policies",
          desc: "Multi-tiered DLP rules blocking unvetted public APIs while establishing governed egress channels to secure Azure endpoints."
        }
      ],
      metrics: [
        { value: "0", label: "Direct Production Changes" },
        { value: "15 min", label: "Release Cycle Turnaround" },
        { value: "100%", label: "Audit Traceability" }
      ]
    }
  };

  const bpModal = document.getElementById("blueprintModal");
  const bpModalKicker = document.getElementById("bpModalKicker");
  const bpModalTitle = document.getElementById("bpModalTitle");
  const bpModalBody = document.getElementById("bpModalBody");
  const bpCloseBtn = document.getElementById("bpModalCloseBtn");
  const bpDismissBtn = document.getElementById("bpModalDismissBtn");

  function openBlueprintModal(solId) {
    const data = blueprintsData[solId];
    if (!data || !bpModal) return;

    bpModalKicker.textContent = data.kicker;
    bpModalTitle.textContent = data.title;

    let layersHtml = data.layers
      .map(
        (l, idx) => `
      <div class="blueprint-layer">
        <div class="layer-title">Layer 0${idx + 1} // ${l.title}</div>
        <p class="layer-desc">${l.desc}</p>
      </div>`
      )
      .join("");

    let metricsHtml = data.metrics
      .map(
        (m) => `
      <div class="bp-metric-box">
        <span class="bp-metric-val">${m.value}</span>
        <span class="bp-metric-label">${m.label}</span>
      </div>`
      )
      .join("");

    bpModalBody.innerHTML = `
      <p style="margin-bottom: 1.5rem; font-size: 1.1rem; color: var(--text);">${data.summary}</p>
      <div class="blueprint-schematic">
        ${layersHtml}
      </div>
      <div class="bp-metrics-grid">
        ${metricsHtml}
      </div>
    `;

    bpModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeBlueprintModal() {
    if (bpModal) {
      bpModal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll(".sol-inspect-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-modal");
      openBlueprintModal(id);
    });
  });

  if (bpCloseBtn) bpCloseBtn.addEventListener("click", closeBlueprintModal);
  if (bpDismissBtn) bpDismissBtn.addEventListener("click", closeBlueprintModal);
  if (bpModal) {
    bpModal.addEventListener("click", (e) => {
      if (e.target === bpModal) closeBlueprintModal();
    });
  }

  // —— 7. Skills Matrix Interactive Filter & Live Search ——
  const skillSearchInput = document.getElementById("skillSearchInput");
  const skillClearBtn = document.getElementById("skillClearBtn");
  const skillChipBtns = document.querySelectorAll(".skill-chip-btn");
  const skillCards = document.querySelectorAll(".skill-item-card");
  const skillCountEl = document.getElementById("skillCount");

  let currentSkillCategory = "all";
  let currentSkillSearch = "";

  function filterSkills() {
    let visibleCount = 0;
    const query = currentSkillSearch.toLowerCase().trim();

    skillCards.forEach((card) => {
      const cat = card.getAttribute("data-cat");
      const name = card.getAttribute("data-name") || "";
      const text = card.textContent.toLowerCase();

      const matchesCat = currentSkillCategory === "all" || cat === currentSkillCategory;
      const matchesSearch = query === "" || name.toLowerCase().includes(query) || text.includes(query);

      if (matchesCat && matchesSearch) {
        card.classList.remove("hidden");
        visibleCount++;
      } else {
        card.classList.add("hidden");
      }
    });

    if (skillCountEl) skillCountEl.textContent = visibleCount;
  }

  if (skillSearchInput) {
    skillSearchInput.addEventListener("input", (e) => {
      currentSkillSearch = e.target.value;
      if (skillClearBtn) {
        if (currentSkillSearch.length > 0) {
          skillClearBtn.classList.remove("hidden");
        } else {
          skillClearBtn.classList.add("hidden");
        }
      }
      filterSkills();
    });
  }

  if (skillClearBtn) {
    skillClearBtn.addEventListener("click", () => {
      if (skillSearchInput) {
        skillSearchInput.value = "";
        currentSkillSearch = "";
        skillClearBtn.classList.add("hidden");
        skillSearchInput.focus();
        filterSkills();
      }
    });
  }

  skillChipBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      skillChipBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentSkillCategory = btn.getAttribute("data-cat");
      filterSkills();
    });
  });

  // —— 8. Technical Insights Reader Modal ——
  const articlesData = {
    "art-1": {
      kicker: "SharePoint Architecture Insight",
      title: "The Evolution of Client Customization: From JSLink to SPFx",
      readTime: "6 min read",
      content: `
        <p>Over the last decade, Microsoft’s front-end customization story underwent one of the most radical paradigm shifts in enterprise software engineering. Those who remember SharePoint 2013 recall writing JavaScript objects that hooked into CSR (Client-Side Rendering) through the JSLink property on web parts.</p>
        <h4>The Classic Paradigm: JSLink & JSOM</h4>
        <p>JSLink gave developers unprecedented flexibility compared to server-side XSLT. However, it came at a severe architectural cost: scripts executed directly in the global scope of the DOM, susceptible to CSS conflicts and uncontrolled lifecycle triggers.</p>
        <h4>The Modern Standard: SPFx & Fluent UI</h4>
        <p>With SharePoint Framework (SPFx), Microsoft introduced sandboxed, component-driven client engineering:</p>
        <ul>
          <li><strong>Strong Typing:</strong> Strict TypeScript interfaces preventing runtime type ambiguity.</li>
          <li><strong>Isolated Toolchains:</strong> Modern build pipelines via Node.js, Webpack, and Sass.</li>
          <li><strong>Microsoft Graph Integration:</strong> Declarative permission requests that honor OAuth2 without exposing raw client tokens.</li>
        </ul>
        <h4>Key Leadership Takeaway</h4>
        <p>When leading migration efforts, do not simply translate JSLink scripts into SPFx web parts. Redesign the data contracts to leverage Microsoft Graph and Microsoft Lists, treating the client purely as a high-fidelity presentation layer.</p>
      `
    },
    "art-2": {
      kicker: "Dataverse Architecture Insight",
      title: "Designing Resilient Relational Models in Dataverse at Scale",
      readTime: "8 min read",
      content: `
        <p>Microsoft Dataverse is frequently misconstrued as a glorified relational database or an elevated SharePoint list. In reality, it is a sophisticated metadata-driven enterprise application tier with built-in RBAC, audit histories, and event execution pipelines.</p>
        <h4>Core Scaling Principles</h4>
        <ul>
          <li><strong>Avoid N:N Generic Link Tables:</strong> Prefer explicit intersecting entities with custom attributes to support audit timestamps and status indicators.</li>
          <li><strong>Delegation Guardrails:</strong> Canvas applications querying Dataverse must avoid non-delegable complex functions on high-volume tables (>50,000 records).</li>
          <li><strong>Strategic Alternate Keys:</strong> Define alternate keys early for seamless upsert operations during automated ETL flows.</li>
        </ul>
        <h4>Business Unit & Security Hierarchies</h4>
        <p>Architecting security roles based on matrixed business units rather than simple record ownership ensures compliance with GDPR and regional data residency mandates across multinational supply chains.</p>
      `
    },
    "art-3": {
      kicker: "Microsoft Fabric Lakehouse Insight",
      title: "Microsoft Fabric OneLake: Unifying Citizen Development with Enterprise Lakehouses",
      readTime: "5 min read",
      content: `
        <p>Historically, an enormous friction existed between low-code citizen developers generating operational data inside Power Platform apps, and corporate enterprise data teams maintaining Snowflake, BigQuery, or Azure Synapse data warehouses.</p>
        <h4>The Fabric Shortcut Revolution</h4>
        <p>Microsoft Fabric obliterates this divide through native Delta Parquet formatting and OneLake shortcuts. Instead of scheduling brittle night-time ETL extracts, Dataverse transactional tables are reflected natively into OneLake.</p>
        <h4>Direct Lake Power BI Speed</h4>
        <p>Power BI reports can now query multi-gigabyte transactional tables using Direct Lake mode, delivering the instant response of in-memory caching while reflecting real-time updates as transactions commit.</p>
        <h4>Strategic Value</h4>
        <p>This unification allows engineering leaders to empower citizen builders while satisfying enterprise data governance, line-of-business auditability, and total cost of ownership (TCO) benchmarks.</p>
      `
    }
  };

  const artModal = document.getElementById("articleModal");
  const artModalKicker = document.getElementById("artModalKicker");
  const artModalTitle = document.getElementById("artModalTitle");
  const artModalBody = document.getElementById("artModalBody");
  const artCloseBtn = document.getElementById("artModalCloseBtn");
  const artDismissBtn = document.getElementById("artModalDismissBtn");

  function openArticleModal(artId) {
    const data = articlesData[artId];
    if (!data || !artModal) return;

    artModalKicker.textContent = `${data.kicker} · ${data.readTime}`;
    artModalTitle.textContent = data.title;
    artModalBody.innerHTML = data.content;

    artModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeArticleModal() {
    if (artModal) {
      artModal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll(".read-insight-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const artId = btn.getAttribute("data-article-id");
      openArticleModal(artId);
    });
  });

  if (artCloseBtn) artCloseBtn.addEventListener("click", closeArticleModal);
  if (artDismissBtn) artDismissBtn.addEventListener("click", closeArticleModal);
  if (artModal) {
    artModal.addEventListener("click", (e) => {
      if (e.target === artModal) closeArticleModal();
    });
  }

  // —— 9. Built-in Web Audio API Dark Ambient Synth Generator ——
  let audioCtx = null;
  let isAmbientPlaying = false;
  let synthGain = null;
  let synthNodes = [];

  const ambientToggleBtn = document.getElementById("ambientToggle");
  const nativeAudioBtn = document.getElementById("nativeAudioBtn");
  const ambientPlayerBar = document.getElementById("ambientPlayerBar");
  const ambientVolumeSlider = document.getElementById("ambientVolume");
  const ambientStopBtn = document.getElementById("ambientStopBtn");

  function initAmbientSynth() {
    if (audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioCtx = new AudioContextClass();
  }

  function startAmbientAudio() {
    initAmbientSynth();
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    stopAmbientAudio();

    // Master Gain
    synthGain = audioCtx.createGain();
    const vol = ambientVolumeSlider ? parseFloat(ambientVolumeSlider.value) : 0.4;
    synthGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    synthGain.gain.exponentialRampToValueAtTime(Math.max(0.01, vol), audioCtx.currentTime + 2.5);
    synthGain.connect(audioCtx.destination);

    // Warm Low Drone 1 (Deep C2 ~ 65.4 Hz)
    const osc1 = audioCtx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(65.41, audioCtx.currentTime);

    // Filter for Low Drone 1
    const filter1 = audioCtx.createBiquadFilter();
    filter1.type = "lowpass";
    filter1.frequency.setValueAtTime(140, audioCtx.currentTime);
    filter1.Q.setValueAtTime(3, audioCtx.currentTime);

    osc1.connect(filter1);
    filter1.connect(synthGain);
    osc1.start();
    synthNodes.push(osc1);

    // Drone 2: Sub-bass 5th (G1 ~ 48.99 Hz)
    const osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(48.99, audioCtx.currentTime);

    const gain2 = audioCtx.createGain();
    gain2.gain.setValueAtTime(0.6, audioCtx.currentTime);

    osc2.connect(gain2);
    gain2.connect(synthGain);
    osc2.start();
    synthNodes.push(osc2);

    // Ambient Rain White/Pink Noise Texture
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.08;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(750, audioCtx.currentTime);
    noiseFilter.Q.setValueAtTime(1.2, audioCtx.currentTime);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(synthGain);
    whiteNoise.start();
    synthNodes.push(whiteNoise);

    isAmbientPlaying = true;
    updateAmbientUI(true);
  }

  function stopAmbientAudio() {
    if (synthGain && audioCtx) {
      synthGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
    }
    setTimeout(() => {
      synthNodes.forEach((node) => {
        try {
          node.stop();
          node.disconnect();
        } catch (e) {}
      });
      synthNodes = [];
    }, 1300);

    isAmbientPlaying = false;
    updateAmbientUI(false);
  }

  function updateAmbientUI(playing) {
    if (ambientToggleBtn) {
      if (playing) {
        ambientToggleBtn.classList.add("active");
        ambientToggleBtn.setAttribute("aria-label", "Stop ambient audio");
      } else {
        ambientToggleBtn.classList.remove("active");
        ambientToggleBtn.setAttribute("aria-label", "Play ambient audio");
      }
    }
    if (nativeAudioBtn) {
      const icon = nativeAudioBtn.querySelector(".btn-play-icon");
      const text = nativeAudioBtn.querySelector(".btn-play-text");
      if (playing) {
        nativeAudioBtn.classList.add("playing");
        if (icon) icon.textContent = "⏸";
        if (text) text.textContent = "Pause Atmospheric Soundscape";
      } else {
        nativeAudioBtn.classList.remove("playing");
        if (icon) icon.textContent = "▶";
        if (text) text.textContent = "Start Atmospheric Soundscape";
      }
    }
    if (ambientPlayerBar) {
      if (playing) {
        ambientPlayerBar.classList.remove("hidden");
      } else {
        ambientPlayerBar.classList.add("hidden");
      }
    }
  }

  if (ambientToggleBtn) {
    ambientToggleBtn.addEventListener("click", () => {
      if (isAmbientPlaying) stopAmbientAudio();
      else startAmbientAudio();
    });
  }

  if (nativeAudioBtn) {
    nativeAudioBtn.addEventListener("click", () => {
      if (isAmbientPlaying) stopAmbientAudio();
      else startAmbientAudio();
    });
  }

  if (ambientStopBtn) {
    ambientStopBtn.addEventListener("click", stopAmbientAudio);
  }

  if (ambientVolumeSlider) {
    ambientVolumeSlider.addEventListener("input", (e) => {
      const vol = parseFloat(e.target.value);
      if (synthGain && audioCtx) {
        synthGain.gain.setValueAtTime(Math.max(0.001, vol), audioCtx.currentTime);
      }
    });
  }

  // —— 10. vCard (.vcf) Generator ——
  function generateAndDownloadVCard() {
    const vCardData = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:Sachchin Annam",
      "N:Annam;Sachchin;;;",
      "TITLE:Engineering Leader | Platform & Solutions Architect",
      "ORG:Ingram Micro",
      "EMAIL;TYPE=INTERNET,WORK:sachchinannam@gmail.com",
      "URL;TYPE=WORK:https://in.linkedin.com/in/sachchinannam",
      "ADR;TYPE=WORK:;;Mumbai;Maharashtra;;India",
      "NOTE:Specializing in Enterprise Power Platform, Microsoft Fabric, SharePoint architecture, and low-code governance.",
      "END:VCARD"
    ].join("\r\n");

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Sachchin_Annam_Architect.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const dlVcard1 = document.getElementById("downloadVcardBtn");
  const dlVcard2 = document.getElementById("downloadVcardBtn2");
  if (dlVcard1) dlVcard1.addEventListener("click", generateAndDownloadVCard);
  if (dlVcard2) dlVcard2.addEventListener("click", generateAndDownloadVCard);

  // Copy Email button
  const copyBtn = document.getElementById("copyEmailBtn");
  const copyBtnText = document.getElementById("copyBtnText");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText("sachchinannam@gmail.com").then(() => {
        if (copyBtnText) copyBtnText.textContent = "Copied!";
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = "Copy";
        }, 2200);
      });
    });
  }

  // Contact Form Submission (Mailto Transmitter)
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const topic = document.getElementById("contactTopic").value;
      const message = document.getElementById("contactMessage").value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.className = "form-status error";
          formStatus.textContent = "Please fill out all required fields.";
        }
        return;
      }

      const subject = encodeURIComponent(`[Transmission: ${topic}] From ${name}`);
      const body = encodeURIComponent(
        `Hello Sachchin,\n\nName / Organization: ${name}\nEmail: ${email}\nInquiry Topic: ${topic}\n\nMessage:\n${message}\n\nSent via Sachchin Annam Portfolio`
      );

      const mailtoUrl = `mailto:sachchinannam@gmail.com?subject=${subject}&body=${body}`;

      if (formStatus) {
        formStatus.className = "form-status success";
        formStatus.textContent = "Launching your mail client with pre-formatted transmission...";
      }

      window.location.href = mailtoUrl;
    });
  }

  // —— 11. Command Palette (Cmd+K / Ctrl+K) ——
  const cmdPalette = document.getElementById("cmdPalette");
  const cmdPaletteBtn = document.getElementById("cmdPaletteBtn");
  const cmdInput = document.getElementById("cmdInput");
  const cmdEscBtn = document.getElementById("cmdEscBtn");
  const cmdResultsList = document.getElementById("cmdResultsList");

  const commands = [
    { id: "sec-home", icon: "🏛️", title: "Go to Home & Cinematic Hero", category: "Navigation", action: () => jumpTo("#home") },
    { id: "sec-about", icon: "👤", title: "Go to About & Foundation", category: "Navigation", action: () => jumpTo("#about") },
    { id: "sec-solutions", icon: "📐", title: "Inspect Enterprise Architecture Blueprints", category: "Navigation", action: () => jumpTo("#solutions") },
    { id: "sec-skills", icon: "⚡", title: "Browse Technical Skills Matrix", category: "Navigation", action: () => jumpTo("#skills") },
    { id: "sec-experience", icon: "⏳", title: "Explore Experience Timeline (Ingram Micro, eClerx)", category: "Navigation", action: () => jumpTo("#experience") },
    { id: "sec-insights", icon: "✍️", title: "Read Technical Articles & Architecture Syntheses", category: "Navigation", action: () => jumpTo("#insights") },
    { id: "sec-achievements", icon: "🏆", title: "View Verified Honors & Certifications", category: "Navigation", action: () => jumpTo("#achievements") },
    { id: "sec-soundtrack", icon: "🎵", title: "Open Cinematic Soundtrack & Ambient Engine", category: "Navigation", action: () => jumpTo("#spotify") },
    { id: "sec-contact", icon: "✉️", title: "Transmit Message / Contact Sachchin", category: "Navigation", action: () => jumpTo("#contact") },
    { id: "act-theme", icon: "🌓", title: "Toggle Dark / Light Theme", category: "Actions", action: () => { const next = root.classList.contains("light") ? "dark" : "light"; applyTheme(next); } },
    { id: "act-ambient", icon: "🎧", title: "Toggle Ambient Gotham Synth Audio", category: "Actions", action: () => { if (isAmbientPlaying) stopAmbientAudio(); else startAmbientAudio(); } },
    { id: "act-vcard", icon: "📇", title: "Download Digital Business Card (.vcf)", category: "Actions", action: () => generateAndDownloadVCard() },
    { id: "act-copy", icon: "📋", title: "Copy Email: sachchinannam@gmail.com", category: "Actions", action: () => { navigator.clipboard.writeText("sachchinannam@gmail.com"); alert("Email address copied to clipboard!"); } }
  ];

  let selectedCmdIndex = 0;
  let filteredCommands = [...commands];

  function jumpTo(hash) {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  function openCommandPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.remove("hidden");
    if (cmdInput) {
      cmdInput.value = "";
      cmdInput.focus();
    }
    filterCommands("");
    document.body.style.overflow = "hidden";
  }

  function closeCommandPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function renderCommands() {
    if (!cmdResultsList) return;
    cmdResultsList.innerHTML = "";

    if (filteredCommands.length === 0) {
      cmdResultsList.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-dim); font-size: 0.95rem;">No commands or sections matching your query.</div>`;
      return;
    }

    filteredCommands.forEach((cmd, idx) => {
      const item = document.createElement("div");
      item.className = `cmd-item ${idx === selectedCmdIndex ? "selected" : ""}`;
      item.innerHTML = `
        <div class="cmd-item-left">
          <span class="cmd-item-icon" aria-hidden="true">${cmd.icon}</span>
          <span class="cmd-item-title">${cmd.title}</span>
        </div>
        <span class="cmd-item-hint">${cmd.category}</span>
      `;

      item.addEventListener("click", () => {
        closeCommandPalette();
        cmd.action();
      });

      cmdResultsList.appendChild(item);
    });
  }

  function filterCommands(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      filteredCommands = [...commands];
    } else {
      filteredCommands = commands.filter(
        (c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      );
    }
    selectedCmdIndex = 0;
    renderCommands();
  }

  if (cmdPaletteBtn) cmdPaletteBtn.addEventListener("click", openCommandPalette);
  if (cmdEscBtn) cmdEscBtn.addEventListener("click", closeCommandPalette);
  if (cmdPalette) {
    cmdPalette.addEventListener("click", (e) => {
      if (e.target === cmdPalette) closeCommandPalette();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener("input", (e) => {
      filterCommands(e.target.value);
    });

    cmdInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedCmdIndex = (selectedCmdIndex + 1) % filteredCommands.length;
        renderCommands();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedCmdIndex = (selectedCmdIndex - 1 + filteredCommands.length) % filteredCommands.length;
        renderCommands();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedCmdIndex]) {
          closeCommandPalette();
          filteredCommands[selectedCmdIndex].action();
        }
      } else if (e.key === "Escape") {
        closeCommandPalette();
      }
    });
  }

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (cmdPalette && cmdPalette.classList.contains("hidden")) {
        openCommandPalette();
      } else {
        closeCommandPalette();
      }
    }
    if (e.key === "Escape") {
      closeCommandPalette();
      closeBlueprintModal();
      closeArticleModal();
    }
  });
})();

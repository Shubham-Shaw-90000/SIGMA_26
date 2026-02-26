/**
 * KINETIC PAGE TRANSITION SYSTEM
 */

(function () {
  if (typeof gsap === "undefined") {
    console.warn("GSAP is required for page transitions.");
    return;
  }

  gsap.registerPlugin(CustomEase);
  CustomEase.create("kineticEase", "0.65, 0, 0.35, 1");

  // =========================================
  // 1. SETUP & STATE MANAGEMENT
  // =========================================

  const transitionId = "kinetic-transition";
  const domCache = {
    overlay: null,
    grid: null,
    lines: null,
    oddLines: null,
    evenLines: null,
  };

  function injectOverlay() {
    let overlay = document.getElementById(transitionId);
    // 1. If it doesn't exist at all, create it (Fallback)
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = transitionId;
      overlay.style.height = "100dvh";
      document.body.appendChild(overlay);
    }
    if (overlay.children.length === 0) {
      const grid = document.createElement("div");
      grid.className = "kinetic-grid";
      for (let i = 0; i < 11; i++) {
        const line = document.createElement("div");
        line.className = `trans-line ${i % 2 === 0 ? "even" : "odd"}`;
        line.textContent = ""; // Starts empty
        grid.appendChild(line);
      }
      overlay.appendChild(grid);
    }
    domCache.overlay = overlay;
    domCache.grid = overlay.querySelector(".kinetic-grid");
    domCache.lines = overlay.querySelectorAll(".trans-line");
    domCache.oddLines = overlay.querySelectorAll(".trans-line.odd");
    domCache.evenLines = overlay.querySelectorAll(".trans-line.even");
  }
  document.addEventListener("DOMContentLoaded", () => {
    injectOverlay();
    animateEntry();
  });

  // =========================================
  // 2. ANIMATION LOGIC
  // =========================================

  function playTransition(text, destinationUrl) {
    // Accessibility Check: Skip animation if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      window.location.href = destinationUrl;
      return;
    }

    const { overlay, grid, lines, oddLines, evenLines } = domCache;
    if (!overlay) return; // Safety check

    // 1. Lock Scroll on Mobile to prevent background rubber-banding
    document.body.style.overflow = "hidden";

    // 2. Update Text Content (Batch DOM updates)
    const repeatedText = `${text} ${text} ${text}`;
    // Using requestAnimationFrame to ensure style calculations happen after text update
    // Remove requestAnimationFrame and update text directly
    lines.forEach((line) => {
      line.textContent = repeatedText;
      gsap.set(line, { visibility: "visible" }); // Reveal only when text is ready
    });

    overlay.classList.add("is-active");

    // Reset GSAP props
    gsap.set(overlay, { opacity: 0, visibility: "visible" });
    gsap.set(grid, { scale: 1, rotation: 0 });
    gsap.set(lines, { opacity: 0 });
    gsap.set(oddLines, { x: "20%" });
    gsap.set(evenLines, { x: "-20%" });
    gsap.set(lines, { force3D: true });

    // 4. The Animation Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        window.location.href = destinationUrl;
      },
    });

    // -- Phase A: Reveal & Zoom --
    tl.to(
      overlay,
      {
        opacity: 1,
        duration: 0.8, //This
        ease: "power2.out",
      },
      0,
    );

    tl.to(
      lines,
      {
        opacity: 1,
        duration: 1.2, //This
        stagger: { amount: 0.2, from: "center" },
        ease: "kineticEase",
      },
      0.1,
    );

    // Kinetic Movement
    tl.to(
      oddLines,
      { x: "-80%", duration: 2, ease: "kineticEase", force3D: true },
      0.15,
    );
    tl.to(
      evenLines,
      { x: "80%", duration: 2, ease: "kineticEase", force3D: true },
      0.15,
    );

    // Grid Rotation
    tl.to(
      grid,
      {
        scale: 1.5,
        rotation: -90,
        duration: 2, //This
        ease: "kineticEase",
      },
      0,
    );

    // -- Phase B: Navigation Trigger --
    // Trigger slightly earlier to mask any browser load latency
    tl.call(
      () => {
        window.location.href = destinationUrl;
      },
      null,
      1.8,
    );
  }

  function animateEntry() {
    // We need to fetch from DOM if cache is empty (fresh page load)
    const overlay = document.getElementById(transitionId);
    if (!overlay) return;

    // Ensure scroll is unlocked on entry
    document.body.style.overflow = "";

    gsap.set(overlay, {
      opacity: 1,
      visibility: "visible",
      pointerEvents: "all",
    });

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.8,
      delay: 0.1, // Small delay for rendering
      ease: "power2.inOut",
      onComplete: () => {
        overlay.classList.remove("is-active");
        gsap.set(overlay, { visibility: "hidden", pointerEvents: "none" });
      },
    });
  }

  // =========================================
  // 3. EVENT INTERCEPTION
  // =========================================

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");

    if (!link) return;
    if (link.target === "_blank") return;

    const href = link.getAttribute("href");
    if (!href) return;
    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    )
      return;

    // Ignore same page hash links
    if (href.includes("#") && href.split("#")[0] === window.location.pathname)
      return;

    const isInternal = link.host === window.location.host;

    if (isInternal) {
      e.preventDefault();

      // Logic to grab text (Inner Text -> Filename -> Fallback)
      let label = link.innerText.trim();
      if (!label) {
        const parts = link.pathname.split("/");
        const filename = parts[parts.length - 1].replace(".html", "");
        label = filename || "SIGMA";
      }

      label = label.toUpperCase();
      if (label === "HOME" || label === "INDEX") label = "SCIENCE";

      playTransition(label, link.href);
    }
  });

  // =========================================
  // 4. BROWSER BACK/FORWARD HANDLING
  // =========================================

  // Restore page state when returning via Back Button (bfcache)
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      const overlay = document.getElementById(transitionId);
      if (overlay) {
        overlay.classList.remove("is-active");
        gsap.set(overlay, { opacity: 0, visibility: "hidden" });
        document.body.style.overflow = ""; // Unlock scroll
      }
    }
  });
})();

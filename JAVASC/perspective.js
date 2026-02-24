const CONFIG = {
  zoomAmount: 500,
  parallaxStrength: 120,
  parallaxDepth: 1,
  mobileBreakpoint: 768,
  animation: {
    duration: 1,
    zoomDuration: 2.5,
    flashDuration: 2,
    easeExpoIn: "expo.in",
    easePower2: "power2.inOut",
  },
};

const state = {
  ready: false,
  zoomed: false,
  loadingComplete: false,
  mouse: { x: 0.5, y: 0.5 }, // Start center
  isMobile: window.matchMedia(`(max-width: ${CONFIG.mobileBreakpoint}px)`)
    .matches,
  isTouch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
};

const DOM = {
  layers: null,
  flashImg: null,
  container: null,
  hero: null,
  tapHint: null,
};

function initPerspective() {

  // 🚫 SKIP ANIMATION FOR IOS TEMPORARY
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    const hero = document.querySelector(".college");
    const tapHint = document.getElementById("tap-hint");

    if (tapHint) tapHint.remove();
    if (hero) hero.remove();

    document.body.style.overflow = "";

    if (window.lenis) {
      window.lenis.start();
      window.lenis.resize();
    }

    window.dispatchEvent(new CustomEvent("heroAway"));
    return; // STOP everything here
  }

  cacheDOM();
  checkInitialLoadingState();
  if (!state.loadingComplete) {
    window.addEventListener(
      "loadingComplete",
      () => {
        state.loadingComplete = true;
        setupParallaxAnimation();
      },
      { once: true },
    );
  } else {
    setupParallaxAnimation();
  }
}

function setupParallaxAnimation() {
  // =========================================================
  // Robust Detection (Mirroring loading_screen.js logic)
  // =========================================================
  let shouldPlayPerspective = true;

  try {
    const navEntry = performance.getEntriesByType("navigation")[0];
    const isReload = navEntry
      ? navEntry.type === "reload"
      : performance.navigation.type === 1;
    const heroRemoved = sessionStorage.getItem("heroRemoved");

    // Logic: Skip parallax setup ONLY if hero was already removed in previous session
    if (heroRemoved && !isReload) {
      shouldPlayPerspective = false;
    }
  } catch (e) {
    // Fallback: If session storage fails, play it to be safe
    shouldPlayPerspective = true;
  }

  if (!shouldPlayPerspective) {
    // --- INSTANT CLEANUP (Hero already removed in previous session) ---
    if (DOM.hero) {
      DOM.hero.remove();
    }

    if (DOM.tapHint) {
      DOM.tapHint.style.display = "none";
    }

    document.body.style.overflow = "";
    if (window.lenis) {
      window.lenis.start();
      window.lenis.resize();
    }

    window.dispatchEvent(new CustomEvent("heroAway"));
    return; // Stop the script here
  }
  // =========================================================

  // If we passed the check, initialize the 3D parallax
  setupLayers();
  setupEventListeners();
  gsap.ticker.add(updateParallax);
  state.ready = true;
}

function cacheDOM() {
  DOM.layers = document.querySelectorAll(".layer");
  DOM.flashImg = document.getElementById("flash-img");
  DOM.container = document.querySelector(".perspective-container");
  DOM.hero = document.querySelector(".college");
  DOM.tapHint = document.getElementById("tap-hint");
}

function checkInitialLoadingState() {
  // If loading wrapper is missing, we consider loading complete
  if (!document.querySelector(".loading-screen-wrapper")) {
    state.loadingComplete = true;
  }
}

function setupLayers() {
  // Set initial properties for parallax layers
  DOM.layers.forEach((layer) => {
    const z = parseFloat(layer.dataset.z);
    // Note: Scale logic preserved from original code (commented out or active)

    gsap.set(layer, {
      xPercent: -50,
      yPercent: -50,
      left: "50%",
      top: "50%",
      x: 0,
      y: 0,
      z: z,
    });
  });

  // Set flash/glow image properties
  // DESKTOP: -35% | MOBILE: -45%
  if (DOM.flashImg) {
    gsap.set(DOM.flashImg, {
      xPercent: -50,
      yPercent: state.isMobile ? -45 : -35,
      left: "50%",
      top: "50%",
      x: 0,
      y: 0,
    });
  }
}

function setupEventListeners() {
  // Mouse movement tracking
  document.addEventListener("mousemove", handleMouseMove);

  // Loading completion listener
  window.addEventListener("loadingComplete", () => {
    state.loadingComplete = true;
  });

  window.addEventListener("mousedown", handleZoomTrigger);
  window.addEventListener("touchstart", handleZoomTrigger, { passive: true });
}

function handleMouseMove(e) {
  state.mouse.x = e.clientX / window.innerWidth;
  state.mouse.y = e.clientY / window.innerHeight;
}

function handleZoomTrigger() {
  // Guard: Don't allow zoom if loading isn't finished
  if (!state.loadingComplete) {
    state.loadingComplete = true;
  }

  toggleZoom();
}

function updateParallax() {
  if (!state.ready) return;

  DOM.layers.forEach((layer) => {
    // Calculate movement based on mouse position from center (0.5)
    const moveX =
      (state.mouse.x - 0.5) * CONFIG.parallaxStrength * CONFIG.parallaxDepth;
    const moveY =
      (state.mouse.y - 0.5) *
      CONFIG.parallaxStrength *
      CONFIG.parallaxDepth *
      0.3;

    gsap.to(layer, {
      x: moveX,
      y: moveY,
      duration: CONFIG.animation.duration,
      overwrite: "auto",
    });
  });
}

function toggleZoom() {
  if (window.innerWidth > 768) {
    window.scrollTo(0, 0);
  }

  if (state.zoomed) return;

  // Hide tap hint immediately
  DOM.tapHint.remove();
  // if (DOM.tapHint) {
  //   gsap.to(DOM.tapHint, {
  //     opacity: 0,
  //     visibility: "hidden",
  //     duration: 0.5,
  //   });
  // }

  const tl = gsap.timeline({
    defaults: { duration: CONFIG.animation.duration },
    onComplete: cleanupHero,
  });

  // 1. Center the gate (Camera move)
  tl.to(
    DOM.container,
    {
      y: state.isMobile ? "0%" : "-100%",
      duration: CONFIG.animation.zoomDuration,
      ease: CONFIG.animation.easeExpoIn,
    },
    "<",
  );

  // Lock zoom state
  state.zoomed = true;

  // 2. Zoom layers
  DOM.layers.forEach((layer) => {
    const baseZ = parseFloat(layer.dataset.z);
    const targetZ = baseZ + CONFIG.zoomAmount;

    tl.to(
      layer,
      {
        z: targetZ,
        duration: CONFIG.animation.zoomDuration,
        ease: CONFIG.animation.easeExpoIn,
      },
      "<",
    );
  });

  // 3. Fade out Hero section
  if (DOM.hero) {
    tl.to(
      DOM.hero,
      {
        opacity: 0,
        duration: CONFIG.animation.zoomDuration,
        ease: CONFIG.animation.easeExpoIn,
      },
      "<",
    );
  }

  // 4. Flash Image Sequence
  if (DOM.flashImg) {
    // Initial appearance
    tl.fromTo(
      DOM.flashImg,
      {
        display: "none",
        opacity: 0,
      },
      {
        display: "block",
        opacity: 1,
        duration: CONFIG.animation.flashDuration,
        ease: CONFIG.animation.easeExpoIn,
      },
      "-=2.5",
    );

    // Scale down/disappear effect
    tl.fromTo(
      DOM.flashImg,
      {
        display: "none",
        scale: 0.001,
      },
      {
        display: "block",
        scale: 0,
        duration: 2.6,
        ease: CONFIG.animation.easeExpoIn,
      },
      "<",
    );
  }
}

function cleanupHero() {
  if (DOM.tapHint) {
    DOM.tapHint.style.opacity = "0";
    DOM.tapHint.style.visibility = "hidden";
    DOM.tapHint.style.display = "none";
  }
  console.log("afterZoomIn / cleanupHero");

  if (!DOM.hero) {
    window.dispatchEvent(new CustomEvent("heroAway"));
    return;
  }

  // Reset Scroll Position
  if (window.innerWidth > 768) {
    window.scrollTo(0, 0);
  }
  if (window.lenis) {
    window.lenis.scrollTo(0, { immediate: true });
  }

  // Smooth fade out revealing content
  gsap.to(DOM.hero, {
    opacity: 0,
    duration: 0.5,
    ease: CONFIG.animation.easePower2,
    onComplete: () => {
      // FIX 1: STOP THE INFINITE LOOP!
      gsap.ticker.remove(updateParallax);

      // Remove from DOM
      DOM.hero.remove();
      sessionStorage.setItem("heroRemoved", "true");

      // FIX 2: SEVER REFERENCES FOR GARBAGE COLLECTION
      DOM.layers = null;
      DOM.hero = null;
      DOM.flashImg = null;

      // Force scroll to top again after removal
      if (window.innerWidth > 768) {
        window.scrollTo(0, 0);
      }
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }

      // Enable Scroll (Lenis & Body)
      if (window.lenis) {
        window.lenis.start();
      }
      document.body.style.setProperty("overflow", "");
      
      // Signal transition completion
      window.dispatchEvent(new CustomEvent("heroAway"));

      // Refresh libraries to detect layout changes
      if (typeof ScrollTrigger !== "undefined") {
        setTimeout(() => {
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }, 100);
      }
      if (window.lenis) {
        window.lenis.resize();
      }
    },
  });
}

window.addEventListener("load", initPerspective);

// Also initialize immediately if script loads after DOM is ready
if (document.readyState !== "loading") {
  // DOM already loaded, initialize with a small delay to ensure bindings are ready
  requestAnimationFrame(() => {
    setTimeout(initPerspective, 50);
  });
}

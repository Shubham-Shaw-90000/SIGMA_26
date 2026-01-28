/**
 * Navigation Controller
 */

document.addEventListener("DOMContentLoaded", () => {

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false, 
    touchMultiplier: 2,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(500, 33);

  const navbar = document.querySelector(".navbar");
  let lastScrollY = 0;
  let isHidden = false;

  const threshold = 100; 
  const tolerance = 5; 
 
  if (!prefersReducedMotion) {
    gsap.from(navbar, {
      yPercent: -100,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      delay: 0.5, 
    });
  }

  lenis.on("scroll", ({ scroll }) => {
   
    const currentScroll = Math.max(0, scroll);

     if (currentScroll < threshold) {
      if (isHidden) {
        showNavbar();
      }
      lastScrollY = currentScroll;
      return;
    }

    const diff = currentScroll - lastScrollY;

   
    if (diff > tolerance && !isHidden) {
      hideNavbar();
    }
   
    else if (diff < -tolerance && isHidden) {
      showNavbar();
    }

    lastScrollY = currentScroll;
  });

  function hideNavbar() {
    if (prefersReducedMotion) return;

    isHidden = true;
    gsap.to(navbar, {
      yPercent: -100,
      duration: 0.4,
      ease: "power2.inOut",
      overwrite: true, 
    });
  }

  function showNavbar() {
    isHidden = false;
    gsap.to(navbar, {
      yPercent: 0,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });
  }

  //--- Scroll-To Section Logic ---

  const navLinks = document.querySelectorAll(".nav-links a");

  
  const targetMap = {
    0: "#hero",
    1: "#about",
    2: "#team",
    3: ".site-footer",
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
  
      const targetKey = link.getAttribute("data-target");
      if (!targetKey) return;

      e.preventDefault();

      const selector = targetMap[targetKey];
      const targetSection = document.querySelector(selector);

      if (targetSection) {
        lenis.scrollTo(targetSection, {
          offset: 0,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          immediate: false, 
        });
      }
    });
  });

  //--- Accessibility Fixes ---

  navbar.addEventListener("focusin", () => {
    if (isHidden) showNavbar();
  });
});

// --- Easter Egg Logic ---
const logo = document.getElementById("logo");
const eggModal = document.getElementById("easterEggModal");
const closeGameBtn = document.getElementById("closeGameBtn");
const gameIframe = document.getElementById("gameIframe");

if (logo && eggModal && closeGameBtn) {
  let clickCount = 0;
  let clickTimer;

  logo.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent jump to top if any
    clickCount++;
    
    // Reset count if user stops clicking
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      clickCount = 0;
    }, 1200);

    // Trigger on 3rd click
    if (clickCount === 3) {
      // 1. Show the Modal
      eggModal.classList.remove("hidden");
      
      // 2. Load the game (only loads now to save performance)
      // Ensure 'game.html' is in the same directory, or update path
      gameIframe.src = "../HTML/game.html"; 
      
      clickCount = 0;
    }
  });

  // Close Logic
  closeGameBtn.addEventListener("click", () => {
    eggModal.classList.add("hidden");
    // Clear src to stop game execution/music/timers
    gameIframe.src = ""; 
  });
  
  // Close if clicking outside the game window (on the backdrop)
  eggModal.addEventListener("click", (e) => {
    if (e.target === eggModal) {
        eggModal.classList.add("hidden");
        gameIframe.src = "";
    }
  });
}


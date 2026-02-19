/**
 * Navigation Controller
 * Handles Lenis initialization, GSAP synchronization, and Smart Navbar logic.
 * * Dependencies: GSAP 3+, ScrollTrigger, Lenis
 */

console.log("nav");

document.addEventListener("DOMContentLoaded", () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const lenis = window.lenis;

  // 5. --- Smart Navbar Logic ---

  const navbar = document.querySelector(".navbar");
  let lastScrollY = 0;
  let isHidden = false;
  let heroRemoved = false; // Track if hero intro is complete

  // Config
  const threshold = 100; // Minimum scroll before hiding starts
  const tolerance = 5; // Small buffer to prevent jitter

  // Listen for hero removal event
  window.addEventListener("heroAway", () => {
    heroRemoved = true;
  });

  // Navbar Entrance Animation - Triggered from animations.js or local
  window.revealNavbar = () => {
    if (!prefersReducedMotion) {
      gsap.to(navbar, {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
      });
    } else {
      gsap.set(navbar, { opacity: 1, yPercent: 0 });
    }
  };

  // Initial state: Hidden until hero animation completes
  gsap.set(navbar, { yPercent: -100, opacity: 0 });

  // Scroll Handler for Hide/Show
  if (lenis && lenis.on) {
    lenis.on("scroll", ({ scroll }) => {
      // Don't run hide/show logic until hero is removed
      if (!heroRemoved) return;

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
      } else if (diff < -tolerance && isHidden) {
        showNavbar();
      }

      lastScrollY = currentScroll;
    });
  }

  function hideNavbar() {
    if (prefersReducedMotion) return;

    isHidden = true;
    gsap.to(navbar, {
      yPercent: -100,
      duration: 0.4,
      ease: "power2.inOut",
      overwrite: true, // Ensure we kill any conflicting tweens
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

  // 4. --- Scroll-To Section Logic ---

  const navLinks = document.querySelectorAll(".nav-links a");

  // Map data-targets to actual DOM IDs
  // 0: Home (#hero), 1: About (#about), 2: Team (#team), 3: Contact (Footer)
  const targetMap = {
    0: "#hero",
    1: "#about",
    2: "#team",
    3: ".site-footer",
    4: "./pebbles.html",
    5: "./register.html",
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetKey = link.getAttribute("data-target");
      if (!targetKey) return;

      const selector = targetMap[targetKey];
      const targetSection = document.querySelector(selector);

      if (targetSection && window.lenis) {
        e.preventDefault();
        window.lenis.scrollTo(targetSection, {
          offset: 0,
          duration: 1.5,
        });
      }
    });
  });

  // 5. --- Accessibility Fixes ---

  // Ensure keyboard focus brings navbar into view
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

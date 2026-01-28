// Initialize a new Lenis instance for smooth scrolling
const lenis = new Lenis();

// Check if the intro '.hero' element OR loading screen exists in the DOM.
// We use querySelector to find the div with class 'hero' specifically.
const introElement = document.querySelector("div.hero");
const loadingScreen = document.querySelector(".loading-screen-wrapper");
const isIntroPresent = !!introElement;
const isLoadingPresent = !!loadingScreen;

// Disable scroll initially if hero or loading screen is still there
if (isIntroPresent || isLoadingPresent) {
  lenis.stop();
  document.body.style.setProperty('overflow', 'hidden', 'important');
  window.scrollTo(0, 0);
}

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);

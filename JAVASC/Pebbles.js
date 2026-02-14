$(function () {
  const $viewport = $(".viewport");
  let rippleInterval; // Store the interval ID

  // 1. Initialize ripples
  $viewport.ripples({
    dropRadius: 10,
    perturbance: 0.05,
  });

  // 2. Define the auto-ripple logic
  function startAutoRipples() {
    // Prevent multiple intervals from stacking
    if (rippleInterval) clearInterval(rippleInterval);

    $viewport.ripples("play");

    rippleInterval = setInterval(function () {
      const w = $viewport.innerWidth();
      const h = $viewport.innerHeight();
      const x = Math.random() * w;
      const y = Math.random() * h;

      $viewport.ripples("drop", x, y, 15, 0.08);
    }, 1500);
  }

  function stopAutoRipples() {
    // Stop adding new drops
    clearInterval(rippleInterval);
    rippleInterval = null;

    // Freeze the physics
    $viewport.ripples("pause");
  }

  // 3. Start immediately
  startAutoRipples();

  // 4. Handle visibility changes
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopAutoRipples();
    } else {
      startAutoRipples();
    }
  });
});

// Scroll controller
const scrollContainer = document.getElementById("issuesScroll");
const scrollAmount = 360; // one card width

document.querySelector(".arrow.left").addEventListener("click", () => {
  scrollContainer.scrollBy({
    left: -scrollAmount,
    behavior: "smooth",
  });
});

document.querySelector(".arrow.right").addEventListener("click", () => {
  scrollContainer.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });
});

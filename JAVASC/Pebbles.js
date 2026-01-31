$(function () {
  const $viewport = $(".viewport");

  // initialize ripples
  $viewport.ripples({
    dropRadius: 10,
    perturbance: 0.05,
  });

  // automatic ripples
  const rippleInterval = setInterval(function () {
    const w = $viewport.innerWidth();
    const h = $viewport.innerHeight();

    const x = Math.random() * w;
    const y = Math.random() * h;

    $viewport.ripples("drop", x, y, 15, 0.08);
  }, 1500);

  // pause / play when tab visibility changes
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      $viewport.ripples("pause");
    } else {
      $viewport.ripples("play");
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
const layer = document.getElementById("rippleLayer");
const area = document.getElementById("area");

const MAX_RIPPLES = 3;
const RIPPLE_DURATION = 4000;

function createRipple(x, y) {
  if (layer.children.length >= MAX_RIPPLES) {
    layer.firstElementChild.remove();
  }

  const ripple = document.createElement("div");
  ripple.className = "ripple";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  layer.appendChild(ripple);

  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
}

area.addEventListener("click", e => {
  createRipple(e.clientX, e.clientY);
});

/* Ambient ripple loop (self-throttling) */
let ambientTimer;

function scheduleAmbient(delay = 8000) {
  clearTimeout(ambientTimer);
  ambientTimer = setTimeout(() => {
    createRipple(
      innerWidth * (0.3 + Math.random() * 0.4),
      innerHeight * (0.3 + Math.random() * 0.6)
    );
    scheduleAmbient(12000);
  }, delay);
}

scheduleAmbient();

area.addEventListener("mousemove", () => scheduleAmbient(15000));

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

console.log("timeline");

// --- 1. Configuration & Data ---
// Made config dynamic based on screen size
const isMobile = window.innerWidth < 768;

const config = {
  eventSpacing: isMobile ? 300 : 800,
  startPadding: isMobile ? window.innerHeight * 0.7 : window.innerWidth * 0.6,
  endPadding: isMobile ? window.innerWidth * 0.5 : window.innerWidth * 0.4,
  branchYOffset: window.innerHeight * 0.08,
};

const timelineData = [
  {
    year: "2021-2022",
    title: "Inception Point",
    desc: "A spark was lit, where curiosity first found its voice and direction.",
    img: "./Assets/CC2021.avif",
  },
  {
    year: "2022-2023",
    title: "First Ascent",
    desc: "Momentum took shape, as ideas evolved into action and collective purpose.",
    img: "./Assets/CC2022.avif",
  },
  {
    year: "2023-2024",
    title: "Sky is the Limit",
    desc: "The horizon widened, with ambition pushing beyond limits and expectations.",
    img: "./Assets/CC2023.avif",
  },
  {
    year: "2024-2025",
    title: "Legacy",
    desc: "A legacy emerged, where changing hands carried the same unyielding flame forward.",
    img: "./Assets/CC2024.avif",
  },
];

// --- 2. Setup DOM & Dimensions ---
gsap.registerPlugin(ScrollTrigger);

const SCROLL_FACTOR = 0.5;
const scrollContainer = document.getElementById("scroll-container");
const svgCanvas = document.getElementById("timeline-svg");
const spacer = document.getElementById("scroll-height-spacer");

// Calculate Total Width based on data
const totalContentWidth =
  config.startPadding +
  timelineData.length * config.eventSpacing +
  config.endPadding;

// Set Spacer height (controls how "long" the scroll feels)
// We make it relative to the width to ensure scrubbing feels 1:1
spacer.style.height = `${totalContentWidth * 0.1}px`;
scrollContainer.style.width = `${totalContentWidth}px`;

// Update SVG Viewbox to match pixel dimensions exactly
function resizeSvg() {
  const h = window.innerHeight;
  svgCanvas.setAttribute("viewBox", `0 0 ${totalContentWidth} ${h}`);
  svgCanvas.setAttribute("width", totalContentWidth);
  svgCanvas.setAttribute("height", h);
}
resizeSvg();

// --- 3. Build Content & SVG Paths ---

function buildTimeline() {
  const centerY = window.innerHeight / 2;
  let mainPathD = `M 0 ${centerY}`;

  // Generate Nodes and Branches
  timelineData.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const nodeX = config.startPadding + (index + 1.1) * config.eventSpacing;

    // Determine Y position (Connection Point)
    // If even index (Top Node), connection point is at centerY - offset
    // If odd index (Bottom Node), connection point is at centerY + offset
    const nodeY = isEven
      ? centerY - config.branchYOffset
      : centerY + config.branchYOffset;

    // 1. Create HTML Node
    const nodeEl = document.createElement("div");
    nodeEl.className = `event-node ${isEven ? "top" : "bottom"}`;

    // Position the anchor point of the node
    nodeEl.style.left = `${nodeX}px`;
    nodeEl.style.top = `${nodeY}px`;

    // Adjust Transform based on position relative to branch
    // If Top Node: It sits ABOVE the connection point (translateY -100%)
    // If Bottom Node: It sits BELOW the connection point (translateY 0%)
    // -50% X centers it horizontally on the branch tip
    const yTransformPercent = isEven ? -100 : 0;

    // Add a small margin (e.g., 20px) so it doesn't touch the line exactly
    const margin = isEven ? -20 : 20;
    // Actually, let's incorporate margin into the transform or just use the gap
    // Using pixels in translate for margin

    nodeEl.style.transform = `translate(-50%, ${yTransformPercent}%) translateY(${margin}px)`;

    nodeEl.innerHTML = `
                    <div class="image-mask">
                        <img src="${item.img}" alt="${item.title}" class="event-image" data-parallax-speed="0.8">
                    </div>
                    <div class="meta-data text-center mt-4">
                        <div class="year-label">${item.year}</div>
                        <h2>${item.title}</h2>
                        <p>${item.desc}</p>
                    </div>
                `;
    scrollContainer.appendChild(nodeEl);

    // 2. Create Branch Path in SVG
    // Logic: Branch starts on main line, slightly before the node X
    const branchStartX = nodeX - (isMobile ? 100 : 200);

    // Create SVG Path element for the branch
    const branchPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    branchPath.classList.add("branch-path");

    // Bezier Curve Logic
    // Start at main line (branchStartX, centerY)
    // Curve to (nodeX, nodeY)
    // Control points for S-curve
    const cp1X = branchStartX + (isMobile ? 50 : 100);
    const cp1Y = centerY;
    const cp2X = nodeX - (isMobile ? 20 : 50);
    const cp2Y = nodeY;

    const d = `M ${branchStartX} ${centerY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${nodeX} ${nodeY}`;
    branchPath.setAttribute("d", d);

    // Store metadata for animation
    branchPath.dataset.triggerX = branchStartX;
    branchPath.id = `branch-${index}`;
    svgCanvas.appendChild(branchPath);

    // Add to main path string (just a straight line through everything)
  });

  // Finish Main Path
  mainPathD += ` L ${totalContentWidth} ${centerY}`;

  const mainPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  mainPath.setAttribute("d", mainPathD);
  mainPath.id = "main-line";
  // Prepend main path so branches render on top
  svgCanvas.insertBefore(mainPath, svgCanvas.firstChild);
}

buildTimeline();

// --- 4. Animation Logic ---

function waitForLoadingComplete() {
  const loadingWrapper = document.querySelector(".loading-screen-wrapper");

  if (!loadingWrapper) {
    // Loading screen already removed, start immediately
    initAnimation();
  } else {
    // Loading screen still present, wait for it to complete
    window.addEventListener("loadingComplete", initAnimation, { once: true });

    // Timeout fallback: if loading screen doesn't dispatch event within 15 seconds, start anyway
    setTimeout(() => {
      if (document.querySelector(".loading-screen-wrapper")) {
        initAnimation();
      }
    }, 15000);
  }
}

// Check if DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", waitForLoadingComplete);
} else {
  // DOM already loaded
  waitForLoadingComplete();
}

function initAnimation() {
  // Master Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".viewport-wrapper", // Pin this wrapper
      start: "top top",
      end: () => `+=${(totalContentWidth - window.innerWidth) * SCROLL_FACTOR}`, // Scroll amount matches content width
      pin: true,
      scrub: true, // Use true for 1:1 scroll sync (no smoothing delay)
      invalidateOnRefresh: true,
      anticipatePin: 1, // Helps prevent jumps when pinning starts
      onUpdate: (self) => {
        // Update UI progress bar
        gsap.set(".progress-bar", { width: self.progress * 100 + "%" });
      },
    },
  });

  // 1. Horizontal Scroll
  // Move the container left as we scroll down
  tl.to(
    scrollContainer,
    {
      x: () => -(totalContentWidth - window.innerWidth),
      ease: "none",
      duration: 10, // Arbitrary duration unit, acts as reference for child tweens
    },
    0,
  );

  // 2. Animate Main Line Drawing
  const mainLine = document.getElementById("main-line");
  const mainLength = mainLine.getTotalLength();

  // Set initial dash state
  gsap.set(mainLine, {
    strokeDasharray: mainLength,
    strokeDashoffset: mainLength,
  });

  // Animate stroke offset
  tl.to(
    mainLine,
    {
      strokeDashoffset: 0,
      ease: "none",
      duration: 10,
    },
    0,
  );

  // 3. Animate Branches & Nodes
  const branches = document.querySelectorAll(".branch-path");
  const nodes = document.querySelectorAll(".event-node");

  branches.forEach((branch, i) => {
    const node = nodes[i];
    const length = branch.getTotalLength();

    // Calculate timing
    // The branch starts drawing when the main line reaches branch.dataset.triggerX
    const startX = parseFloat(branch.dataset.triggerX);
    const startTime = (startX / totalContentWidth) * 10;

    // Prepare branch stroke
    gsap.set(branch, { strokeDasharray: length, strokeDashoffset: length });

    // Animate Branch
    tl.to(
      branch,
      {
        strokeDashoffset: 0,
        ease: "power2.out",
        duration: 0.5, // Quick draw
      },
      startTime,
    );

    // Animate Node Reveal (just after branch starts)
    tl.fromTo(
      node,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, ease: "back.out(1.7)", duration: 0.8 },
      startTime + 0.3,
    );

    // Add Parallax to Images
    const img = node.querySelector(".event-image");

    tl.fromTo(
      img,
      { x: "-10%" },
      { x: "5%", ease: "none", duration: 4 }, // Parallax duration covers the time the node is on screen
      startTime - 2, // Start slightly before it appears
    );
  });
}

// Handle Resize
// let resizeTimer;
// window.addEventListener("resize", () => {
//   clearTimeout(resizeTimer);
//   resizeTimer = setTimeout(() => {
//     location.reload();
//   }, 250);
// });

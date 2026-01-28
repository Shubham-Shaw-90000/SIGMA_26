// --- 1. Configuration & Data ---
const config = {
  eventSpacing: 800, // px between events
  startPadding: window.innerWidth * 0.2,
  endPadding: window.innerWidth * 0.6,
  branchYOffset: 80, // Vertical distance for branches
};

const timelineData = [
  {
    year: "2021",
    title: "Inception Point",
    desc: "The project begins with a single line of code and a vision.",
    img: "./Assets/CC2021.avif",
  },
  {
    year: "2022",
    title: "First Divergence",
    desc: "Systems split as complexity grows. The architecture expands.",
    img: "./Assets/CC2022.avif",
  },
  {
    year: "2023",
    title: "Neural Integration",
    desc: "AI models merged with frontend logic creating organic motion.",
    img: "./Assets/CC2023.avif",
  },
  {
    year: "2024",
    title: "Horizon Event",
    desc: "The final singularity. Design and code become indistinguishable.",
    img: "./Assets/CC2023.avif",
  },
];

// --- 2. Setup DOM & Dimensions (DEFERRED) ---
// Note: We do NOT run this immediately to allow LCP to paint first.

function buildAndInitTimeline() {
  gsap.registerPlugin(ScrollTrigger);

  const SCROLL_FACTOR = 1;
  const scrollContainer = document.getElementById("scroll-container");
  const svgCanvas = document.getElementById("timeline-svg");
  const spacer = document.getElementById("scroll-height-spacer");

  // Safety check if elements exist
  if (!scrollContainer || !svgCanvas || !spacer) return;

  // Calculate Total Width based on data
  const totalContentWidth =
    config.startPadding +
    timelineData.length * config.eventSpacing +
    config.endPadding;

  // Set Spacer height (controls how "long" the scroll feels)
  spacer.style.height = `${totalContentWidth * 0.1}px`;
  
  // CLS FIX: Set width immediately to prevent layout shifts later
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
  const centerY = window.innerHeight / 2;
  let mainPathD = `M 0 ${centerY}`;
  
  // Use a document fragment for batch DOM insertion (Performance)
  const fragment = document.createDocumentFragment();

  // Generate Nodes and Branches
  timelineData.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const nodeX = config.startPadding + (index + 1.1) * config.eventSpacing;

    const nodeY = isEven
      ? centerY - config.branchYOffset
      : centerY + config.branchYOffset;
    
    // 1. Create HTML Node
    const nodeEl = document.createElement("div");
    nodeEl.className = `event-node ${isEven ? "top" : "bottom"}`;
    nodeEl.style.left = `${nodeX}px`;
    nodeEl.style.top = `${centerY}px`;

    const yTransform = isEven
      ? -config.branchYOffset - 100
      : config.branchYOffset - 100;
    nodeEl.style.transform = `translate(-50%, ${yTransform}px)`;

    // Added Explicit dimensions to inner images for layout stability
    nodeEl.innerHTML = `
                    <div class="image-mask">
                        <img src="${item.img}" alt="${item.title}" class="event-image" width="400" height="300" loading="lazy">
                    </div>
                    <div class="meta-data text-center mt-4">
                        <div class="year-label">${item.year}</div>
                        <h2>${item.title}</h2>
                        <p>${item.desc}</p>
                    </div>
                `;
    fragment.appendChild(nodeEl);

    // 2. Create Branch Path in SVG
    const branchStartX = nodeX - 200;
    const branchPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    branchPath.classList.add("branch-path");

    const cp1X = branchStartX + 100;
    const cp1Y = centerY;
    const cp2X = nodeX - 50;
    const cp2Y = nodeY;

    const d = `M ${branchStartX} ${centerY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${nodeX} ${nodeY}`;
    branchPath.setAttribute("d", d);

    branchPath.dataset.triggerX = branchStartX;
    branchPath.id = `branch-${index}`;
    svgCanvas.appendChild(branchPath);
  });

  // Append all DOM nodes at once
  scrollContainer.appendChild(fragment);

  // Finish Main Path
  mainPathD += ` L ${totalContentWidth} ${centerY}`;

  const mainPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  mainPath.setAttribute("d", mainPathD);
  mainPath.id = "main-line";
  svgCanvas.insertBefore(mainPath, svgCanvas.firstChild);

  // --- 4. Init Animation Logic ---
  initAnimation(totalContentWidth, SCROLL_FACTOR, scrollContainer);
}


function initAnimation(totalContentWidth, SCROLL_FACTOR, scrollContainer) {
  // Master Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".viewport-wrapper", // Pin this wrapper
      start: "top top",
      end: () => `+=${(totalContentWidth - window.innerWidth) * SCROLL_FACTOR}`,
      pin: true,
      scrub: 1.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Update UI progress bar
        gsap.set(".progress-bar", { width: self.progress * 100 + "%" });
      },
    },
  });

  // 1. Horizontal Scroll
  tl.to(
    scrollContainer,
    {
      x: () => -(totalContentWidth - window.innerWidth),
      ease: "none",
      duration: 10,
    },
    0
  );

  // 2. Animate Main Line Drawing
  const mainLine = document.getElementById("main-line");
  const mainLength = mainLine.getTotalLength();

  gsap.set(mainLine, {
    strokeDasharray: mainLength,
    strokeDashoffset: mainLength,
  });

  tl.to(
    mainLine,
    {
      strokeDashoffset: 0,
      ease: "none",
      duration: 10,
    },
    0
  );

  // 3. Animate Branches & Nodes
  const branches = document.querySelectorAll(".branch-path");
  const nodes = document.querySelectorAll(".event-node");

  branches.forEach((branch, i) => {
    const node = nodes[i];
    const length = branch.getTotalLength();

    const startX = parseFloat(branch.dataset.triggerX);
    const startTime = (startX / totalContentWidth) * 10;

    gsap.set(branch, { strokeDasharray: length, strokeDashoffset: length });

    tl.to(
      branch,
      {
        strokeDashoffset: 0,
        ease: "power2.out",
        duration: 0.5,
      },
      startTime
    );

    tl.fromTo(
      node,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, ease: "back.out(1.7)", duration: 0.8 },
      startTime + 0.3
    );

    const img = node.querySelector(".event-image");
    tl.fromTo(
      img,
      { x: "-10%" },
      { x: "5%", ease: "none", duration: 4 }, 
      startTime - 2
    );
  });
}

// Handle Resize
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Only reload if width changed significantly (mobile vertical resize protection)
    // For now, simpler is better:
    location.reload();
  }, 250);
});

// Initialization Strategy: 
// Wait for Load (all assets) + slight delay to ensure LCP is done.
window.addEventListener('load', () => {
    // Use requestAnimationFrame to yield to browser rendering
    requestAnimationFrame(() => {
        buildAndInitTimeline();
    });

});

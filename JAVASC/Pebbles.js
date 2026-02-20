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

/*===SHOWCASE SECTION===*/

const factsData = [
  [
    // Card Index 0 (Cosmos / Physics / Math)
    {
      tag: "Astrophysics",
      title: "The Universe Sings Too!",
      shortDesc: "Evidence of an everpresent background of cosmic hum.",
      fullDesc:
        "Scientists have found evidence of an everpresent background of ultra-low frequency gravitational waves. It is a collection of weak, independent sources of gravitational waves superimposing to form an incoherent cosmic hum across the fabric of the universe.",
      img: "../Assets/astrophysics.avif",
    },
    {
      tag: "Cosmology",
      title: "Made of Star Stuff",
      shortDesc: "The essential building blocks of life were forged in stars.",
      fullDesc:
        "In the cores of stars, intense heat fuses lighter elements to form heavier ones. When massive stars explode as supernovae, they scatter these elements. Every atom of iron in your blood and calcium in your bones once existed inside an ancient star.",
      img: "../Assets/cosmology.avif",
    },
    {
      tag: "Astrochemistry",
      title: "Interstellar Amino Acid",
      shortDesc: "Tryptophan detected 1000 light-years from Earth.",
      fullDesc:
        "The amino acid tryptophan was detected in the IC348 star-forming region within the Perseus Molecular Cloud Complex. This finding suggests such chemical signatures are common in the gas and dust where planets form, which is key to discovering exoplanetary life.",
      img: "../Assets/astrochemistry.avif",
    },
    {
      tag: "Quantum Physics",
      title: "The Quantum Internet",
      shortDesc: "Entanglement could make hacking fundamentally impossible.",
      fullDesc:
        "Researchers are developing a quantum internet. In quantum communication, any attempt to intercept data changes its quantum state, instantly revealing the intrusion. If scaled globally, it could create virtually unhackable networks for global defense and banking.",
      img: "../Assets/quantum_physics.avif",
    },
    {
      tag: "Mathematics",
      title: "The Largest Prime",
      shortDesc: "A 41-million-digit mathematical behemoth discovered.",
      fullDesc:
        "The largest known prime is a Mersenne prime containing over 41 million digits, discovered through the GIMPS project. Although not directly used in encryption today, the testing methods developed through these searches strengthen cryptographic research globally.",
      img: "../Assets/mathematics.avif",
    },
  ],
  [
    // Card Index 1 (Earth / Nature / Biology)
    {
      tag: "Ecology",
      title: "The Wood Wide Web",
      shortDesc: "A secret fungal network connects entire forests.",
      fullDesc:
        "Underneath almost every forest is a vast web of fungal threads called mycorrhizal networks. Trees use this network to trade nutrients and 'talk', sending chemical distress signals to warn neighbors of impending insect attacks before they even happen.",
      img: "../Assets/ecology.avif",
    },
    {
      tag: "Biogeochemistry",
      title: "The Smell of Rain",
      shortDesc: "Why humans are exceptionally sensitive to petrichor.",
      fullDesc:
        "The distinct smell of rain, petrichor, is primarily due to geosmin, a by-product of soil bacteria. Human noses are incredibly sensitive to it, able to detect it at 0.4 parts per billion—likely an evolutionary trait our ancestors developed to locate water.",
      img: "../Assets/biogeochemistry.avif",
    },
    {
      tag: "Artificial Intelligence",
      title: "Weather AI",
      shortDesc: "Forecasting storms and heatwaves faster than ever.",
      fullDesc:
        "Researchers developed AI systems that analyze decades of climate data within minutes. These models can forecast complex weather events faster than traditional systems, vastly improving disaster preparedness and community safety worldwide.",
      img: "../Assets/artificial_intelligence.avif",
    },
    {
      tag: "Biology",
      title: "Biological Time Dilation",
      shortDesc: "Why flies seem to dodge your swatter effortlessly.",
      fullDesc:
        "Different species perceive time differently. Smaller animals with higher metabolisms that must deal with rapid environmental changes experience time much slower than humans. To a fly, your swinging hand is simply moving in slow motion.",
      img: "../Assets/biology.avif",
    },
    {
      tag: "Evolution",
      title: "Virgin Birth",
      shortDesc: "Parthenogenesis allows reproduction without fertilization.",
      fullDesc:
        "Parthenogenesis is an asexual reproduction strategy where embryos develop from unfertilised eggs, seen in komodo dragons and some sharks. While it avoids the energy costs of sexual reproduction, it risks accumulating harmful mutations over generations.",
      img: "../Assets/evolution.avif",
    },
  ],
  [
    // Card Index 2 (Human Body / Tech / Chemistry)
    {
      tag: "Chemistry",
      title: "Silicon Aromaticity",
      shortDesc: "A completely new carbon-free aromatic ring.",
      fullDesc:
        "Scientists discovered pentasilacyclopentadienide, a planar and aromatic compound where all five carbon atoms are replaced by silicon. This breakthrough equilibrium discovery may lead to entirely new classes of electronic, optical, or catalytic materials.",
      img: "../Assets/chemistry.avif",
    },
    {
      tag: "Neuroscience",
      title: "Brain Rewiring",
      shortDesc: "The human brain remains adaptable throughout life.",
      fullDesc:
        "Neuroplasticity is the brain’s incredible ability to reorganize its neural pathways. Whether learning new skills, recovering from an injury, or adapting to stress, the brain is constantly undergoing physical and structural changes.",
      img: "../Assets/neuroscience.avif",
    },
    {
      tag: "Computing",
      title: "Pocket Supercomputers",
      shortDesc: "Your phone dwarfs the Apollo 11 computers.",
      fullDesc:
        "The guidance computer used in the Apollo 11 moon landing had only about 4KB of RAM. Today's modern smartphones have millions of times more processing power, placing an astronomical technological leap right in the palm of your hand.",
      img: "../Assets/computing.avif",
    },
    {
      tag: "Acoustics",
      title: "The Sound of You",
      shortDesc: "Why we hate hearing our own recorded voices.",
      fullDesc:
        "When we speak, bone conduction in our skull amplifies the lower frequencies, making our voice sound deeper and richer to ourselves. Recordings lack this internal conduction, exposing the unfamiliar, unfiltered pitch of our voice.",
      img: "../Assets/acoustics.avif",
    },
    {
      tag: "Statistics",
      title: "Statistical Illusions",
      shortDesc: "When data trends completely reverse themselves.",
      fullDesc:
        "Simpson's Paradox occurs when a trend appears in isolated groups of data but vanishes or reverses when combined. Confining variables properly is crucial in medical studies to avoid drawing false-positive conclusions and prescribing ineffective treatments.",
      img: "../Assets/statistics.avif",
    },
  ],
];

let currentFactIndex = 0;
let rotationTimer = null;
let isRotationPaused = false;

// Updates the DOM elements of all 3 cards synchronously
function updateCards() {
  for (let i = 0; i < 3; i++) {
    const fact = factsData[i][currentFactIndex];
    const cardElement = document.getElementById(`dyn-card-${i}`);

    if (!cardElement) continue;

    const img = document.getElementById(`dyn-img-${i}`);
    const tag = document.getElementById(`dyn-tag-${i}`);
    const title = document.getElementById(`dyn-title-${i}`);
    const desc = document.getElementById(`dyn-desc-${i}`);

    // Inject new content
    img.src = fact.img;
    tag.textContent = fact.tag;
    title.textContent = fact.title;

    // Respect expanded vs short state
    desc.textContent = cardElement.classList.contains("expanded")
      ? fact.fullDesc
      : fact.shortDesc;
  }
}

// Rotates to the next fact
function rotateFacts() {
  if (isRotationPaused) return;

  const dynamicCards = document.querySelectorAll(".dynamic-card");

  // 1. Add fade-out class
  dynamicCards.forEach((card) => card.classList.add("fade-out"));

  // 2. Wait for fade out, change content, then fade back in
  setTimeout(() => {
    currentFactIndex = (currentFactIndex + 1) % 5;
    updateCards();
    dynamicCards.forEach((card) => card.classList.remove("fade-out"));
  }, 400); // matches the 0.4s CSS transition
}

function startRotation() {
  if (rotationTimer) clearInterval(rotationTimer);
  rotationTimer = setInterval(rotateFacts, 10000); // 10 seconds
}

function stopRotation() {
  if (rotationTimer) clearInterval(rotationTimer);
  rotationTimer = null;
}

// Initialize Rotation Engine
document.addEventListener("DOMContentLoaded", () => {
  // Setup initial data
  updateCards();
  startRotation();

  // Setup Click Handlers for Expand/Collapse with smooth text-fade
  const dynamicCards = document.querySelectorAll(".dynamic-card");

  dynamicCards.forEach((card, domIndex) => {
    card.addEventListener("click", function (e) {
      e.preventDefault();

      const isCurrentlyExpanded = this.classList.contains("expanded");

      // Apply a quick text fade-out before swapping the descriptions
      dynamicCards.forEach((c) => c.classList.add("text-fade-out"));

      setTimeout(() => {
        // First, collapse ALL cards and revert all texts to short description
        dynamicCards.forEach((c, idx) => {
          c.classList.remove("expanded");
          const descElement = document.getElementById(`dyn-desc-${idx}`);
          descElement.textContent = factsData[idx][currentFactIndex].shortDesc;
        });

        // Logic to expand the clicked card
        if (!isCurrentlyExpanded) {
          // Expand this specific card (now strictly within bounds)
          this.classList.add("expanded");
          const descElement = document.getElementById(`dyn-desc-${domIndex}`);
          // Swap to full description
          descElement.textContent =
            factsData[domIndex][currentFactIndex].fullDesc;

          // Pause the rotation
          isRotationPaused = true;
          stopRotation();
        } else {
          // If it was already expanded, we just collapsed it, so resume rotation
          isRotationPaused = false;
          startRotation();
        }

        // Remove the fade-out class to reveal the newly swapped text
        dynamicCards.forEach((c) => c.classList.remove("text-fade-out"));
      }, 200); // 200ms mask delay so the height jump happens while invisible
    });
  });
});

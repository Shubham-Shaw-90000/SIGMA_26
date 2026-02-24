if (window.innerWidth > 1023) {
  window.scrollTo(0, 0);
}
if (window.lenis) {
  window.lenis.scrollTo(0, { immediate: true });
}
if (window.lenis) {
  window.lenis.start();
}

// Loading Screen Animation and Transition Logic
gsap.registerPlugin(CustomEase, SplitText, ScrambleTextPlugin);

(function initLoadingScreen() {
  CustomEase.create("customEase", "0.86, 0, 0.07, 1");
  CustomEase.create("mouseEase", "0.25, 0.1, 0.25, 1");

  const loadingWrapper = document.querySelector(".loading-screen-wrapper");
  if (!loadingWrapper) return; // Exit if loading screen not present

  // =========================================================
  // First-load detection using sessionStorage & Performance API
  // =========================================================
  let shouldPlayAnimation = true;

  try {
    // Check if page was reloaded manually
    const navEntry = performance.getEntriesByType("navigation")[0];
    const isReload = navEntry
      ? navEntry.type === "reload"
      : performance.navigation.type === 1;

    if (sessionStorage.getItem("siteLoaded") && !isReload) {
      // If site was previously loaded AND this is not a manual refresh
      shouldPlayAnimation = false;
    } else {
      // First visit or manual refresh: Set the flag
      sessionStorage.setItem("siteLoaded", "true");
    }
  } catch (e) {
    // Safe fallback: If sessionStorage is blocked, default to playing animation
    console.warn(
      "SessionStorage access blocked. Playing loading animation by default.",
    );
    shouldPlayAnimation = true;
  }

  if (!shouldPlayAnimation) {
    // --- SKIP LOADING ANIMATION ---

    // Delay slightly to ensure DOM is fully ready
    requestAnimationFrame(() => {
      // 1. Immediately remove the loading screen to prevent flash
      loadingWrapper.remove();

      // 2. Ensure Hero Section is visible and scaled correctly (simulating post-animation state)
      const heroSection = document.querySelector(".college");
      if (heroSection) {
        gsap.set(heroSection, {
          opacity: 1,
          scale: 1,
          visibility: "visible",
        });
      }

      // 3. Show tap hint immediately if it exists
      const tapHint = document.getElementById("tap-hint");
      if (tapHint) {
        gsap.set(tapHint, { opacity: 1, visibility: "visible" });
      }

      // 4. Dispatch event so other scripts know loading is "done"
      window.dispatchEvent(new CustomEvent("loadingComplete"));
    });

    // Stop execution of the rest of the file
    return;
  }
  // =========================================================

  document.fonts.ready.then(() => {
    startLoadingAnimation();
  });

  function startLoadingAnimation() {
    const backgroundTextItems = document.querySelectorAll(".text-item");
    // const backgroundImages = {
    //     default: document.getElementById("default-bg"),
    //     precision: document.getElementById("focus-bg"),
    //     analysis: document.getElementById("presence-bg"),
    //     discovery: document.getElementById("feel-bg")
    // };

    // function switchBackgroundImage(id) {
    //     Object.values(backgroundImages).forEach((bg) => {
    //         gsap.to(bg, {
    //             opacity: 0,
    //             duration: 0.8,
    //             ease: "customEase"
    //         });
    //     });

    //     if (backgroundImages[id]) {
    //         gsap.to(backgroundImages[id], {
    //             opacity: 1,
    //             duration: 0.8,
    //             ease: "customEase",
    //             delay: 0.2
    //         });
    //     } else {
    //         gsap.to(backgroundImages.default, {
    //             opacity: 1,
    //             duration: 0.8,
    //             ease: "customEase",
    //             delay: 0.2
    //         });
    //     }
    // }

    const alternativeTexts = {
      precision: {
        QUANTUM: "MEASUREMENT",
        PARTICLES: "ELECTRONS",
        ATOMS: "NUCLEI",
        ENERGY: "WAVES",
        MATTER: "FORMS",
        "&": "⚛",
        SPACE: "TIME",
        EXPERIMENT: "PROCEDURE",
        DISCOVERY: "RESULTS",
        EVIDENCE: "DATA",
        THE: "OUR",
        RESEARCH: "EMPIRICAL",
        PROCESS: "METHOD",
        IS: "DEMANDS",
        REVOLUTIONARY: "EXACT",
        S: "STUDY",
        C: "CALCULATE",
        I: "INSTRUMENT",
        E: "EXAMINE",
        N: "NUMERICAL",
        "TO TRUTH": "TO FACTS",
        "OBSERVE NATURE": "MEASURE PHENOMENA",
        "VERIFY DATA": "CONFIRM RESULTS",
        "TEST HYPOTHESES": "CONDUCT TESTS",
        "CHALLENGE THEORIES": "REFINE MODELS",
        LOGIC: "MATHEMATICS",
        REASON: "COMPUTATION",
        ANALYSIS: "QUANTITATIVE",
        INNOVATION: "BREAKTHROUGH",
        KNOWLEDGE: "UNDERSTANDING",
        EVOLVE: "REFINE",
        DISCOVER: "CALCULATE",
        PRECISION: "ACCURACY",
      },
      analysis: {
        QUANTUM: "BEHAVIOR",
        PARTICLES: "INTERACTION",
        ATOMS: "STRUCTURE",
        ENERGY: "POTENTIAL",
        MATTER: "COMPOSITION",
        "&": "∞",
        SPACE: "DIMENSION",
        EXPERIMENT: "OBSERVATION",
        DISCOVERY: "INSIGHT",
        EVIDENCE: "PATTERN",
        THE: "THE",
        RESEARCH: "INVESTIGATION",
        PROCESS: "EXAMINATION",
        IS: "REVEALS",
        REVOLUTIONARY: "COMPLEX",
        S: "STUDY",
        C: "CORRELATE",
        I: "INTERPRET",
        E: "EVALUATE",
        N: "NUCLEATE",
        "TO TRUTH": "TO CAUSE",
        "OBSERVE NATURE": "STUDY SYSTEMS",
        "VERIFY DATA": "VALIDATE SETS",
        "TEST HYPOTHESES": "EXAMINE MODELS",
        "CHALLENGE THEORIES": "QUESTION LAWS",
        LOGIC: "REASON",
        REASON: "EVIDENCE",
        ANALYSIS: "SYNTHESIS",
        INNOVATION: "PARADIGM",
        KNOWLEDGE: "INSIGHT",
        EVOLVE: "PROGRESS",
        DISCOVER: "UNDERSTAND",
      },
      discovery: {
        QUANTUM: "REVOLUTION",
        PARTICLES: "PHYSICS",
        ATOMS: "THEORY",
        ENERGY: "UNIVERSE",
        MATTER: "CREATION",
        "&": "√",
        SPACE: "COSMOS",
        EXPERIMENT: "TRIAL",
        DISCOVERY: "WONDER",
        EVIDENCE: "PROOF",
        THE: "ALL",
        RESEARCH: "QUEST",
        PROCESS: "JOURNEY",
        IS: "UNLOCKS",
        REVOLUTIONARY: "TRANSFORMATIVE",
        S: "SEEK",
        C: "CREATE",
        I: "INSPIRE",
        E: "EXPLORE",
        N: "NURTURE",
        "TO TRUTH": "TO REALITY",
        "OBSERVE NATURE": "EMBRACE WONDER",
        "VERIFY DATA": "CONFIRM BELIEFS",
        "TEST HYPOTHESES": "PROVE CONCEPTS",
        "CHALLENGE THEORIES": "PIONEER IDEAS",
        LOGIC: "SYNTHESIS",
        REASON: "INTUITION",
        ANALYSIS: "REVELATION",
        INNOVATION: "EVOLUTION",
        KNOWLEDGE: "WISDOM",
        EVOLVE: "TRANSFORM",
        DISCOVER: "REVOLUTIONIZE",
        DISCOVERY: "UNDERSTANDING",
      },
    };

    backgroundTextItems.forEach((item) => {
      item.dataset.originalText = item.textContent;
      item.dataset.text = item.textContent;
      gsap.set(item, { opacity: 1 });
    });

    const typeLines = document.querySelectorAll(".type-line");
    typeLines.forEach((line, index) => {
      if (index % 2 === 0) {
        line.classList.add("odd");
      } else {
        line.classList.add("even");
      }
    });

    const oddLines = document.querySelectorAll(".type-line.odd");
    const evenLines = document.querySelectorAll(".type-line.even");
    const TYPE_LINE_OPACITY = 0.015;

    const state = {
      activeRowId: null,
      kineticAnimationActive: false,
      activeKineticAnimation: null,
      textRevealAnimation: null,
      transitionInProgress: false,
    };

    const textRows = document.querySelectorAll(".text-row");
    const splitTexts = {};

    textRows.forEach((row) => {
      const textElement = row.querySelector(".text-content");
      const rowId = row.dataset.rowId;

      splitTexts[rowId] = new SplitText(textElement, {
        type: "chars",
        charsClass: "char",
        mask: true,
        reduceWhiteSpace: false,
        propIndex: true,
      });

      textElement.style.visibility = "visible";
    });

    function updateCharacterWidths() {
      const isMobile = window.innerWidth < 1024;

      textRows.forEach((row) => {
        const rowId = row.dataset.rowId;
        const textElement = row.querySelector(".text-content");
        const computedStyle = window.getComputedStyle(textElement);
        const currentFontSize = computedStyle.fontSize;
        const chars = splitTexts[rowId].chars;

        chars.forEach((char, i) => {
          const charText =
            char.textContent ||
            (char.querySelector(".char-inner")
              ? char.querySelector(".char-inner").textContent
              : "");
          if (!charText && i === 0) return;

          let charWidth;

          if (isMobile) {
            const fontSizeValue = parseFloat(currentFontSize);
            const standardCharWidth = fontSizeValue * 0.6;
            charWidth = standardCharWidth;

            if (!char.querySelector(".char-inner") && charText) {
              char.textContent = "";
              const innerSpan = document.createElement("span");
              innerSpan.className = "char-inner";
              innerSpan.textContent = charText;
              char.appendChild(innerSpan);
              innerSpan.style.transform = "translate3d(0, 0, 0)";
            }

            char.style.width = `${charWidth}px`;
            char.style.maxWidth = `${charWidth}px`;
            char.dataset.charWidth = charWidth;
            char.dataset.hoverWidth = charWidth;
          } else {
            const tempSpan = document.createElement("span");
            tempSpan.style.position = "absolute";
            tempSpan.style.visibility = "hidden";
            tempSpan.style.fontSize = currentFontSize;
            tempSpan.style.fontFamily = "Longsile, sans-serif";
            tempSpan.textContent = charText;
            document.body.appendChild(tempSpan);

            const actualWidth = tempSpan.offsetWidth;
            document.body.removeChild(tempSpan);

            const fontSizeValue = parseFloat(currentFontSize);
            const fontSizeRatio = fontSizeValue / 160;
            const padding = 10 * fontSizeRatio;

            charWidth = Math.max(actualWidth + padding, 30 * fontSizeRatio);

            if (!char.querySelector(".char-inner") && charText) {
              char.textContent = "";
              const innerSpan = document.createElement("span");
              innerSpan.className = "char-inner";
              innerSpan.textContent = charText;
              char.appendChild(innerSpan);
              innerSpan.style.transform = "translate3d(0, 0, 0)";
            }

            char.style.width = `${charWidth}px`;
            char.style.maxWidth = `${charWidth}px`;
            char.dataset.charWidth = charWidth;

            const hoverWidth = Math.max(charWidth * 1.8, 85 * fontSizeRatio);
            char.dataset.hoverWidth = hoverWidth;
          }

          char.style.setProperty("--char-index", i);
        });
      });
    }

    updateCharacterWidths();

    textRows.forEach((row, rowIndex) => {
      const rowId = row.dataset.rowId;
      const chars = splitTexts[rowId].chars;

      gsap.set(chars, {
        opacity: 0,
        filter: "blur(15px)",
      });

      gsap.to(chars, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.09,
        ease: "customEase",
        delay: 0.15 * rowIndex,
      });
    });

    function forceResetKineticAnimation() {
      if (state.activeKineticAnimation) {
        state.activeKineticAnimation.kill();
        state.activeKineticAnimation = null;
      }

      const kineticType = document.getElementById("kinetic-type");
      gsap.killTweensOf([kineticType, typeLines, oddLines, evenLines]);

      gsap.set(kineticType, {
        display: "grid",
        scale: 1,
        rotation: 0,
        opacity: 1,
        visibility: "visible",
      });

      gsap.set(typeLines, {
        opacity: TYPE_LINE_OPACITY,
        x: "0%",
      });

      state.kineticAnimationActive = false;
    }

    function startKineticAnimation(text) {
      forceResetKineticAnimation();

      const kineticType = document.getElementById("kinetic-type");
      kineticType.style.display = "grid";
      kineticType.style.opacity = "1";
      kineticType.style.visibility = "visible";

      const repeatedText = `${text} ${text} ${text}`;

      typeLines.forEach((line) => {
        line.textContent = repeatedText;
      });

      setTimeout(() => {
        const timeline = gsap.timeline({
          onComplete: () => {
            state.kineticAnimationActive = false;
          },
        });

        timeline.to(kineticType, {
          duration: 1.4,
          ease: "customEase",
          scale: 2.7,
          rotation: -90,
        });

        timeline.to(
          oddLines,
          {
            keyframes: [
              { x: "20%", duration: 1, ease: "customEase" },
              { x: "-200%", duration: 1.5, ease: "customEase" },
            ],
            stagger: 0.08,
          },
          0,
        );

        timeline.to(
          evenLines,
          {
            keyframes: [
              { x: "-20%", duration: 1, ease: "customEase" },
              { x: "200%", duration: 1.5, ease: "customEase" },
            ],
            stagger: 0.08,
          },
          0,
        );

        timeline.to(
          typeLines,
          {
            keyframes: [
              { opacity: 1, duration: 1, ease: "customEase" },
              { opacity: 0, duration: 1.5, ease: "customEase" },
            ],
            stagger: 0.05,
          },
          0,
        );

        state.kineticAnimationActive = true;
        state.activeKineticAnimation = timeline;
      }, 20);
    }

    function transitionBetweenRows(fromRow, toRow) {
      if (state.transitionInProgress) return;

      state.transitionInProgress = true;

      const fromRowId = fromRow.dataset.rowId;
      const toRowId = toRow.dataset.rowId;

      fromRow.classList.remove("active");
      const fromChars = splitTexts[fromRowId].chars;
      const fromInners = fromRow.querySelectorAll(".char-inner");

      gsap.killTweensOf(fromChars);
      gsap.killTweensOf(fromInners);

      toRow.classList.add("active");
      state.activeRowId = toRowId;

      const toText = toRow.querySelector(".text-content").dataset.text;
      const toChars = splitTexts[toRowId].chars;
      const toInners = toRow.querySelectorAll(".char-inner");

      forceResetKineticAnimation();
      // switchBackgroundImage(toRowId);
      startKineticAnimation(toText);

      if (state.textRevealAnimation) {
        state.textRevealAnimation.kill();
      }
      state.textRevealAnimation = createTextRevealAnimation(toRowId);

      gsap.set(fromChars, {
        maxWidth: (i, target) => parseFloat(target.dataset.charWidth),
      });

      gsap.set(fromInners, {
        x: 0,
      });

      const timeline = gsap.timeline({
        onComplete: () => {
          state.transitionInProgress = false;
        },
      });

      timeline.to(
        toChars,
        {
          maxWidth: (i, target) => parseFloat(target.dataset.hoverWidth),
          duration: 0.64,
          stagger: 0.04,
          ease: "customEase",
        },
        0,
      );

      timeline.to(
        toInners,
        {
          // x: -5,
          // scale:2,
          textShadow: "0px 0px 10px #eaff94",
          color: "#f8ffde",
          duration: 0.64,
          stagger: 0.3,
          ease: "customEase",
        },
        0.05,
      );
    }

    function createTextRevealAnimation(rowId) {
      const timeline = gsap.timeline();

      timeline.to(backgroundTextItems, {
        opacity: 0.3,
        duration: 0.5,
        ease: "customEase",
      });

      timeline.call(() => {
        backgroundTextItems.forEach((item) => {
          item.classList.add("highlight");
        });
      });

      timeline.call(
        () => {
          backgroundTextItems.forEach((item) => {
            const originalText = item.dataset.text;
            if (
              alternativeTexts[rowId] &&
              alternativeTexts[rowId][originalText]
            ) {
              item.textContent = alternativeTexts[rowId][originalText];
            }
          });
        },
        null,
        "+=0.5",
      );

      timeline.call(() => {
        backgroundTextItems.forEach((item) => {
          item.classList.remove("highlight");
          item.classList.add("highlight-reverse");
        });
      });

      timeline.call(
        () => {
          backgroundTextItems.forEach((item) => {
            item.classList.remove("highlight-reverse");
          });
        },
        null,
        "+=0.5",
      );

      return timeline;
    }

    function activateRow(row) {
      const rowId = row.dataset.rowId;

      if (state.activeRowId === rowId) return;
      if (state.transitionInProgress) return;

      const activeRow = document.querySelector(".text-row.active");

      if (activeRow) {
        transitionBetweenRows(activeRow, row);
      } else {
        row.classList.add("active");
        state.activeRowId = rowId;

        const text = row.querySelector(".text-content").dataset.text;
        const chars = splitTexts[rowId].chars;
        const innerSpans = row.querySelectorAll(".char-inner");

        // switchBackgroundImage(rowId);
        startKineticAnimation(text);

        if (state.textRevealAnimation) {
          state.textRevealAnimation.kill();
        }
        state.textRevealAnimation = createTextRevealAnimation(rowId);

        const timeline = gsap.timeline();

        timeline.to(
          chars,
          {
            maxWidth: (i, target) => parseFloat(target.dataset.hoverWidth),
            duration: 0.64,
            stagger: 0.04,
            ease: "customEase",
          },
          0,
        );

        timeline.to(
          innerSpans,
          {
            // x: -5,
            textShadow: "0px 0px 10px #eaff94",
            color: "#f8ffde",
            duration: 0.64,
            stagger: 0.3,
            ease: "customEase",
          },
          0.05,
        );
      }
    }

    // Loading State
    const loadingState = {
      currentRowIndex: 0,
      isLoading: true,
      loadingProgress: 0,
      totalDuration: 120, // 15 seconds
    };

    const rowIds = ["precision", "analysis", "discovery"];
    const loadingContainer = document.querySelector(".loading-container");
    const loadingProgressBar = document.querySelector(".loading-progress");
    const loadingPercentage = document.querySelector(".loading-percentage");

    function updateLoadingBar(progress) {
      loadingProgressBar.style.width = progress + "%";
      loadingPercentage.textContent = Math.floor(progress) + "%";
    }

    function animateExpandingRectangle() {
      const rectangle = document.getElementById("expand-rectangle");
      const backgroundFrame = document.querySelector(".background-frame");
      const backgroundImages = document.querySelectorAll(".background-image");
      const textBackground = document.querySelector(".text-background");
      const mainContent = document.querySelector(
        ".main-content .sliced-container",
      );
      const kineticType = document.getElementById("kinetic-type");

      gsap.set(rectangle, {
        width: 0,
        height: 2,
      });

      const rectTimeline = gsap.timeline({
        onComplete: transitionToHero,
      });

      // First, hide all loading screen elements
      const elementsToAnimate = [
        backgroundFrame,
        textBackground,
        mainContent,
        kineticType,
      ].filter((el) => el !== null);
      if (backgroundImages.length > 0) {
        elementsToAnimate.push(...Array.from(backgroundImages));
      }

      rectTimeline.to(
        elementsToAnimate,
        {
          opacity: 0.2,
          duration: 2.5,
          ease: "power2.out",
        },
        0,
      );

      // Then expand the rectangle
      rectTimeline.to(
        rectangle,
        {
          width: window.innerWidth,
          duration: 1.5,
          ease: "power2.inOut",
        },
        "<",
      );

      rectTimeline.to(
        rectangle,
        {
          height: window.innerHeight,
          duration: 1.2,
          ease: "power2.inOut",
        },
        1.5,
      );
    }

    function transitionToHero() {
      const rectangle = document.getElementById("expand-rectangle");
      const heroSection = document.querySelector(".college");

      // Prepare hero section
      gsap.set(heroSection, {
        opacity: 1,
        scale: 10,
        visibility: "visible",
      });

      gsap.to(heroSection, {
        opacity: 1,
        duration: 1,
        scale: 1,
        visibility: "visible",
      });

      // Remove loading screen wrapper FIRST (but keep the rectangle)
      // Move rectangle to body so it doesn't get removed
      document.body.appendChild(rectangle);
      loadingWrapper.remove();

      const transitionTimeline = gsap.timeline({
        onComplete: () => {
          // console.log("OINK2")
          // Remove the white rectangle after animation
          rectangle.remove();

          // Dispatch event
          window.dispatchEvent(new CustomEvent("loadingComplete"));

          // Show tap hint
          const tapHint = document.getElementById("tap-hint");
          if (tapHint) {
            gsap.to(tapHint, {
              opacity: 1,
              visibility: "visible",
              duration: 0.8,
              delay: 0.5,
            });
          }
        },
      });

      // Fade out white rectangle while zooming in hero
      // transitionTimeline.to(rectangle, {
      //     opacity: 0,
      //     duration: 1.2,
      //     ease: "power2.inOut"
      // }, 0);

      // transitionTimeline.to(heroSection, {
      //     opacity: 1,
      //     scale: 1,
      //     duration: 1.2,
      //     ease: "power2.out"
      // });
    }

    function cycleToNextRow() {
      if (!loadingState.isLoading) return;

      const currentRow = document.querySelector(".text-row.active");
      const nextIndex = (loadingState.currentRowIndex + 1) % rowIds.length;
      const nextRow = document.querySelector(
        `.text-row[data-row-id="${rowIds[nextIndex]}"]`,
      );

      if (currentRow && currentRow !== nextRow) {
        transitionBetweenRows(currentRow, nextRow);
        loadingState.currentRowIndex = nextIndex;
      }
    }

    // Start automatic cycling
    const cycleInterval = setInterval(() => {
      cycleToNextRow();
    }, 4000);

    // Animate loading progress
    gsap.to(loadingState, {
      loadingProgress: 100,
      duration: loadingState.totalDuration / 1000,
      ease: "power1.inOut",
      onUpdate: () => {
        updateLoadingBar(loadingState.loadingProgress);
      },
      onComplete: () => {
        clearInterval(cycleInterval);
        loadingState.isLoading = false;

        gsap.to(loadingContainer, {
          opacity: 0,
          duration: 0.8,
          ease: "customEase",
        });

        animateExpandingRectangle();
      },
    });

    // Activate first row
    const firstRow = document.querySelector(
      `.text-row[data-row-id="${rowIds[0]}"]`,
    );
    if (firstRow) {
      activateRow(firstRow);
    }

    // Scramble text animation
    function scrambleRandomText() {
      const randomIndex = Math.floor(
        Math.random() * backgroundTextItems.length,
      );
      const randomItem = backgroundTextItems[randomIndex];
      const originalText = randomItem.dataset.text;

      gsap.to(randomItem, {
        duration: 1,
        scrambleText: {
          text: originalText,
          chars: "■▪▌▐▬",
          revealDelay: 0.5,
          speed: 0.3,
        },
        ease: "none",
      });

      const delay = 0.5 + Math.random() * 2;
      setTimeout(scrambleRandomText, delay * 1000);
    }

    setTimeout(scrambleRandomText, 1000);

    // Pulsing opacity animation
    backgroundTextItems.forEach((item, index) => {
      const delay = index * 0.1;
      gsap.to(item, {
        opacity: 0.85,
        duration: 2 + (index % 3),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: delay,
      });
    });
  }
})();


// Ensure GSAP plugins are registered
gsap.registerPlugin(ScrollTrigger, SplitText);

function initAnimations() {
    const heroSection = document.getElementById("hero");
    const progressUI = document.querySelector(".progress-ui");

    // Initial State: Hide the timeline progress UI
    if (progressUI) {
        gsap.set(progressUI, { opacity: 0 });
    }

    // Check if the intro '.hero' element exists in the DOM
    // The intro has class="hero" but NOT id="hero". 
    // The main section is id="hero" class="hero-interactive".
    // querySelector('.hero') might match both if we aren't careful, but standard .hero is first in DOM.
    // Let's use a more specific check or just the class that only the intro has if possible.
    // In index.html: <div class="hero">...</div> vs <section id="hero"...>
    const introElement = document.querySelector("section.hero");
    const isIntroPresent = !!introElement;

    if (!isIntroPresent) {
        // Intro is gone (maybe removed by script or not there), show main content immediately
        gsap.set(heroSection, { opacity: 1, visibility: "visible" });
        if (window.HeroAnimations) window.HeroAnimations.init();
        gsap.set(".hero-letter-segment", { y: 0, opacity: 1 });
        // reveal navbar immediately if hero is already gone
        if (window.revealNavbar) window.revealNavbar();
    } else {
        // Intro is present. Ensure main hero is hidden.
        gsap.set(heroSection, { opacity: 0, visibility: "hidden" });
        // Also ensure children are prepared (hidden) so they don't flash when parent appears
        gsap.set(".hero-letter-segment", { opacity: 0 });
    }

    // Listener for the Intro Animation Completion
    window.addEventListener('heroAway', () => {
        playHeroEntrance();
    });

    // Setup other scroll animations
    setupScrollAnimations();
    setupSplitTextAnimations();
}

function playHeroEntrance() {
    const heroSection = document.getElementById("hero");
    const segments = document.querySelectorAll(".hero-letter-segment");

    // 1. Prepare Initial States (Critical to prevent flicker)
    // Hide children and set their starting positions BEFORE showing parents
    gsap.set(segments, {
        y: 150,
        opacity: 0,
        rotateX: -45,
        scaleY: 1.2
    });

    // 2. Reveal Container (Start at opacity 0)
    gsap.set(heroSection, { visibility: "visible", opacity: 0 });

    // 3. Animate Container Fade In
    gsap.to(heroSection, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
    });

    // 4. Stagger In Letters
    gsap.to(segments, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        scaleY: 1,
        stagger: 0.3,
        duration: 1,
        ease: "expo.out",
        onComplete: () => {
            if (window.HeroAnimations) window.HeroAnimations.init();
        }
    });

    // 5. Reveal Navbar
    if (window.revealNavbar) window.revealNavbar();
}

function setupSplitTextAnimations() {
    // About Title
    const aboutTitle = new SplitText("#about .section-title", { type: "chars" });
    gsap.from(aboutTitle.chars, {
        scrollTrigger: {
            trigger: ".section-title",
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 50,
        rotateX: -90,
        stagger: 0.05,
        duration: 1,
        ease: "back.out(1.7)"
    });

    // Team Title (if exists)
    const teamTitle = new SplitText("#team .section-title", { type: "chars" });
    if (teamTitle.chars.length) {
        gsap.from(teamTitle.chars, {
            scrollTrigger: {
                trigger: "#team .section-title",
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            rotateX: -90,
            stagger: 0.05,
            duration: 1,
            ease: "back.out(1.7)"
        });
    }

      // Timeline Title (if exists)
    const timelineTitle = new SplitText("#timeline .section-title", { type: "chars" });
    if (teamTitle.chars.length) {
        gsap.from(teamTitle.chars, {
            scrollTrigger: {
                trigger: "#team .section-title",
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            rotateX: -90,
            stagger: 0.05,
            duration: 1,
            ease: "back.out(1.7)"
        });
    }

    // Paragraphs
    const paragraphs = document.querySelectorAll(".text-content p");
    paragraphs.forEach(p => {
        const split = new SplitText(p, { type: "lines" });
        gsap.from(split.lines, {
            scrollTrigger: {
                trigger: p,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 30,
            stagger: 0.1,
            duration: 1.2,
            ease: "power3.out"
        });
    });
}

function setupScrollAnimations() {
    // About Images/Frames
    const frames = document.querySelectorAll(".frame .photo");
    gsap.from(frames, {
        scrollTrigger: {
            trigger: ".frame",
            start: "top 80%",
        },
        y: 100,
        opacity: 0,
        scale: 0.9,
        stagger: 0.2,
        duration: 1.5,
        ease: "expo.out"
    });

    // === TEAM SECTION ===
    const teamCards = document.querySelectorAll(".team-card-wrapper");
    gsap.from(teamCards, {
        scrollTrigger: {
            trigger: ".team-grid",
            start: "top 85%",
        },
        y: 100,
        opacity: 0,
        rotateY: 20,
        stagger: 0.1,
        duration: 1.2,
        ease: "power4.out"
    });

    // === TIMELINE PROGRESS UI ===
    // Sync UI with the pinned timeline duration
    ScrollTrigger.create({
        trigger: ".timeline",
        start: "top top",
        endTrigger: ".site-footer", // End when we hit the footer
        end: "top bottom",
        onToggle: self => {
            const ui = document.querySelector(".progress-ui");
            if (ui) {
                gsap.to(ui, {
                    opacity: self.isActive ? 1 : 0,
                    duration: 0.5,
                    pointerEvents: self.isActive ? "all" : "none"
                });
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", initAnimations);

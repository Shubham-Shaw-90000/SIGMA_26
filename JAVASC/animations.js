 
// Ensure GSAP plugins are registered
// SplitText removed to avoid errors 
gsap.registerPlugin(ScrollTrigger);

function initAnimations() {
    const heroSection = document.getElementById("hero");
    const progressUI = document.querySelector(".progress-ui");

    // Initial State: Hide the timeline progress UI
    if (progressUI) {
        gsap.set(progressUI, { opacity: 0 });
    }

    // Check if the intro '.college' element exists in the DOM
    const introElement = document.querySelector(".college");
    const isIntroPresent = !!introElement;

    if (!isIntroPresent) {
        // Intro is gone, show main content immediately
        if (heroSection) {
            gsap.set(heroSection, { opacity: 1, visibility: "visible" });
        }
        if (window.HeroAnimations) window.HeroAnimations.init();
        
        // Wrap in existence check to avoid console warnings
        if (document.querySelector(".hero-letter-segment")) {
            gsap.set(".hero-letter-segment", { y: 0, opacity: 1 });
        }
        
        if (window.revealNavbar) window.revealNavbar();
    } else {
        // Intro is present. Ensure main hero is hidden.
        if (heroSection) {
            gsap.set(heroSection, { opacity: 0, visibility: "hidden" });
        }
        if (document.querySelector(".hero-letter-segment")) {
            gsap.set(".hero-letter-segment", { opacity: 0 });
        }
    }

    // Listener for the Intro Animation Completion
    window.addEventListener('heroAway', () => {
        playHeroEntrance();
    });

    // Setup animations
    setupScrollAnimations();
    setupTextAnimations();
    setupHoverEffects();
    
    if (window.innerWidth <= 768) {
        setupMobileHeroReveal();
    } else {
        setupHeroGridAnimations();
    }
}

function playHeroEntrance() {
    const heroSection = document.getElementById("hero");
    const segments = document.querySelectorAll(".hero-letter-segment");

    if (segments.length > 0) {
        // 1. Prepare Initial States
        gsap.set(segments, {
            y: 150,
            opacity: 0,
            rotateX: -45,
            scaleY: 1.2
        });
    }

    // 2. Reveal Container
    gsap.set(heroSection, { visibility: "visible", opacity: 0 });

    // 3. Animate Container Fade In
    gsap.to(heroSection, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
    });

    if (segments.length > 0) {
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
    } else {
        // Fallback if no segments found
        if (window.HeroAnimations) window.HeroAnimations.init();
    }

    // 5. Reveal Navbar
    if (window.revealNavbar) window.revealNavbar();
}

// Helper to split text into words (mocks SplitText)
function splitTextToWords(element) {
    if (!element) return [];
    const text = element.textContent.trim();
    if (!text) return [];
    
    // Clear content
    element.innerHTML = '';
    
    // Split into words
    const words = text.split(/\s+/).map(word => {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.textContent = word + '\u00A0'; // Add space after word
        element.appendChild(span);
        return span;
    });
    
    return words;
}

// Helper to split text into spans (mocks SplitText)
function splitTextToSpans(element) {
    if (!element) return [];
    const text = element.textContent.trim();
    if (!text) return [];
    
    // Clear content
    element.innerHTML = '';
    
    // Split into characters (including spaces as nbsp)
    const chars = text.split('').map(char => {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.textContent = char === ' ' ? '\u00A0' : char;
        element.appendChild(span);
        return span;
    });
    
    return chars;
}

function setupTextAnimations() {
    // General Section Titles (Split Text Effect)
    gsap.utils.toArray(".section-title").forEach(title => {
        const chars = splitTextToSpans(title);
        
        gsap.from(chars, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none play reverse"
            },
            y: 40,
            opacity: 0,
            rotateX: -90,
            transformPerspective: 500, // Added for 3D effect
            stagger: 0.05,
            duration: 1,
            ease: "back.out(1.7)"
        });
    });

    // Team Header Specifics
    const headerContainer = document.querySelector("#team .team-header-container");
    if (headerContainer) {
        // Animate subtitle separately
        const subtitle = headerContainer.querySelector(".section-subtitle");
        
        gsap.from(headerContainer, {
            scrollTrigger: {
                trigger: headerContainer,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });

        if (subtitle) {
            const chars = splitTextToSpans(subtitle);
            gsap.from(chars, {
                scrollTrigger: {
                    trigger: headerContainer,
                    start: "top 85%",
                },
                opacity: 0,
                y: 20,
                stagger: 0.02,
                duration: 0.8,
                ease: "power2.out",
                delay: 0.2
            });
        }
    }

    // Team Names (Split Text Effect) - Pre-split characters
    gsap.utils.toArray("#team .card-name").forEach((name) => {
        splitTextToSpans(name);
        // Individual ScrollTriggers removed, handled by card batch for better sync
    });

    // Team Roles & Descriptions
    // Individual ScrollTriggers removed, handled by card batch for better sync


    // Paragraphs (Word Stagger)
    const paragraphs = document.querySelectorAll(".text-content p");
    paragraphs.forEach(p => {
        const words = splitTextToWords(p);
        
        gsap.from(words, {
            scrollTrigger: {
                trigger: p,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 20,
            opacity: 0,
            stagger: 0.015, // Fast ripple of words
            duration: 0.6,
            ease: "power2.out"
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
        y: 80,
        opacity: 0,
        scale: 0.95,
        stagger: 0.15,
        duration: 1.4,
        ease: "expo.out"
    });

    // === TEAM SECTION ===
    // Fixed: Use Batching for better mobile/desktop sync and refresh handling
    // 1. Set initial state immediately to prevent "already visible" flash on refresh
    gsap.set(".glass-card-wrapper", { opacity: 0, y: 50 });
    gsap.set("#team .card-role, #team .card-desc, #team .card-socials a", { opacity: 0 });

    ScrollTrigger.batch(".glass-card-wrapper", {
        start: "top 90%", // Trigger slightly later for better visibility on mobile
        interval: 0.1, // Short interval between batches
        onEnter: batch => {
            batch.forEach((wrapper, i) => {
                // Main card animation
                gsap.to(wrapper, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    delay: i * 0.1, // Stagger cards within the same batch
                    onStart: () => {
                        // Trigger internal animations when card starts appearing
                        const nameChars = wrapper.querySelectorAll(".card-name span");
                        const role = wrapper.querySelector(".card-role");
                        const desc = wrapper.querySelector(".card-desc");
                        const icons = wrapper.querySelectorAll(".card-socials a");

                        if (nameChars.length) {
                            gsap.fromTo(nameChars, 
                                { y: 20, opacity: 0, scale: 1.2 },
                                { y: 0, opacity: 1, scale: 1, stagger: 0.03, duration: 0.8, ease: "back.out(1.7)" }
                            );
                        }
                        if (role) {
                            gsap.fromTo(role,
                                { x: -20, opacity: 0, filter: "blur(5px)" },
                                { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, delay: 0.2 }
                            );
                        }
                        if (desc) {
                            gsap.fromTo(desc,
                                { opacity: 0, y: 10 },
                                { opacity: 1, y: 0, duration: 0.8, delay: 0.3 }
                            );
                        }
                        if (icons.length) {
                            gsap.fromTo(icons,
                                { scale: 0, opacity: 0 },
                                { scale: 1, opacity: 1, stagger: 0.08, duration: 0.5, delay: 0.4, ease: "back.out(1.7)" }
                            );
                        }
                    }
                });
            });
        },
        once: true 
    });

    // === FOOTER SECTION ===
    const footerCols = document.querySelectorAll(".footer-col");
    if (footerCols.length > 0) {
        gsap.from(footerCols, {
            scrollTrigger: {
                trigger: ".site-footer",
                start: "top 90%",
            },
            y: 50,
            opacity: 0,
            stagger: 0.2,
            duration: 1,
            ease: "power2.out"
        });
    }

    // === TIMELINE PROGRESS UI ===
    ScrollTrigger.create({
        trigger: ".timeline",
        start: "top top",
        endTrigger: ".site-footer",
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

function setupHoverEffects() {
    // Disable hover effects on touch devices/mobile
    if (window.innerWidth <= 768) return;

    // // Modern Tilt Effect for Team Cards
    // const cards = document.querySelectorAll(".glass-card");
    
    // cards.forEach(card => {
    //     card.addEventListener("mousemove", (e) => {
    //         const rect = card.getBoundingClientRect();
    //         const x = e.clientX - rect.left;
    //         const y = e.clientY - rect.top;
            
    //         // Calculate center relative to card
    //         const centerX = rect.width / 2;
    //         const centerY = rect.height / 2;
            
    //         // Calculate rotation (limit to +/- 8 degrees)
    //         const rotateX = ((y - centerY) / centerY) * -8;
    //         const rotateY = ((x - centerX) / centerX) * 8;

    //         gsap.to(card, {
    //             rotateX: rotateX,
    //             rotateY: rotateY,
    //             transformPerspective: 1000,
    //             duration: 0.4,
    //             ease: "power2.out",
    //             overwrite: "auto"
    //         });
    //     });

    //     card.addEventListener("mouseleave", () => {
    //         gsap.to(card, {
    //             rotateX: 0,
    //             rotateY: 0,
    //             duration: 0.8,
    //             ease: "elastic.out(1, 0.5)",
    //             overwrite: "auto"
    //         });
    //     });
    // });

    // Hero Grid Items Hover Animations
    const heroItems = document.querySelectorAll(".hero-item");
    heroItems.forEach(item => {
        const char = item.querySelector(".hero-char");
        const backdrop = item.querySelector(".hero-img-backdrop");
        const card = item.querySelector(".scientist-card");
        const cardElements = card ? card.querySelectorAll(".card-header, .sc-name, .sc-achievements li") : [];

        item.addEventListener("mouseenter", () => {
            // Animate Scientist Card Sub-elements
            const cardElements = card ? card.querySelectorAll(".card-header, .sc-name, .sc-achievements li") : [];
            
            if (cardElements.length > 0) {
                gsap.fromTo(cardElements, 
                    { y: 20, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        stagger: 0.05, 
                        duration: 0.5, 
                        ease: "power2.out",
                        delay: 0.1 
                    }
                );
            }

            // Sub-element: Scale image slightly for "zoom" effect
            const img = backdrop ? backdrop.querySelector("img") : null;
            if (img) {
                gsap.to(img, { scale: 1.1, duration: 0.6, ease: "power2.out" });
            }
        });

        item.addEventListener("mouseleave", () => {
            const img = backdrop ? backdrop.querySelector("img") : null;
            if (img) {
                gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });
            }
        });
    });
}

function setupMobileHeroReveal() {
    const heroItems = document.querySelectorAll(".hero-item");
    if (heroItems.length === 0) return;

    // Set initial state for mobile items
    gsap.set(heroItems, { opacity: 1, y: 0 }); // Ensure items are visible but children are hidden by CSS

    heroItems.forEach((item, index) => {
        const char = item.querySelector(".hero-char");
        const backdrop = item.querySelector(".hero-img-backdrop");
        const card = item.querySelector(".scientist-card");
        const cardElements = card ? card.querySelectorAll(".card-header, .sc-name, .sc-achievements li") : [];

        // Create a timeline for each item
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
                // markers: true // Uncomment for debugging
            }
        });

        // 1. Reveal Character
        tl.fromTo(char, 
            { opacity: 0.2, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
        );

        // 2. Reveal Image Backdrop
        if (backdrop) {
            tl.to(backdrop, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.3");
        }

        // 3. Reveal Scientist Card & its elements
        if (card) {
            tl.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.5");

            if (cardElements.length > 0) {
                tl.fromTo(cardElements, 
                    { y: 15, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.05, duration: 0.4 },
                    "-=0.3"
                );
            }
        }
    });
}

function setupHeroGridAnimations() {
    const heroItems = document.querySelectorAll(".hero-item");
    if (heroItems.length === 0) return;

    // Set initial state for entrance
    gsap.set(heroItems, {
        opacity: 0,
        y: 50,
        rotateX: -15,
        transformPerspective: 1000
    });

    // Entrance Animation (Staggered)
    gsap.to(heroItems, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.5
    });

    // Animate the characters separately for a "floating" look
//     heroItems.forEach((item, i) => {
//         const char = item.querySelector(".hero-char");
//         if (char) {
//             gsap.to(char, {
//                 y: "15px",
//                 duration: 2 + i * 0.2,
//                 repeat: -1,
//                 yoyo: true,
//                 ease: "sine.inOut",
//                 delay: i * 0.1
//             });
//         }
//     });
}

document.addEventListener("DOMContentLoaded", initAnimations);

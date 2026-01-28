let ready = false;
let isZoomed = false;
const zoomAmount = 150;

// // Check if hero was already removed in this session
// if (sessionStorage.getItem('heroRemoved') === 'true') {
//     const hero = document.querySelector(".hero");
//     if (hero) {
//         hero.remove();
//         isZoomed = true;
//     }
// }

window.addEventListener("load", () => {
    ready = true;
    const layers = document.querySelectorAll('.layer');

    // setting layer properties
    layers.forEach(layer => {
        const z = parseFloat(layer.dataset.z);
        // Scale up images that are further back (negative z)
        const scale = 1 + (Math.abs(z) * 0.05);

        gsap.set(layer, {
            xPercent: -50,
            yPercent: -50,
            left: "50%",
            top: "50%",
            x: 0,
            y: 0,
            z: z,
            // scale: scale,
            // scale: z < 0 ? scale : 1  // Only scale layers with negative z
        });
    });

    // setting flash glow properties - placing it at center of gate
    gsap.set('#flash-img', {
        xPercent: -50,
        yPercent: -50,
        left: "50%",
        top: "50%",
        x: 0,
        y: 0,
    })

    // Mouse
    let mouse = { x: 0.5, y: 0.5 };

    document.addEventListener("mousemove", e => {
        mouse.x = e.clientX / window.innerWidth;
        mouse.y = e.clientY / window.innerHeight;
    });

    gsap.ticker.add(() => {
        if (!ready) return;


        layers.forEach(layer => {
            const z = parseFloat(layer.dataset.z);
            const depth = 1;// z / 20;

            const moveX = (mouse.x - 0.5) * 500 * depth;
            const moveY = (mouse.y - 0.5) * 500 * depth * 0.3;

            gsap.to(layer, {
                x: moveX,
                y: moveY,
                duration: 1,
                // ease:'power3.in',
                overwrite: 'auto',
            });
        });



    });

    // Disable zoom trigger until loading is complete
    let loadingComplete = !document.querySelector('.loading-screen-wrapper');

    window.addEventListener('loadingComplete', () => {
        loadingComplete = true;
    });

    window.addEventListener('mousedown', () => {
        if (!loadingComplete) return; // Don't allow zoom during loading
        // flashZoomIn()
        toggleZoom()
    })
});

// function flashZoomIn() {
//     const flashImg = document.getElementById('flash-img');
//     gsap.fromTo(flashImg, {
//         display: 'none',
//         scale:0.1,
//     },
//         {
//             display: 'block',
//             scale: 10,
//             duration:1,
//     })
// }

function toggleZoom() {
    if (isZoomed) return;
    const flashImg = document.getElementById('flash-img');
    const layers = document.querySelectorAll('.layer');
    const container = document.querySelector(".perspective-container");

    const t1 = gsap.timeline({
        defaults: { duration: 1 },
        onComplete: afterZoomIn,
    });

    // Centers the gate to the center of the screen
    t1.to(container, {
        y: isZoomed ? "0" : "-35%",
        duration: 2.5,
        ease: "expo.in"
    }, "<")



    // isZoomed = !isZoomed;
    isZoomed = true;

    // layers zooms stuff
    layers.forEach(layer => {
        const baseZ = parseFloat(layer.dataset.z);
        const targetZ = isZoomed ? baseZ + zoomAmount : baseZ;


        t1.to(layer, {
            z: targetZ,
            duration: 2.5,
            ease: "expo.in"
        }, "<");
    });

    // black image aniamtion

    // just opacity
    t1.fromTo(flashImg, {
        display: 'none',
        // scale: 0.001,
        opacity: 0,
    },
        {
            display: 'block',
            // scale: 3,
            opacity: 1,
            duration: 2,
            ease: "expo.in"
        }, "-=2.5")


    // rest of the animation of black img
    t1.fromTo(flashImg, {
        display: 'none',
        scale: 0.001,
        // roation:0,
        // opacity: 0,
    },
        {
            display: 'block',
            scale: 4,
            // opacity:1,
            // rotation:1000000,
            duration: 2.6,
            ease: "expo.in"
        }, "<")
}

function afterZoomIn() {
    // remove the drawings from DOM
    console.log("afterZoomIn");
    const hero = document.querySelector(".hero_college");

    if (hero) {

        window.scrollTo(0, 0);
        if (typeof lenis !== 'undefined') {
            lenis.scrollTo(0, { immediate: true });
        }
        // Fade out animation
        gsap.to(hero, {
            opacity: 0,
            duration: 1, // Smooth fade out revealing the content underneath
            ease: "power2.inOut",
            onComplete: () => {
                hero.remove();
                sessionStorage.setItem('heroRemoved', 'true');

                // Force scroll to top AFTER hero is removed
                window.scrollTo(0, 0);
                if (typeof lenis !== 'undefined') {
                    lenis.scrollTo(0, { immediate: true });
                }

                // Enable scroll
                if (typeof lenis !== 'undefined') {
                    lenis.start();
                }
                document.body.style.setProperty('overflow', '');

                // Dispatch event for animations.js to start the next sequence
                window.dispatchEvent(new CustomEvent('heroAway'));

                // Refresh ScrollTrigger and Lenis to account for the DOM change
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
                if (typeof lenis !== 'undefined') {
                    lenis.resize();
                }
            }
        });
    } else {
        // If hero was somehow already removed, trigger the event anyway
        window.dispatchEvent(new CustomEvent('heroAway'));
    }
}
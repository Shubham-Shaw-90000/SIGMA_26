 document.addEventListener("DOMContentLoaded", () => {
        const canvas = document.getElementById("mainCanvas");
        const letters = document.querySelectorAll(".hero-item");

        // --- OPTIMIZATION 1: Cached Rects ---
        let canvasRect = canvas
          ? canvas.getBoundingClientRect()
          : { left: 0, top: 0 };

        window.addEventListener("resize", () => {
          canvasRect = canvas.getBoundingClientRect();
        });

        // --- OPTIMIZATION 2: Single Mouse Listener for Cursor Light ---
        if (canvas) {
          let tx = 0,
            ty = 0;
          let isRendering = false;

          canvas.addEventListener("mousemove", (e) => {
            tx = e.clientX - canvasRect.left;
            ty = e.clientY - canvasRect.top;

            if (!isRendering) {
              requestAnimationFrame(() => {
                canvas.style.setProperty("--tx", `${tx}px`);
                canvas.style.setProperty("--ty", `${ty}px`);
                isRendering = false;
              });
              isRendering = true;
            }
          });
        }

        // --- OPTIMIZATION 3: Delegated & Calculated Tilt ---
        letters.forEach((letter) => {
          const themeColor = letter.style.getPropertyValue("--theme");

          letter.addEventListener("mouseenter", () => {
            if (themeColor) {
              canvas.style.setProperty("--active-glow", themeColor);
            }
          });

          letter.addEventListener("mouseleave", () => {
            canvas.style.setProperty("--active-glow", "255, 255, 255");
            letter.style.setProperty("--rx", "0deg");
            letter.style.setProperty("--ry", "0deg");
          });

          letter.addEventListener("mousemove", (e) => {
            const rect = letter.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xPct = (x / rect.width - 0.5) * 2;
            const yPct = (y / rect.height - 0.5) * 2;

            const maxRot = 15;

            letter.style.setProperty("--rx", `${-yPct * maxRot}deg`);
            letter.style.setProperty("--ry", `${xPct * maxRot}deg`);
          });
        });
      });
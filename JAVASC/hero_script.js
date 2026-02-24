document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("mainCanvas");
  const letters = document.querySelectorAll(".hero-item");

  // Detect if the primary input mechanism is touch (no hover capability)
  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  let canvasRect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0 };

  window.addEventListener("resize", () => {
    if (canvas) canvasRect = canvas.getBoundingClientRect();
  });

  // ONLY add cursor tracking if it's NOT a touch device
  if (canvas && !isTouchDevice) {
    let tx = 0, ty = 0;
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

  // ONLY add 3D tilt tracking if it's NOT a touch device
  if (!isTouchDevice) {
    letters.forEach((letter) => {
      const themeColor = letter.style.getPropertyValue("--theme");

      letter.addEventListener("mouseenter", () => {
        // FIX: Ask the browser for dimensions ONLY ONCE when the mouse enters
        letter._cachedRect = letter.getBoundingClientRect(); 
        
        if (themeColor) {
          canvas.style.setProperty("--active-glow", themeColor);
          canvas.classList.add("glow-active");
        }
      });

      letter.addEventListener("mouseleave", () => {
        // Clear the glow and rotation
        canvas.style.setProperty("--active-glow", "255, 255, 255");
        canvas.classList.remove("glow-active");
        letter.style.setProperty("--rx", "0deg");
        letter.style.setProperty("--ry", "0deg");
      });

      letter.addEventListener("mousemove", (e) => {
        // FIX: Read from the saved cache! No layout thrashing!
        const rect = letter._cachedRect; 
        if (!rect) return; // Safety check
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPct = (x / rect.width - 0.5) * 2;
        const yPct = (y / rect.height - 0.5) * 2;

        const maxRot = 12;

        letter.style.setProperty("--rx", `${-yPct * maxRot}deg`);
        letter.style.setProperty("--ry", `${xPct * maxRot}deg`);
      });
    });
  }
});

//Phone and Email Copy
document.addEventListener("DOMContentLoaded", () => {
  function copyToClipboard(value, label) {
    navigator.clipboard.writeText(value).then(() => {
      alert(label + " copied: " + value);
    });
  }

  document.querySelectorAll(".copy-phone").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      copyToClipboard(el.dataset.phone, "Phone number");
    });
  });

  document.querySelectorAll(".copy-email").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      copyToClipboard(el.dataset.email, "Email");
    });
  });
});

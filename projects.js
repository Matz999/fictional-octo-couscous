document.addEventListener("DOMContentLoaded", () => {
  const headings = Array.from(document.querySelectorAll("h1.cities"));
  let speed = 0.5; // px per frame
  let positions = headings.map((h, i) => i * 80); // space out vertically
  const containerHeight = window.innerHeight;

  function animate() {
    headings.forEach((h, i) => {
      positions[i] += speed;
      if (positions[i] > containerHeight) {
        positions[i] = -h.offsetHeight;
      }
      h.style.top = positions[i] + "px";
    });
    requestAnimationFrame(animate);
  }

  // Set position absolute for animation
  const cityDescriptions = {
    "chicago": "Chicago is known for its impressive architecture and vibrant arts scene.Chicago is known for its impressive architecture and vibrant arts scene.",
    "cartagena": "Cartagena is a beautiful port city on Colombia’s Caribbean coast.",
    "london": "London is a global city with a rich history and diverse culture.",
    "new_york": "New York is the city that never sleeps, famous for its skyline and energy.",
    "paris": "Paris is the city of lights, renowned for its art, fashion, and cuisine.",
    "buenos_aires": "Buenos Aires is Argentina’s capital, known for tango and European-style architecture.",
    "berlin": "Berlin is Germany’s capital, celebrated for its creativity and history.",
    "tokyo": "Tokyo is Japan’s bustling capital, blending tradition and technology."
  };

  headings.forEach(h => {
    h.style.position = "absolute";
    h.style.left = "50%";
    h.style.transform = "translateX(-50%)";
    h.style.whiteSpace = "nowrap";
    h.style.pointerEvents = "auto";
    h.style.zIndex = "10";
    // Add hover event for popup
    h.addEventListener("mouseenter", (e) => {
      speed = 0.08; // slow down when hovering
      const city = h.textContent.trim().replace(/\s+/g, "_").toLowerCase();
      // Image popup
      const popup = document.getElementById("city-popup");
      const img = document.getElementById("popup-img");
      img.src = `images/${city}.jpg`;
      img.alt = city;
      popup.style.display = "block";
      // Text popup
      const textPopup = document.getElementById("text-popup");
      const title = document.getElementById("popup-title");
      const desc = document.getElementById("popup-description");
      title.textContent = h.textContent.trim();
      desc.textContent = cityDescriptions[city] || "No description available.";
      textPopup.style.display = "block";
    });
    h.addEventListener("mouseleave", (e) => {
      speed = 0.5; // restore speed when not hovering
      const popup = document.getElementById("city-popup");
      popup.style.display = "none";
      const textPopup = document.getElementById("text-popup");
      textPopup.style.display = "none";
    });
  });

  animate();

  // Close button for text popup
  const closeBtn = document.getElementById("close-popup");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.getElementById("text-popup").style.display = "none";
    });
  }
});

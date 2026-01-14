document.addEventListener("DOMContentLoaded", () => {
  // Create and size canvas
  const canvas = document.createElement("canvas");
  canvas.id = "agendaCanvas";
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext("2d");

  // Timeline data
  const projects = [
    { date: "2024-01-01", title: "Project 1", description: "Description for Project 1" },
    { date: "2024-03-15", title: "Project 2", description: "Description for Project 2" },
    { date: "2024-06-10", title: "Project 3", description: "Description for Project 3" },
    { date: "2024-09-05", title: "Project 4", description: "Description for Project 4" },
    { date: "2024-12-20", title: "Project 5", description: "Description for Project 5" }
  ];

  let zoom = 1;
  let offsetX = 0;
  let dragging = false;
  let dragStartX = 0;
  let lastOffsetX = 0;

  function drawTimeline() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw horizontal line
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Draw projects
    projects.forEach((proj, i) => {
      const x = offsetX + 150 + i * 250 * zoom;
      ctx.beginPath();
      ctx.arc(x, canvas.height / 2, 30, 0, 2 * Math.PI);
      ctx.fillStyle = "#ff9500";
      ctx.fill();
      ctx.strokeStyle = "#222";
      ctx.stroke();

      ctx.fillStyle = "#222";
      ctx.font = "bold 18px Helvetica, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(proj.title, x, canvas.height / 2 - 40);
      ctx.font = "14px Helvetica, Arial, sans-serif";
      ctx.fillText(proj.date, x, canvas.height / 2 + 50);
    });
  }

  // Zoom handler
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const mouseX = e.clientX;
    const prevZoom = zoom;
    zoom *= e.deltaY < 0 ? 1.1 : 0.9;
    zoom = Math.max(0.5, Math.min(zoom, 3));
    // Keep mouse position stable while zooming
    offsetX = mouseX - ((mouseX - offsetX) * (zoom / prevZoom));
    drawTimeline();
  });

  // Drag to scroll horizontally
  canvas.addEventListener("mousedown", (e) => {
    dragging = true;
    dragStartX = e.clientX;
    lastOffsetX = offsetX;
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    offsetX = lastOffsetX + (e.clientX - dragStartX);
    drawTimeline();
  });

  window.addEventListener("mouseup", () => {
    dragging = false;
  });

  // Click handler for project selection
  canvas.addEventListener("click", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    projects.forEach((proj, i) => {
      const x = offsetX + 150 + i * 250 * zoom;
      const dist = Math.sqrt((mouseX - x) ** 2 + (mouseY - canvas.height / 2) ** 2);
      if (dist < 30) {
        alert(`${proj.title}\n${proj.date}\n\n${proj.description}`);
      }
    });
  });

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawTimeline();
  });

  drawTimeline();
});
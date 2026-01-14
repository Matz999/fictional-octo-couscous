/*TODO fix the style.css something in it makes the body appear above everything, the about.html has no 
style and it works */

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("aboutCanvas");
  const ctx = canvas.getContext("2d");

  // Initial positions for draggable lines
  let col1CenterX, col2CenterX, textCenterY;
  let textWidth = 150, textHeight = 200; // actual values
  let targetTextWidth = textWidth, targetTextHeight = textHeight; // smooth targets

  function setInitialPositions() {
    const colWidth = canvas.width / 2;
    col1CenterX = colWidth / 2;
    col2CenterX = colWidth * 1.5;
    textCenterY = canvas.height / 2;
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setInitialPositions();
    // Don't call drawGrid/drawText here, let animate() handle it
  }

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Top border lines
    ctx.moveTo(0, textCenterY - textHeight / 2);
    ctx.lineTo(canvas.width, textCenterY - textHeight / 2);
    // Bottom border lines
    ctx.moveTo(0, textCenterY + textHeight / 2);
    ctx.lineTo(canvas.width, textCenterY + textHeight / 2);
    // Vertical lines through left/right borders of text for Column 1
    ctx.moveTo(col1CenterX - textWidth / 2, 0);
    ctx.lineTo(col1CenterX - textWidth / 2, canvas.height);
    ctx.moveTo(col1CenterX + textWidth / 2, 0);
    ctx.lineTo(col1CenterX + textWidth / 2, canvas.height);
    // Vertical lines through left/right borders of text for Column 2
    ctx.moveTo(col2CenterX - textWidth / 2, 0);
    ctx.lineTo(col2CenterX - textWidth / 2, canvas.height);
    ctx.moveTo(col2CenterX + textWidth / 2, 0);
    ctx.lineTo(col2CenterX + textWidth / 2, canvas.height);
    ctx.stroke();
  }

  function drawText() {
    const fontSize = Math.max(12, Math.floor(textHeight * 0.2));
    ctx.font = `bold ${fontSize}px Helvetica, Arial, sans-serif`;
    ctx.fillStyle = "#ff0000ff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Calculate max width for each column (distance between vertical lines)
    const col1MaxWidth = textWidth;
    const col2MaxWidth = textWidth;

    // Helper to wrap text within a given width
    function wrapText(text, x, y, maxWidth, lineHeight) {
      const words = text.split(' ');
      let line = '';
      let lines = [];
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y - ((lines.length - 1) * lineHeight) / 2 + i * lineHeight);
      }
    }

    const text = "Homomorphic encryption provides many opportunities for privacy-aware processing, including with methods related";
    const lineHeight = fontSize * 1.2;

    wrapText(text, col1CenterX, textCenterY, col1MaxWidth, lineHeight);
    wrapText(text, col2CenterX, textCenterY, col2MaxWidth, lineHeight);
  }

  // Drag logic: click anywhere, mouse position sets border positions
  let dragging = false;
  let dragMode = null;

  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Determine drag mode by quadrant
    if (x < canvas.width / 2) {
      dragMode = "col1";
    } else {
      dragMode = "col2";
    }
    dragging = true;
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Use mouse position to set target width and height
    if (dragMode === "col1") {
      targetTextWidth = Math.max(40, Math.abs(x - col1CenterX) * 2);
    } else if (dragMode === "col2") {
      targetTextWidth = Math.max(40, Math.abs(x - col2CenterX) * 2);
    }
    targetTextHeight = Math.max(20, Math.abs(y - textCenterY) * 2);
  });

  window.addEventListener("mouseup", () => {
    dragging = false;
    dragMode = null;
  });

  window.addEventListener("resize", resize);
  resize();

  // Animation loop for smooth resizing
  function animate() {
    // Smoothly interpolate values
    textWidth += (targetTextWidth - textWidth) * 0.1;
    textHeight += (targetTextHeight - textHeight) * 0.1;
    drawGrid();
    drawText();
    requestAnimationFrame(animate);
  }
  animate();
});
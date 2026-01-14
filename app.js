const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = 3840;
  canvas.height = 2160;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Grid settings
const pointSpacing = 70;
let gridCols, gridRows;
let points = [];
let userInput = "";
let scrollRow = 0; // Tracks how many rows are hidden at the top
let userInputHistory = [];
let phraseHistory = [];
// Random phrases state
const phrases = [
  "DESIGN",
  "MARKETING",
  "UI/UX",
  "ANIMATION",
  "ART",
  "CULTURE",
  "BANNERS",
  "ARCHITECTURE",
  "BRANDING",
];

const initPhrase = ["We are makerStudio, a creative studio based in Berlin, Germany. We are a team of designers, developers, and artists who are passionate about creating innovative and engaging digital experiences."];
const aboutPhrase = ["Our design passion lies in championing causes, with culture being paramount. We're inspired by the vast diversity of subjects from art to science, enjoying the expansive canvas it provides for collaboration and creativity."]

let activePhrases = [];
const phraseDuration = 2000; // ms
const phraseInterval = 2500; // ms
const phraseTypeDelay = 50; // ms per letter

function loadInitPhrase() {
  if (!points.length) return;
  const phrase = initPhrase[0];
  const phraseLen = phrase.length;
  if (points.length < phraseLen) return;
  // Place at 4th row, 2nd column
  let indices = [];
  // Calculate starting index
  let startIdx = gridCols * 3 + 1; // 4th row (index 3), 2nd column (index 1)
  for (let i = 0; i < phraseLen; i++) {
    indices.push(startIdx + i);
    // If we reach end of row, move to next row's 2nd column
    if (((startIdx + i + 1) % gridCols) === 0) {
      startIdx += gridCols;
      indices[indices.length - 1] = startIdx + 1;
    }
  }
  let phraseObj = {
    indices,
    text: phrase,
    visibleCount: 0,
    timeout: null,
    typeInterval: null,
  };
  // Animate typing for initPhrase
  phraseObj.typeInterval = setInterval(() => {
    phraseObj.visibleCount++;
    if (phraseObj.visibleCount >= phraseLen) {
      clearInterval(phraseObj.typeInterval);
    }
  }, phraseTypeDelay);
  activePhrases.push(phraseObj);
}

// Each phrase is { indices: [grid indices], text: phrase, timeout: setTimeout }
function updateGrid() {
  gridCols = Math.floor(canvas.width / pointSpacing);
  gridRows = Math.floor(canvas.height / pointSpacing);
  points = [];
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      points.push({
        x: col * pointSpacing + pointSpacing / 2,
        y: row * pointSpacing + pointSpacing / 2,
      });
    }
  }
}

function drawGrid() {
  // Blue background
  ctx.fillStyle = "#008cffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "60px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < points.length; i++) {
    // Calculate row for this point
    const row = Math.floor(i / gridCols);
    const pt = points[i];
    if (row < scrollRow) {
      // For hidden rows, always draw a point
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
      continue;
    }
    // Check if a phrase letter is active at this point
    let phraseLetter = null;
    let isInitPhrase = false;
    for (const phraseObj of activePhrases) {
      const idx = phraseObj.indices.indexOf(i);
      if (idx !== -1 && phraseObj.visibleCount > idx) {
        phraseLetter = phraseObj.text[idx];
        // Check if this is the initPhrase
        if (phraseObj.text === initPhrase[0]) {
          isInitPhrase = true;
        }
        break;
      }
    }
    if (phraseLetter) {
      ctx.save();
      ctx.fillStyle = "white";
      ctx.font = isInitPhrase ? "200px helvetica" : "bold 60px helvetica";
      ctx.fillText(phraseLetter, pt.x, pt.y);
      ctx.restore();
    } else if (userInput[i]) {
      ctx.fillText(userInput[i], pt.x, pt.y);
    } else {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }
}

function animate() {
    console.log(scrollRow);
  drawGrid();
  requestAnimationFrame(animate);
}

// Random phrase logic
function showRandomPhrase() {
  if (!points.length) return;
  // Pick a random phrase
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  // Find available indices for the phrase
  const usedIndices = [
    ...activePhrases.flatMap((p) => p.indices),
    ...userInput.split("").map((_, i) => i),
  ];
  const available = points
    .map((_, i) => i)
    .filter((i) => !usedIndices.includes(i));
  if (available.length < phrase.length) return; // not enough space
  // Pick a random start index
  const startIdx =
    available[
      Math.floor(Math.random() * (available.length - phrase.length + 1))
    ];
  // Find consecutive available indices
  let indices = [];
  for (
    let i = startIdx, j = 0;
    j < phrase.length && i < points.length;
    i++
  ) {
    if (available.includes(i)) {
      indices.push(i);
      j++;
    } else {
      // If not enough consecutive, try again
      indices = [];
      break;
    }
  }
  if (indices.length !== phrase.length) return;
  // Add phrase with typing animation
  let phraseObj = {
    indices,
    text: phrase,
    visibleCount: 0,
    timeout: null,
    typeInterval: null,
  };
  // Animate typing
  phraseObj.typeInterval = setInterval(() => {
    phraseObj.visibleCount++;
    if (phraseObj.visibleCount >= phrase.length) {
      clearInterval(phraseObj.typeInterval);
      // Remove after phraseDuration
      phraseObj.timeout = setTimeout(() => {
        activePhrases = activePhrases.filter((p) => p !== phraseObj);
      }, phraseDuration);
    }
  }, phraseTypeDelay);
  activePhrases.push(phraseObj);
}

setInterval(showRandomPhrase, phraseInterval);

// Handle user input

canvas.addEventListener("wheel", (e) => { 
    // Wheel down: push content up, Wheel up: push content down
    if (e.deltaY > 0) {
                    console.log(e.deltaY)

        // Push all content up by one row
        if (gridRows > 1) {
            const rowLen = gridCols;
            // Save current state for restoration
            userInputHistory.push(userInput);
            phraseHistory.push(JSON.parse(JSON.stringify(activePhrases)));
            userInput = userInput.slice(rowLen);
            activePhrases.forEach(phraseObj => {
                phraseObj.indices = phraseObj.indices.map(idx => idx - rowLen);
            });
            activePhrases = activePhrases.filter(phraseObj => phraseObj.indices.every(idx => idx >= 0));
            // If scrolled to 40th row, show aboutPhrase
            if (scrollRow < 7) scrollRow++;
            if (scrollRow === 7) {
              // Add aboutPhrase at 40th row, 2nd column
              const phrase = aboutPhrase[0];
              const phraseLen = phrase.length;
              if (points.length >= gridCols * 6 + 1 + phraseLen) {
                let indices = [];
                let startIdx = gridCols * 6 + 1;
                for (let i = 0; i < phraseLen; i++) {
                  indices.push(startIdx + i);
                  if (((startIdx + i + 1) % gridCols) === 0) {
                    startIdx += gridCols;
                    indices[indices.length - 1] = startIdx + 1;
                  }
                }
                let phraseObj = {
                    
                  indices,
                  text: phrase,
                  visibleCount: phraseLen,
                  timeout: null,
                  typeInterval: null,
                };
                activePhrases.push(phraseObj);
              }
            }
            // Do NOT remove aboutPhrase when scrolling past 40th row
        }
    } else if (e.deltaY < 0) {
        // Restore previous grid state if available
        if (userInputHistory.length > 0 && phraseHistory.length > 0) {
            userInput = userInputHistory.pop();
            activePhrases = phraseHistory.pop();
            if (scrollRow > 0) scrollRow--;
            // Do NOT remove aboutPhrase when scrolling above 40th row
        }
    }
    // Prevent default scroll behavior
    e.preventDefault();
});
window.addEventListener("keydown", (e) => {
  if (e.key.length === 1) {
    userInput += e.key;
  } else if (e.key === "Backspace") {
    userInput = userInput.slice(0, -1);
  }
});

// Recalculate grid on resize
function onResize() {
  resizeCanvas();
  updateGrid();
  // Clear phrases and reload initPhrase
  activePhrases = [];
  loadInitPhrase();
}
window.addEventListener("resize", onResize);
resizeCanvas();
updateGrid();
loadInitPhrase();
animate();

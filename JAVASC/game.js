const SCIENTISTS = [
  { id: 1, name: "Einstein", img: "../Assets/einstein.png", text: "Theory of Relativity" },
  { id: 2, name: "Newton", img: "../Assets/newton.png", text: "Laws of Motion" },
  { id: 3, name: "Curie", img: "../Assets/curie.png", text: "Radioactivity Pioneer" },
  { id: 4, name: "Tesla", img: "../Assets/tesla.png", text: "AC Electricity" },
  { id: 5, name: "Galileo", img: "../Assets/galileo.png", text: "Father of Astronomy" },
  { id: 6, name: "Darwin", img: "../Assets/darwin.png", text: "Evolution by Natural Selection" },
  { id: 7, name: "Hawking", img: "../Assets/hawking.png", text: "Black Hole Radiation" },
  { id: 8, name: "Babbage", img: "../Assets/babbage.png", text: "Father of Computer" },
  { id: 9, name: "Faraday", img: "../Assets/faraday.png", text: "Electromagnetic Induction" },
  { id:10, name: "Raman", img: "../Assets/raman.png", text: "Raman Effect" },
  { id:11, name: "Bohr", img: "../Assets/bohr.png", text: "Atomic Model" },
  { id:12, name: "Fermi", img: "../Assets/fermi.png", text: "Nuclear Reactor" },
  { id:13, name: "Kepler", img: "../Assets/kepler.png", text: "Planetary Laws" },
  { id:14, name: "Planck", img: "../Assets/planck.png", text: "Quantum Theory" },
  { id:15, name: "Pasteur", img: "../Assets/pasteur.png", text: "Germ Theory" },
  { id:16, name: "Edison", img: "../Assets/edison.png", text: "Practical Light Bulb" }
];

const board = document.getElementById("gameBoard");
const scoreEl = document.getElementById("score");
const statusEl = document.getElementById("status");
const timerEl = document.getElementById("timer");
const controlBtn = document.getElementById("controlBtn");

let firstCard = null;
let lock = false;
let score = 0;
let matched = 0;

/* ===== Timer variables ===== */
let timerInterval = null;
let timeLeft = 180; // seconds (3 minutes)

/* ===== WebAudio for sound effects (no external assets) ===== */
let audioCtx = null;
function ensureAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playTone(freq = 440, duration = 0.08, type = 'sine', gain = 0.12) {
  ensureAudioCtx();
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g);
  g.connect(audioCtx.destination);
  const now = audioCtx.currentTime;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + 0.01);
  o.start(now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  o.stop(now + duration + 0.02);
}
function playSound(name) {
  // simple mapping of named events to short tones
  switch (name) {
    case 'flip': playTone(880, 0.06, 'sine', 0.06); break;
    case 'match':
      playTone(880, 0.08, 'sine', 0.07);
      setTimeout(()=> playTone(1320, 0.09, 'sine', 0.06), 80);
      break;
    case 'wrong': playTone(220, 0.16, 'sawtooth', 0.12); break;
    case 'end':
      playTone(660, 0.08, 'sine', 0.08);
      setTimeout(()=> playTone(880, 0.12, 'sine', 0.09), 90);
      setTimeout(()=> playTone(1100, 0.14, 'sine', 0.12), 210);
      break;
    default: break;
  }
}

/* ===== Timer functions ===== */
function formatTime(sec) {
  const m = Math.floor(sec/60).toString().padStart(2,'0');
  const s = (sec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}
function updateTimerDisplay() {
  // create a small span that uses gradient text
  timerEl.innerHTML = `<span class="timeText">${formatTime(timeLeft)}</span>`;
}
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}
function startTimer() {
  stopTimer();
  timeLeft = 180;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      onTimerExpired();
    }
  }, 1000);
}

/* ===== ORIGINAL GAME LOGIC (preserved) ===== */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function startGame() {
  board.innerHTML = "";
  score = 0;
  matched = 0;
  scoreEl.textContent = score;
  controlBtn.style.display = "none";
  controlBtn.setAttribute('aria-hidden', 'true');
  statusEl.textContent = "";
  firstCard = null;
  lock = false;

  const selected = shuffle([...SCIENTISTS]).slice(0, 8);
  let cards = [];

  selected.forEach(s => {
    cards.push({ type: "img", ...s });
    cards.push({ type: "text", ...s });
  });

  shuffle(cards);

  cards.forEach(c => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.pair = c.id;

    card.innerHTML = `
      <div class="card-face card-front">🧪</div>
      <div class="card-face card-back">
        ${
          c.type === "img"
          ? `<img height="100%" src="images/${c.img}">`
          : `<div class="card-text">${c.text}</div>`
        }
      </div>
    `;

    card.onclick = () => flip(card);
    board.appendChild(card);
  });

  // restore pointer events (in case they were disabled on time up)
  board.style.pointerEvents = 'auto';
  // start/reset timer on game start
  startTimer();
}

function flip(card) {
  // if timer expired we should block further flips
  if (lock || card === firstCard || card.classList.contains("correct") || timeLeft <= 0) return;

  // play flip sound
  playSound('flip');

  card.classList.add("flip");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  lock = true;

  if (firstCard.dataset.pair === card.dataset.pair) {
    // ✅ MATCH
    score += 10;
    scoreEl.textContent = score;

    firstCard.classList.add("correct");
    card.classList.add("correct");

    matched++;
    // match sound
    playSound('match');

    reset();

    if (matched === 8) {
      // game complete before timer ends
      stopTimer();
      controlBtn.style.display = "inline-block";
      controlBtn.textContent = "Play Again";
      controlBtn.setAttribute('aria-hidden', 'false');
      statusEl.textContent = `All pairs found! Final score: ${score}`;
      playSound('end');
    }

  } else {
    // ❌ WRONG
    firstCard.classList.add("wrong");
    card.classList.add("wrong");

    // wrong sound
    playSound('wrong');

    setTimeout(() => {
      firstCard.classList.add("shake");
      card.classList.add("shake");
    }, 200);

    setTimeout(() => {
      // restore original class names but keep feedback classes removed implicitly
      firstCard.className = "card";
      card.className = "card";
      reset();
    }, 900);
  }
}

function reset() {
  [firstCard, lock] = [null, false];
}

function restartGame() {
  // stop timers and audio contexts where necessary, then start fresh
  stopTimer();
  startGame();
}

/* ===== Timer expiry handler ===== */
function onTimerExpired() {
  // Block board interactions
  board.style.pointerEvents = 'none';
  // ensure no further flips
  lock = true;

  statusEl.textContent = `Time's up! Your score: ${score}`;
  // show a single control button to let user start fresh
  controlBtn.style.display = "inline-block";
  controlBtn.textContent = "Restart";
  controlBtn.setAttribute('aria-hidden', 'false');

  // play end sound
  playSound('end');
}

/* ===== Hook up control button ===== */
controlBtn.onclick = function () {
  // Clicking the control button restarts the game
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(()=>{});
  }
  restartGame();
};

/* ===== Init ===== */
startGame();

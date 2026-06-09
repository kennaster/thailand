/*
 * ============================================================
 *  Thailand Countdown — app.js
 * ============================================================
 *
 *  HOW TO ADD PHOTOS
 *  -----------------
 *  1. Drop the image file into the /photos/ folder.
 *  2. Add an entry to the PHOTOS array below:
 *
 *       { src: "photos/your-photo.jpg", caption: "Your caption" }
 *
 *     Leave caption as "" if you don't want text under the photo.
 *
 *  3. git add photos/your-photo.jpg app.js
 *     git commit -m "Add photo: description"
 *     git push
 *
 *  GitHub Pages auto-deploys within 1–2 minutes.
 * ============================================================
 */

// ── Departure Date ────────────────────────────────────────────
// Change this to update the countdown target.

const DEPARTURE_DATE = new Date("2026-09-14T13:00:00");

// ── Photos ────────────────────────────────────────────────────
// Add your photos here. See instructions at the top of this file.

const PHOTOS = [
  { src: "photos/IMG_7731.jpg", caption: "Singha o'clock 🍺" },
  { src: "photos/IMG_420.JPG", caption: "Orange Juice o'clock" },
  { src: "photos/IMG_7401.jpg", caption: "Painting in the Freedom Sand" },
  { src: "photos/IMG_7403.jpg", caption: "My Babydoll" },
  { src: "photos/IMG_7459.jpg", caption: "Sleepy Girl" },
  { src: "photos/IMG_7572.jpg", caption: "สวยมาก" },
  { src: "photos/IMG_7616.jpg", caption: "My baby coconut <3" },
  { src: "photos/IMG_7622.jpg", caption: "So hot baby!" },
];

// ── Collage Configuration ─────────────────────────────────────

const SLOTS_PER_LAYER        = 12;   // slots per layer on desktop
const SLOTS_PER_LAYER_MOBILE = 6;    // slots per layer on mobile (≤ 600px)
const POLAROID_WIDTH         = 200;  // px — matches CSS .polaroid width
const ROW_HEIGHT             = 210;  // px — vertical spacing between rows
const LAYER_OFFSET_X         = 15;   // px — each new layer shifts this far right
const LAYER_OFFSET_Y         = 10;   // px — each new layer shifts this far down

// ── Translations ──────────────────────────────────────────────
// To add a new language: duplicate one of these objects, translate the values,
// and wire up a button. dateLocale controls how the departure date is formatted.

const STRINGS = {
  en: {
    heroPrefix:     '',
    heroSuffix:     ' days until Thailand',
    subtitlePrefix: 'Departing ',
    labelDays:      'Days',
    labelHours:     'Hours',
    labelMinutes:   'Minutes',
    labelSeconds:   'Seconds',
    arrived:        "You're in Thailand! 🇹🇭",
    collageHeading: 'Every photo is a day closer to you, Yuri 🌸',
    placeholder:    'Photos coming soon — check back after the next trip 📷',
    toggleBtn:      'ภาษาไทย',
    dateLocale:     'en-GB',
  },
  th: {
    heroPrefix:     'อีก ',
    heroSuffix:     ' วัน ก็จะถึงไทยแล้ว',
    subtitlePrefix: 'วันเดินทาง ',
    labelDays:      'วัน',
    labelHours:     'ชั่วโมง',
    labelMinutes:   'นาที',
    labelSeconds:   'วินาที',
    arrived:        'มาถึงไทยแล้ว! 🇹🇭',
    collageHeading: 'ทุกรูปคือวันที่ใกล้เธอมากขึ้น ยูริ 🌸',
    placeholder:    'รูปภาพกำลังจะมา — แวะมาดูหลังทริปหน้านะ 📷',
    toggleBtn:      'English',
    dateLocale:     'th-TH-u-ca-gregory',  // Gregorian calendar, Thai month names
  },
};

let currentLang = 'en';

// ── DOM References ────────────────────────────────────────────

const departureEl   = document.getElementById('departure-display');
const daysHeadEl    = document.getElementById('days-display');
const daysEl        = document.getElementById('days');
const hoursEl       = document.getElementById('hours');
const minutesEl     = document.getElementById('minutes');
const secondsEl     = document.getElementById('seconds');
const countdownGrid = document.getElementById('countdown-grid');
const arrivedEl     = document.getElementById('arrived-message');
const langToggleBtn = document.getElementById('lang-toggle');

// Show departure date immediately in English so there's no blank flash
// before the load event fires. setLanguage() re-formats it for Thai.
if (departureEl) {
  departureEl.textContent = DEPARTURE_DATE.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

// ── Language Toggle ───────────────────────────────────────────

function setLanguage(lang) {
  const s = STRINGS[lang] || STRINGS.en;
  currentLang = lang;

  // Flip html[lang] — CSS uses this attribute to apply Sarabun for Thai.
  document.documentElement.lang = lang;

  // Swap every element that carries a data-i18n key.
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (key in s) el.textContent = s[key];
  });

  // Re-format the departure date in the correct locale.
  if (departureEl) {
    departureEl.textContent = DEPARTURE_DATE.toLocaleDateString(s.dateLocale, {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  // If the collage placeholder is already rendered, retranslate it.
  const placeholder = document.querySelector('.collage-placeholder');
  if (placeholder) placeholder.textContent = s.placeholder;

  localStorage.setItem('lang', lang);
}

if (langToggleBtn) {
  langToggleBtn.addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'th' : 'en');
  });
}

// ── Countdown ────────────────────────────────────────────────

function pad(n) {
  return String(Math.floor(n)).padStart(2, '0');
}

// Restart a CSS animation by forcing a reflow.
function triggerPulse(el) {
  el.classList.remove('tick');
  void el.offsetWidth;
  el.classList.add('tick');
}

function tick() {
  const diff = DEPARTURE_DATE.getTime() - Date.now();

  if (diff <= 0) {
    countdownGrid.style.display = 'none';
    arrivedEl.classList.add('visible');
    if (daysHeadEl) daysHeadEl.textContent = '0';
    clearInterval(countdownTimer);
    return;
  }

  const totalSec = Math.floor(diff / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  if (daysHeadEl) daysHeadEl.textContent = d;

  daysEl.textContent    = pad(d);
  hoursEl.textContent   = pad(h);
  minutesEl.textContent = pad(m);
  secondsEl.textContent = pad(s);

  triggerPulse(secondsEl);
  if (s === 59)                           triggerPulse(minutesEl);
  if (s === 59 && m === 59)               triggerPulse(hoursEl);
  if (s === 59 && m === 59 && h === 23)   triggerPulse(daysEl);
}

tick();
const countdownTimer = setInterval(tick, 1000);

// ── Collage Wall ──────────────────────────────────────────────

const collageWall = document.getElementById('collage-wall');

function isMobile() {
  return window.matchMedia('(max-width: 600px)').matches;
}

// Deterministic pseudo-random [0, 1) from an integer seed.
// Uses Math.sin so it's consistent across browsers/runs.
function seededRand(seed) {
  const x = Math.sin(seed + 42.7) * 10000;
  return x - Math.floor(x);
}

/**
 * Compute the absolute position and rotation for one Polaroid slot.
 *
 * @param {number} slotIndex   0-based index within the layer
 * @param {number} layerIndex  0-based layer number (layer 0 = bottom)
 * @param {number} cols        number of grid columns
 * @param {number} cellW       pixel width of one grid cell
 * @returns {{ x: number, y: number, rot: number }}
 */
function slotPosition(slotIndex, layerIndex, cols, cellW) {
  const col = slotIndex % cols;
  const row = Math.floor(slotIndex / cols);

  const seed = layerIndex * 200 + slotIndex;

  const baseX = col * cellW + (cellW - POLAROID_WIDTH) / 2;
  const baseY = row * ROW_HEIGHT + 8;

  // Jitter keeps cards feeling hand-placed rather than grid-locked.
  const jx  = seededRand(seed)     * 24 - 12;   // ±12 px
  const jy  = seededRand(seed + 1) * 18 - 9;    // ±9 px
  const rot = seededRand(seed + 2) * 16 - 8;    // ±8°

  // Each additional layer sits slightly up and to the right, like
  // a new batch of photos laid on top of the existing stack.
  return {
    x:   Math.max(0, baseX + jx + layerIndex * LAYER_OFFSET_X),
    y:   Math.max(0, baseY + jy + layerIndex * LAYER_OFFSET_Y),
    rot: rot,
  };
}

function createPolaroid(photo, pos, zIndex, dimmed) {
  const card = document.createElement('div');
  card.className     = 'polaroid';
  card.style.left    = `${pos.x}px`;
  card.style.top     = `${pos.y}px`;
  card.style.transform = `rotate(${pos.rot.toFixed(2)}deg)`;
  card.style.zIndex  = zIndex;

  if (dimmed) {
    card.style.opacity   = '0.84';
    card.style.filter    = 'brightness(0.91)';
  }

  card.addEventListener('mouseenter', () => {
    card.style.transform = `translateY(-4px) rotate(${pos.rot.toFixed(2)}deg) scale(1.04)`;
    card.style.zIndex    = 9999;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = `rotate(${pos.rot.toFixed(2)}deg)`;
    card.style.zIndex    = zIndex;
  });

  const img = document.createElement('img');
  img.src     = photo.src;
  img.alt     = photo.caption || 'Thailand trip photo';
  img.loading = 'lazy';

  const caption = document.createElement('div');
  caption.className   = 'caption';
  caption.textContent = photo.caption || '';

  card.appendChild(img);
  card.appendChild(caption);
  return card;
}

function buildCollage() {
  if (!collageWall) return;
  collageWall.innerHTML = '';

  if (PHOTOS.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.className   = 'collage-placeholder';
    placeholder.textContent = STRINGS[currentLang].placeholder;
    collageWall.appendChild(placeholder);
    return;
  }

  const mobile        = isMobile();
  const slotsPerLayer = mobile ? SLOTS_PER_LAYER_MOBILE : SLOTS_PER_LAYER;
  const cols          = mobile ? 2 : 4;

  const wallPad    = parseFloat(getComputedStyle(collageWall).paddingLeft) || 20;
  const usableW    = Math.max(300, (collageWall.clientWidth || 640) - wallPad * 2);
  const cellW      = usableW / cols;

  const totalLayers = Math.ceil(PHOTOS.length / slotsPerLayer);
  const maxRows     = Math.ceil(slotsPerLayer / cols);

  // Size the wall tall enough to contain all rows plus layer stacking offsets.
  const neededH = maxRows * ROW_HEIGHT
    + (totalLayers - 1) * LAYER_OFFSET_Y
    + 200   // extra room for polaroid height + bottom padding
    + wallPad;
  collageWall.style.minHeight = `${neededH}px`;

  PHOTOS.forEach((photo, i) => {
    const layerIndex = Math.floor(i / slotsPerLayer);
    const slotIndex  = i % slotsPerLayer;
    const isTopLayer = layerIndex === totalLayers - 1;

    const pos      = slotPosition(slotIndex, layerIndex, cols, cellW);
    const zIndex   = layerIndex * slotsPerLayer + slotIndex + 1;
    const polaroid = createPolaroid(photo, pos, zIndex, !isTopLayer);

    collageWall.appendChild(polaroid);
  });

  console.log(
    `Collage: ${PHOTOS.length} photo(s) across ${totalLayers} layer(s), `
    + `${slotsPerLayer} slots/layer, ${cols} cols`
  );
}

// Debounced resize rebuild so it doesn't thrash on window drag.
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildCollage, 180);
});

window.addEventListener('load', () => {
  const savedLang = localStorage.getItem('lang') || 'en';
  setLanguage(savedLang);
  buildCollage();
});

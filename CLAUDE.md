# Thailand Countdown — GitHub Pages Project

## Project Overview

A single-page GitHub Pages site that counts down to the next Thailand trip. The page features a live countdown timer, a Thai-themed aesthetic, and an informal photo collage wall that stacks photos in "layers" once the first layer fills up. No build tools, no frameworks — pure HTML, CSS, and vanilla JavaScript so GitHub Pages can serve it directly.

---

## File Structure

```
/
├── index.html          # Main page (everything lives here or is linked from here)
├── style.css           # All styles
├── app.js              # Countdown logic + collage engine
├── photos/             # Drop uploaded photos here
│   └── .gitkeep
└── CLAUDE.md           # This file
```

---

## Design Direction

**Theme**: Warm, sun-bleached tropical — like a well-loved travel journal left in the sun. Not corporate, not generic. Think faded Thai tourism posters, temple gold, tuk-tuk red, humid green jungle.

**Palette** (use as CSS variables):
```css
--thai-red:    #A51C30;
--thai-blue:   #2D4B8E;
--gold:        #F0B429;
--cream:       #FDF6E3;
--warm-shadow: rgba(165, 28, 48, 0.15);
--ink:         #1A1208;
```

**Typography**:
- Display/headline: `Kanit` (Google Fonts) — Thai-adjacent Latin script, bold weight
- Body/countdown digits: `Space Mono` — monospaced for ticking timer feel
- Do NOT use Inter, Roboto, or Arial

**Mood**: Slightly worn, textured, layered — like photos pinned to a corkboard. Not flat. Not minimal. Living, breathing, human.

---

## Page Sections

### 1. Header / Hero

- Large centered title: **"X days until Thailand"** — where X is dynamically calculated
- Thai flag rendered in CSS (no image dependency): two horizontal red bands, one wide blue band in the center
- Subtle animated shimmer on the gold accents
- A secondary line in smaller type: full target date, e.g. "Departing 14 March 2026"

**Countdown configuration** — editable constant at the top of `app.js`:
```js
const DEPARTURE_DATE = new Date("2026-09-14T13:00:00"); // ← Change this date
```

### 2. Countdown Timer

- Displays: **Days · Hours · Minutes · Seconds** in large `Space Mono` digits
- Each unit in its own card with a label beneath
- Cards have a slight drop shadow and cream background
- Ticks in real time (setInterval, 1000ms)
- When countdown reaches zero, replace timer with: **"You're in Thailand! 🇹🇭"** in a celebratory animation

### 3. Photo Collage Wall

This is the centrepiece feature. See full spec below.

---

## Collage Wall — Detailed Spec

### Concept

Photos are displayed as slightly rotated, overlapping Polaroid-style cards pinned to a corkboard-textured background. The wall fills layer by layer:

- **Layer 1**: Photos are placed across the full width of the wall area in a packed, informal grid (variable sizes, slight rotations ±8°, small random offsets).
- **Layer 2**: Once Layer 1 is "full" (all slots taken), new photos begin appearing on top, slightly offset and rotated differently — as if physically stacked on the board.
- Continue for as many layers as needed. Older layers show through at edges.

### Photo Card Style

Each photo renders as a Polaroid:
```
┌─────────────────┐
│                 │  ← 8px white border
│   [photo here]  │
│                 │
│                 │
│  caption text   │  ← optional, small handwriting-style font
└─────────────────┘
```
- White border: ~10px on sides and top, ~30px on bottom (classic Polaroid)
- Slight drop shadow: `box-shadow: 3px 5px 12px rgba(0,0,0,0.25)`
- Random rotation: between -8deg and +8deg per card
- Font for captions: `Caveat` (Google Fonts) — casual handwriting style

### Adding Photos

**Method: Edit a JS array in `app.js`**

Keep it dead simple. No backend, no drag-and-drop uploads (GitHub Pages is static). Instructions for Adam:

1. Drop the image file into the `/photos/` folder
2. Add an entry to the `PHOTOS` array in `app.js`:

```js
const PHOTOS = [
  { src: "photos/beach-2024.jpg", caption: "Koh Lanta, Jan 2024" },
  { src: "photos/temple.jpg",     caption: "" },
  // Add more here ↑
];
```

3. Commit and push — the photo appears on the site within minutes.

Document this workflow clearly in a comment block at the top of `app.js`.

### Layer Logic

- Define a `SLOTS_PER_LAYER` constant (default: 12). This is the number of Polaroid positions per layer.
- Pre-generate slot positions for each layer using a seeded layout algorithm (or just hardcode a pleasing grid of 12 positions with jitter).
- Layer N+1 positions should be offset from Layer N positions (e.g., +15px X, +10px Y, with different base rotations) to create visible stacking.
- Apply a slight CSS `brightness` or `opacity` reduction to lower layers so the top layer reads clearly.
- Each layer should be a `<div class="collage-layer">` with `position: relative` children.

### Collage Wall Container

- Full-width section below the countdown
- Background: corkboard texture (CSS-only using a warm tan `#C8A97A` with a subtle noise pattern via SVG filter or CSS `background-image` with a repeating dot/grain pattern)
- Section heading: **"Meanwhile, collecting memories..."** in `Kanit`, gold color
- Padding: generous — this section should feel like a real pinboard, not a grid

---

## Responsive Behavior

- Mobile: Countdown cards stack 2×2. Collage wall uses fewer slots per layer (6 instead of 12), smaller Polaroid sizes.
- Tablet/Desktop: Full layout as described.
- Use CSS custom properties and clamp() for fluid font sizing.

---

## Animations & Polish

- Page load: staggered fade-in of header → countdown → collage (CSS animation-delay)
- Countdown digits: subtle scale pulse on each second tick (CSS keyframe, 50ms scale to 1.05 then back)
- Polaroid hover: slight lift (`transform: translateY(-4px) rotate(Xdeg) scale(1.04)`, transition 200ms)
- Thai flag: the blue center stripe has a slow, subtle shimmer animation

---

## No Dependencies (except Google Fonts)

- Zero npm, zero bundlers, zero frameworks
- Google Fonts via `<link>` in `<head>`: Kanit (700, 400), Space Mono (400), Caveat (400)
- All logic in vanilla JS ES6+ (const/let, template literals, arrow functions are fine)
- CSS: plain CSS with custom properties. No Sass, no Tailwind.

---

## GitHub Pages Deployment Instructions

Follow these steps to get the site live at `https://<your-username>.github.io/<repo-name>/`:

### Step 1 — Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in.
2. Click **"New repository"** (the **+** icon, top right → "New repository").
3. Name it something like `thailand-countdown`.
4. Set visibility to **Public** (required for free GitHub Pages).
5. Click **"Create repository"** — do NOT initialize with a README (you'll push your own files).

### Step 2 — Push Your Files

In your local project folder (terminal / Git Bash):

```bash
git init
git add .
git commit -m "Initial Thailand countdown site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/thailand-countdown.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3 — Enable GitHub Pages

1. In your repo on GitHub, go to **Settings** → **Pages** (left sidebar).
2. Under **"Branch"**, select `main` and folder `/ (root)`.
3. Click **Save**.
4. Wait ~60 seconds, then visit: `https://YOUR_USERNAME.github.io/thailand-countdown/`

### Step 4 — Adding Photos Later

```bash
# Copy your photo into the /photos folder, then:
git add photos/your-photo.jpg
# Edit PHOTOS array in app.js
git add app.js
git commit -m "Add photo: Chiang Mai night market"
git push
```

GitHub Pages auto-deploys on every push. Changes go live within 1–2 minutes.

### Step 5 — Updating the Departure Date

Open `app.js`, find the line:
```js
const DEPARTURE_DATE = new Date("2026-03-14T00:00:00");
```
Change the date, commit, push. Done.

---

## Implementation Notes for Claude Code

- Start with `index.html` skeleton, then `style.css`, then `app.js`.
- Implement the countdown first — validate it works before building the collage.
- The collage wall should work correctly even with 0 photos (show a friendly placeholder: "Photos coming soon — check back after the next trip 📷").
- Use `console.log` statements during development to track layer assignment logic.
- Validate the Thai flag CSS renders correctly in both Chrome and Firefox (use `display: flex` column layout for the three stripes, proportions: 2:3:2 red:blue:red by height).
- The whole site should pass a basic accessibility check: meaningful `alt` text on photos (use caption if provided, else "Thailand trip photo"), sufficient color contrast on countdown text.
- Comment the code well — Adam will maintain this himself.
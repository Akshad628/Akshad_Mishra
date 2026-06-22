# Wandel Reality — UI Kit & Build Template

A reusable specification for building scroll-driven, glassmorphism + skeuomorphism
single-page experiences with a "puzzle / spatial / cinematic" feel.

> Use this document as the brief whenever you spin up a project that should
> feel like Wandel Reality — XR studios, immersive product launches, design
> portfolios, exhibition microsites, art-forward marketing pages, etc.

---

## 0 · Look & Feel — One paragraph

White canvas with a **strong radial vignette to near-black** at the edges. A
subtle pixel-grain overlay mixed multiplicatively to age the surface.
Typography pairs a **distinctive serif-leaning display** (Clash Display) with
a **light geometric sans body** (Outfit) and a **mono accent** for overlines
(JetBrains Mono). All interactive surfaces are **glass** (frosted blur with a
top inner highlight) sitting on **skeuomorphic plinths** (recessed inputs,
domed dark buttons). Motion is constant but never showy:
**Lenis-smoothed scroll**, **parallax layers**, **sweep reveals** on cards,
and a single **cinematic moment** per page (a hero that breaks apart, a
product that explodes and reassembles, a curve that traces the cursor).

---

## 1 · Tech stack

| Layer       | Choice                       | Why                                                          |
| ----------- | ---------------------------- | ------------------------------------------------------------ |
| Frontend    | **React 19** (CRA + craco)   | Stable, hot-reload friendly, easy to embed shadcn/ui.        |
| Styling     | **Tailwind CSS 3.4**         | Spec-driven utility classes; pairs with shadcn for primitives.|
| Components  | **shadcn/ui (Radix)**        | Accessible primitives we extend with the visual tokens.      |
| Motion      | **Framer Motion 11**         | `useScroll` + `useTransform` for scroll-linked animations.   |
| Smooth scroll| **Lenis 1.3**               | Buttery scroll without breaking native anchors.              |
| Icons       | **lucide-react**             | Consistent, tree-shakable line icons.                        |
| Toast       | **sonner**                   | Drop-in replacement for the form success/error feedback.     |
| Backend     | **FastAPI 0.110**            | Async, fast, clean Pydantic models for forms.                |
| DB          | **MongoDB + Motor**          | Schemaless writes for contact submissions / event logs.      |

Always use `yarn`, never `npm`. Always pin `webpack-dev-server` to `4.15.2`
to match CRA 5.

---

## 2 · Color system

### Tokens (CSS variables, defined in `index.css`)

```css
--wr-bg:          #ffffff;
--wr-ink:         #050505;
--wr-ink-soft:    #555555;
--wr-grain:       rgba(0, 0, 0, 0.04);
--wr-glass-border:      rgba(255, 255, 255, 0.45);
--wr-glass-border-dark: rgba(0, 0, 0, 0.08);
--wr-accent:      #0a0a0a;
```

### The vignette (mandatory)

```css
.wr-vignette::after {
  content: "";
  position: fixed; inset: 0;
  pointer-events: none; z-index: 1;
  background: radial-gradient(
    ellipse at center,
    rgba(255,255,255,0) 35%,
    rgba(10,10,10,0.55) 100%
  );
}
```

### Forbidden patterns

- ❌ Purple/violet gradients on white.
- ❌ Flat full-white backgrounds (always pair with the vignette).
- ❌ Dark text on dark imagery — use `mix-blend-mode: difference` instead.
- ❌ Centered hero with equal margins — prefer **asymmetry**.

---

## 3 · Typography

### Fonts (loaded via Fontshare CDN at the top of `index.css`)

```css
@import url("https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=outfit@300,400,500,600&f[]=jetbrains-mono@400,500&display=swap");
```

| Role     | Family                | Class            |
| -------- | --------------------- | ---------------- |
| Display  | **Clash Display**     | `.font-display`  |
| Body     | **Outfit** (default)  | (root)           |
| Mono     | **JetBrains Mono**    | `.font-mono`     |

### Hierarchy

```
H1   font-display text-5xl sm:text-7xl lg:text-[8rem] tracking-tighter leading-[0.92]
H2   font-display text-4xl sm:text-6xl lg:text-7xl tracking-tighter
H3   font-display text-2xl sm:text-3xl tracking-tight
Body text-base sm:text-lg leading-relaxed font-light text-neutral-700
Overline (.overline)
     font-mono text-[0.72rem] uppercase tracking-[0.22em] text-neutral-500
```

### Hero text on busy imagery

Use **`mix-blend-mode: difference`** with a near-white color so type stays
legible on both dark-blue puzzle pieces and the white background.

```css
.wr-hero-text {
  color: #fff;
  mix-blend-mode: difference;
  isolation: isolate;
}
```

---

## 4 · Surfaces

### Glassmorphism

```css
.wr-glass {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(22px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow:
    0 24px 60px -20px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(0, 0, 0, 0.06);
}
```

There's also `.wr-glass-dark` for the inverse (used on Quest fragments + footer chips).

### Skeuomorphism — buttons and inputs

```css
.wr-skeu-btn {
  background: linear-gradient(180deg, #2a2a2a 0%, #050505 100%);
  border-radius: 999px;
  color: #fff;
  box-shadow:
    0 14px 30px -10px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -2px 4px rgba(0, 0, 0, 0.4);
}
.wr-skeu-input {
  background: linear-gradient(180deg, #ececec, #ffffff);
  border-radius: 14px;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.08),
    inset 0 -1px 0 rgba(255, 255, 255, 0.9);
}
```

Both react to focus / hover with subtle lift or recess transitions
(see `index.css` for full state machines).

---

## 5 · Section blueprint (8-act scroll)

| Act | Section       | Sticky | Notes                                                            |
| --- | ------------- | ------ | ---------------------------------------------------------------- |
| 0   | Preloader     | full   | 0→100 counter, caption rotates with progress, vignette behind.   |
| 1   | Hero          | sticky | Hero image fragments into `n×n` puzzle pieces on scroll.         |
| 2   | Ateliers      | scroll | Cards sweep in along a **left** vertical curve (SVG rail).       |
| 3   | Services      | scroll | Bento grid, glass + skeu icon plinths.                           |
| 4   | Storytelling  | sticky | Hero product **rises → 360° rotates → explodes → reassembles**.  |
| 5   | Reach         | scroll | Skeuomorphic form + booking modal (env-driven URL).              |
| 6   | Team          | scroll | Cards sweep in along a **right** vertical curve.                  |
| 7   | Footer        | scroll | Big tracked-tight wordmark, dark gradient.                       |

### Key motion patterns

- **Puzzle break (Hero):** every piece has its own `dx, dy, depth`.
  `useTransform(scrollYProgress, [0,1], [0, dx])` for explode.
  Add cursor-driven parallax: `translate(mouseX * depth)`.
- **Sweep reveals:** map `[i/total, (i+1)/total]` of `scrollYProgress` to
  card `x, y, rotate, opacity, scale`. Each card claims its own slice.
- **Product explode (Storytelling):** map progress 0→0.25 lift, 0.2→0.6
  rotate to 360°, 0.55→0.8 explode, 0.8→1 reassemble.
- **Cursor trail:** capture last 70 pointer positions, render as smoothed
  Catmull-Rom-to-Quadratic bezier path with `feTurbulence` displacement.
  Active only after a configured section.

---

## 6 · Component patterns

### Sweep card (Ateliers / Team)

```jsx
function Card({ i, total, progress, ...rest }) {
  const t0 = i / total, t1 = (i + 1) / total;
  const x       = useTransform(progress, [t0, t1], [220, -40]);
  const y       = useTransform(progress, [t0, t1], [120, 0]);
  const rotate  = useTransform(progress, [t0, t1], [8, 0]);
  const opacity = useTransform(progress, [t0-.05, t0+.05, t1-.05, t1+.1], [0,1,1,.7]);
  const scale   = useTransform(progress, [t0, t1], [0.92, 1]);
  return (
    <motion.article style={{ x, y, rotate, opacity, scale }}
      className="wr-glass rounded-3xl p-5">
      ...
    </motion.article>
  );
}
```

Always pair with a curved SVG rail behind the cards:

```svg
<path d="M 200 0 C -20 250, 320 500, 0 750"
      stroke="rgba(10,10,10,0.18)" stroke-dasharray="3 6" fill="none" />
```

### Skeuomorphic icon plinth

```jsx
<div className="w-12 h-12 rounded-xl flex items-center justify-center"
  style={{
    background: "linear-gradient(180deg, #fff 0%, #e9e9e9 100%)",
    boxShadow: "inset 0 1px 0 #fff, inset 0 -2px 4px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.06)",
  }}>
  <Icon size={20} />
</div>
```

### Crayon scribble overlay (hover reveal)

- Generate `n` short bezier scratches via a deterministic PRNG (seed = card
  index) so each card's pattern is stable across renders.
- Apply `feTurbulence + feDisplacementMap` for hand-drawn texture.
- Animate via `stroke-dasharray` + `stroke-dashoffset` keyframe.
- Stroke widths between 0.55 – 1.2 on a 100×100 viewBox = "light pen scratch".

### Cursor trail

- Fixed `<svg>` at z-0, pointer-events none.
- Buffer last 22 (scrolling up) → 70 (scrolling down) cursor points.
- Render via Catmull-Rom-to-Quadratic interpolation.
- Active flag flips when `getBoundingClientRect().top < 0.5 * innerHeight`
  for the configured section.
- Stroke uses a `linearGradient` from transparent to dark for a fade tail.

---

## 7 · Backend / form pattern

```python
# /api/reach-out
class ReachOutCreate(BaseModel):
    name:    str = Field(..., min_length=1)
    email:   EmailStr
    phone:   Optional[str] = None
    subject: str
    body:    str
    website: Optional[str] = None
```

- All routes prefixed `/api`.
- Datetimes stored as ISO strings, returned as `datetime` via Pydantic.
- Emergent platform expects MongoDB only, env-driven URL.

### Booking integration (no API keys needed)

- Frontend env: `REACT_APP_BOOKING_URL=https://calendar.app.google/XXXX`.
- "Book a call" card opens an iframe modal with an "Open in new tab" fallback
  in case Google blocks the embed.

---

## 8 · Project skeleton

```
/app
├── README.md
├── UI_KIT.md                    # this document
├── backend/
│   ├── server.py                # FastAPI app + routers
│   ├── .env / .env.example
│   └── requirements.txt
└── frontend/
    ├── .env / .env.example
    ├── package.json             # webpack-dev-server pinned to 4.15.2
    ├── craco.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── index.js / index.css   # tokens, vignette, fonts
        ├── App.js                 # router shell
        ├── pages/Landing.jsx      # composition of acts
        ├── lib/useLenis.js        # Lenis smooth-scroll hook
        └── components/
            ├── ui/                # shadcn primitives
            └── wr/                # WandelReality components
                ├── Preloader.jsx
                ├── Nav.jsx
                ├── Hero.jsx
                ├── Ateliers.jsx
                ├── Services.jsx
                ├── Storytelling.jsx
                ├── Reach.jsx
                ├── Team.jsx
                ├── Footer.jsx
                └── CursorTrail.jsx
```

---

## 9 · Quality bar (acceptance for "looks like WR")

- Lenis is wrapping the app — no native scroll feel.
- Vignette is visible at all times (test on a fully white section).
- At least one section uses `position: sticky` + scroll-linked motion.
- All grouped reveals use the i/total slice pattern (no two cards animate
  at the same time on the same axis).
- Glass surfaces always carry **both** an outer drop shadow and an inner
  top highlight.
- Buttons must compress visually on `:active` (skeuomorphism rule).
- The active-section navbar pill is filled black with white text.
- Mouse-driven parallax on at least one hero element.
- Form inputs are recessed (skeu), not flat.
- Title appears within 4s of first paint (preloader cap).

---

## 10 · Non-goals (don't bring these in)

- Heavy 3D engines (three.js, R3F) unless the brief explicitly demands a
  real model. Use Framer Motion + CSS where possible.
- Dark-mode toggle. The page IS the artwork — pick the right mode for the
  story you're telling, ship it.
- Wholesale animation libraries on top of Framer Motion (Anime.js, etc.).
- Auth, blog, comments, rating systems unless asked.

---

## 11 · Quick-start checklist when forking this template

1. Replace `Wandel Reality` strings + logo glyph in `Nav.jsx` and `Footer.jsx`.
2. Edit the `TEAM` array in `Team.jsx` (or remove the section).
3. Edit the `PROJECTS` array in `Ateliers.jsx`.
4. Edit the `SERVICES` array in `Services.jsx`.
5. Swap the puzzle hero image URL in `Hero.jsx` and the headset image in
   `Storytelling.jsx`. Keep aspect ratios.
6. Set `REACT_APP_BOOKING_URL` (and optional social envs) in `frontend/.env`.
7. Adjust the vignette intensity in `index.css` only if the brief calls for
   a softer mood.
8. Build, run `testing_agent_v3` for end-to-end QA, ship.

---

© Wandel Reality — Studio Template, 2026

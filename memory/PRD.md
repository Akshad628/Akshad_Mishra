# PRD — akshad.dev Portfolio

## Original problem statement
A personal, gamified single-page portfolio for **Akshad Mishra** (CSE undergrad,
Hyderabad, full-stack + AI + Blender). Built on the visual system of the prior
Wandel Reality project — puzzle theme, glass/skeu, Lenis smooth scroll,
Framer Motion, preloader with rotating dashed rings, cursor trail — but with
new content and a heavy **gamification layer** inspired by Duolingo + awwwards
game-portfolios.

## Personas
- **Recruiter** — scans skills, stats, projects, contact within 60s.
- **Fellow builder** — inspects the gamification, opens Cmd+K, plays the minigame.
- **Curious visitor** — scrolls through, collects hidden pieces, sees the story.

## Core requirements (locked)
- Single page, scroll-driven, single-theme (puzzle white + dark vignette).
- 8 acts: preloader → hero (puzzle portrait) → projects → skills → 3D reel →
  live stats → about (timeline) → certifications → reach → footer.
- **Live** GitHub + LeetCode integrations, no keys.
- Contact form → MongoDB (existing `/api/reach-out` endpoint).
- Gamification: XP bar, achievement toasts, hidden collectibles, Konami code,
  Cmd+K command palette with `/whoami /play /resume /email /github /linkedin
  /leetcode` and section jumps, Breakout minigame.
- **No Google Calendar booking** — repurposed to a 6-tile quick-action grid.
- **Zero "Wandel Reality" references** in visible copy or backend metadata.

## What's implemented (Dec 22, 2025 → Dec 22, 2025 pivot day)
- Full rebrand → akshad.dev (Preloader, Nav, Hero, Footer, backend title/root).
- 8 new sections wired into `Landing.jsx` in correct scroll order.
- Projects: 4 real projects from resume.
- Skills: 6 grouped disciplines with animated XP bars.
- 3D Reel: 3 placeholder Blender cards (comment marks where to swap in .mp4s/renders).
- Stats: live GitHub (repos + contribution grid) + LeetCode (via
  `leetcode-api-faisalshohag.vercel.app`).
- About: 5-node vertical timeline from KV Picket → NRSC.
- Certifications: 6 cards, 2 wired to sample PDF URLs.
- Reach: form + 6 quick-action tiles (email, GitHub, LinkedIn, LeetCode, resume, phone).
- Gamification: XPBar, AchievementsProvider + `useAchievement` hook + toaster,
  CollectibleSpot + InventoryHUD (6 pieces), Konami code + `wr-god-mode`
  hue-shift animation, CommandPalette (Cmd/Ctrl+K) with 12 commands, MiniGame
  (Breakout with best-score in localStorage).
- Backend: `/api/reach-out` unchanged, title/root rebranded.
- Env: `REACT_APP_GITHUB_USER`, `REACT_APP_LEETCODE_USER`,
  `REACT_APP_CONTACT_EMAIL`, `REACT_APP_SOCIAL_*`, `REACT_APP_RESUME_URL`.

## Test status
- `test_reports/iteration_2.json`: **backend 100%**, **frontend 100%**.
- All 18 feature checks pass end-to-end.

## Backlog (P0 → P2)
- **P0** — Akshad to send real portrait for the hero puzzle (`Hero.jsx` HERO_IMG).
- **P0** — Akshad to send real Blender renders / MP4 for 3D Reel (`Reel3D.jsx` ITEMS[i].image).
- **P1** — Add `react-three-fiber` .glb viewer for the 3D Reel middle card (real 3D rotate).
- **P1** — Boot-percentage tied to real asset preload instead of fixed 2.4s timer.
- **P1** — Blog / writing section if Akshad wants long-form posts later.
- **P2** — GitHub GraphQL for pinned repos (currently sorted-by-updated).
- **P2** — Extract `wr/*` components into `@akshad/ui` npm package.

## Next actions
1. Get real portrait + Blender renders from Akshad.
2. Deploy to `akshad.dev` (Vercel/Netlify + FastAPI backend on Railway/Render).
3. Post-launch: switch preloader to real preload, add analytics.

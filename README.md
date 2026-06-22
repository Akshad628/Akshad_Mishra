# Wandel Reality — XR Studio Website

A scroll-driven, single-page experience for **Wandel Reality**, an XR studio.
Built with FastAPI + React + MongoDB. Smooth scroll via Lenis, motion via
Framer Motion, glassmorphism + skeuomorphism design tokens, and a puzzle-themed
reveal-on-scroll narrative ending with an exploding/reassembling Meta Quest.

```
/app
├── backend/   # FastAPI + Motor (MongoDB async driver)
└── frontend/  # React (CRA + craco), Tailwind, shadcn/ui
```

---

## 1 · Prerequisites

| Tool      | Version |
| --------- | ------- |
| Node.js   | ≥ 18    |
| Yarn      | ≥ 1.22  (use **yarn**, never npm) |
| Python    | ≥ 3.10  |
| MongoDB   | ≥ 6.0   (local install or container) |

---

## 2 · Local Setup (portable)

### a. Clone & install

```bash
git clone <your-repo-url> wandel-reality
cd wandel-reality
```

### b. Backend

```bash
cd backend
cp .env.example .env          # edit if needed
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

Backend is now on `http://localhost:8001`. Try `curl http://localhost:8001/api/`.

### c. Frontend

```bash
cd ../frontend
cp .env.example .env          # IMPORTANT — see Google Calendar section below
yarn install
yarn start
```

Frontend on `http://localhost:3000`.

### d. MongoDB

- macOS:  `brew install mongodb-community && brew services start mongodb-community`
- Linux:  follow [official docs](https://www.mongodb.com/docs/manual/installation/)
- Docker: `docker run -d -p 27017:27017 --name wr-mongo mongo:7`

The default `MONGO_URL` in `backend/.env` is `mongodb://localhost:27017`.

---

## 3 · How to connect your Google Calendar (booking)

The "Book a 30-min call" card opens an in-page Google Calendar Appointment Schedule
in a modal. To wire it up:

1. Sign into [https://calendar.google.com](https://calendar.google.com) on a
   Google account that has Appointment Schedules enabled (any personal Google
   account works — no Workspace required as of 2024).
2. Click **Create → Appointment schedule**.
3. Set the title (e.g. "Wandel intro call"), duration (e.g. 30 min), availability
   window, buffer time, and time zone.
4. Save the schedule, then open it and click **Share → Copy booking page link**.
   The link looks like `https://calendar.app.google/XXXXXXXX`.
5. Paste it into `frontend/.env`:

   ```bash
   REACT_APP_BOOKING_URL=https://calendar.app.google/XXXXXXXX
   ```

6. Restart the frontend (`Ctrl-C` and `yarn start` again, or in Emergent:
   `sudo supervisorctl restart frontend`).

That's it — clicking "Book a 30-min call" now opens the Google Calendar
appointment picker in a modal with a fallback **Open in new tab** option in
case Google blocks the iframe for your account.

> **Want Calendly instead?** Paste your Calendly link
> (e.g. `https://calendly.com/your-team/intro`) into the same env var.
> The modal will load it the same way.

---

## 4 · Environment variables

### `backend/.env`

| Key            | Purpose                                  |
| -------------- | ---------------------------------------- |
| `MONGO_URL`    | MongoDB connection string                |
| `DB_NAME`      | Database name                            |
| `CORS_ORIGINS` | Comma-separated allowed origins (or `*`) |

### `frontend/.env`

| Key                           | Purpose                                              |
| ----------------------------- | ---------------------------------------------------- |
| `REACT_APP_BACKEND_URL`       | URL of the FastAPI backend (no trailing slash)       |
| `REACT_APP_BOOKING_URL`       | Google Calendar / Calendly booking URL (optional)    |
| `REACT_APP_CONTACT_EMAIL`     | Email shown in the Reach section + footer            |
| `REACT_APP_CONTACT_PHONE`     | Phone shown in the Reach section (optional)          |
| `REACT_APP_SOCIAL_GITHUB`     | Social link (optional, hidden if empty)              |
| `REACT_APP_SOCIAL_LINKEDIN`   | Social link (optional, hidden if empty)              |
| `REACT_APP_SOCIAL_INSTAGRAM`  | Social link (optional, hidden if empty)              |
| `REACT_APP_SOCIAL_TWITTER`    | Social link (optional, hidden if empty)              |

> **No keys are hardcoded.** Everything is read from env at build time.

---

## 5 · API

| Method | Path             | Body                                                                  |
| ------ | ---------------- | --------------------------------------------------------------------- |
| GET    | `/api/`          | health check                                                          |
| POST   | `/api/reach-out` | `{ name, email, phone?, subject, body, website? }`                    |
| GET    | `/api/reach-out` | list all submissions (admin — protect or remove before production)    |

---

## 6 · Sections (scroll order)

1. **Preloader** — 0 → 100% with scene caption
2. **Hero** — puzzle image that breaks/reassembles on scroll + cursor parallax
3. **Ateliers** — *Silence That Remains*, *HCI Showcases*, *ISRO GSLV* — left-curved sweep
4. **Services** — six XR disciplines, glass + skeu cards
5. **Storytelling** — Meta Quest rises → rotates 360° → explodes → reassembles
6. **Reach** — contact form (saved to MongoDB) + booking modal
7. **Team** — 11 members in a right-curved vertical sweep
8. **Footer** — incorporation, sitemap, socials, big wordmark

---

## 7 · Customising the team

Edit the `TEAM` array at the top of `/app/frontend/src/components/wr/Team.jsx`.
Each entry: `{ name, role, desc }`. Initials are generated automatically.

To use real headshots, replace the initials block with an `<img>` tag using
your photo URLs.

---

## 8 · Production build

```bash
cd frontend && yarn build      # outputs to /app/frontend/build
cd ../backend && uvicorn server:app --host 0.0.0.0 --port 8001 --workers 2
```

Serve `frontend/build/` behind any static host (nginx, Caddy, Vercel, etc.)
and point `REACT_APP_BACKEND_URL` at your deployed FastAPI URL.

---

## 9 · Troubleshooting

- **`Bad gateway` from preview** — backend is up but frontend may still be
  building; check `sudo supervisorctl status` or
  `tail -n 60 /var/log/supervisor/frontend.*.log`.
- **`onAfterSetupMiddleware` error** — `webpack-dev-server` resolution was
  pinned to v5; we pinned it to `4.15.2` to match CRA 5 (see `package.json`
  `resolutions`).
- **Google Calendar iframe is blank** — some Google accounts block iframe
  embeds. Click "Open in new tab" inside the modal; we fall back to a real
  Google booking page.
- **Form submits but nothing saves** — confirm `REACT_APP_BACKEND_URL` is
  reachable from your browser and Mongo is running.

---

© 2026 Wandel Reality

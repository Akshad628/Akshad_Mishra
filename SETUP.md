# Wandel Reality — Local Setup Guide

You downloaded the zip. This walks you from "unzipped folder" to "site running
on your laptop" in under 10 minutes.

> Anything inside `< >` is a placeholder you replace.
> Commands assume macOS/Linux. On Windows use **PowerShell** and replace
> `source .venv/bin/activate` with `.\.venv\Scripts\Activate.ps1`.

---

## 1 · Prerequisites — install once per machine

| Tool       | Minimum | Check version                    | Install                                  |
| ---------- | ------- | -------------------------------- | ---------------------------------------- |
| Node.js    | 18+     | `node -v`                        | https://nodejs.org (LTS)                 |
| Yarn       | 1.22+   | `yarn -v`                        | `npm i -g yarn`                          |
| Python     | 3.10+   | `python3 --version`              | https://python.org                       |
| MongoDB    | 6.0+    | `mongod --version`               | see "MongoDB" section below              |
| git        | any     | `git --version`                  | https://git-scm.com                      |

> ⚠️ Use **yarn**, never **npm**, for the frontend.

### MongoDB — pick one

- **Docker (easiest)** — one command, no install:
  ```bash
  docker run -d --name wr-mongo -p 27017:27017 mongo:7
  ```
- **macOS (Homebrew)**:
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community
  ```
- **Linux**: follow https://www.mongodb.com/docs/manual/installation/
- **Windows**: download MongoDB Community Server installer.

Confirm Mongo is up:
```bash
curl -s http://localhost:27017
# → "It looks like you are trying to access MongoDB over HTTP..."  ← that's good
```

---

## 2 · Unzip and enter the project

```bash
unzip wandel-reality.zip
cd wandel-reality
```

Folder layout:
```
wandel-reality/
├── backend/   (FastAPI + MongoDB)
└── frontend/  (React + Tailwind + Framer Motion)
```

---

## 3 · Backend setup

```bash
# 3.1  enter the backend
cd backend

# 3.2  create a virtual environment
python3 -m venv .venv

# 3.3  activate it
source .venv/bin/activate              # macOS / Linux
# .\.venv\Scripts\Activate.ps1         # Windows PowerShell

# 3.4  install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 3.5  copy the env template and edit if needed
cp .env.example .env

# 3.6  start the server
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

Test it:
```bash
curl http://localhost:8001/api/
# → {"message":"Wandel Reality API online"}
```

Leave this terminal open.

---

## 4 · Frontend setup

Open a **second terminal** (do NOT close the backend one).

```bash
# 4.1  enter the frontend
cd wandel-reality/frontend

# 4.2  copy the env template
cp .env.example .env
```

Now open `frontend/.env` and **change one line**:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```
(remove the Emergent preview URL if it's still there).

Optional — paste your booking URL:
```
REACT_APP_BOOKING_URL=https://calendar.app.google/<YourCode>
```

Continue:
```bash
# 4.3  install JS dependencies (uses yarn — first run takes 2-3 minutes)
yarn install

# 4.4  start the dev server
yarn start
```

You should see:
```
Compiled successfully!
Local:    http://localhost:3000
```

Your browser opens automatically. The preloader counts to 100, the puzzle hero
appears — you're done.

---

## 5 · Daily workflow (after first setup)

Two terminals:

**Terminal A — backend**
```bash
cd wandel-reality/backend
source .venv/bin/activate
uvicorn server:app --reload --port 8001
```

**Terminal B — frontend**
```bash
cd wandel-reality/frontend
yarn start
```

Stop either with **Ctrl-C**.

---

## 6 · How to give me your Google Calendar (booking)

1. https://calendar.google.com → **Create → Appointment schedule**
2. Configure title, duration (e.g. 30 min), availability, buffer.
3. Save → open the schedule → **Share → Copy booking page link**.
4. Paste it into `frontend/.env`:
   ```
   REACT_APP_BOOKING_URL=https://calendar.app.google/<YourCode>
   ```
5. Restart the frontend (`Ctrl-C`, then `yarn start`).

The "Book a 30-min call" card now opens that calendar in an in-page modal.

---

## 7 · Customising

- **Team members** — `frontend/src/components/wr/Team.jsx` → edit the `TEAM`
  array (name, role, desc, photo URL).
- **Projects** — `frontend/src/components/wr/Ateliers.jsx` → `PROJECTS` array.
- **Services** — `frontend/src/components/wr/Services.jsx` → `SERVICES` array.
- **Hero image** — replace `HERO_IMG` URL in `Hero.jsx`.
- **Quest image / future frame sequence** — see editorial note at the top of
  `frontend/src/components/wr/Storytelling.jsx`.
- **Footer details / incorporation copy** — `Footer.jsx`.
- **Contact email / socials** — `frontend/.env` (`REACT_APP_CONTACT_EMAIL`,
  `REACT_APP_SOCIAL_GITHUB`, etc.). Empty values hide the social icon.

---

## 8 · Production build

When you're ready to host:

```bash
# build static frontend
cd frontend
yarn build              # outputs ./build

# run backend with workers (no --reload)
cd ../backend
source .venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 2
```

Serve `frontend/build/` from any static host (Netlify / Vercel / Caddy /
Nginx) and point `REACT_APP_BACKEND_URL` at the backend's public URL before
building.

---

## 9 · Common issues

| Symptom                                                                      | Fix                                                                                    |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `ModuleNotFoundError: motor` after `pip install`                             | You forgot to activate `.venv`. Run `source .venv/bin/activate` and reinstall.         |
| `Error: ENOENT: no such file or directory ... node_modules`                  | Run `yarn install` from inside `frontend/`.                                            |
| `Compile error: 'onAfterSetupMiddleware'`                                    | Make sure `package.json` resolutions still pin `webpack-dev-server` to `4.15.2`.       |
| Browser shows nothing / spinner forever                                      | Check the backend is reachable: `curl http://localhost:8001/api/`.                     |
| Form sends but API returns 500                                               | Mongo isn't running. Check `mongod`/Docker container.                                  |
| Booking modal is blank                                                       | Some Google accounts block iframe embeds — click **Open in new tab** in the modal.     |
| `pymongo.errors.ServerSelectionTimeoutError`                                 | `MONGO_URL` in `backend/.env` is wrong, or Mongo isn't running yet.                    |
| Port 3000 / 8001 already in use                                              | `lsof -i :3000` (or `:8001`), then `kill <PID>`.                                       |
| Frontend builds but contact form does not post                               | `REACT_APP_BACKEND_URL` is unset. Edit `frontend/.env`, then **restart** `yarn start`. |

---

## 10 · You're done

If you hit anything not in section 9, paste the exact error into ChatGPT or
ping the maintainer. The codebase is small enough that any compiler error
will tell you the file and line in plain English.

Have fun. 🛠️

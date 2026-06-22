# Booking Setup — Google Calendar Appointment Schedule

This project ships a built-in "Book a 30-min call" card that opens a booking
modal in the Reach section. It is wired to a single environment variable —
**`REACT_APP_BOOKING_URL`** — that you paste a public booking link into.

Two important clarifications upfront:

1. **No Google Calendar API key, no OAuth, no Google Cloud project required.**
   We use Google's public "Appointment Schedule" feature, which gives you a
   shareable link anyone can use to pick a time on your calendar. It's the
   simplest, safest path and works on free Google accounts.

2. If you ever need **server-side** access to the calendar (e.g., to create,
   list, or modify events from your own backend), that *does* require the
   Google Calendar **API** with OAuth — covered in the optional Section 8 at
   the end of this doc. The site as-shipped does **not** need it.

---

## 1 · What you'll get

A modal that looks like the Wandel Reality glass card, embedding your
Appointment Schedule. Visitors pick a slot, fill the Google form, and the
event lands on your calendar. They get an email + calendar invite
automatically. You don't have to lift a finger.

```
┌──────────────── Reach section ────────────────┐
│  [📅] Book a 30-min call          [Open ↗]   │  ← clicks open the modal
│       Google Calendar · pick a slot           │
└───────────────────────────────────────────────┘
```

Fallback: if a visitor's Google account or browser blocks the iframe, the
modal shows an **"Open in new tab"** button that goes to the same URL.

---

## 2 · Prerequisites

- A Google account (free Gmail works as of 2024, Workspace also works).
- 5 minutes.

---

## 3 · Create the Appointment Schedule (step-by-step)

### 3.1  Open Google Calendar

Visit https://calendar.google.com and sign in with the account you want
appointments to land on.

### 3.2  Click **Create**

Top-left of the calendar UI. A dropdown appears.

### 3.3  Choose **Appointment schedule**

> If you don't see this option, your account might be too restricted —
> switch accounts (top-right avatar) or enable "Calendar appointments" in
> your Google account settings. On free Gmail accounts, the menu shows it
> by default.

### 3.4  Fill in the schedule details

| Field             | Suggested value                                            |
| ----------------- | ---------------------------------------------------------- |
| Title             | `Wandel Reality · 30-min intro`                            |
| Appointment length| `30 minutes`                                               |
| Time zone         | Auto-detected; double-check                                |
| Window            | Next 60 days                                               |
| Daily availability| e.g. `Mon–Fri, 10:00–17:00`                                |
| Buffer            | `15 min` (gap between two consecutive bookings)            |
| Max bookings/day  | e.g. `4`                                                   |
| Visibility        | Public — required for the link to work without sign-in.    |

You can also add:
- A custom thumbnail.
- Required form fields (name, email auto-included; add company/website etc.).
- A confirmation email + reminders.

### 3.5  Save

Click **Save** in the top-right.

### 3.6  Copy the booking link

After saving you'll be taken to the schedule's settings panel.

1. Click **Share**.
2. Click **Copy booking page link**.
3. Your link looks like:
   ```
   https://calendar.app.google/abcDEF1234
   ```

That's the only string you need.

---

## 4 · Paste it into the project

### Local dev

Open `frontend/.env`:

```bash
cd frontend
nano .env       # or any editor
```

Find (or add) the line:

```
REACT_APP_BOOKING_URL=
```

Paste your link after the equals sign:

```
REACT_APP_BOOKING_URL=https://calendar.app.google/abcDEF1234
```

Save the file.

### Restart the frontend

CRA reads env vars at build time. Stop and restart the dev server:

```bash
# stop with Ctrl-C
yarn start
```

(On the Emergent platform: `sudo supervisorctl restart frontend`.)

### Production / deployed builds

Set `REACT_APP_BOOKING_URL` on your hosting platform (Vercel, Netlify,
Cloudflare Pages, your own server) **before** building. Re-build and deploy.

---

## 5 · Verify it works

1. Visit the site, scroll to **Reach**.
2. Click the **Book a 30-min call** card.
3. The modal should open with your appointment schedule loaded inside.
4. Pick a test slot, fill the form, submit.
5. Check Google Calendar on your account — the event should appear.

If the iframe shows a blank page (Google sometimes blocks embedding for
certain Workspace policies), click **Open in new tab** — the booking flow
works there too. The button is a fallback, not a fail state.

---

## 6 · Calendly as a drop-in alternative

If you prefer Calendly:

1. https://calendly.com → create an event type.
2. Copy your event URL, e.g. `https://calendly.com/your-team/intro`.
3. Paste it into the same env var:
   ```
   REACT_APP_BOOKING_URL=https://calendly.com/your-team/intro
   ```
4. Restart frontend.

The modal works identically. You can use any calendar service that exposes
a public booking URL with iframe embedding (Cal.com, SavvyCal, Microsoft
Bookings, etc.).

---

## 7 · How the integration is wired (for reference)

`frontend/src/components/wr/Reach.jsx`

```js
const BOOKING_URL = process.env.REACT_APP_BOOKING_URL || "";

// "Book a 30-min call" button:
const openBooking = (e) => {
  e.preventDefault();
  if (BOOKING_URL) setBookOpen(true);
  else toast.message("Booking not configured", { ... });
};

// Modal renders an iframe:
<iframe title="Booking" src={BOOKING_URL} ... />
```

Nothing on the backend touches the calendar. Form submissions to
`/api/reach-out` are independent — they save to MongoDB, regardless of
whether booking is configured.

---

## 8 · Optional — full Google Calendar API (server-side)

**Only do this if you need to programmatically read/write events from your
backend.** The shipped site does not need this; skip if you're just letting
visitors book intro calls.

### 8.1  Create a Google Cloud project

1. https://console.cloud.google.com → **Create Project**.
2. Name it `Wandel Reality Calendar`.

### 8.2  Enable the Google Calendar API

1. In your project: **APIs & Services → Library**.
2. Search "Google Calendar API" → **Enable**.

### 8.3  Create OAuth credentials

1. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. Application type: **Web application**.
3. Authorised redirect URI: `http://localhost:8001/api/auth/google/callback`
   (and your production URL). Use whatever path you wire your backend
   callback to.
4. Save. Copy the **Client ID** and **Client Secret**.

### 8.4  Configure the OAuth consent screen

1. **OAuth consent screen** → External.
2. Add scopes: `https://www.googleapis.com/auth/calendar.events`
   (or `calendar.readonly` if you only need read access).
3. Add yourself as a test user.

### 8.5  Add credentials to backend

Add to `backend/.env` (these are placeholders — *never* commit real values):

```
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_REDIRECT_URI=http://localhost:8001/api/auth/google/callback
```

### 8.6  Wire the OAuth flow

You'd need to add three FastAPI routes:

| Route                                  | Purpose                                                 |
| -------------------------------------- | ------------------------------------------------------- |
| `GET /api/auth/google/start`           | Redirect to Google OAuth consent.                       |
| `GET /api/auth/google/callback`        | Receive code, exchange for tokens, store refresh token. |
| `GET /api/calendar/events`             | Use the stored token to call the Calendar API.          |

Recommended Python libraries:

```bash
pip install google-auth google-auth-oauthlib google-api-python-client
```

These additions are **out of scope** for the current shipped feature. Tell
me when you want this and I'll add the routes — but for visitor bookings
the Appointment Schedule link in Section 3 is the right answer.

---

## 9 · Quick reference

| Task                              | What you change                                   | Where                       |
| --------------------------------- | ------------------------------------------------- | --------------------------- |
| Connect a Google Calendar booking | Paste shareable URL                               | `frontend/.env`             |
| Switch to Calendly                | Paste Calendly URL                                | `frontend/.env`             |
| Disable booking                   | Leave `REACT_APP_BOOKING_URL` empty               | `frontend/.env`             |
| Change the modal title            | Edit `Pick a time that works` string              | `Reach.jsx`                 |
| Change the card copy              | Edit `Book a 30-min call` text                    | `Reach.jsx`                 |
| Programmatic API access           | Section 8 above                                   | new backend code            |

---

© 2026 Wandel Reality

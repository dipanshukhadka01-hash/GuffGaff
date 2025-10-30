# GuffGaff

GuffGaff is a full-stack social media experience focused on warmth, generosity, and mutual assistance. It features a React + Tailwind CSS frontend, a Node.js/Express API, MongoDB persistence, and Firebase-powered authentication and notifications.

## Features

- **Authentication** – Email/password & Google sign-in via Firebase with profile onboarding.
- **Mutual Assistance Forums** – Category-based boards with threaded replies, verified solutions, and audio-friendly posts.
- **Banter Feed** – Real-time friendly feed with mood tags, reactions, and quick composer.
- **Gamified Help System** – Payback Points, ranks, badges, and live leaderboard.
- **Notifications** – Socket.io channel with hooks for Firebase Cloud Messaging delivery.
- **Chat** – Direct messaging with conversation management.
- **Admin Console** – Manage members, award badges, adjust points, and moderate posts.

## Project Structure

```
GuffGaff/
├── backend/        # Express API, MongoDB models, Firebase Admin integration
└── frontend/       # React app with Vite + Tailwind CSS
```

## Prerequisites

- Node.js 18+
- MongoDB instance (local or cloud)
- Firebase project (Web SDK + Admin credentials)

## Backend Setup

```bash
cd backend
cp .env.example .env
# populate MongoDB + Firebase credentials
npm install
npm run dev
```

Key environment variables:

- `MONGODB_URI` – MongoDB connection string
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` – Firebase Admin SDK
- `CLIENT_ORIGIN` – Allowed comma-separated origins for CORS

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file alongside `package.json` with:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Development Notes

- Realtime notifications leverage Socket.io; the client automatically connects when authenticated.
- Firebase Cloud Messaging hooks are prepared for future device token registration.
- Audio clip storage is represented as URLs; integrate with Firebase Storage or another asset pipeline for production.
- Admin routes require the authenticated user to include the `admin` role.

Enjoy building a cheerful digital town square! 🌤️

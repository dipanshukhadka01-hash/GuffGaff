# GuffGaff

GuffGaff is a warm, community-first social hub built with the MERN stack (React + Node.js/Express + MongoDB) and Firebase authentication. The experience centres on kindness, mutual support, and light-hearted banter. Members earn **Payback Points** for sharing solutions, offering help, or posting uplifting content. Verified answers, badges, leaderboards, and a lightweight chat system keep the square active and encouraging.

## Features

- **Authentication** – Email/password and Google sign-in powered by Firebase Web SDK with JWT-backed sessions on the API. Password reset hooks are ready to be wired to Firebase/Auth0 templates.
- **Banter Feed** – Realtime home feed for text and audio snippets with mood tags, likes, shares, and threaded comments. Posts can be marked as solved to reward helpers.
- **Mutual Assistance Forums** – Category-filtered discussions for tech, DIY, study help, wellness, and more. OPs can mark responses as verified solutions.
- **Gamification** – Payback Points contribute to ranks (Newbie → Helper → Expert → Legend) and unlock profile badges such as Helper or Witty Mind.
- **Leaderboards & Recognition** – Dedicated views for the most helpful, funniest, and most active neighbours.
- **Notifications** – Realtime via Socket.IO with Firebase Cloud Messaging-ready hooks.
- **Chat / DM** – One-to-one and future group conversations with typing indicators and read receipts scaffolding.
- **Admin Dashboard** – Moderate users, posts, bans, and view health metrics for the community.

## Tech Stack

- **Frontend** – React 18, Vite, Tailwind CSS, React Router, Headless UI, Heroicons, Socket.IO client, Firebase web SDK.
- **Backend** – Express 4, MongoDB with Mongoose, JWT auth, Socket.IO server, Firebase Admin SDK integration hooks.
- **Infrastructure** – Environment-driven configuration, ready for deployment to services like Render, Railway, or Vercel + Fly.

## Getting Started

### Requirements

- Node.js 18+
- npm or yarn
- MongoDB instance (local or Atlas)
- Firebase project (for authentication) – optional during local development if you prefer email/password with the API.

### Backend

```bash
cd backend
cp .env.example .env
# Fill in MongoDB and JWT secrets. Optional: add Firebase service account credentials.
npm install
npm run dev

# Production preview (supports both spellings)
npm run preview
# or
npm run preveiw
```

The API will start on `http://localhost:5000`. Socket.IO is bootstrapped on the same port.

### Frontend

```bash
cd frontend
cp .env.example .env
# Provide Vite API base and Firebase web configuration.
npm install
npm run dev
```

The Vite dev server runs at `http://localhost:5173` and proxies API calls to the backend.

### Firebase Setup

1. Create a Firebase project.
2. Enable Email/Password and Google providers.
3. Download a service account key and populate the backend `.env` with `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
4. Copy the web app credentials into the frontend `.env` file.

### Testing the Flow

1. Sign up or log in from the React app.
2. Post to the Banter Feed, add comments, and mark a reply as solved.
3. Explore the leaderboard and profile screens to see ranks and badges update with points.
4. Use the admin dashboard to peek at user metrics and practice moderation.
5. Try the DM tab to create a conversation (IDs can be obtained from the admin view for now).

## Project Structure

```
GuffGaff/
├── backend/
│   ├── src/
│   │   ├── config/           # Database + Firebase admin wiring
│   │   ├── controllers/      # Route handlers for auth, posts, chat, admin
│   │   ├── middleware/       # Auth + validation helpers
│   │   ├── models/           # Mongoose schemas (User, Post, Comment, etc.)
│   │   ├── routes/           # Express routers grouped by concern
│   │   ├── services/         # Socket.IO orchestration
│   │   └── utils/            # Rank and badge logic
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI pieces (feed, layout, badges)
│   │   ├── context/          # Auth + socket providers
│   │   ├── pages/            # Routed screens
│   │   ├── services/         # API + Firebase clients
│   │   └── styles/           # Tailwind entry point
│   └── .env.example
└── README.md
```

## Next Steps

- Connect audio uploads to a storage bucket (Firebase Storage or S3).
- Integrate Firebase Cloud Messaging for push notifications on web/mobile.
- Harden validation, rate limiting, and moderation workflows.
- Expand the chat system with message status indicators and media uploads.

Welcome to the GuffGaff town square – keep it kind! 💙

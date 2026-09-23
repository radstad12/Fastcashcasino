# FastCashCasino v1

Tablet-first online slot casino starter for a GTA RP game economy.

## Architecture

- `frontend/` = static web app, deployable to GitHub Pages
- `backend/` = Node.js + Express + SQLite authoritative game server
- All balances, RNG and payouts are server-side.
- Initial casino bankroll: 500,000 game tokens.
- 10 slot configurations.
- Atomic spin transaction prevents the casino bankroll from going below its reserve.
- Admin dashboard for bankroll and transaction inspection.

> This project is for game tokens in a GTA RP economy. It is not configured for real-money gambling.

## Local test

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Backend runs on `http://localhost:3000`.

### Frontend

Serve `frontend/` with any static server, or open `index.html` directly for a basic UI test.

Set `frontend/config.js` to the backend URL when deployed.

## Deployment

GitHub Pages can host `frontend/`.

The `backend/` must run on a Node.js server/container with persistent storage. Put the backend URL into `frontend/config.js`.

For production, put HTTPS in front of the backend and add proper authentication for FiveM-to-backend deposits.

## Admin

Open `/admin.html` on the backend host.

Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env`.

## FiveM

The backend exposes a simple development deposit endpoint. Do not expose that endpoint to browsers in production. A FiveM server resource should authenticate server-to-server and then credit the verified character.

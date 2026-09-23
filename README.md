# GTA RP Casino Starter

Online multiplayer slot-casino starter for a FiveM/GTA RP project.

## What this starter does

- Starts the casino with a `500000` token bankroll.
- Player balances are server-side, never trusted from the browser.
- Includes 10 slot machines using one reusable slot engine.
- Players can change their bet.
- Every spin is generated on the server.
- Casino bankroll and player balances are updated atomically.
- A configurable house edge makes the casino positive in expectation over many spins.
- A bankroll guard prevents a payout from making the casino bankroll negative.
- Includes an admin API for inspecting/adjusting the casino bankroll.
- Uses SQLite for a simple first deployment; it can later be moved to PostgreSQL.

## Important

The 500000 value is an initial *game-token* bankroll. This starter is intended for a GTA RP/game economy, not for real-money gambling.

A house edge is an expectation, not a mathematical guarantee that the bankroll rises after every spin. The bankroll can temporarily fall after a large win. The hard invariant is that it cannot go below the configured reserve.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Open:

http://localhost:3000

Admin:

http://localhost:3000/admin.html

Default development admin credentials are in `.env.example`. Change them before any real deployment.

## API

- `POST /api/players`
- `GET /api/players/:id`
- `POST /api/players/:id/deposit`
- `GET /api/games`
- `POST /api/spin`
- `GET /api/casino`
- `GET /api/admin/transactions`
- `POST /api/admin/casino/adjust`

## FiveM integration

The `/api/players/:id/deposit` endpoint is deliberately simple for the starter. In production, put a server-to-server authentication layer in front of it and have the FiveM resource verify the actual GTA character/account before crediting tokens.

Never let the browser call the deposit endpoint directly.

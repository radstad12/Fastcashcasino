# FastCashCasino — GitHub Pages Edition

A polished, tablet-first GTA-inspired online casino frontend.

## What is included

- Casino lobby with 10 slot games
- Full-screen slot machine view
- Animated reels
- Bet controls + quick bet buttons
- Demo token balance
- Win/loss handling
- Paytable for every game
- Recent spin history
- Sound toggle
- Full-screen mode
- Mobile/tablet responsive layout
- VIP / rewards / stats panels
- Casino background and game-card art generated for this project
- No backend required for this first frontend version

## GitHub Pages

Upload the contents of this folder to your repository and enable GitHub Pages from:

Settings → Pages → Deploy from branch → `main` → `/root`

The site is completely static, so it works on GitHub Pages.

## Important

This version uses a local demo balance and browser-side demo game logic so you can immediately test the UI.

The later multiplayer version should replace the demo `spin()` and balance functions with calls to an authoritative backend. Do not use the browser-side balance/RNG for a production economy.

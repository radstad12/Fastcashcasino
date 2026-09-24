# FastCash Casino — Slot Floor v3

Frontend-only GitHub Pages demo using virtual TOKENS.

## What changed
- Removed poker from the build.
- Replaced blurry raster game covers with sharp vector SVG artwork.
- 10 original slot themes with different mechanics.
- Added animated reel stopping, win highlights, bonus effects and browser-generated casino sounds.
- Added feature states: free spins, sticky respins, expanding wilds, tumble/cascade, multipliers, mystery bonus, cashback and a virtual jackpot meter.
- Symbols are rendered as crisp inline SVG icons instead of emoji.
- Spin outcome is generated before the visual reel animation; animation only presents the result.
- +10,000 TOKENS remains a testing-only balance button.

## Slot designs
1. Neon 81 — 4x3, 81 ways, Multi Wild x2/x4/x8
2. Wild Hunt — 5x3, 20 lines, Wild x2, Sticky Free Spins
3. Hot 100 — 6x4, 100 lines, Expanding Wild, two scatter-style symbols, virtual jackpot
4. Joker ReSpin — 4x3, 81 ways, Sticky Wild Respin + Gamble
5. Multi Five — 5x4, 20 lines, Multi Wild + Free Spins
6. Midnight Fruits — 4x3, 81 ways, Wild + zero-balance Cashback event
7. Fruit Jack — 5x4, 40 lines, Wild + Scatter + Mystery Bonus + Gamble
8. Vegas 81 — 4x3, 81 ways, Multi Wild
9. Olympus Clash — 6x5, Pay Anywhere, Tumble/Cascade + multiplier-style bonus events
10. Firebird Double — 4x3, 27 ways from each side, Wild

The mechanics are original FastCash implementations inspired by common Czech slot patterns, not copies of third-party game artwork or source code.

## GitHub Pages
Upload the contents of `Fastcashcasino-main` to the repository root and enable:
Settings → Pages → Deploy from branch → main → /(root)

This is a browser-only demo. For real multiplayer/shared balances, move RNG, balances and game state to a server.

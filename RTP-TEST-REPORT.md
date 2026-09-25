# Multi Vegas 81 — safe-casino candidate

Candidate target: about 95% measured RTP, max credited win 100x stake.

## Model
- Existing 4x3 reel strips retained.
- Existing 27/81 criss-cross evaluation retained.
- Existing left-to-right and highest-win-per-way logic retained.
- Existing Multi Wild logic retained.
- Payout table adjusted downward to make the actual reel model sustainable:
  - Cherry 1x/2x
  - Dollar 1x/3x
  - Orange 1x/3x
  - Plum 1x/3x
  - Bell 1x/3x
  - Grapes 2x/20x
  - Melon 4x/40x
  - Seven 7x/80x
- Game max bet set to 250 tokens for a 500,000-token starting bank.
- Spin payout remains capped at 100x stake.

## Simulation
1,000,000 spins at 100 tokens: measured RTP about 95.21%, hit frequency about 18.96%.

1,000 independent sessions of 10,000 spins:
- 100-token bet: mean final bank about 550,000; no ruin observed.
- 250-token bet: mean final bank about 625,000; no ruin observed in the test set.
- 500-token bet: occasional ruin occurred, so 500 is not recommended for a 500,000 starting bank.

These are simulations, not a guarantee of future outcomes. The model is a custom approximation, not the proprietary RNG/reel configuration of the original game.

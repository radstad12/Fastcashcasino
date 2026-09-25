# Multi Vegas 81 — final candidate RTP test

Requested target: 95% RTP, maximum total win 100x stake.

The candidate uses four deterministic 1,000-stop reel strips, one RNG stop per reel and three consecutive visible symbols. The normal 4x3, 27/81 criss-cross evaluation is retained, including left-to-right wins, multiple ways adding together, highest win per way, and Multi Wild substitution/multipliers.

## Monte Carlo test
5 independent runs × 1,000,000 spins = 5,000,000 spins.

RTP results: 95.6504%, 95.6114%, 95.9424%, 95.5080%, 95.9941%.
Mean: 95.7413%.
Hit frequency: about 18.8%.
50x+ wins: about 0.055–0.059%.
100x wins: about 0.0019–0.0037%.
Observed maximum: 100x (the configured cap).

This is close to the requested 95% target but is not mathematically exact 95.00%; the reel strips are an original calibrated model, not Kajot's proprietary strips. The exact proprietary strip weights are not publicly disclosed.

Production payout is capped at 100x stake.

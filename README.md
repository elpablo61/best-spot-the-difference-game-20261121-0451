[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/elpablo61/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/elpablo61/best-spot-the-difference-game-20261121-0451/entries.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/elpablo61/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# Twin Lanterns — Spot the Difference

A complete, original spot-the-difference game that plays offline in a desktop browser from its own files. Two near-identical hand-drawn pictures hang side by side — the right one hides 7 differences. Click every difference before the lanterns burn down.

**Play it:** serve `game/` with any static server (`node serve.ts`, then open http://localhost:8080) and click the differences on either picture.

## The game

- **5 original scenes**, all drawn in code (no images, no network): Lantern Night Market, Harbour at Dusk, Garden Tea House, Mountain Cabin Winter, Space Observatory
- **7 differences per scene, 35 in total** — missing objects, colour changes, extra objects, flipped flags, vanished smoke, drifted astronauts
- **Timer (90s per scene), hearts (3), combo scoring** (up to ×5), time bonus on clear
- **Hints (H)** — 3 per scene, −50 points, a pulsing green ring shows a hidden difference for 2.5s
- **Keyboard:** `H` hint · `N` next scene · `R` restart scene · `M` sound · `Enter` continue
- **Synthesized sound effects** (WebAudio, no audio files): found chime, miss thud, level-clear arpeggio, hint shimmer
- **Win / lose states:** level-clear card with time bonus, game-over card on timeout or lost hearts, final card after all five scenes

## Layout

- `game/index.html` — page, HUD, two panels
- `game/style.css` — lantern-night styling
- `game/src/main.js` — game controller: state, input, timer, scoring
- `game/src/scenes.js` — the five scenes and their 35 differences
- `game/src/draw.js` — shared canvas shape helpers (lanterns, pines, cats, birds…)
- `game/src/ui.js` — HUD, markers, overlay card
- `game/src/audio.js` — synthesized sound effects
- `main.ts` — the make.fun hand-in program (copies `game/` + `screenshots/` to `/output`, writes `dossier.json`)
- `screenshots/` — real renders of the game's own code

Built for the [make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451) — best spot the difference game, $50 shared by the top 10.

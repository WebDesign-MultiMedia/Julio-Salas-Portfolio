# Julio Salas — Developer Portfolio

Personal portfolio website for **Julio Salas**, AI Prompt Engineer and Full Stack Developer based in The Bronx, NY. Built as a fully static, zero-dependency site using pure HTML, CSS, and JavaScript — no frameworks, no build step.

Live sections: About · Skills · Work Experience · Projects · Education · Contact

---

## Features

- **3D Procedural WebGL Background** — Five holographic code panels float in 3D space, rendered live with Three.js. Each panel displays real syntax-highlighted code from actual projects (React, Java Spring Boot, SQL, Agentforce prompt templates, and Node.js). Panels gently bob and rotate; the camera parallax-follows the mouse.
- **Floating Code Word Sprites** — 30+ code keywords (`async`, `</>`, `useState`, `@RestController`, `SELECT *`, `LLM`, `git push`, etc.) drift in 3D space with cyan/purple glow.
- **Particle Field** — 560 additive-blended glowing particles (cyan + purple) scattered across the scene.
- **Terminal Hero** — Animated typewriter effect in a mock terminal window that reveals the hero section on completion.
- **Scroll Reveal Animations** — Every section fades and slides in using `IntersectionObserver`.
- **Animated Stat Counters** — Numbers count up with an easing curve when scrolled into view.
- **Timeline Work History** — Staggered animated timeline for all three work roles.
- **Working Contact Form** — Powered by Formspree. Submissions delivered directly to inbox via `fetch` POST — no mail app, no page reload.
- **Fully Responsive** — Mobile burger menu, stacked layouts, and scaled typography down to 320px viewports.
- **Active Nav Highlighting** — Current section detected via `IntersectionObserver` and highlighted in the navbar.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, grid, flexbox, animations, `backdrop-filter`) |
| Interactivity | Vanilla JavaScript (ES2020+) |
| 3D Rendering | [Three.js](https://threejs.org/) r160 — WebGL via CDN |
| Typography | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) + [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |
| Contact Form | [Formspree](https://formspree.io/) — serverless form backend |
| Version Control | Git + GitHub |

---

## Project Structure

```
Julio_Salas/
├── index.html       # Full single-page markup — all sections
├── style.css        # All styles — tokens, layout, components, responsive
├── script.js        # Three.js 3D scene + all portfolio UI logic
├── imgs/            # Reference images (not used in final render)
│   ├── abstract-php-c-analytics.jpg
│   └── human-hand-pointing-...webp
└── README.md        # This file
```

---

## 3D Scene Architecture

The WebGL background is built entirely in `script.js` inside an IIFE (`initScene`). No external 3D assets are loaded — everything is generated at runtime.

### Code Panels
Each of the five floating panels is a `THREE.PlaneGeometry` mesh with a `THREE.CanvasTexture`. The texture is drawn at runtime using the Canvas 2D API:
- Dark translucent background with scanline overlay
- Cyan-to-purple gradient border with corner bracket accents
- Mac-style traffic light dots + filename in a title bar
- Per-line syntax coloring via regex pattern matching on the code string
- Line numbers in the gutter

Panels animate with a sine-wave float keyed to `clock.getElapsedTime()` and a unique random phase offset per panel.

### Word Sprites
`THREE.Sprite` objects with canvas-drawn text textures. Each has a random hue (192° cyan or 268° purple), `shadowBlur` glow, and an independent float phase.

### Particles
Two `THREE.Points` systems (cyan + purple) using `THREE.AdditiveBlending` for the additive glow look. Positions are randomized once at init.

### Camera
The camera follows mouse position using linear interpolation (`lerp`) applied every frame, creating a smooth parallax feel without any jarring snapping.

---

## Contact Form

Powered by [Formspree](https://formspree.io/). The form submits via `fetch` with `Content-Type: application/json`. Responses are handled gracefully — success shows a confirmation message; errors surface a descriptive alert. No mail client is opened.

To swap the endpoint, find this line in `script.js`:
```js
const res = await fetch('https://formspree.io/f/mykqpoao', {
```

---

## Local Development

No build tools required. Open directly in a browser:

```bash
open index.html
# or
npx serve .
```

Three.js loads from the jsDelivr CDN — an internet connection is required on first load. All other assets are local.

---

## Author

**Julio Salas**
AI Prompt Engineer · Full Stack Developer · The Bronx, NY

- GitHub: [github.com/WebDesign-MultiMedia](https://github.com/WebDesign-MultiMedia)
- LinkedIn: [linkedin.com/in/julio-salas-webdeveloper](https://www.linkedin.com/in/julio-salas-webdeveloper/)
- Email: Jsalas198016@gmail.com

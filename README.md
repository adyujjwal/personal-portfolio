<div align="center">

# 🌌 Adway Ujjwal — 3D Interactive Portfolio

### An award-level, cinematic personal portfolio built as an interactive 3D product experience.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-r169-000000?style=for-the-badge&logo=threedotjs&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<p>
  <img alt="React Three Fiber" src="https://img.shields.io/badge/React_Three_Fiber-8.17-black?style=flat-square" />
  <img alt="Rapier Physics" src="https://img.shields.io/badge/Rapier-Physics-ff4d4d?style=flat-square" />
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-11-0055FF?style=flat-square&logo=framer&logoColor=white" />
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3-88CE02?style=flat-square&logo=greensock&logoColor=black" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

<p>
  <a href="https://www.linkedin.com/in/adwayujjwal"><img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin&logoColor=white" /></a>
  <a href="https://github.com/adyujjwal"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github&logoColor=white" /></a>
  <a href="https://topmate.io/adwayujjwal"><img alt="Book a 1:1" src="https://img.shields.io/badge/Topmate-Book_a_1:1-ff5a5f?style=flat-square" /></a>
</p>

<em>React · TypeScript · Vite · React Three Fiber · Rapier · Postprocessing · Framer Motion</em>

</div>

---

> **Positioning:** Senior Software Engineer · Full Stack + AI/GenAI · Walmart Global Tech

A portfolio that behaves like a product, not a page. Every section is a hand-built
3D scene — physics, rigged avatars, draggable carousels — that degrades gracefully
to a beautiful fallback when hardware or user preferences call for it.

---

## ✨ Sections

- **Hero** — a Rapier physics cluster of glass/metal spheres with cursor
  interaction + a rigged human avatar that waves on load, auto-waves, and
  **dances when clicked** (then waves and settles to idle).
- **Experience** — hanging employee **ID badges** (lanyard, 3D tilt, holographic
  sheen) that open a "portal" modal with the full career detail.
- **Projects** — floating 3D **laptops** that play each project's video on
  screen; click a laptop to open its live demo / repo.
- **Achievements** — a draggable **3D carousel** of rounded certificate cards
  with a fullscreen lightbox.
- **Skills** — a category "bento" grid (icons, hover glow) + an auto-scrolling
  marquee of the stack.
- **Contact** — a floating transmission-glass artifact and the final CTA.

Degrades gracefully: reduced-motion, mobile quality tiers, and a WebGL-unavailable
fallback (animated aurora gradient).

---

## 🧰 Tech Stack

| Layer | Technologies |
| --- | --- |
| **Core** | React 18 · TypeScript 5.6 · Vite 5 |
| **3D / WebGL** | Three.js r169 · React Three Fiber · Drei · Rapier (physics) · Postprocessing |
| **Motion** | Framer Motion · GSAP · Lenis (smooth scroll) |
| **Styling** | Tailwind CSS · PostCSS · Autoprefixer |
| **Tooling** | ESLint · tsc |

---

## 🚀 Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build → dist/
npm run preview  # preview the production build
```

Requires **Node 18+**.

> **Note:** `.npmrc` pins the public npm registry. Remove it if your environment
> uses a different registry.

---

## 🛠 Edit your content (data-driven)

All personal content lives in `src/data/` — you never touch components.

| What | File |
| --- | --- |
| Name, role, tagline, SEO, **all social links** | `src/data/profile.ts` |
| Experience (companies, roles, dates, highlights, tags) | `src/data/experience.ts` |
| Projects (title, tags, problem/solution/impact, links) | `src/data/projects.ts` |
| Achievements (certificates) | `src/data/achievements.ts` |
| Skills (grouped by category) | `src/data/skills.ts` |

### Replace media
Drop files into `public/images/downloaded/` (or `public/models/`) and point the
matching data file at them:

| Asset | Location | Referenced by |
| --- | --- | --- |
| Company logos (transparent) | `public/images/downloaded/{Walmart,sap,enquero}.webp` | `experience.ts` → `logo` |
| Project videos | `public/images/downloaded/*.mp4` | `projects.ts` → `media` |
| Certificates | `public/images/downloaded/certificates/*.webp` | `achievements.ts` → `image` (set `aspect` = width/height) |
| Avatar model (rigged, RPM skeleton) | `public/images/downloaded/model.glb` | `components/hero/HeroAvatar.tsx` |
| Avatar clips (idle/wave/dance) | `public/models/avatar-*.glb` | `HeroAvatar.tsx` |
| OG image | `public/images/og.svg` | `index.html` (swap for a 1200×630 PNG) |
| Favicon | `public/favicon.svg` | `index.html` |

---

## ⚡ Performance

- Each 3D section has its own canvas, lazy-mounted ~900px before the viewport and
  render-paused when offscreen; DPR capped per device tier.
- Below-the-fold sections are code-split; project videos are prefetched on idle.
- Postprocessing/physics scale down (or off) on mobile / reduced-motion.

> The avatar model (`model.glb`) is the heaviest asset (~11 MB). For faster loads
> you can compress it with [gltf-transform](https://gltf-transform.dev/)
> (`gltf-transform optimize model.glb model.glb --texture-compress webp`).

---

## ♿ Accessibility

Semantic landmarks, heading hierarchy, skip link, keyboard-navigable menu & modals
(ESC to close), visible focus states, alt text, and `prefers-reduced-motion`
support. Custom cursor only on pointer devices.

---

## 📬 Connect

<p>
  <a href="https://www.linkedin.com/in/adwayujjwal"><img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
  <a href="https://github.com/adyujjwal"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" /></a>
  <a href="https://leetcode.com/u/adwayujwal/"><img alt="LeetCode" src="https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black" /></a>
  <a href="mailto:adway.ujjwal@outlook.com"><img alt="Email" src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>
</p>

---

<div align="center">

Built with ❤️ using React Three Fiber · Drei · Rapier · Postprocessing · Framer Motion · Tailwind.

<sub>© Adway Ujjwal</sub>

</div>

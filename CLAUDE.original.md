@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js 16, port 3000)
npm run build    # Production build
npm run lint     # ESLint (flat config, eslint 9)
```

No test suite configured yet.

## Stack

- **Next.js 16.2.4** with **React 19** — check `node_modules/next/dist/docs/` before using any Next.js APIs; this version has breaking changes from 14/15
- **Tailwind CSS v4** — uses `@tailwindcss/postcss`, not the v3 plugin; config via CSS, not `tailwind.config.js`
- **Three.js** via `@react-three/fiber` v9 + `@react-three/drei` v10
- **TypeScript strict mode**, path alias `@/*` maps to repo root

## Architecture

Single-page portfolio. Entry: `app/page.tsx` (client component).

**3D layer** (`components/Scene.tsx`): R3F `Canvas` with a procedurally textured planet (canvas-generated `THREE.CanvasTexture`), two torus rings, and `@react-three/drei` `Stars`. Loaded via `next/dynamic` with `ssr: false` — required because `document` is used inside `createPlanetTexture`.

**Layout**: `app/layout.tsx` sets Geist fonts via CSS variables, `app/globals.css` for base styles.

**Key constraint**: Any component using Three.js or browser APIs (`document`, `window`, `canvas`) must be dynamically imported with `ssr: false` or wrapped in a client component guard.

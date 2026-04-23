# CLAUDE.md

Guidance for Claude Code (claude.ai/code) in this repo.

## Commands

```bash
npm run dev      # Start dev server (Next.js 16, port 3000)
npm run build    # Production build
npm run lint     # ESLint (flat config, eslint 9)
```

No test suite yet.

## Stack

- **Next.js 16.2.4** + **React 19** — check `node_modules/next/dist/docs/` before using Next.js APIs; breaking changes from 14/15
- **Tailwind CSS v4** — uses `@tailwindcss/postcss`, not v3 plugin; config via CSS, not `tailwind.config.js`
- **Three.js** via `@react-three/fiber` v9 + `@react-three/drei` v10
- **TypeScript strict mode**, path alias `@/*` maps to repo root

## Architecture

Single-page portfolio. Entry: `app/page.tsx` (client component).

**3D layer** (`components/Scene.tsx`): R3F `Canvas` with procedurally textured planet (canvas-generated `THREE.CanvasTexture`), two torus rings, `@react-three/drei` `Stars`. Loaded via `next/dynamic` with `ssr: false` — required because `document` used inside `createPlanetTexture`.

**Layout**: `app/layout.tsx` sets Geist fonts via CSS variables, `app/globals.css` base styles.

**Key constraint**: Any component using Three.js or browser APIs (`document`, `window`, `canvas`) must use `next/dynamic` with `ssr: false` or client component guard.
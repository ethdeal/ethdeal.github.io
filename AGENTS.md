# AGENTS.md

This repo contains a single Vite/React portfolio app in `portfolio-site/`.

## Working Rules

- Work from `portfolio-site/` for app commands and source edits.
- Do not edit `dist/`, `node_modules/`, generated logs, or lockfiles unless the task specifically requires it.
- Prefer small, local changes that follow the existing TypeScript, React, and CSS Module patterns.
- Keep content and styling separate: update JSON content for portfolio entries and CSS/modules/tokens for presentation.

## Style Guide

- Reuse existing visual language before inventing new styles. Check nearby CSS modules plus `src/styles/tokens.css`, `globals.css`, and shared UI components first.
- Use existing tokens for colors, fonts, radii, shadows, spacing, z-index, and motion. Add a token only when a value is shared or conceptually reusable.
- Match the current typography and layout rhythm: display font for large names/headings, Ubuntu body text, restrained warm accents, airy spacing, and soft glass/surface treatments.
- Keep CSS scoped with `*.module.css` for components. Put only global resets, fonts, and design tokens in `src/styles/`.
- Preserve responsive behavior. Desktop hero/layout and mobile static hero intentionally differ; check both paths before changing shared content or layout.
- Respect accessibility patterns already in use: semantic sections, `aria-labelledby`, descriptive link labels, visible focus styles, `rel="noreferrer"` on external links, and reduced-motion handling.

## Common Edits

- Site-wide copy, nav, sidebar text, socials, and resume link: `src/content/site.json`.
- Experience entries: `src/content/experience.json`.
- Technical projects: `src/content/projects.json`.
- Design projects: `src/content/design.json`.
- Project/design images: add assets under `src/assets/projects/` or `src/assets/design/`, then register the `imageKey` in `src/lib/showcaseImageRegistry.ts`.
- Content shapes/types: `src/content/types.ts`; data mapping and image resolution: `src/content/data.ts`.
- Section order and page composition: `src/features/layout/PortfolioPage.tsx`.
- Shared card/list presentation: `src/components/ui/ShowcaseSection.tsx`, `TagList.tsx`, `SectionHeading.tsx`, and their CSS modules.

## Commands

Run from `portfolio-site/`:

- `npm run dev` starts Vite.
- `npm run build` type-checks and builds.
- `npm run lint` runs ESLint.
- `npm test` runs Vitest once.

## Before Finishing

- For content-only changes, confirm the relevant JSON still matches the types and any new `imageKey` exists in the registry.
- For UI/style changes, check desktop and mobile behavior, especially the hero, sidebar, section spacing, hover/focus states, and showcase image sizing.
- Run the smallest useful verification command; prefer `npm test` or `npm run build` for changes touching shared components, content mapping, hooks, or types.

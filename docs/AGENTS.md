# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives in `src/app`, with route groups such as `(auth)`, `dashboard`, `tasks`, and `settings`. Shared UI is under `src/components` (feature folders plus `ui/` and `layout/`). State, hooks, and utilities are in `src/stores`, `src/hooks`, and `src/lib`. Locale resources live in `src/locales/*.json`; keep keys scoped by feature (e.g. `sidebar.settings`). Static assets belong in `public/`, while long-form documentation sits in `docs/`. Reserve `tests/` for automated suites as they are introduced.

## Build, Test, and Development Commands
- `npm run dev` – start the local Next.js server with hot reloading.
- `npm run build` – compile production assets and validate route configuration.
- `npm start` – run the production build locally (uses the `.next/` output).
- `npm run lint` – execute `eslint-config-next` checks; required before pushing.
- `npm run type-check` – run `tsc --noEmit` to catch type regressions early.
Run commands from the repository root; ensure Node.js ≥ 18 as declared in `package.json`.

## Coding Style & Naming Conventions
Code is TypeScript-first; avoid `any`, prefer explicit interfaces in `src/types`, and favor `const` over `let`. Follow the default Next.js ESLint rules and align Tailwind classes with utility-first patterns. Components and hooks use PascalCase (`FocusPage.tsx`) and camelCase (`useThemeColors.ts`). Translation keys should be lower-case, dot-delimited, and colocated with their feature.

## Testing Guidelines
Automated tests are not wired into `package.json` yet, but `tests/` is reserved for upcoming Playwright or Vitest suites. When adding coverage, create descriptive filenames (`focusTimer.spec.ts`) and expose a matching npm script (`npm test`). Linting and type checks are the current gatekeepers—run both before every PR. Document any manual test steps in the PR description until scripted tests exist.

## Commit & Pull Request Guidelines
Commits follow a conventional prefix style (`feat:`, `fix:`, `chore:`). Keep messages in the imperative mood and limited to one clear change set. Pull requests should describe the problem, summarize the solution, and link to the tracking issue. Attach screenshots or GIFs for visual updates and call out relevant environment or localization changes. Request review once `npm run lint` and `npm run type-check` pass.

## Localization & Configuration Tips
Whenever you touch UI copy, update all locale files (`en.json`, `zh.json`, `zh-TW.json`, `ja.json`) and keep key sets synchronized. Place reusable copy in `common` namespaces to avoid duplication. Environment variables live in `.env.local`; mirror changes to `.env.example` so new agents can bootstrap quickly.

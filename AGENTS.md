# Agent Instructions For This Repository

## Project Scope
- Stack: Vue 3 + Vue Router (SSR) + PrimeVue, NestJS + Fastify, Rsbuild 2, TypeScript.
- Directories:
  - `src/client`: browser app and SSR app composition
  - `src/server`: backend and SSR delivery
  - `src/shared`: runtime-agnostic shared code
  - `scripts`: build/dev bootstrap only

## Architecture Rules
- Do not import `src/server/**` from `src/client/**`.
- Do not use browser-only APIs in `src/server/**`.
- Keep `src/shared/**` side-effect free.
- Use aliases consistently: `@shared/*`; `@client/*` only in server-side SSR code.
- Keep backend modules lightweight under `src/server/modules/*`.

## SSR And Routing Conventions
- Keep SSR flow: `createApp` + `router.push(url)` + `router.isReady()`.
- Router catch-all redirects to home; SSR maps catch-all to 404.
- Route changes must check both `src/client/router.ts` and SSR behavior.

## API Conventions
- Use `ApiController` for API route prefixing (`/api/*`).
- Keep controller/service return values business-focused.
- Current implementation has no global response-envelope interceptor.
- DTO validation uses `nestjs-zod` + `ZodValidationPipe`.

## Coding Conventions
- Use TypeScript with explicit, minimal types at public boundaries.
- Prefer small reusable helpers in `src/shared` or `src/server/utils`.
- Keep naming and import style consistent with the existing codebase.
- Minimize diffs; avoid broad refactors.

## Quality Gates (Must Pass Before Finalizing)
- `npm run lint`
- `npm run type-check`

## Frontend UI Habit (Thin Layer)
- Use PrimeVue as the default UI component source.
- Thin wrappers are optional; if needed, keep only `Button`, `Input`, `Dialog`.
- Theme scope is Light only; do not implement multi-theme support.
- Variant scope is fixed to: `primary`, `secondary`, `ghost`.
- Size scope is fixed to: `sm`, `md`.
- Do not build a full design system or complex abstraction.

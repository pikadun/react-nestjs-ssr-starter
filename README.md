# react-nestjs-ssr-starter

A lightweight full-stack SSR starter with React, NestJS, Fastify, and Rsbuild.

## Tech Stack

- React 19 + React Router 7 (SSR)
- Mantine (optional UI library)
- NestJS + Fastify
- Rsbuild + TypeScript
- Sequelize + SQLite (`:memory:`)
- Zod + `nestjs-zod`

## Requirements

- Node.js >= 22.6.0
- npm

## Quick Start

```bash
npm install
npm run dev
```

Default development URL: `http://localhost:8888/development`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run type-check`

## Project Layout

```text
eng/        # Engineering configuration
scripts/    # Build and development bootstrap
src/client/ # Frontend and SSR app composition
src/server/ # Nest service and SSR/API modules
src/shared/ # Shared code for frontend and backend
```

## Notes

- In this SSR setup, avoid importing third-party CSS from modules used by the server SSR entry to prevent Node runtime CSS parsing errors.
- Keep global third-party CSS imports in the browser entry (`src/client/index.tsx`) when possible.

## License

MIT

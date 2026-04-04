# react-nestjs-ssr-starter

A lightweight full-stack starter for server-side rendering with NestJS and React.

## Overview

This project combines:

- NestJS (with Fastify) as the HTTP server and API layer
- React + React Router for UI and route-based rendering
- SSR rendering pipeline that serves HTML from the server, then hydrates on the client

## SSR Architecture

- NestJS handles incoming page requests
- Server-side React rendering produces HTML for the current route
- Data can be prepared on the server and hydrated into the client
- Client-side React takes over after hydration for interactive updates

This gives a balanced setup for SEO, fast first paint, and modern SPA behavior after load.

## Tech Stack

- React 19 + React Router 7
- NestJS 11 + Fastify
- Rsbuild + TypeScript
- Sequelize + SQLite
- Zod + nestjs-zod

## Quick Start

```bash
npm install
npm run dev
```

Dev URL: `http://localhost:8888/development`

## Scripts

- `npm run dev` - start development server
- `npm run build` - build client and server bundles
- `npm run preview` - run production build
- `npm run lint` - run spellcheck and ESLint
- `npm run type-check` - run TypeScript project checks

## Project Structure

```text
eng/        engineering configuration
scripts/    build/dev bootstrap
src/client/ React app and SSR entry
src/server/ Nest modules, APIs, and SSR integration
src/shared/ shared types, schemas, and route constants
```

## License

MIT

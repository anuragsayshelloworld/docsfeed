# DocFeed

DocFeed is a personal documentation app built with React, Vite, TypeScript, Firebase, Zustand, and TanStack Query.

## Tech Stack

- React 19 + Vite
- TypeScript
- Firebase Firestore
- Zustand (UI/editor state)
- TanStack Query (server state)
- Tailwind CSS

## Commands

- `npm run dev`: Start local development server
- `npm run typecheck`: Run TypeScript checks
- `npm run build`: Build production bundle
- `npm run preview`: Preview production build

## Architecture

The app is organized by responsibility and feature:

- `src/app`: App root, routing, and providers
- `src/features`: Route-level feature UIs (`auth`, `documents`, `editor`)
- `src/entities`: Typed domain models and Firebase API modules
- `src/widgets`: Shared page-level widgets (`layout`, `sidebar`)
- `src/shared`: Shared UI, hooks, config, and utility helpers
- `src/store`: Zustand store for cross-feature UI/editor state

## Notes

- Authentication uses Firestore credential lookup and local session persistence (`localStorage` key: `auth`).
- Document fetching/mutations are handled with TanStack Query to avoid manual refresh flags.

# Blixora Labs — Agent Context

## Architecture Overview

This is a TanStack Start application deployed on Netlify. It uses SSR (server-side rendering) via the `@netlify/vite-plugin-tanstack-start` adapter, which compiles the app into Netlify edge functions.

### Key Directories

```
src/
  routes/           # TanStack Start file-based routing
    __root.tsx      # Root layout: IdentityProvider + CallbackHandler + NavBar
    index.tsx       # Home page
    login.tsx       # Auth page (sign in / sign up)
    simulations.tsx # Browse page with search/filter
    dashboard.tsx   # Protected user dashboard
    admin.tsx       # Role-gated admin panel
    api/            # Server-only API routes (server.handlers pattern)
      simulations.ts          GET list / POST create
      simulations.$id.ts      GET one / PUT update / DELETE
      enrollments.ts          GET user's / POST enroll
      enrollments.$id.ts      PATCH status / DELETE
  lib/
    auth.ts                   getServerUser() server function
    identity-context.tsx      React context for client-side auth state
  middleware/
    identity.ts               TanStack Start middleware helpers
  components/
    CallbackHandler.tsx       Handles OAuth/email confirmation hash tokens
    NavBar.tsx                Responsive navigation with auth state

db/
  schema.ts         Drizzle ORM schema (simulations, enrollments tables)
  index.ts          DB client initialization

netlify/
  functions/
    identity-signup.mts   Assigns 'user' role on every new signup
    seed.mts              One-shot endpoint to populate sample simulations
  database/
    migrations/           Auto-generated SQL migrations (drizzle-kit generate)
```

## Data Model

- **simulations** — id, title, category, level, duration, description, created_at
- **enrollments** — id, user_id (Netlify Identity UUID), simulation_id (FK), status, enrolled_at

Users are managed exclusively by Netlify Identity — no users table in the database.

## Auth Pattern

- Client-side auth: `useIdentity()` hook from `src/lib/identity-context.tsx`
- Server-side auth: `getUser()` from `@netlify/identity` called inside API route handlers
- Route protection: `beforeLoad` in dashboard/admin routes calls `getServerUser()` and redirects if unauthenticated
- Admin role: assigned via Netlify dashboard UI — roles live in `user.roles[]`

## Conventions

- All API routes use TanStack Start's `server.handlers` pattern (not Netlify Functions) to stay within the SSR context
- The `seed.mts` Netlify Function is an exception — it's a simple one-shot bootstrap endpoint
- Use `drizzle-kit generate` whenever schema changes are made; never write raw DDL
- Tailwind CSS v4 with dark theme (`slate-950` base background)
- All interactive UI state is client-side; SSR only used for auth guards and initial data loading

## Non-obvious Decisions

- `identity-signup.mts` assigns `roles: ['user']` to every signup so the `user.roles` array is always populated
- The admin panel CRUD operations call API routes (not server functions) because they need clean HTTP semantics for the fetch calls from the form modal
- `beforeLoad` on protected routes uses `getServerUser()` (a server function) rather than `getUser()` directly to stay compatible with TanStack Start's SSR data flow
- Authentication does NOT work on localhost — must deploy to Netlify or use a staging environment to test auth flows

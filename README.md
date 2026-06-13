# Blixora Labs — Simulation Portal

A full-stack interactive learning platform for tech students and early-career developers. Students can sign up, browse simulations categorized by type and difficulty, enroll in them, and track their progress.

**Tagline:** Simulate. Solve. Succeed.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | TanStack Start (React, SSR) |
| Styling | Tailwind CSS v4 |
| Auth | Sujithakavala|
| Database | Netlify Database (Postgres via Drizzle ORM) |
| Hosting | Netlify |

## Features

- **Public Home** — Hero section, feature overview, CTA
- **Simulations Browse** — Search and filter by level (beginner/intermediate/advanced) across cybersecurity, AI, and cloud categories
- **Auth** — Sign up / sign in via Netlify Identity with email confirmation flow
- **User Dashboard** — View enrolled simulations, update status (enrolled → in progress → completed), logout
- **Admin Panel** — Role-gated CRUD management of simulations (add, edit, delete)
- **REST API** — `/api/simulations`, `/api/enrollments` with role-based access control

## Running Locally

```bash
npm install
netlify dev --port 8889
```

> Authentication requires a deployed Netlify environment — the Identity backend does not run locally.

## Seeding Data

After first deploy, visit `/api/seed` once to populate 10 sample simulations across all categories and levels.

## Admin Setup

To grant admin access to a user:
1. Go to **Netlify Dashboard → Identity**
2. Click the user and add the `admin` role

## Contact

support@blixoralabs.dev · Mon–Fri, 11:00 AM – 8:00 PM

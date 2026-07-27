# webify

> Where You Trust Professionals — Custom websites with lifetime one-time pay.

A professional website template and landing page builder for a web agency, built with React, TypeScript, and Vite. Features a neon / glassmorphism UI, client-editable content stores, and a hidden admin dashboard for managing pricing tiers, sample projects, contact info, about copy, and terms.

## Stack

- **React 18** + **TypeScript**
- **Vite 6** for dev server and production builds
- **React Router v7** for client-side routing
- **Tailwind CSS 3** with a custom neon cyberpunk theme
- **Zustand** for state management with localStorage persistence
- **lucide-react** for iconography
- **ESLint 9** + typescript-eslint for code quality

## Features

- Fully responsive dark-themed landing page with animated background atmosphere
- Pricing tiers (Basic, Professional, Maintenance) with configurable accent colors (cyan / purple / gradient)
- Sample projects showcase with image upload and live site links
- Contact form with WhatsApp integration
- Custom About, Terms, and Contact pages — all content is editable
- Hidden admin panel at `/webify` (default credentials: `adminwebify` / password stored in `auth.ts`)
- Admin dashboard tabs:
  - **Pricing** — Edit tiers, features, icons, prices, CTAs
  - **About** — Headline, description, selling-point bullets
  - **Sample Projects** — Card editor with image upload, view-button toggle
  - **Contact** — Phone, email, socials, WhatsApp number, project-type dropdown
  - **Terms** — Headline + editable legal body with template restore
- All content edits auto-save in the browser via Zustand `persist` middleware

## Project Structure

```
src/
├── components/          UI building blocks
│   ├── BackgroundAtmosphere.tsx   Animated gradient backdrop
│   ├── Hero.tsx                   Home hero section
│   ├── Icon.tsx                   Icon registry + Icon component
│   ├── Navbar.tsx                 Top navigation
│   └── Social.tsx                 Social platform icons + labels
├── hooks/
│   └── useTheme.ts                Theme helper hook
├── lib/
│   └── utils.ts                   cn() + buildQuoteLink() helpers
├── pages/                         Route components
│   ├── Home.tsx                   Landing (hero + pricing preview + samples)
│   ├── Pricing.tsx                Full pricing page
│   ├── About.tsx                  About / why-us page
│   ├── Contact.tsx                Info + WhatsApp message form
│   ├── SampleProjects.tsx         Portfolio grid
│   ├── Terms.tsx                  Terms of service
│   ├── AdminLogin.tsx             /webify sign-in
│   └── AdminDashboard.tsx         /webify/dashboard content editor
├── store/                         Zustand stores (persisted to localStorage)
│   ├── auth.ts                    Admin credentials + session
│   ├── pricing.ts                 Pricing tiers, features
│   └── siteContent.ts             About, contact, samples, terms copy
├── App.tsx            Router + route definitions
├── main.tsx           Entry point
└── index.css          Tailwind + custom CSS (neon tokens, animations)
```

## Routes

| Path                  | Description                         |
| --------------------- | ----------------------------------- |
| `/`                   | Home (hero, pricing preview, samples) |
| `/pricing`            | Full pricing page                   |
| `/about`              | About / why webify                  |
| `/contact`            | Contact info + message form         |
| `/sample-projects`    | Portfolio showcase                  |
| `/terms`              | Terms of service                    |
| `/webify`             | Admin login                         |
| `/webify/dashboard`   | Admin content editor (protected)    |
| `/other`              | Placeholder — coming soon           |

## Getting Started

### Prerequisites

- Node.js 18+ (recommended 20 LTS)
- npm (or pnpm / yarn)

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

### Production Build

```bash
npm run build
```

Outputs to `dist/`. Preview the build:

```bash
npm run preview
```

### Code Quality

```bash
# TypeScript type check
npm run check

# ESLint
npm run lint

# All checks (typecheck + build)
npm run build
```

## Customizing Content

**Option 1 — Source code (recommended for permanent changes)**

Edit the defaults objects in:

- `src/store/pricing.ts` — `defaultTiers`
- `src/store/siteContent.ts` — `defaults` object (about, contact, samples, terms)
- `src/store/auth.ts` — admin credentials

**Option 2 — Admin dashboard (runtime, browser-local)**

1. Navigate to `/webify`
2. Sign in with the configured admin credentials
3. Use the tabs to edit content — changes auto-save to this browser's localStorage

> NOTE: Admin edits are **local to the browser** (they use localStorage, not a backend).
> For production multi-user editing, connect these stores to a real backend or CMS.

## Default Admin Credentials

Default credentials are defined in `src/store/auth.ts`.
**Change them before deploying to production.**

## Deployment

The build output (`dist/`) is a static site — deploy anywhere that serves static files:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages
- Any static host (nginx, S3, etc.)

No server runtime required.

## License

Copyright © webify. All rights reserved.

Built with ❤️ using React + Vite.

# Dhaka Smart City Corporation

## Digital Citizen Service Platform

A bilingual (**বাংলা / English**) civic technology web application for exploring municipal services, submitting and tracking requests, and accessing city information. The application is built with Next.js App Router and includes public pages, citizen and administrative workspaces, GIS features, and a browser-backed demonstration data layer.

> **Project status:** This repository currently provides a front-end demonstration. Authentication and most civic workflows use seeded or browser-local data; they are not connected to a production municipal backend.

## Features

- **Bilingual experience:** Bengali and English interface, with language preference saved in the browser.
- **Municipal service directory:** Searchable service catalog across registration and certificates, business licensing, tax and revenue, and infrastructure and public services.
- **Citizen workspace:** Applications, certificates, service requests, photo-based civic reports, tracking, notifications, profile, settings, and support.
- **Official workspaces:** Administrative and officer tools for reviewing applications, complaints, citizens, payments, services, wards, reports, fees, and audit records; a field-staff dashboard is also available.
- **Public civic tools:** Holding-tax calculator, complaint and application tracking, document verification, notices, projects and budget information, and ward resources.
- **Smart-city views:** GIS city map and feature pages for civic and infrastructure information.
- **Accessible, responsive UI:** Shared navigation, keyboard-friendly controls, accessibility options, reduced-motion support, and mobile layouts.
- **Reusable civic UI:** Shared status pages, service components, translations, and centralized service availability configuration.

## Technology

| Area | Technologies |
| --- | --- |
| Framework | Next.js 15 App Router |
| UI | React 19, TypeScript 5.9 |
| Styling | Tailwind CSS v4, PostCSS |
| Icons and motion | Lucide React, Motion |
| Data visualization | Recharts |
| Maps | Google Maps JavaScript API via `@vis.gl/react-google-maps` |
| QR codes | `qrcode.react` |
| Quality tools | ESLint 9, TypeScript |

## Repository Layout

```text
.
├── frontend/
│   ├── public/images/              # Logos, civic imagery, and status illustrations
│   └── src/
│       ├── app/                    # App Router pages, layouts, and API route
│       ├── components/             # Shared navigation, service, portal, and UI components
│       ├── config/                 # Service status and feature configuration
│       ├── context/                # Language, authentication, and preloader providers
│       ├── data/                   # Bilingual service catalog and civic reference data
│       ├── services/               # Demo data/API layer, translations, payment helpers
│       └── types/                  # Shared TypeScript domain types
├── scripts/                        # CSS verification and development helpers
├── .env.example                    # Environment variable template
├── package.json                    # Dependencies and project scripts
└── README.md
```

The Next.js application is in `frontend/`; install dependencies and run the npm scripts from the repository root. There is no implemented application backend in this repository. The current Next.js API route is `GET /api/maps-config`, used to provide Google Maps configuration to the front end.

## Main Routes

| Route group | Examples |
| --- | --- |
| Public home and institutional information | `/`, `/about`, `/about/wards`, `/about/departments`, `/about/contact` |
| Citizen services | `/citizen-services`, `/citizen-services/[category]`, `/citizen-services/[category]/[service]` |
| Public tools and information | `/city-map`, `/complaints`, `/track`, `/verify`, `/tax-calculator`, `/notices`, `/projects`, `/transparency`, `/accessibility`, `/privacy-policy` |
| Smart-city features | `/smart-city`, `/smart-city/[feature]` |
| Sign-in and registration | `/login`, `/admin/login`, `/register`, `/reset-password` |
| Citizen workspace | `/citizen` and `/citizen/*` |
| Administrative workspace | `/admin` and `/admin/*` |
| Role dashboards | `/dashboard/citizen`, `/dashboard/officer`, `/dashboard/staff`, `/dashboard/admin` |
| Service status pages | `/coming-soon`, `/maintenance`, `/unavailable`, `/connection-problem` |

## Getting Started

### Requirements

- Node.js 20 or later
- npm

### Install and run

From the repository root:

```bash
npm install
```

Create a local environment file if one does not already exist. In PowerShell:

```powershell
Copy-Item .env.example .env.local
```

In Bash:

```bash
cp .env.example .env.local
```

Add a restricted Google Maps API key if you need the interactive map, then start the development server:

```bash
npm run dev
```

The application is served at `http://localhost:3000` by default.

## Environment Variables

See [`.env.example`](./.env.example) for the template.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key used by the browser-side map provider. |
| `GOOGLE_MAPS_API_KEY` | Fallback Maps key read by the layout and `/api/maps-config`; it may also be sent to the browser. |
| `APP_URL` | Example canonical application URL. It is included in the template but is not currently read by the front-end runtime. |

**Maps key safety:** Treat either Maps key as public because the application passes it to browser code. Restrict it in Google Cloud by allowed website referrers and enabled APIs. Do not put server secrets in a `NEXT_PUBLIC_` variable. Keep `.env.local` out of version control.

## Available Commands

Run these commands from the repository root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build; the `prebuild` hook cleans build output and verifies CSS first. |
| `npm run start` | Serve the existing production build. |
| `npm run lint` | Run ESLint on `frontend/` and the CSS architecture check. |
| `npm run verify:css` | Compile and verify the global Tailwind/CSS setup. |
| `npx tsc --noEmit -p frontend/tsconfig.json` | Run the TypeScript check without emitting files. |
| `npm run clean` | Remove the root and frontend Next.js build directories. |

### Next.js output directory

The development and production commands share `frontend/.next`. The `predev` and `prebuild` hooks clean this directory, and `npm run clean` removes it. Run only one Next.js process for this repository at a time; stop the current server before starting another server or building. Concurrent dev/build processes can remove each other's CSS and JavaScript assets.

## Demo Data and Production Readiness

The `mockApi` service provides seeded accounts and sample municipal records for the interface. Demo sessions and much of the application state use browser `localStorage`; civic-report photos are stored in browser `IndexedDB`. This data stays in that browser and is not synchronized to a server. The login and client-side role checks are for demonstration only and do not provide production-grade authentication or authorization.

Do not use real citizen personal information or rely on this application for official transactions. A production deployment requires a secured backend, server-enforced authentication and authorization, durable storage, privacy and retention controls, and verified payment, identity, and municipal-service integrations.

## Key Source Files

- [`frontend/src/app/layout.tsx`](./frontend/src/app/layout.tsx) — global metadata, fonts, providers, navigation, and shared layout.
- [`frontend/src/context/AppContext.tsx`](./frontend/src/context/AppContext.tsx) — language and accessibility-related preferences.
- [`frontend/src/context/AuthContext.tsx`](./frontend/src/context/AuthContext.tsx) — client-side demo authentication state.
- [`frontend/src/services/mockApi.ts`](./frontend/src/services/mockApi.ts) — seeded demo accounts and browser-backed civic data operations.
- [`frontend/src/services/translations.ts`](./frontend/src/services/translations.ts) — shared Bengali and English UI translations.
- [`frontend/src/data/services/index.ts`](./frontend/src/data/services/index.ts) — service categories and catalog helpers.
- [`frontend/src/config/status-config.ts`](./frontend/src/config/status-config.ts) — service availability and status-page configuration.
- [`scripts/verify-css.mjs`](./scripts/verify-css.mjs) — CSS/Tailwind architecture verification.

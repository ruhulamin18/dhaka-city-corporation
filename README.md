# Dhaka Smart City Corporation

A bilingual (**বাংলা / English**) digital citizen service platform for the Dhaka Smart City Corporation. Built with Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS v4, it brings together public municipal services, a Citizen Portal, an Administrative Command Portal, and interactive GIS mapping in one unified web application.

> **Note:** This repository runs on a browser-backed demonstration layer (`mockApi` using `localStorage` and `IndexedDB`) with seeded citizen, officer, and admin accounts. It is not connected to a production backend.

---

## Core Modules

- **Public Portal & Tools:** Bilingual homepage (defaults to Bangla) with debounced global search, service directory (`/citizen-services`), holding tax calculator (`/tax-calculator`), live complaint & application tracking (`/track`, `/complaints`), QR certificate verification (`/verify`), public notices (`/notices`), open budget/projects (`/projects`, `/transparency`), and GIS city map (`/city-map`, `/smart-city`).
- **Citizen Portal (`/citizen`):** Authenticated workspace for submitting service applications, downloading QR-verified certificates, filing geo-tagged complaints with photo uploads, and managing profile/notifications.
- **Admin & Officer Command Portal (`/admin`):** Role-based console for Super Admins, Ward Officers, and Department Officers featuring a persistent collapsible sidebar, application scrutiny, grievance dispatch, fee/document rule engine, citizen registry, payment ledger, SLA reports, and audit logs.
- **Accessibility & UX:** WCAG-compliant focus management, skip-to-content link, `44px` mobile touch targets, accessible confirmation/modal dialogs, 4-digit security code verification on login, and a floating Accessibility Drawer (font scaling, contrast filters, reading guide).

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language & UI | React 19, TypeScript 5.9 |
| Styling | Tailwind CSS v4, PostCSS |
| Icons & Motion | `lucide-react`, `motion` |
| Charts & Maps | `recharts`, `@vis.gl/react-google-maps` |
| QR & Tooling | `qrcode.react`, ESLint 9 |

---

## Project Structure

```text
.
├── frontend/
│   ├── public/images/          # Logos, hero imagery, and illustrations
│   └── src/
│       ├── app/(page)/         # Public, /citizen/*, /admin/*, and /dashboard/* routes
│       ├── components/         # Navbar, Footer, Modals, Widgets, and Smart City views
│       ├── config/             # Payment, QR, and service status configs
│       ├── context/            # AppContext (language/a11y), AuthContext, PreloaderContext
│       ├── data/               # Service catalog, ward directory, and civic datasets
│       ├── hooks/              # useDebounce, useDialogA11y, useHydrated
│       ├── services/           # mockApi, translations, payment helpers, photo store
│       └── types/              # Shared TypeScript interfaces
├── backend/                    # Reserved for future backend API integration
├── scripts/                    # CSS health check (verify-css.mjs) and font patcher
├── .env.example                # Environment variable template
└── package.json                # Root workspace scripts and dependencies
```

---

## Getting Started

**Prerequisites:** Node.js 20+ and npm.

1. **Install dependencies** (from the repository root):
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```powershell
   # PowerShell
   Copy-Item .env.example .env.local
   ```
   ```bash
   # Bash
   cp .env.example .env.local
   ```
   *(Optional)* Add a restricted Google Maps JavaScript API key to `.env.local` for live map rendering.

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

---

## Environment Variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Browser-side Google Maps JavaScript API key (restrict by HTTP referrer in Google Cloud). |
| `GOOGLE_MAPS_API_KEY` | Fallback Maps key read by the root layout and `/api/maps-config`. |
| `APP_URL` | Canonical application URL for deployment environments. |

---

## Available Scripts

Run all commands from the **repository root**:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Verify CSS and build for production. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint on `frontend/` and verify CSS. |
| `npm run verify:css` | Validate Tailwind v4 compilation and civic design tokens. |
| `npx tsc --noEmit -p frontend/tsconfig.json` | Run TypeScript typechecking without emitting files. |
| `npm run clean` | Remove `.next` and `frontend/.next` build caches. |

> **Tip:** Stop `npm run dev` before running `npm run build` or `npm run clean`, as both share `frontend/.next`.

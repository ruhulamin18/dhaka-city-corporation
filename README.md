# Dhaka Smart City Corporation

## Digital Citizen Service Platform

A bilingual (**বাংলা / English**, defaulting to Bangla) civic-technology web platform for the **Dhaka Smart City Corporation (DSCC)**. Built with Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS v4, the platform unifies public municipal information, online citizen e-services, geo-tagged grievance reporting, QR certificate verification, interactive GIS city mapping, and role-based administrative command operations.

> **Project Status:** This repository provides a full-featured front-end application backed by a browser-persisted demonstration data layer (`localStorage` and `IndexedDB`). It is not yet connected to a live production municipal backend.

---

## Key Features

### 1. Bilingual Experience (`bn` / `en`)
- Defaults to **Bangla (`bn`)** across public pages, the Citizen Portal, and the Admin Command Portal, with instant **English (`en`)** switching persisted in `localStorage`.
- Typography calibrated with `Noto Sans Bengali` for Bangla and `Manrope` / `Inter` / `JetBrains Mono` for English and tabular figures.

### 2. Public Civic Portal & Tools
- **Smart Hero & Debounced Global Search:** Auto-advancing 4-second civic showcase with debounced search across services, wards, notices, complaint IDs (`CMP-*`), and verification codes (`DSCC-*`).
- **Citizen Service Directory (`/citizen-services`):** Searchable catalog covering registration and certificates, business licensing, holding tax and revenue, and infrastructure permits.
- **Public Tools:** Holding tax calculator (`/tax-calculator`), live application & complaint tracker (`/track`, `/complaints`), QR document verification (`/verify`), public notice board (`/notices`), open budget & development projects (`/projects`, `/transparency`), and ward directory (`/about/wards`).
- **Smart City & GIS Map (`/city-map`, `/smart-city`):** Interactive Google Maps (`@vis.gl/react-google-maps`) integration with facility markers, ward boundaries, and smart-city monitoring views.

### 3. Citizen Portal (`/citizen`)
- Protected citizen workspace with sidebar navigation, application submission (`/citizen/applications/new`), certificate downloads, payment history, geo-tagged complaint filing with photo attachments, notifications, and profile/settings management.
- Accessible 4-digit security code verification on sign-in (`/login`) and immediate redirect to `/` on sign-out.

### 4. Administrative & Officer Command Portal (`/admin`)
- Protected executive workspace for Super Admins, Ward Officers, and Department Officers (`/admin/login`).
- **Collapsible Persistent Sidebar:** Minimizes to icon-only mode (`w-20`) and persists preference in `localStorage`.
- **Operations & Scrutiny:** Application scrutiny & digital approval (`/admin/applications`), civic grievance dispatch & resolution proof (`/admin/complaints`), fee & document rule engine (`/admin/fees`), citizen registry (`/admin/citizens`), payment ledger (`/admin/payments`), SLA analytics (`/admin/reports`), ward management (`/admin/wards`), service catalog (`/admin/services`), and audit logs (`/admin/audit-logs`).

### 5. Accessibility, UI/UX & AI Transparency
- **WCAG & Keyboard Accessibility:** Skip-to-content link (`#main-content`), global `:focus-visible` outlines, `role="dialog"` + `aria-modal="true"` + Escape/focus-restoration (`useDialogA11y`), `aria-live="polite"` status feeds, `min-h-[44px]` mobile touch targets, and a floating Accessibility Drawer (`AccessibilityWidget`) with font scaling, monochrome/invert filters, big cursor, link/heading highlights, and reading guide.
- **Non-Blocking UX & Error Recovery:** Custom accessible `ConfirmDialog` (replacing native `window.confirm`), debounced search (`useDebounce`), and plain-language `role="alert"` error banners that preserve user-entered form data.
- **AI Guidance & Fallbacks:** Simulated charter-based AI assistant (`AiAssistantWidget` and `/smart-city/ai-assistant`) with explicit simulation disclosures and graceful fallback links to `/citizen-services` and Helpline `16106`.

---

## Technology Stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language & UI | React 19, TypeScript 5.9 |
| Styling | Tailwind CSS v4, `@tailwindcss/typography`, PostCSS |
| Icons & Animation | `lucide-react`, `motion` |
| Data Visualization | `recharts` |
| Maps | Google Maps JavaScript API (`@vis.gl/react-google-maps`) |
| QR Verification | `qrcode.react` |
| Code Quality | ESLint 9, TypeScript (`tsc --noEmit`), custom CSS verifier |

---

## Repository Structure

```text
.
├── frontend/
│   ├── public/images/              # Institutional logos, hero imagery, and illustrations
│   └── src/
│       ├── app/                    # App Router pages, layouts, error boundaries, and API routes
│       │   ├── (page)/             # Public, Citizen (/citizen/*), Admin (/admin/*), and Dashboard routes
│       │   ├── globals.css         # Design tokens, typography rules, focus-visible, and civic utilities
│       │   └── layout.tsx          # Root layout, fonts, skip-link, and global providers
│       ├── components/             # Navbar, Footer, PaymentModal, SecurityCodeField, Widgets
│       │   ├── common/             # ConfirmDialog, EmptyState, CivicPreloader, Cards
│       │   ├── navbar/             # UtilityBar, DesktopNavigation, MegaMenu, MobileNavigation
│       │   └── smart-city/         # SmartCityLayout, SmartCityMap, and monitoring views
│       ├── config/                 # Payment, QR, and service status configuration
│       ├── context/                # AppContext (i18n/a11y), AuthContext, PreloaderContext
│       ├── data/                   # Bilingual service catalog, ward directory, and civic datasets
│       ├── hooks/                  # useDebounce, useDialogA11y, useHydrated
│       ├── services/               # mockApi, translations, payment helpers, IndexedDB photo store
│       └── types/                  # Shared TypeScript interfaces and domain types
├── backend/                        # Reserved directory for future backend service integration
├── scripts/                        # CSS health check (verify-css.mjs), font patcher, route checks
├── .env.example                    # Environment variable template
├── package.json                    # Workspace dependencies and root npm scripts
└── README.md
```

---

## Main Routes

| Route Group | Paths |
| --- | --- |
| Public & Institutional | `/`, `/about`, `/about/wards`, `/about/departments`, `/about/councillors`, `/about/contact` |
| Citizen Services | `/citizen-services`, `/citizen-services/[category]`, `/citizen-services/[category]/[service]` |
| Public Civic Tools | `/city-map`, `/complaints`, `/track`, `/verify`, `/tax-calculator`, `/notices`, `/projects`, `/transparency`, `/accessibility`, `/privacy-policy` |
| Smart City | `/smart-city`, `/smart-city/[feature]` |
| Authentication | `/login`, `/admin/login`, `/register`, `/reset-password` |
| Citizen Portal | `/citizen`, `/citizen/applications`, `/citizen/applications/new`, `/citizen/certificates`, `/citizen/complaints`, `/citizen/tracking`, `/citizen/notifications`, `/citizen/profile`, `/citizen/settings`, `/citizen/support` |
| Admin & Officer Portal | `/admin`, `/admin/applications`, `/admin/complaints`, `/admin/citizens`, `/admin/payments`, `/admin/fees`, `/admin/services`, `/admin/wards`, `/admin/reports`, `/admin/audit-logs` |
| Role Dashboards | `/dashboard/citizen`, `/dashboard/officer`, `/dashboard/staff`, `/dashboard/admin` |
| Service Status | `/coming-soon`, `/maintenance`, `/unavailable`, `/connection-problem` |

---

## Getting Started

### Prerequisites
- **Node.js** 20 or later
- **npm**

### Installation & Local Development

1. Install dependencies from the repository root:
   ```bash
   npm install
   ```

2. Create a local environment file from the template:
   - **PowerShell:**
     ```powershell
     Copy-Item .env.example .env.local
     ```
   - **Bash:**
     ```bash
     cp .env.example .env.local
     ```

3. *(Optional)* Add a restricted Google Maps JavaScript API key in `.env.local` if you want live Google Maps rendering on `/city-map` and the location picker.

4. Start the development server:
   ```bash
   npm run dev
   ```
   The application runs at `http://localhost:3000`.

---

## Environment Variables

See [`.env.example`](./.env.example) for the full template.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key exposed to the browser map provider. |
| `GOOGLE_MAPS_API_KEY` | Fallback Maps key read by the root layout and `GET /api/maps-config`. |
| `APP_URL` | Canonical application URL placeholder for deployment environments. |

> **Security Note:** Restrict any Google Maps API key in Google Cloud Console by HTTP referrer and enabled APIs. Never place server-only secrets inside `NEXT_PUBLIC_` variables, and keep `.env.local` out of version control.

---

## Available Scripts

Run all commands from the **repository root**:

| Command | Description |
| --- | --- |
| `npm run dev` | Cleans stale `.next` artifacts, patches font loader, and starts Next.js dev server. |
| `npm run build` | Runs `prebuild` (clean + font patch + CSS verification) and creates a production build. |
| `npm run start` | Serves the production build from `frontend/.next`. |
| `npm run lint` | Runs ESLint on `frontend/` and executes `verify:css`. |
| `npm run verify:css` | Compiles and validates Tailwind v4 CSS output and core civic tokens. |
| `npx tsc --noEmit -p frontend/tsconfig.json` | Runs strict TypeScript typechecking across `frontend/`. |
| `npm run clean` | Removes `.next` and `frontend/.next` build directories. |

> **Important:** `npm run dev` and `npm run build` share `frontend/.next`. Always stop any running dev server before running `npm run build` or `npm run clean` to avoid chunk mismatches (`ChunkLoadError`).

---

## Demo Data & Production Notes

- **Seeded Demonstration Data:** `frontend/src/services/mockApi.ts` provides seeded citizen, officer, and admin accounts along with sample applications, complaints, wards, and payment records.
- **Browser Persistence:** Sessions and updates are stored in browser `localStorage`, and uploaded civic-report photos are stored in `IndexedDB`.
- **Production Readiness:** Before deploying to production, replace `mockApi` with a secured backend API (`backend/`), server-enforced authentication and RBAC, encrypted database persistence, and live payment/NID integrations.

# Dhaka City Corporation — Digital Citizen Service Platform

A modern, bilingual (**বাংলা / English**) civic-tech portal and paperless municipal service platform for **Dhaka City Corporation**. Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, the platform unifies public civic information, **31 citizen services across 4 core categories**, geo-tagged complaint management, interactive GIS mapping, public QR verification, open budget transparency, and role-based municipal operations.

---

## Table of Contents

- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Application Routes](#application-routes)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Demo Credentials & Sample Verification IDs](#demo-credentials--sample-verification-ids)
- [Design System & Accessibility](#design-system--accessibility)
- [Backend Architecture & Phase 2 Roadmap](#backend-architecture--phase-2-roadmap)

---

## Key Features

### 1. Citizen Services Portal (4 Categories · 31 Services)
- **100% Public Browsing Without Login:** Citizens can explore `/citizen-services`, all 4 category pages, and all 31 dedicated service detail pages—including 4-part service overviews, eligibility criteria, required document checklists, step-by-step guides, fee schedules, FAQs, department contacts, and related services—without signing in.
- **Instant Public Tools:** Birth Certificate Verification, Trade License Verification, Holding Tax Estimator, Parks & Playgrounds Directory, Cemetery & Cremation Directory, and Public Toilet Locator work directly without authentication.
- **Auth-Gated Applications with Direct Redirect-Back:** Protected submission forms and private records redirect unauthenticated visitors to `/login?redirect=...` (or `/register?redirect=...`) and return them directly to the intended service form upon authentication.
- **Dynamic Validation & Honest Status Handling:** Validates Bangladeshi mobile numbers (`01[3-9]XXXXXXXX`), 10/13/17-digit NIDs, and file attachments (`.pdf`, `.jpg`, `.jpeg`, `.png` up to 5 MB). Unverified fee schedules and pending live payment gateways are transparently labeled rather than fabricated.

### 2. Institutional Portal — About City Corporation (11 Public Pages)
Complete bilingual public reference pages under `/about/*`: City Corporation Overview, History & Background, Mission & Vision, Mayor / Administrator Profile, Councillors Directory, Ward Directory, Organizational Structure (Organogram), Departments & Officials, Citizen Charter, Zonal Office Locations, and Emergency Contact Directory.

### 3. Smart City Operations & Civic Transparency
- **Interactive GIS City Map (`/city-map`):** Filterable civic map layers for hospitals, public toilets, parks, secondary waste transfer stations, road excavation permits, and live citizen complaints.
- **Geo-Tagged Smart Complaints (`/complaints`):** Citizens submit location-tagged infrastructure and civic complaints with automated department routing, live tracking IDs, officer dispatch, field staff proof-of-resolution, and citizen ratings.
- **Public QR Document Verification (`/verify`):** Instant authenticity verification for issued Trade Licenses, Citizen Certificates, Holding Tax Receipts, and Facility Bookings.
- **Open Budget & Development Tracker (`/transparency`):** Ward-wise budget allocation, expenditure utilization charts, and public infrastructure project progress tracking.

### 4. Role-Based Access Control (RBAC) Dashboards
- **Citizen Portal (`/dashboard/citizen`):** Track submitted applications, certificates, tax records, and facility bookings.
- **Department Officer Desk (`/dashboard/officer`):** Review and approve/reject applications and dispatch field staff to ward complaints.
- **Field Staff Portal (`/dashboard/staff`):** Manage assigned ward tasks and upload field resolution updates.
- **Admin / Mayor Command Center (`/dashboard/admin`):** Citywide revenue analytics, complaint SLA metrics, and dynamic notice board publishing.

### 5. Unified Status & Error Handling System
Consistent government-portal status screens across all 6 system states—**404 Not Found**, **500 Error**, **Scheduled Maintenance**, **Coming Soon**, **Service Temporarily Unavailable**, and **Connection Problem**—controlled from a single centralized service status registry.

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) · React 19 |
| **Language** | TypeScript 5.9 (strict mode) |
| **Styling** | Tailwind CSS v4 · `clsx` · `tailwind-merge` · `class-variance-authority` |
| **Animations** | Motion (`motion/react`) with reduced-motion support |
| **Icons** | Lucide React (`lucide-react`) |
| **Data Visualization** | Recharts (`recharts`) |
| **Maps & QR** | Google Maps (`@vis.gl/react-google-maps`) · `qrcode.react` |
| **Linting & Quality** | ESLint 9 · `eslint-config-next` |
| **Planned Backend** | Node.js 20+ · Express 5 · TypeScript · PostgreSQL (see [`backend/README.md`](./backend/README.md)) |

---

## Project Structure

```text
.
├── README.md                          # Project overview, setup, and architecture guide
├── package.json                       # Workspace dependencies and root Next.js scripts
├── .env.example                       # Environment variable template (no secrets)
├── eslint.config.mjs                  # ESLint configuration
├── metadata.json                      # Application metadata
│
├── frontend/                          # Next.js 15 App Router web application
│   ├── next.config.ts                 # Next.js configuration
│   ├── postcss.config.mjs             # Tailwind CSS v4 PostCSS plugin
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── public/
│   │   └── images/                    # Official emblem logo, portal backdrop, status illustrations
│   └── src/
│       ├── app/                       # App Router layouts, global CSS, and route groups
│       │   └── (page)/
│       │       ├── page.tsx           # Homepage
│       │       ├── about/             # 11 public institutional sub-pages
│       │       ├── citizen-services/  # Hub, [category], and [category]/[service] (31 services)
│       │       ├── city-map/          # Interactive GIS City Map
│       │       ├── complaints/        # Geo-tagged complaints & live tracker
│       │       ├── dashboard/         # RBAC dashboards (citizen, officer, staff, admin)
│       │       ├── login/ & register/ # Authentication with safe redirect-back & security code
│       │       ├── tax-calculator/    # Holding tax estimator
│       │       ├── transparency/      # Open budget & project tracker
│       │       ├── verify/            # Public QR certificate & receipt verification
│       │       └── [status routes]/   # maintenance, coming-soon, unavailable, connection-problem
│       ├── components/
│       │   ├── about/                 # Reusable About Us layouts & cards
│       │   ├── citizen-services/      # 14 modular Citizen Services UI components
│       │   ├── common/                # Shared civic UI primitives
│       │   ├── navbar/                # Utility bar, desktop/mobile nav, 4-column Mega Menu
│       │   ├── sections/              # Homepage feature sections
│       │   └── status/                # Unified 6-state StatusPage component
│       ├── config/
│       │   └── status-config.ts       # Centralized service availability registry
│       ├── context/                   # AppContext (language/contrast) & AuthContext (RBAC session)
│       ├── data/
│       │   ├── aboutData.ts           # Bilingual institutional data
│       │   └── services/              # Typed bilingual catalog for all 4 categories & 31 services
│       ├── services/
│       │   ├── mockApi.ts             # Frontend data persistence & auth service layer
│       │   └── translations.ts        # Core UI translation dictionary (bn / en)
│       └── types/                     # Shared domain & Citizen Service TypeScript contracts
│
└── backend/                           # Phase 2 REST API blueprint & PostgreSQL schema contract
    └── README.md                      # Detailed backend directory, endpoints & SQL schema spec
```

---

## Application Routes

### Citizen Services Catalog (`/citizen-services`)

| # | Category Route | Services Included |
| :--- | :--- | :--- |
| **01** | `/citizen-services/registration-certificates` | Birth Registration, Birth Certificate Correction, Birth Certificate Verification, Death Registration, Death Certificate Download, Citizenship Certificate, Character Certificate, Permanent Resident Certificate, Family Certificate, Income Certificate (10) |
| **02** | `/citizen-services/business-licensing` | New Trade License, Trade License Renewal, License Modification, Duplicate Trade License, Trade License Verification (5) |
| **03** | `/citizen-services/tax-revenue` | Holding Tax Assessment, Holding Tax Payment, Tax Reassessment, Tax Clearance Certificate, Tax Payment History, Digital Payment Receipt (6) |
| **04** | `/citizen-services/infrastructure-public-services` | Road Repair Request, Drain Cleaning Request, Street Light Repair, Waterlogging Report, Waste Management, Mosquito Control, Parks & Playgrounds, Community Center Booking, Cemetery & Cremation Services, Public Toilet Information (10) |

### Core Portal Routes
- **Public:** `/`, `/about/*` (11 sub-pages), `/citizen-services`, `/city-map`, `/complaints`, `/tax-calculator`, `/transparency`, `/verify`
- **Authentication:** `/login`, `/register`
- **Protected Dashboards:** `/dashboard/citizen`, `/dashboard/officer`, `/dashboard/staff`, `/dashboard/admin`
- **System Status Pages:** `/maintenance`, `/coming-soon`, `/unavailable`, `/connection-problem` (plus automatic Next.js `not-found.tsx` and `error.tsx` boundaries)

---

## Getting Started

### Prerequisites
- **Node.js** `20.x` or later (or **Bun** `1.x`)
- **npm** / **bun** package manager

### Installation & Local Development

1. **Clone the repository and install dependencies from the workspace root:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Populate `.env.local` with your keys (see [Environment Variables](#environment-variables)).

3. **Start the development server (runs on `http://localhost:3000`):**
   ```bash
   npm run dev
   ```

4. **Verify lint and production build:**
   ```bash
   npm run lint
   npm run build
   ```

---

## Environment Variables

Declared in [`.env.example`](./.env.example). Never commit real secrets to version control.

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Server-only | Optional API key for server-side Gemini features |
| `APP_URL` | Server-only | Base deployment URL for self-referential links and callbacks |
| `GOOGLE_MAPS_API_KEY` | Server-only | Google Maps Platform key (if used server-side) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Client | Google Maps JavaScript API key for interactive satellite maps |

---

## Available Scripts

All scripts are defined in the root `package.json` and target the `frontend/` Next.js application:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server (`next dev frontend`) on port `3000` |
| `npm run build` | Runs TypeScript checks and builds the optimized production bundle (`next build frontend`) |
| `npm run start` | Serves the production build (`next start frontend`) |
| `npm run lint` | Runs ESLint across `frontend/` (`eslint frontend`) |
| `npm run clean` | Removes cached `.next` build artifacts |

---

## Demo Credentials & Sample Verification IDs

The frontend currently persists demo sessions and records locally in the browser via `frontend/src/services/mockApi.ts` until connected to the Phase 2 backend.

### Role Accounts (`/login`)

| Role | Identifier (Mobile / Email) | Password | Dashboard Route |
| :--- | :--- | :--- | :--- |
| **Citizen** | `01711482910` | `citizen123` | `/dashboard/citizen` |
| **Admin / Mayor** | `admin@dscc.gov.bd` | `admin123` | `/dashboard/admin` |
| **Department Officer** | `officer@dscc.gov.bd` | `officer123` | `/dashboard/officer` |
| **Field Staff** | `staff@dscc.gov.bd` | `staff123` | `/dashboard/staff` |

### Sample Public Verification & Tracking IDs
- **Trade License:** `DSCC-TL-2026-4108` · `DSCC-TL-2026-5219`
- **Citizen Certificate:** `DSCC-CERT-2026-1094`
- **Holding Tax Receipt:** `DSCC-TAX-2026-7731`
- **Facility Booking:** `DSCC-FAC-2026-309`
- **Complaint Tracking ID:** `CMP-2026-8492` · `CMP-2026-8510`

---

## Design System & Accessibility

- **Civic Palette:** Deep Civic Green (`#006A4E`, hover `#00523C`), Soft Mint (`#ECFDF5`), Refined Crimson Accent (`#C81E1E` for urgent notices/validation), Pure White cards (`#FFFFFF`), Off-White surfaces (`#F8FAFC`), and crisp Slate borders (`#E2E8F0`).
- **Full Bilingual Switching:** Instant `বাংলা` / `English` switching persisted across sessions with automatic `<html lang>` updates.
- **Accessibility:** Right-aligned floating Accessibility Widget with high-contrast mode toggle, keyboard-navigable dropdowns/accordions, semantic landmarks, ARIA attributes, and reduced-motion support.

---

## Backend Architecture & Phase 2 Roadmap

The frontend service layer (`frontend/src/services/mockApi.ts`) and per-service `apiEndpointContract` metadata are structured for clean drop-in replacement by a production REST API without refactoring UI components.

See [`backend/README.md`](./backend/README.md) for the complete Phase 2 backend specification, including:
- **Node.js 20+ / Express 5 / PostgreSQL** directory blueprint and relational SQL schema
- **REST API Endpoint Contracts** for Auth (NID/OTP + JWT RBAC), Applications, Holding Tax, Facility Bookings, Geo-Tagged Complaints, GIS Markers, Open Budgets, Notices, and Cryptographic QR Verification
- **External Integrations Roadmap:** BDRIS (Birth & Death Registry), NID Verification API, certified payment gateways (Ekpay / SSLCommerz / Sonali e-Sheba), and signed PDF certificate generation.

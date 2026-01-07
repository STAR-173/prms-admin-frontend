# PRMS Admin Dashboard (Frontend)

The **Player Relationship Management System (PRMS) Admin Dashboard** is a Next.js 15 application designed for casino/poker room management. It serves as the administrative interface for managing players, staff, poker houses, chip transactions (ledger), and viewing system insights.

This project uses the **App Router**, **Server-Side Proxying (Middleware)**, and **React Query** for state management.

## 🛠 Tech Stack

- **Framework:** [Next.js 15.1.0](https://nextjs.org/) (App Router)
- **Language:** TypeScript 5.3
- **Styling:** Tailwind CSS 3.4, `tailwindcss-animate`, `clsx`, `tailwind-merge`
- **UI Components:** Shadcn UI (Radix Primitives), Lucide React (Icons)
- **State Management & Fetching:** @tanstack/react-query v5
- **Charts:** Recharts v3.6
- **Date Handling:** date-fns
- **HTTP Client:** Axios (proxied via Next.js Middleware)
- **Containerization:** Docker (Node 20-alpine base)

## 📂 Project Structure

```text
prms-admin-frontend/
├── public/                 # Static assets (manifests, icons)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Authentication routes (Login)
│   │   ├── (dashboard)/    # Protected dashboard routes (Layout with Sidebar)
│   │   │   ├── dashboard/  # Main stats view
│   │   │   ├── houses/     # Poker house management & QR codes
│   │   │   ├── insights/   # Analytics & Charts
│   │   │   ├── ledger/     # Chip transaction history
│   │   │   ├── players/    # Player management & KYC
│   │   │   └── staff/      # Staff CRUD & Role assignment
│   │   ├── globals.css     # Global styles & Tailwind directives
│   │   ├── layout.tsx      # Root layout (Providers & PWA Install)
│   │   └── page.tsx        # Root entry (Redirects to /login)
│   ├── components/
│   │   ├── ui/             # Reusable UI components (Shadcn/Radix)
│   │   ├── AuthGuard.tsx   # Client-side route protection
│   │   ├── Sidebar.tsx     # Navigation logic
│   │   └── ...             # Other shared components (MobileHeader, FloatingPWA)
│   ├── lib/
│   │   ├── api.ts          # Axios instance configuration (Inferred)
│   │   ├── export.ts       # CSV Export utility
│   │   └── utils.ts        # CN/Clsx helpers
│   ├── providers/          # React Query Provider setup
│   ├── types/              # TypeScript interfaces (Player, House, StaffMember)
│   └── middleware.ts       # API Proxy Logic
├── Dockerfile              # Multi-stage production build
├── components.json         # Shadcn configuration
├── next.config.ts          # Next.js configuration (standalone output)
├── package.json            # Dependencies & Scripts
└── tailwind.config.js      # Tailwind configuration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v20.x (Recommended, matches Docker base)
- **Package Manager:** npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd prms-admin-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

### Environment Configuration

The application relies on Next.js Middleware to proxy API requests to the backend to avoid CORS issues and hide backend topology.

Create a `.env.local` file in the root directory:

```env
# The internal URL of the backend service.
# If running locally without Docker: http://localhost:4000
# If running in Docker Compose: http://backend_service_name:4000
BACKEND_INTERNAL_URL=http://localhost:4000

# Public API URL (baked into build time for specific client-side needs, if any)
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### Running Development Server

The application is configured to run on port **3002**.

```bash
npm run dev
# Starts Next.js on http://localhost:3002
```

## 🏗 Architecture & Patterns

### 1. API Proxying (Middleware)
Unlike traditional SPAs that hit the backend API directly, this application uses `src/middleware.ts` to proxy requests.
- **Client Side:** Requests are made to `/api/*` (relative to the Next.js server).
- **Server Side:** The middleware intercepts `/api/*`, strips the prefix, and forwards the request to `process.env.BACKEND_INTERNAL_URL/api/v1/*`.
- **Benefit:** Resolves CORS issues and allows dynamic backend URL configuration via environment variables without rebuilding the frontend.

### 2. Authentication Flow
- **Method:** OTP-based authentication (Phone -> OTP).
- **Storage:** Access Token, User ID, and Role are stored in `localStorage` upon successful verification in `(auth)/login/page.tsx`.
- **Protection:** `AuthGuard.tsx` wraps the dashboard layout. It checks for the existence of `accessToken` in localStorage. If missing, it forces a redirect to `/login`.

### 3. Data Fetching (React Query)
Custom hooks are located within their respective feature folders (colocation pattern).
- **Pattern:** `useQuery` for fetching, `useMutation` for CUD operations.
- **Invalidation:** Mutations automatically trigger `queryClient.invalidateQueries` to refresh UI data without manual state updates.
- **Example:** `src/app/(dashboard)/houses/useHouses.ts` handles fetching house lists and creating new houses.

### 4. PWA Implementation
- **Manifest:** Linked in `src/app/layout.tsx`.
- **Installation:** A custom `FloatingPWAInstall.tsx` component detects `beforeinstallprompt` events and renders a custom install button if the app is not running in standalone mode.

## 🐳 Docker Deployment

The project includes a multi-stage `Dockerfile` optimized for production using Next.js `standalone` mode.

### Build and Run

1. **Build the image:**
   ```bash
   docker build -t prms-admin-frontend .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3002:3002 \
     -e BACKEND_INTERNAL_URL="http://host.docker.internal:4000" \
     prms-admin-frontend
   ```

**Note:** The Dockerfile explicitly exposes port `3002` and runs `server.js` generated by the standalone build.

## 📦 Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts dev server on port 3002. |
| `npm run build` | Builds the production application. |
| `npm run start` | Starts the production server. |
| `npm run lint` | Runs ESLint. |

## 🧩 Key Features Breakdown

### Dashboard (`/dashboard`)
- **Stats:** Displays total players, active houses, total chips, and current seating.
- **Live Feed:** Polls `/admin/dashboard/activity` every 10 seconds.

### Houses (`/houses`)
- **CRUD:** Create new poker houses.
- **QR Codes:** Generates and displays QR codes for players to join specific houses.
- **Export:** CSV export of house data.

### Staff (`/staff`)
- **Role Management:** Assign roles (ADMIN, FLOOR, CASHIER, etc.).
- **House Assignment:** Link staff members to specific houses.
- **Identity:** Handles Official ID and Selfie uploads (via FormData).

### Players (`/players`)
- **Filters:** Filter by KYC status (VERIFIED, PENDING, REJECTED).
- **Search:** Debounced search by ID, Name, or Phone.
- **Pagination:** Server-side pagination supported.

### Insights (`/insights`)
- **Visuals:** Area charts for Revenue and Activity trends using `recharts`.
- **Time Ranges:** Toggle between Today, This Week, This Month.

### Ledger (`/ledger`)
- **Audit:** Full history of chip credits (Buy-ins) and debits (Cash-outs).
- **Filtering:** Filter transactions by type (Credit/Debit).
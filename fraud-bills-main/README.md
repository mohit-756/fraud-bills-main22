# BillGuard - Mobile App

AI-Powered Bill Fraud Detection mobile application built with React + Capacitor for Android/iOS.

## Tech Stack

- **Framework:** React 18, TypeScript, Vite
- **Mobile:** Capacitor 8 (Android/iOS)
- **Styling:** Tailwind CSS, shadcn/ui components
- **State:** React Context API, TanStack React Query
- **Charts:** Recharts
- **Testing:** Vitest, Playwright, Testing Library

## Setup

```bash
npm install
npm run dev        # Web dev server on port 8080
npm run build      # Production build to dist/
npx cap sync       # Sync Capacitor after build
npx cap open android  # Open Android Studio
```

## Features

- Role-based dashboards (Sales, Finance, Vendor)
- AI-powered fraud detection with 5-step review pipeline (forensics, source verification, policy compliance, duplicate check)
- Multi-source bill upload (local, S3, Azure Blob, OneLake)
- Purchase order management
- Accounts payable/receivable & payroll reimbursement
- AI chatbot assistant for bill queries
- Attendance tracking
- Haptic feedback & native back button support

## Roles

| Role | Capabilities |
|------|-------------|
| **Sales** | Upload bills, view fraud reports, track submissions |
| **Finance** | Review all bills, approve/reject, manage policies |
| **Vendor** | Submit bills, track purchase orders |

## Build

```bash
npm run build
npx cap copy
npx cap open android
```

## API

Backend: `https://d2ontk4ewdype3.cloudfront.net`

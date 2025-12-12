# 🌍 We-Travel Frontend

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.0.7+-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0+-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4+-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

**Modern Travel Planning Social Platform - Client Application**

Connecting travelers worldwide to share travel ideas, collaborate on tours, and create unforgettable journeys together.

[🚀 Live Demo](https://we-travel-theta.vercel.app) • [📖 Documentation](#documentation) • [🛠️ Tech Stack](#-tech-stack) • [📁 Project Structure](#-project-structure)

</div>

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Screenshots & Demo](#-screenshots--demo)
- [Quick Start](#quick-start)
- [Pages & Routes](#pages--routes)
- [API Integration](#api-integration)
- [Build & Deployment](#build--deployment)

---

## Project Overview

**We-Travel** is a sophisticated frontend application for a travel planning social platform. It enables users to:

- 📍 **Explore Travel Plans** - Discover and browse travel itineraries from the community
- 👥 **Create & Manage Plans** - Design detailed travel plans with itineraries and budgets
- 📝 **Request to Join** - Connect with other travelers and join exciting trips
- ⭐ **Review & Rate** - Share experiences and rate hosts after travel completion
- 💳 **Manage Subscriptions** - Access premium features with flexible subscription plans
- 📊 **Dashboard Analytics** - View personal travel statistics and activity metrics
- 👨‍💼 **Admin Portal** - Comprehensive admin dashboard for system management
- 🎨 **Dark Mode Support** - Seamless dark/light theme switching

Built with **modern, production-ready technologies** featuring responsive design, real-time authentication, server-side rendering, and optimized performance.

---

## 🎯 Key Features

| Feature | Description | User Type |
|---------|-------------|-----------|
| **Public Travel Exploration** | Browse all travel plans from the community with filters | All Users |
| **User Authentication** | Secure login/registration with JWT tokens | All Users |
| **Profile Management** | Complete profile customization with image upload | All Users |
| **Travel Plan Creation** | Create detailed plans with itineraries and budgets | Hosts |
| **Travel Plan Updates** | Edit and manage existing travel plans | Plan Owners |
| **Request Management** | Send/receive/approve travel plan join requests | All Users |
| **Travel Detail View** | Comprehensive travel plan information & host details | All Users |
| **User Dashboard** | Personal statistics, travel activity, & subscriptions | All Users |
| **Admin Dashboard** | System analytics, user management, payment monitoring | Admins |
| **Subscription Management** | Monthly/yearly premium access | Subscribers |
| **Payment Integration** | Stripe checkout for premium subscriptions | Subscribers |
| **Dark Mode** | System theme support with persistent preferences | All Users |
| **Responsive Design** | Mobile-first design optimized for all devices | All Users |
| **Skeleton Loaders** | Beautiful loading states with shimmer animations | All Users |

---

## 🛠 Tech Stack

### Framework & Runtime
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js** | React framework with SSR & SSG | 16.0.7 |
| **React** | UI library & components | 19.2.0 |
| **TypeScript** | Type-safe development | 5.8+ |

### Styling & UI
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Tailwind CSS** | Utility-first CSS framework | 4.0+ |
| **shadcn/ui** | High-quality React components | Latest |
| **Lucide React** | Beautiful icon library | 0.556.0 |
| **Radix UI** | Unstyled, accessible components | Latest |
| **Framer Motion** | Animation & motion library | 12.23.25 |

### Form & Validation
| Technology | Purpose | Version |
|-----------|---------|---------|
| **React Hook Form** | Performant form handling | 7.68.0 |
| **Zod** | TypeScript-first schema validation | 3.25.76 |

### Other Libraries
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Recharts** | Beautiful chart library | 3.5.1 |
| **Next Themes** | Dark mode implementation | 0.4.6 |
| **Sonner** | Toast notifications | 2.0.7 |
| **Date-fns** | Date manipulation & formatting | 4.1.0 |

---

## 📸 Screenshots & Demo

### Hero & Landing Page
<div align="center">
  <img src="./public/Images/Hero.png" alt="Hero Page" width="900" style="border-radius: 8px; margin: 20px 0;" />
  <p><em>Beautiful landing page with hero section and featured travel plans</em></p>
</div>

### Explore & Browse Travel Plans
<div align="center">
  <img src="./public/Images/explore.png" alt="Explore Page" width="900" style="border-radius: 8px; margin: 20px 0;" />
  <p><em>Discover travel plans from the community with filtering and search capabilities</em></p>
</div>

### User Dashboard Analytics
<div align="center">
  <img src="./public/Images/dashboard.png" alt="Dashboard" width="900" style="border-radius: 8px; margin: 20px 0;" />
  <p><em>Personal dashboard with travel statistics, activity tracking, and subscription management</em></p>
</div>

### About & Platform Information
<div align="center">
  <img src="./public/Images/about.png" alt="About" width="900" style="border-radius: 8px; margin: 20px 0;" />
  <p><em>Learn more about We-Travel platform and our mission to connect travelers</em></p>
</div>

---

## Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**
- **Backend API** running (see [BACKEND_README.md](./BACKEND_README.md))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tafhim301/We-Travel-Client.git
   cd We-Travel-Client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables:**
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

6. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

---

## Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API base URL | ✅ | `http://localhost:5000` |
| `NEXT_PUBLIC_APP_URL` | Frontend application URL | ✅ | `http://localhost:3000` |

---

## 📁 Project Structure

```
We-Travel-Client/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages group
│   │   ├── (commonLayout)/     # Public pages group
│   │   ├── (dashboardLayout)/ # Protected pages group
│   │   ├── actions/            # Server actions
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── modules/            # Feature components
│   │   ├── shared/             # Reusable components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── skeleton/           # Loading skeletons
│   ├── lib/                    # Utilities & context
│   ├── hooks/                  # Custom hooks
│   └── services/               # API services
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── next.config.ts              # Next.js config
├── tailwind.config.ts          # Tailwind config
└── package.json
```

---

## Pages & Routes

| Route | Auth | Purpose |
|-------|------|---------|
| `/` | ❌ | Landing page with hero & featured plans |
| `/explore` | ❌ | Browse all travel plans |
| `/travel-plan/[id]` | ❌ | View travel plan details |
| `/profile/[id]` | ❌ | View user profile & ratings |
| `/subscriptions` | ❌ | View subscription plans |
| `/auth/login` | ❌ | User login |
| `/auth/register` | ❌ | User registration |
| `/dashboard/overview` | ✅ | Personal statistics & activity |
| `/dashboard/profile` | ✅ | Edit user profile |
| `/dashboard/my-travel-plans` | ✅ | User's created plans |
| `/dashboard/create-travel-plan` | ✅ | Create new plan |
| `/dashboard/admin/overview` | ✅ ADMIN | System analytics |
| `/dashboard/admin/users` | ✅ ADMIN | User management |
| `/dashboard/admin/travel-plan` | ✅ ADMIN | Travel plan management |

---

## API Integration

The frontend communicates with the backend API documented in [BACKEND_README.md](./BACKEND_README.md).

### Key API Endpoints

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/auth/login` | POST | User login | ❌ |
| `/api/auth/logout` | POST | User logout | ✅ |
| `/api/user/register` | POST | User registration | ❌ |
| `/api/user/me` | GET | Get current user | ✅ |
| `/api/user/update` | PATCH | Update profile | ✅ |
| `/api/travelPlans` | GET | List travel plans | ❌ |
| `/api/travelPlans` | POST | Create plan | ✅ |
| `/api/travelPlans/:id` | GET | Get plan details | ❌ |
| `/api/travel-requests/:planId` | POST | Request to join | ✅ |
| `/api/travel-requests` | GET | Get user requests | ✅ |
| `/api/stats/me/dashboard` | GET | User dashboard stats | ✅ |
| `/api/stats/admin/overview` | GET | Admin analytics | ✅ ADMIN |
| `/api/payment/init-payment` | POST | Start payment | ✅ |

---

## Build & Deployment

### Development

```bash
npm run dev
# Server runs at http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

**Live URL:** https://we-travel-theta.vercel.app

---

## 📹 Video Summary & Demo

<div align="">

### Project Walkthrough & Feature Demo

**[Click here to watch the complete feature walkthrough]**

Key Features Demonstrated:
- ✅ User registration & authentication
- ✅ Browsing & filtering travel plans
- ✅ Creating travel plans with itineraries
- ✅ Requesting to join community plans
- ✅ Admin dashboard with analytics
- ✅ Subscription management
- ✅ Dark/light mode switching

</div>



---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Backend README](./BACKEND_README.md)

---

## Support

- **Live Demo:** https://we-travel-theta.vercel.app
- **GitHub:** https://github.com/Tafhim301/We-Travel-Client
- **Issues:** [Report a bug](https://github.com/Tafhim301/We-Travel-Client/issues)

---

<div align="">

### 🙏 Thank You for Using We-Travel!

Made by Tafhimul Islam

[⬆ Back to top](#-we-travel-frontend)

</div>

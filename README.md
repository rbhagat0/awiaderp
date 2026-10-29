# Awiad ERP - Multi-Tenant SaaS MVP

A multi-tenant SaaS ERP system built with React, Node.js/Express, and Neon Serverless PostgreSQL.

## Architecture

- **Frontend**: React + Tailwind CSS + lucide-react (hosted on Cloudflare Pages)
- **Backend**: Node.js + Express API
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT-based with role-based access control

## Project Structure

```
erp/
├── backend/                 # Node.js/Express API
│   ├── server.js            # Entry point
│   ├── src/
│   │   ├── config/db.js     # Neon PostgreSQL connection
│   │   ├── middleware/auth.js # JWT auth & role authorization
│   │   ├── controllers/     # Route controllers
│   │   └── routes/api.js    # API route definitions
│   └── scripts/
│       ├── migrate.js       # Database schema migration
│       └── seed.js          # Seed data
└── frontend/                # React frontend
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── context/         # Auth context
    │   ├── lib/             # API client
    │   ├── pages/           # Page components
    │   ├── App.jsx          # Root component
    │   └── main.jsx         # Entry point
    ├── tailwind.config.js   # Tailwind CSS config
    └── vite.config.ts       # Vite config
```

## User Roles

1. **Super Admin** - Access to Master Admin Dashboard, can onboard companies and manage subscriptions
2. **Company Admin** - Owner of a tenant workspace, can invite employees and manage company settings
3. **Company Employee** - Standard user restricted to their company's modules

## Core Modules

- **Master Admin Dashboard** - Table view of all companies, subscription management
- **Company Home Hub** - Odoo-inspired grid of clickable module cards
- **Sales Module** - CRM with clients/contacts and leads/deals tracking
- **Project Module** - Project creation linked to clients, task management

## Data Isolation

All tenant-specific tables (clients, leads, projects, tasks, users) contain a `company_id` foreign key referencing the master `companies` table. Backend queries strictly filter by `company_id`.

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Neon DATABASE_URL and JWT_SECRET
npm run migrate
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Deploy to Cloudflare Pages

```bash
cd frontend
npm run build
wrangler pages deploy dist
```

## Default Credentials

- **Super Admin**: superadmin@awiaderp.com / admin123

## License

MIT
Awiad ERP - MVP System Requirements
1. Architecture & Tech Stack

Model: Multi-Tenant SaaS (Software as a Service).

Frontend: React (hosted on Cloudflare Pages for global edge delivery).

Backend: Node.js / Express API.

Database: Neon Serverless PostgreSQL.

Data Isolation: Strict multi-tenancy at the database level. Every tenant-specific SQL table (Sales, Projects, Users) must contain a company_id foreign key referencing the master companies table. Backend queries must strictly filter by this ID.

2. User Roles & Portals

Super Admin (You): Accesses a hidden Master Admin Dashboard to onboard new companies and manage subscription tiers.

Company Admin: The owner of a tenant workspace. Can invite employees to their workspace and manage company settings.

Company Employee: Standard user restricted to interacting with the modules within their assigned company workspace.

3. Core Modules (Initial MVP Scope)

Master Admin Dashboard (Global):

Table view of all onboarded companies.

Basic subscription/tenant status management.

Company Home Hub (Tenant):

Odoo-inspired grid interface displaying active modules as clickable cards.

Sales Module (Tenant):

Basic CRM functionality.

Manage clients/contacts (linked to company_id).

Track active leads, deals, and basic statuses.

Project Module (Tenant):

Create projects linked to specific clients/sales.

Basic list view of project statuses and active tasks.
# StudioCraft Architecture

A full-stack architecture and interior design portfolio platform with a refined public website, a PostgreSQL-backed content layer, and a protected admin workspace for managing the content that appears on the site.

StudioCraft is intentionally designed as a small, maintainable product rather than a static landing page. The public experience is image-led and editorial, while the back office keeps the practical parts of the site—projects, services, testimonials, homepage statistics, contact details, and inquiries—editable without changing source code.

> **Project status:** Functional full-stack portfolio platform with PostgreSQL persistence, protected admin CRUD, Docker-based local database setup, and production build support.

## Contents

- [Project overview](#project-overview)
- [Objective](#objective)
- [What the project includes](#what-the-project-includes)
- [Technology stack](#technology-stack)
- [Screenshots](#screenshots)
- [Project structure](#project-structure)
- [Application architecture](#application-architecture)
- [Database design](#database-design)
- [Local setup](#local-setup)
- [Environment variables](#environment-variables)
- [Available commands](#available-commands)
- [API reference](#api-reference)
- [Admin workflow](#admin-workflow)
- [Testing and verification](#testing-and-verification)
- [Deployment notes](#deployment-notes)
- [Outcome](#outcome)
- [Author](#author)

## Project overview

StudioCraft presents an architecture studio through a deliberately quiet visual system: large imagery, generous spacing, restrained typography, and short editorial sections. The site is useful as a portfolio, but it is also a working content system. A studio administrator can sign in, update content, publish changes, and review incoming consultation requests from the admin area.

The frontend remains usable when the API is unavailable by falling back to the bundled portfolio content for the main public sections. When the API and database are available, the public pages use the latest published records from PostgreSQL.

## Objective

The objective was to build a credible, maintainable portfolio platform that feels like a real studio website while solving the operational problems that a static portfolio leaves behind:

1. Keep projects, services, testimonials, and homepage numbers editable.
2. Store consultation requests in a database instead of losing them in the browser.
3. Separate public content delivery from protected administration routes.
4. Keep the visual language consistent across the homepage, services, portfolio, project details, and contact experience.
5. Make local development straightforward with a repeatable PostgreSQL setup.
6. Keep the codebase understandable for the next engineer who has to maintain it.

## What the project includes

| Area | Capability |
|---|---|
| Public website | Homepage, about page, services page, portfolio, project details, and contact page |
| Content management | CRUD for projects, services, testimonials, and homepage statistics |
| Publishing | Draft/published state and display ordering for editable collections |
| Inquiries | Consultation form persisted to PostgreSQL with admin status updates |
| Site configuration | Editable studio name, email, phone, address, and public contact details |
| Authentication | Email/password admin sign-in with salted password hashing and HTTP-only sessions |
| Media strategy | Local image assets mapped through stable database image keys |
| Developer experience | Vite development server, Express API, Docker PostgreSQL, typed API helper, and seed script |
| Documentation | API, database, architecture, folder structure, setup, screenshots, and deployment notes |

## Technology stack

| Layer | Technology | Role |
|---|---|---|
| Client | React 18 | Component-based user interface |
| Language | TypeScript | Shared types and safer application code |
| Build tool | Vite | Fast development server and production bundling |
| Styling | Tailwind CSS | Utility-first layout and responsive styling |
| UI primitives | Radix UI and Lucide React | Accessible controls and consistent iconography |
| Routing | React Router | Public and admin route handling |
| Server | Express | JSON API and production static serving |
| Database | PostgreSQL | Content, inquiries, admins, and sessions |
| Database driver | `pg` | Connection pooling and parameterized SQL queries |
| Authentication | Node `crypto` | Salted `scrypt` password hashing and session tokens |
| Local infrastructure | Docker Compose | Repeatable PostgreSQL development service |
| Validation | TypeScript, ESLint, Vitest, Vite build | Compile-time and regression checks |

## Screenshots

The screenshot set was captured from the running application at a consistent 1440×900 viewport. The homepage section captures use real section scrolling rather than duplicate full-page frames.

### Public experience

![StudioCraft homepage hero](screenshots/01-home-hero.png)

![StudioCraft homepage about section](screenshots/02-home-about.png)

![StudioCraft featured projects](screenshots/03-home-projects.png)

![StudioCraft homepage services](screenshots/04-home-services.png)

![StudioCraft client testimonials](screenshots/05-home-testimonials.png)

![StudioCraft about page](screenshots/06-about-page.png)

![StudioCraft services page](screenshots/07-services-page.png)

![StudioCraft portfolio page](screenshots/08-portfolio-page.png)

![StudioCraft contact page](screenshots/09-contact-page.png)

### Admin entry point

![StudioCraft admin sign-in](screenshots/10-admin-login.png)

## Project structure

```text
architectural-elegance/
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── docker-compose.yml
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js
├── vitest.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tsconfig.server.json
├── components.json
│
├── public/
│   ├── placeholder.svg
│   └── robots.txt
│
├── screenshots/
│   ├── 01-home-hero.png
│   ├── 02-home-about.png
│   ├── 03-home-projects.png
│   ├── 04-home-services.png
│   ├── 05-home-testimonials.png
│   ├── 06-about-page.png
│   ├── 07-services-page.png
│   ├── 08-portfolio-page.png
│   ├── 09-contact-page.png
│   └── 10-admin-login.png
│
├── docs/
│   └── README.md
│
├── server/
│   ├── auth.ts
│   ├── db.ts
│   ├── index.ts
│   ├── schema.sql
│   └── seed.ts
│
└── src/
    ├── App.tsx
    ├── App.css
    ├── index.css
    ├── main.tsx
    ├── vite-env.d.ts
    ├── assets/
    ├── components/
    │   ├── AnimatedSection.tsx
    │   ├── Footer.tsx
    │   ├── Navbar.tsx
    │   ├── NavLink.tsx
    │   └── ui/
    ├── hooks/
    ├── lib/
    │   ├── api.ts
    │   ├── projectImages.ts
    │   └── utils.ts
    ├── pages/
    │   ├── Index.tsx
    │   ├── AboutPage.tsx
    │   ├── ServicesPage.tsx
    │   ├── PortfolioPage.tsx
    │   ├── ProjectDetailPage.tsx
    │   ├── ContactPage.tsx
    │   ├── AdminPage.tsx
    │   └── NotFound.tsx
    └── test/
        └── setup.ts
```

### Directory responsibilities

| Path | Responsibility |
|---|---|
| `src/pages/` | Route-level public pages and the protected admin screen |
| `src/components/` | Navigation, footer, animation, and reusable interface components |
| `src/lib/api.ts` | Typed frontend wrapper around the Express API |
| `src/lib/projectImages.ts` | Maps stable database image keys to bundled image assets |
| `server/index.ts` | Express app, public endpoints, admin endpoints, and production serving |
| `server/db.ts` | PostgreSQL pool and reusable query access |
| `server/auth.ts` | Password hashing and session helpers |
| `server/schema.sql` | Database tables, constraints, indexes, and relationships |
| `server/seed.ts` | Idempotent schema setup and initial content |
| `screenshots/` | Documentation and portfolio-ready UI captures |
| `docker-compose.yml` | Local PostgreSQL service definition |

## Application architecture

The application uses a simple boundary: React owns the interface, Express owns the API and authentication boundary, and PostgreSQL owns persistent content. Public endpoints return only published content. Admin endpoints require a valid session before they can read or mutate management data.

```mermaid
flowchart LR
    User[Visitor] --> Browser[React Client]
    Admin[Administrator] --> Browser

    Browser --> Router[React Router]
    Router --> Public[Public Pages]
    Router --> AdminUI[Admin Panel]

    Public --> API[Express API]
    AdminUI --> API
    API --> PublicRoutes[Public Content Routes]
    API --> Auth[Session Auth Middleware]
    Auth --> AdminRoutes[Protected Admin Routes]

    PublicRoutes --> Pool[PostgreSQL Pool]
    AdminRoutes --> Pool
    Pool --> DB[(PostgreSQL)]
```

### Request lifecycle

```mermaid
sequenceDiagram
    participant B as Browser
    participant R as React page
    participant E as Express API
    participant A as Auth middleware
    participant P as PostgreSQL

    B->>R: Open route
    R->>E: GET /api/content
    E->>P: Parameterized query
    P-->>E: Published rows
    E-->>R: JSON response
    R-->>B: Render content

    B->>R: Submit admin change
    R->>E: POST/PATCH/DELETE /api/*
    E->>A: Validate session cookie
    A->>P: Check session
    P-->>A: Valid session
    A->>P: Mutate requested record
    P-->>E: Updated row
    E-->>R: JSON response
```

## Database design

The schema keeps the editable public content in separate tables so each collection can have its own ordering and publishing behaviour. Contact submissions are isolated from content tables, while sessions are short-lived and tied to an administrator record.

```mermaid
erDiagram
    ADMINS ||--o{ SESSIONS : creates
    PROJECTS ||--o{ PROJECT_GALLERY : contains

    ADMINS {
        serial id PK
        varchar email UK
        text password_hash
        timestamptz created_at
    }

    SESSIONS {
        text token PK
        integer admin_id FK
        timestamptz expires_at
        timestamptz created_at
    }

    PROJECTS {
        serial id PK
        varchar slug UK
        varchar title
        varchar category
        varchar location
        varchar year
        text short_description
        text concept
        varchar image_key
        varchar[] materials
        boolean published
        integer display_order
        timestamptz created_at
        timestamptz updated_at
    }

    PROJECT_GALLERY {
        serial id PK
        integer project_id FK
        varchar image_key
        integer display_order
    }

    SERVICES {
        serial id PK
        varchar title
        text description
        varchar icon_key
        boolean published
        integer display_order
    }

    TESTIMONIALS {
        serial id PK
        varchar name
        varchar role
        text quote
        boolean published
        integer display_order
    }

    HOMEPAGE_STATS {
        serial id PK
        varchar number_value
        varchar label
        boolean published
        integer display_order
    }

    INQUIRIES {
        serial id PK
        varchar name
        varchar email
        varchar phone
        varchar project_type
        varchar budget_range
        text description
        varchar status
        timestamptz created_at
    }

    SITE_SETTINGS {
        varchar setting_key PK
        text setting_value
        timestamptz updated_at
    }
```

### Tables at a glance

| Table | Purpose | Publicly readable |
|---|---|---:|
| `admins` | Administrator identity and password hash | No |
| `sessions` | Short-lived authenticated admin sessions | No |
| `projects` | Portfolio project records | Published records |
| `project_gallery` | Ordered gallery images for projects | Through project detail |
| `services` | Homepage and services-page offerings | Published records |
| `testimonials` | Client quotes shown on the homepage | Published records |
| `homepage_stats` | Editable headline metrics | Published records |
| `inquiries` | Consultation form submissions | No |
| `site_settings` | General studio contact configuration | Selected public values |

## Local setup

### Prerequisites

Install Node.js 18 or newer, npm, and Docker Desktop. PostgreSQL can also be run independently, but Docker Compose is the quickest path for a clean local environment.

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment configuration

Copy the example file and replace the placeholder administrator credentials:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

The included service exposes PostgreSQL on port `5432` and creates the `studiocraft` database.

### 4. Initialize and seed the database

```bash
npm run db:setup
```

The setup script creates the schema and seeds the initial admin, projects, services, testimonials, homepage statistics, and site settings. It is safe to run again during local development.

### 5. Start the application

Run the API server and Vite client in separate terminals:

```bash
npm run server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) for the public site. The admin entry point is [http://localhost:8080/admin](http://localhost:8080/admin).

## Environment variables

| Variable | Required | Description |
|---|---:|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_EMAIL` | Yes | Initial administrator email used by the seed script |
| `ADMIN_PASSWORD` | Yes | Initial administrator password used by the seed script |
| `PORT` | No | Express port; defaults to `3000` |
| `NODE_ENV` | No | Enables production cookie behaviour when set to `production` |

Example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/studiocraft
ADMIN_EMAIL=admin@studiocraft.local
ADMIN_PASSWORD=replace-this-password
PORT=3000
NODE_ENV=development
```

Never commit `.env`. The repository includes `.env.example` as the safe template for contributors.

## Available commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run server` | Start the Express API with `tsx` |
| `npm run db:setup` | Create schema and seed initial database content |
| `npm run build` | Create the production frontend bundle |
| `npm run typecheck` | Check application TypeScript |
| `npm run typecheck:server` | Check server TypeScript |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest |

## API reference

All API responses are JSON. Public content endpoints return published records ordered by `display_order`. Admin routes require the session cookie created by the login endpoint.

### Public endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | List published portfolio projects |
| `GET` | `/api/projects/:slug` | Return one published project by slug |
| `GET` | `/api/services` | List published services |
| `GET` | `/api/testimonials` | List published testimonials |
| `GET` | `/api/homepage-stats` | List published homepage statistics |
| `GET` | `/api/site-settings` | Return public site settings |
| `POST` | `/api/inquiries` | Create a consultation inquiry |

### Authentication endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Validate credentials and create a session |
| `POST` | `/api/admin/logout` | Clear the current session |
| `GET` | `/api/admin/me` | Return the authenticated admin session |

Login request:

```json
{
  "email": "admin@studiocraft.local",
  "password": "replace-this-password"
}
```

### Admin project endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/projects` | List all projects, including drafts |
| `POST` | `/api/admin/projects` | Create a project |
| `PATCH` | `/api/admin/projects/:id` | Update a project |
| `DELETE` | `/api/admin/projects/:id` | Delete a project |

### Admin content endpoints

| Collection | List | Create | Update | Delete |
|---|---|---|---|---|
| Services | `GET /api/admin/services` | `POST /api/admin/services` | `PATCH /api/admin/services/:id` | `DELETE /api/admin/services/:id` |
| Testimonials | `GET /api/admin/testimonials` | `POST /api/admin/testimonials` | `PATCH /api/admin/testimonials/:id` | `DELETE /api/admin/testimonials/:id` |
| Homepage stats | `GET /api/admin/homepage-stats` | `POST /api/admin/homepage-stats` | `PATCH /api/admin/homepage-stats/:id` | `DELETE /api/admin/homepage-stats/:id` |

### Admin operations endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/inquiries` | List consultation inquiries |
| `PATCH` | `/api/admin/inquiries/:id` | Update inquiry status |
| `GET` | `/api/admin/site-settings` | Read all settings |
| `PATCH` | `/api/admin/site-settings` | Update settings as a key/value object |

Consultation request example:

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1 555 0100",
  "projectType": "Residential architecture",
  "budgetRange": "$250k–$500k",
  "description": "We are planning a coastal home and would like to discuss the first design phase."
}
```

Settings update example:

```json
{
  "studio_name": "StudioCraft",
  "email": "hello@studiocraft.com",
  "phone": "+1 (212) 555–0147",
  "address": "245 West 29th Street, New York, NY 10001"
}
```

## Admin workflow

The admin area is intentionally straightforward. After signing in, the administrator can switch between content collections instead of navigating through a complex dashboard hierarchy.

1. Sign in at `/admin` using the seeded admin credentials.
2. Review or edit projects, services, testimonials, and homepage statistics.
3. Use the publish control to decide which records appear on the public site.
4. Adjust display order when the presentation order matters.
5. Review new inquiries and move their status from `new` to `contacted` or `archived`.
6. Update studio contact settings when the public footer or contact page needs to change.

## Testing and verification

The project uses several lightweight checks rather than relying on one large end-to-end test suite:

- TypeScript checks cover both the Vite client and Express server.
- ESLint catches common React and TypeScript mistakes.
- Vitest provides the unit-test entry point and test setup.
- The production Vite build verifies that imports, assets, routes, and bundling work together.
- The API server can be started independently to catch runtime dependency and routing errors.
- The public pages include graceful fallback content when the database is unavailable.

Run the normal verification sequence with:

```bash
npm run typecheck
npm run typecheck:server
npm run lint
npm test
npm run build
```

## Deployment notes

For production, build the frontend and run the Express server with a managed PostgreSQL instance:

```bash
npm run build
npm run server
```

Set `NODE_ENV=production`, use a strong administrator password, keep the database private, and place the application behind HTTPS. The application should receive its secrets through the hosting provider’s environment configuration rather than through committed files.

The included Docker Compose file is intended for local development. A production deployment should use managed database backups, restricted network access, log monitoring, and a deliberate session expiration policy.

## Outcome

The result is a working studio portfolio that is visually focused without being operationally fragile. The public side communicates the work clearly, while the admin side makes the content maintainable by someone who does not need to open the codebase for every small update.

From an engineering perspective, the project demonstrates a complete path from browser interaction to persisted data: typed React components call an Express API, the API enforces the admin boundary, and PostgreSQL stores the records that drive the site. The visual layer and data layer remain separate enough to evolve independently, but small enough to understand without a large framework overhead.

## Author

Built and maintained by **Nazmus Sakib**.

- Portfolio: [nazmussakib.tech](https://nazmussakib.tech/)
- LinkedIn: [linkedin.com/in/nazmussakib247](https://www.linkedin.com/in/nazmussakib247/)
- GitHub: [github.com/Nazmussakib247](https://github.com/Nazmussakib247)

All rights reserved by Nazmus Sakib.

## References

1. [React documentation](https://react.dev/)
2. [Vite documentation](https://vitejs.dev/guide/)
3. [Express documentation](https://expressjs.com/)
4. [PostgreSQL documentation](https://www.postgresql.org/docs/)
5. [node-postgres documentation](https://node-postgres.com/)
6. [Docker Compose documentation](https://docs.docker.com/compose/)
7. [React Router documentation](https://reactrouter.com/)

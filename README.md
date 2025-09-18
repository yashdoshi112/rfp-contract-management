# RFP Contract Management System

A full‑stack RFP (Request for Proposal) contract management system built with:

- **Frontend:** React + TypeScript (Vite), CSS
- **Backend:** Node.js + Express + TypeScript + Prisma (PostgreSQL)
- **Auth:** JWT, Role-based (Buyer / Supplier)
- **Storage:** Local uploads via Multer (S3 optional via env)
- **Email:** Nodemailer (logs to console by default)
- **Search:** PostgreSQL full‑text search (fallback to ILIKE)
- **Docs:** Swagger/OpenAPI at `/api/docs`
- **Real-time:** Socket.IO for live status updates (bonus)

## ✨ Core Scenarios
- Buyer registers and logs in → creates/publishes RFPs with optional file upload.
- Supplier registers → browses/searches published RFPs → submits a response with file.
- Buyer reviews responses → moves RFP through Draft → Published → Response Submitted → Under Review → Approved/Rejected.
- Email notifications are logged (or sent if SMTP configured).
- Role‑specific dashboards with responsive design.
- Basic full‑text search over RFP title/description.

## Demo Accounts
- **Buyer**: `buyer@test.com` / `password123`
- **Supplier**: `supplier@test.com` / `password123`

> These are created by the backend seed script.

---

## Quickstart (Local)

### 1) Dev prerequisites
- Node 18+
- pnpm or npm
- PostgreSQL 14+ (or managed instance)

### 2) Backend setup
```bash
cd backend
cp .env.example .env
# update DATABASE_URL and JWT_SECRET
pnpm i         # or: npm i
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
pnpm dev
```
Backend runs on **http://localhost:4000** and serves Swagger at **/api/docs**.

### 3) Frontend setup
```bash
cd ../frontend
cp .env.example .env
pnpm i         # or: npm i
pnpm dev
```
Frontend runs on **http://localhost:5173** (Vite).

> The frontend expects backend at `http://localhost:4000`. Update `VITE_API_URL` in `frontend/.env` if needed.

---

## Deployment

- **Railway**/**Render**: Easiest to host backend + PostgreSQL.
- **Vercel/Netlify**: Host the frontend (set `VITE_API_URL` to your backend URL).
- Docker compose is included under `deployment/` for local dev.

### Docker (local)
```bash
cd deployment
docker compose up --build
```
- Backend: http://localhost:4000
- Frontend: http://localhost:5173
- PG Admin: http://localhost:5050 (optional; user: admin@local / admin)

---

## AI Usage Report (Summary)
- **Code generation**: Large portions of boilerplate (React pages, Express routes, Prisma schema) drafted with AI, then refined.
- **UI/UX**: Layouts, component names, and state flows scaffolded via AI; manually tuned for clarity and responsiveness.
- **DB design**: AI proposed the initial entities and relations; finalized manually (indexes, enums, versioning table).
- **API docs**: AI suggested OpenAPI structure; validated and corrected to match implementation.
- **Testing Strategy**: AI outlined unit and e2e ideas under `docs/api-docs.md`; manual notes added for future coverage.

See `docs/` for more details.

---

## Repository Structure
```
.
├── README.md
├── frontend/
├── backend/
├── docs/
│   ├── api-docs.md
│   └── database-schema.md
└── deployment/
```

---

## Security Notes
- JWT signed with `JWT_SECRET` (HS256).
- Passwords hashed with bcrypt.
- RBAC guard middleware.
- Multer validates MIME and size (basic); S3 integration gated by envs.
- CORS restricted to `VITE_API_URL` origin in dev; configure allowed origins for prod.
- Prisma input validation + Zod on API to reduce invalid payloads.

---

## Testing (outline)
- **Unit**: services and controllers with Jest.
- **Integration**: supertest for auth/RFP/response flows.
- **e2e**: Playwright for key user stories (login, create RFP, respond, approve).

---

Happy hacking! ✨

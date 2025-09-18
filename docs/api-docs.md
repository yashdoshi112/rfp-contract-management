# API Overview (Swagger at `/api/docs`)

Key endpoints:

## Auth
- `POST /api/auth/register` – `{ email, password, name, role }`
- `POST /api/auth/login` – `{ email, password }`

## RFPs
- `POST /api/rfps` (Buyer) – create (Draft by default; file: `attachment`)
- `POST /api/rfps/:id/publish` (Buyer)
- `GET /api/rfps/mine` (Buyer) – buyer's RFPs
- `GET /api/rfps` (Supplier) – list published (supports `search`)
- `GET /api/rfps/:id` – detail
- `PUT /api/rfps/:id` (Buyer) – updates & version bump
- `POST /api/rfps/:id/under-review` (Buyer)
- `POST /api/rfps/:id/approve` (Buyer) – body `{ responseId }`
- `POST /api/rfps/:id/reject` (Buyer)

## Responses
- `POST /api/rfps/:id/responses` (Supplier) – submit; file: `attachment`
- `GET /api/rfps/:id/responses` (Buyer) – review list
- `GET /api/my/responses` (Supplier)

Auth: Bearer token in `Authorization` header.

Search uses PostgreSQL full‑text (`to_tsvector` / `plainto_tsquery`) with fallback to `ILIKE` when needed.

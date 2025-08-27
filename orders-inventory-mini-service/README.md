# Orders & Inventory Mini-Service

A small REST API for a simplified e-commerce flow using **Node.js + Express**, **PostgreSQL (Sequelize)**, **Redis cache**, **express-validator**, and **winston** logging.

## Features

- Clean, modular project structure
- Centralized error handling with consistent shape: `{ code, message, details? }`
- Input validation with **express-validator**
- Structured logging (**winston**) including request latency
- **Products**
  - `POST /products` (validate, create, bust cache)
  - `GET /products` (pagination + filters + **Redis cache** with TTL)
- **Orders**
  - `POST /orders` (validate stock, atomic decrement with transaction & row lock, create order+items, compute total)
  - `GET /orders/:id` (with items and user summary)
  - `PATCH /orders/:id/cancel` (only if status `PLACED`; restore stock)
- Caching strategy: Redis cache for `GET /products` keyed by page+filters; bust on product create
- Docker and non-Docker setup
- Migrations via sequelize-cli
- Example HTTP requests provided

> Stretch idea (not included here): Swap Redis caching for an async BullMQ job on order placement.

---

## Quickstart (Docker)

1. **Clone** this repo or unzip the provided archive.
2. Copy env: `cp .env.example .env` (or create `.env`) and keep default docker values.
3. Run:
   ```bash
   docker compose up --build
   ```
   This will start: API on `:3000`, Postgres on `:5432`, Redis on `:6379`. Migrations run automatically for the API container on boot.

## Quickstart (Local / Non-Docker)

Prereqs: Node 18+ or 20+, PostgreSQL 14+, Redis 6+

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Postgres DB and user or reuse defaults. Copy env:
   ```bash
   cp .env.example .env
   ```
   Update `.env` to match your local DB and Redis.
3. Run migrations:
   ```bash
   npx sequelize db:migrate
   ```
4. Start server:
   ```bash
   npm start
   ```
   API runs at `http://localhost:3000`.

## DB Migrations

This project uses `sequelize-cli`. Key commands:

```bash
# Run all migrations
npx sequelize db:migrate

# Undo last
npx sequelize db:migrate:undo

# Undo all
npx sequelize db:migrate:undo:all
```

## Endpoints

### 1) Create Product
`POST /products`

Body:
```json
{ "sku": "SKU-123", "name": "Widget", "price_cents": 999, "stock": 10 }
```

### 2) List Products (cached)
`GET /products?page=1&limit=10&min_price=500&max_price=1500&in_stock=true`

### 3) Create Order
`POST /orders`

Body:
```json
{
  "user_id": 1,
  "items": [{ "product_id": 1, "qty": 2 }, { "product_id": 2, "qty": 1 }]
}
```

### 4) Get Order by ID
`GET /orders/:id`

### 5) Cancel Order
`PATCH /orders/:id/cancel`

---

## Example Requests (.http)

Open `requests.http` for ready-to-run examples (VS Code REST Client compatible). Or see curl in comments inside.

## Assumptions & Trade-offs

- Product prices are in integer cents to avoid floating-point issues.
- Order totals are computed as sum of `price_cents_at_purchase * qty` for each item.
- Simple Redis cache with 60s TTL for `GET /products`. We bust cache globally on product creation (coarse but safe).
- Stock decrement performed **atomically** inside a DB transaction with `SELECT ... FOR UPDATE` row locks via Sequelize.
- Minimal user model; only email+name.
- For real prod: add auth, rate-limiting, request IDs, better observability, health checks, OpenAPI spec, and more granular cache busting.

## Project Structure

```
src/
  app.js
  server.js
  config/
    index.js
  db/
    index.js
  models/
    index.js
    user.js
    product.js
    order.js
    orderItem.js
  migrations/
    202408270001-create-user.js
    202408270002-create-product.js
    202408270003-create-order.js
    202408270004-create-orderItem.js
  routes/
    index.js
    products.js
    orders.js
  controllers/
    productController.js
    orderController.js
  services/
    orderService.js
  middlewares/
    validate.js
    errorHandler.js
    requestLogger.js
  utils/
    logger.js
  cache/
    redisClient.js
```

---

## Testing

This starter keeps testing minimal; add your preferred framework (Jest, supertest) as needed.

## License

MIT

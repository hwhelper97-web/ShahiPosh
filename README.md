# ShahiPosh — Premium E-commerce Clothing Brand

Complete full-stack luxury e-commerce project for **shahiposh.com**.

## Stack
- Frontend: Next.js (App Router), Tailwind CSS, Framer Motion
- Backend: Node.js + Express REST API
- ORM/DB: Prisma + PostgreSQL
- Media: Cloudinary
- Auth: JWT admin login

## Project Structure
```
frontend/   # Next.js storefront + admin UI
backend/    # Express API
prisma/     # Prisma schema
```

## Features
- Premium dark-themed animated homepage with hero + collections + trending + brand story + testimonials + newsletter
- Shop page with search, category/size/sort controls
- Product detail with gallery, size selection, Add to Cart, WhatsApp order button
- Cart and Checkout with order placement
- Admin dashboard (`/admin`) with JWT login, product add/delete, orders view, SaaS-like sidebar layout
- REST APIs:
  - `GET /api/products`
  - `GET /api/products/:id`
  - `POST /api/products` (admin)
  - `PUT /api/products/:id` (admin)
  - `DELETE /api/products/:id` (admin)
  - `POST /api/order`
  - `GET /api/orders` (admin)
  - `POST /api/auth/login`

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment:
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate --schema prisma/schema.prisma
   npx prisma migrate dev --schema prisma/schema.prisma
   ```
4. Start development servers:
   ```bash
   npm run dev
   ```

Frontend: http://localhost:3000  
Backend: http://localhost:5000

## Deployment
- Frontend: Vercel (set `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`)
- Backend: Render/Railway (set DB, JWT, admin, Cloudinary envs)
- Database: PostgreSQL

## WhatsApp Integration
Uses configurable env number:
```
https://wa.me/<NEXT_PUBLIC_WHATSAPP_NUMBER>?text=<ENCODED_MESSAGE>
```
Buttons are integrated on product and cart pages with pre-filled order details.

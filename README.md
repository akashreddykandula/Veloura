# Veloura Commerce

A complete MERN clothing brand e-commerce platform with customer storefront, admin dashboard, JWT auth, MongoDB schemas, Cloudinary-ready image handling, Razorpay payments, coupons, orders, wishlist, reviews, support tickets, SEO helpers, and responsive fashion-brand UI.

## Folder Structure

```txt
client/   React + Vite + Tailwind storefront and admin UI
server/   Node.js + Express + MongoDB API
```

## Install

```bash
npm install
cp .env.example server/.env
cp client/.env.example client/.env
npm run seed
npm run dev
```

Client: `http://localhost:5173`
API: `http://localhost:5001/api`

For day-to-day development, run both frontend and backend together from the root:

```bash
npm run dev
```

Alias if you prefer a save-and-refresh workflow name:

```bash
npm run save
```

Both commands start:

- React/Vite frontend with hot reload on file save
- Express/Nodemon backend with auto restart on file save

## Deployment

1. Create MongoDB Atlas, Cloudinary, and Razorpay credentials.
2. Set all variables from `.env.example` in your host.
3. Build the client with `npm run build --workspace client`.
4. Deploy `server` to Render/Railway/Fly.io and `client/dist` to Vercel/Netlify.
5. Set `VITE_API_URL` to your deployed API URL and `CLIENT_URL` to your deployed frontend URL.

## Architecture

- API base: `/api`
- Auth: JWT bearer tokens with role-based access.
- Validation and security: Helmet, CORS, rate limiting, Mongo sanitization, HPP, express-validator.
- Payments: Razorpay order creation and signature verification, plus COD flow.
- SEO: dynamic document titles/meta, structured data component, sitemap route.
# Velora
# Veloura
# Veloura

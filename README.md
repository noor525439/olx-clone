# OLX-style MERN (Ads + Cart + Checkout)

## Setup

### 1) Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2) Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Key Features

- Auth: signup/login/profile
- **Profile picture**: upload/update via Cloudinary (set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in backend `.env`)
- Ads: post/list/detail, image upload, my ads
- Search & filters: search, city, category, price range
- Cart + checkout + orders
- Payment: `/api/payments/create` (supports your gateway via env vars, otherwise dev mode)
- Admin: manage users, ads moderation, order management


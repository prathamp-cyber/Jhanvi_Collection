# 🛍️ Janvi Collection - E-Commerce Platform

**Janvi Collection** is a full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application. It includes a customer-facing storefront, an integrated admin dashboard accessible directly via the `/samay` route, a secure REST backend API, and a standalone admin dashboard.

---

## 🧩 Project Architecture

The repository consists of 3 main applications:

1. **Backend (`/backend`)**: Node.js & Express API server connected to MongoDB, Cloudinary for image hosting, and payment gateways (Stripe & Razorpay).
2. **Frontend (`/frontend`)**: React storefront built with Vite & Tailwind CSS. Includes the **Samay Admin Module** accessible at `/samay` (e.g., `http://localhost:5173/samay`).
3. **Standalone Admin (`/admin`)**: Standalone React & Vite admin panel for separate deployment options.

---

## 🚀 Local Run Steps

### 1. Environment Setup
Copy the example `.env.example` files to `.env` in each subdirectory and fill in your values:

```bash
# Backend environment setup
cp backend/.env.example backend/.env

# Frontend environment setup
cp frontend/.env.example frontend/.env

# Standalone Admin environment setup
cp admin/.env.example admin/.env
```

---

### 2. Running Each Application

#### Backend (API Server - Port 4000)
```bash
cd backend
npm run dev
```

#### Frontend Storefront & Samay Admin (Port 5173)
```bash
cd frontend
npm run dev
```
* **Storefront URL**: `http://localhost:5173`
* **Samay Admin Dashboard URL**: `http://localhost:5173/samay`

#### Standalone Admin (Port 5174, Optional)
```bash
cd admin
npm run dev
```
* **Standalone Admin URL**: `http://localhost:5174`

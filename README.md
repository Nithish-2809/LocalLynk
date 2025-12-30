# 🛍️ LocalLynk

**LocalLynk** is a full-stack local marketplace web application that enables users to buy and sell products within their nearby area. It emphasizes location-aware discovery, secure payments, and real-time interaction between buyers and sellers.

---

## 🚀 Features

- 🔐 User authentication with JWT
- 📍 **Nearby products discovery using geolocation**
- 🔍 Product search by name and category
- 🛒 Buy & sell products with order management
- 💬 Real-time chat between buyers and sellers
- 💳 Secure Stripe payment integration
- 👤 User profile management
- 📦 Product availability status (Available / Sold)
- 🗺️ Distance-based product listing (km-wise)

---

## 🧑‍💻 Tech Stack

### Frontend
- React
- React Router
- Axios
- Stripe.js

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- **Geospatial queries (MongoDB 2dsphere)**
- Stripe API

---

## 🔄 Application Flow

1. Users sign up or log in
2. Sellers list products with location details
3. Buyers browse products or discover **nearby items based on location**
4. Buyers place orders and complete payment via Stripe
5. Orders are verified and products are marked as sold
6. Buyers and sellers can chat in real time

---

## 🛠️ Setup Instructions

### Clone the repository
```bash
git clone https://github.com/your-username/locallynk.git
cd locallynk

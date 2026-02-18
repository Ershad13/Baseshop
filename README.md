# ArchMaps - Architectural Map Shop

A WooCommerce-like web application for selling architectural maps and blueprints.

## Features

- **Landing Page**: Professional introduction to the shop.
- **Product Listing**: Browse available architectural plans.
- **Shopping Cart**: Add and remove items from the cart.
- **User Authentication**: Sign up and login with email/password or Google (Mocked).
- **Secure Checkout**: Mocked checkout process that saves orders to the database.
- **Downloads**: Users can download purchased maps from their dashboard.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide React, Axios, React Router.
- **Backend**: Node.js, Express, SQLite3 (better-sqlite3).
- **Authentication**: JWT, Bcrypt.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. **Clone the repository**
2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```
3. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   node index.js
   ```
   The server will run on `http://localhost:5000`.

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Database Schema

The app uses SQLite3 with the following tables:
- `users`: User accounts and auth info.
- `products`: Available architectural maps.
- `orders`: Purchase history.
- `order_items`: Products associated with each order.

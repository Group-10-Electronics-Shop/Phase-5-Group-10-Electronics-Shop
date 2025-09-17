# Phase-5-Group-10 Electronics Shop – Frontend

## 🛒 Overview
This is the **frontend** for the Electronics Shop project, built with **React + Redux + Vite + Tailwind CSS**.  
It provides a fully interactive e-commerce interface for browsing, searching, and purchasing electronics, including category filters, product details, cart, wishlist, and checkout with multiple payment methods.

---

## 🚀 Tech Stack

- **React 18** – Frontend UI library  
- **Redux Toolkit** – State management  
- **React Router v6** – Routing  
- **Tailwind CSS** – Styling  
- **Vite** – Development & build tool  
- **React Icons** – Icon library  

---

## 🏠 Features

### Homepage
- Banner with promotional message
- Sidebar with clickable **categories**
- Sections for **Flash Sales**, **Bestselling**, and **New Arrivals**
- Clean product grid layout with images, descriptions, and KES prices
- Products link to **Product Detail** pages

### Products Page
- Displays all products in a grid layout
- Filters by categories
- Pagination-ready layout

### Product Detail Page
- Product image, name, description, price
- Add to **cart** or **wishlist**
- Related products displayed

### Cart
- Shows selected products with totals
- Link to **checkout** page

### Checkout
- Supports **MPESA, Airtel Money, PayPal, Card** payments
- Payment instructions displayed per method

### Wishlist
- Shows all wishlisted products
- Add/remove items

### Authentication
- Login / Register functionality
- Profile page for user info

### Orders
- View past orders

### Navbar & Footer
- Redux-connected Navbar with cart count and user info
- Fully styled footer with support, account, quick links, branding

---

## 🛠 Installation

```bash
git clone <>
cd electronics-shop-frontend
npm install
npm run dev
```
#### Open the app at http://localhost:5173/
---
## 🖼️ Screenshots  

![Home](./public/Home.png)

![Cart](./public/Cart.png)

![Products](./public/Products.png)

![Checkout](./public/Checkout.png)

---
## 🧩 Project Structure
```
src/
├─ assets/          # Images, banners
├─ components/      # Navbar, Footer
├─ features/        # Redux slices: auth, cart, wishlist, orders, products
├─ pages/           # Home, Products, ProductDetail, Cart, Checkout, Profile, Orders, Wishlist
├─ App.jsx          # Root component
└─ main.jsx         # Entry point
```
---
## 🧑‍💻 Contributing Guidelines

Branches

Use feature branches: feature/<your-feature>

Keep main clean for production-ready code

Commit Messages

Use present tense and clear description

Example:
```
feat: add homepage layout with flash sales, bestseller, new arrivals
fix: resolve product image rendering in product detail page
chore: update Redux store structure
```
### Adding Products / Categories
```
Products and categories are fetched from the backend.

Temporary mock products can be added in src/features/products/productsSlice.js under the initial state.

Product object format:
{
  id: 1,
  name: "Samsung Galaxy S23",
  description: "Latest Samsung flagship phone",
  price: 99999,
  category: "Smartphones",
  image: "/src/assets/products/galaxy-s23.jpg"
}

```
#### Categories are defined in src/features/products/categories.js:
```
["Smartphones", "Laptops", "Headphones", "Accessories"]
```
#### Adding Payment Methods

Go to src/pages/Checkout.jsx.

#### Add new payment option in the paymentMethods array:
```
const paymentMethods = ["MPESA", "Airtel Money", "PayPal", "Card", "Crypto"];
```
#### Coding Guidelines

Use Tailwind CSS classes for styling

Maintain responsive design

Keep component code modular and reusable

Follow React and Redux best practices
---
## ⚡ Notes

All prices are in Kenya Shillings (KES).

Product images are linked via local assets or URLs.

Payment instructions for each method are displayed on the checkout page.

Ensure all categories and products link to their respective pages.
---
### 📝 Next Steps for Developers

Developer 1: Backend API integration (products, categories, auth, orders).

Developer 2 (Michael): Frontend Redux integration & Auth/Wishlist.

Developer 3: Payment flow & Checkout logic.

Developer 4: UI polishing and responsiveness testing.
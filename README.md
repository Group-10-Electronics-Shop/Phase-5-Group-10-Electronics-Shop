# 🛒 Phase 5 Group 10 Electronics Shop

## 🌟 Overview

The Electronics Shop is a comprehensive full-stack e-commerce platform specializing in consumer electronics. Our marketplace offers customers a seamless online shopping experience for a diverse range of electronic products including mobile phones, laptops, televisions, and premium sound systems. Built as a Phase 5 group project, this application showcases modern web development practices, featuring a responsive React-based frontend powered by a robust Python/Flask backend infrastructure.

### What We Offer

Our platform provides customers access to:
- **📱 Mobile Phones** - Latest smartphones from leading brands
- **💻 Laptops** - Professional and personal computing devices
- **📺 Televisions** - Smart TVs and entertainment displays
- **🔊 Sound Systems** - Premium audio equipment and accessories

#### 👥 Team Members

- 👤 Michael Muturi - Frontend Developer/UI-UX Design
- 👤 Brian Oduory - Fullstack Developer/Database Architect
- 👤 Emmah Wanjiku - CI-CD workflow/Backend Developer
- 👤 Dennis Wanjohi - Frontend Developer/Documentation/Deployment


<div align="center">

![Project Status](https://img.shields.io/badge/status-live-success)
![Deployment](https://img.shields.io/badge/deployment-render-purple)
![React](https://img.shields.io/badge/react-18.x-blue)
![Python](https://img.shields.io/badge/python-3.x-yellow)

**A modern, full-stack e-commerce platform for electronics**

[Live Demo](https://shopatelec.netlify.app) 

• [Report Bug](#-support) • [Request Feature](#-support)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)
- [Support](#-support)

---

## 🌟 Overview

The Electronics Shop is a comprehensive e-commerce platform designed to provide users with a seamless online shopping experience for electronic products. Built as a Phase 5 group project, this application demonstrates full-stack development capabilities with modern web technologies, featuring a React-based frontend and a robust Python backend.

### Key Highlights

- **🎯 User-Centric Design:** Intuitive interface for browsing and purchasing electronics
- **🔐 Secure Authentication:** JWT-based user authentication and authorization
- **🛍️ Complete E-commerce Flow:** From product discovery to checkout
- **📱 Responsive Design:** Optimized for desktop, tablet, and mobile devices
- **⚡ Real-time Updates:** Dynamic cart and order management
- **🌐 Production Ready:** Deployed and accessible 24/7 on Render

---

## ✨ Features

### 🛍️ Shopping Experience

- **Product Catalog**
  - Browse extensive collection of electronics
  - Advanced search and filtering capabilities
  - Category-based navigation
  - Detailed product pages with specifications
  - Product images and descriptions
  - Real-time stock availability

- **Shopping Cart**
  - Add/remove items dynamically
  - Update quantities in real-time
  - Persistent cart across sessions
  - Cart total calculations
  - Quick checkout process

### 👤 User Management

- **Authentication & Authorization**
  - User registration with validation
  - Secure login/logout functionality
  - Password encryption
  - JWT token-based sessions
  - Protected routes and endpoints

- **User Profile**
  - View and edit profile information
  - Order history tracking
  - Saved addresses
  - Wishlist functionality

### 📦 Order Management

- **Order Processing**
  - Streamlined checkout flow
  - Order confirmation emails
  - Real-time order status tracking
  - Order history and details
  - Invoice generation

### 🎨 User Interface

- **Modern Design**
  - Clean, intuitive interface
  - Smooth animations and transitions
  - Loading states and error handling
  - Toast notifications for user actions
  - Mobile-first responsive design

### 🔧 Admin Features (If Applicable)

- Product inventory management
- Order processing and fulfillment
- User management dashboard
- Analytics and reporting

---

## 🛠️ Tech Stack

### Frontend

- **React 18.x** - UI library for building interactive interfaces
- **Create React App** - Bootstrapped development environment
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API requests
- **CSS3/SCSS** - Styling and responsive design
- **React Context/Redux** - State management (specify which you use)

### Backend

- **Python 3.x** - Core programming language
- **Flask** - Lightweight web framework
- **Flask-RESTful** - RESTful API development
- **SQLAlchemy** - ORM for database operations
- **Flask-JWT-Extended** - JWT authentication
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-Migrate** - Database migrations

### Database

- **PostgreSQL** - Primary relational database
- **SQLite** - Development database (optional)

### Deployment & DevOps

- **Render** - Cloud hosting platform
- **Git** - Version control
- **GitHub** - Code repository and collaboration
- **Gunicorn** - WSGI HTTP server for Python

### Development Tools

- **npm/yarn** - Package management
- **pip** - Python package installer
- **Postman** - API testing
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher)
- **npm** (v6.x or higher) or **yarn** (v1.22.x or higher)
- **Python** (v3.8 or higher)
- **pip** (v20.x or higher)
- **PostgreSQL** (v12.x or higher)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/phase-5-group-10-electronics-shop.git
cd phase-5-group-10-electronics-shop
```

2. **Set up the Frontend**

```bash
# Navigate to frontend directory
cd my-app

# Install dependencies
npm install
# or
yarn install
```

3. **Set up the Backend**

```bash
# Navigate to backend directory
cd ../server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

4. **Configure Environment Variables**

Create `.env` files in both frontend and backend directories:

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

**Backend (.env):**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/electronics_shop
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key
FLASK_ENV=development
FLASK_APP=app.py
```

5. **Initialize the Database**

```bash
# From the backend directory
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Optional: Seed the database
python seed.py
```

### Running Locally

1. **Start the Backend Server**

```bash
# From the backend directory
flask run
# Server runs on http://localhost:5000
```

2. **Start the Frontend Development Server**

```bash
# From the frontend directory
npm start
# Application opens on http://localhost:3000
```

3. **Access the Application**

Open your browser and navigate to `http://localhost:3000`

---

## 📁 Project Structure

```
phase-5-group-10-electronics-shop/
├── client/                      # Frontend React application
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── context/             # React Context providers
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API service functions
│   │   ├── utils/               # Utility functions
│   │   ├── styles/              # Global styles
│   │   ├── App.js               # Root component
│   │   └── index.js             # Entry point
│   ├── package.json
│   └── README.md
│
├── server/                      # Backend Flask application
│   ├── models/                  # Database models
│   ├── routes/                  # API route handlers
│   ├── controllers/             # Business logic
│   ├── middleware/              # Custom middleware
│   ├── migrations/              # Database migrations
│   ├── config.py                # Configuration settings
│   ├── app.py                   # Flask application factory
│   ├── seed.py                  # Database seeding script
│   └── requirements.txt         # Python dependencies
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 📜 Available Scripts

### Frontend Scripts

In the `client` directory, you can run:

#### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

The page will reload when you make changes. You may also see lint errors in the console.

#### `npm test`

Launches the test runner in interactive watch mode.

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for best performance. The build is minified and filenames include hashes.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project and copy all configuration files and transitive dependencies (webpack, Babel, ESLint, etc) into your project for full control.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments.

### Backend Scripts

In the `server` directory, you can run:

#### `flask run`

Starts the Flask development server on [http://localhost:5000](http://localhost:5000).

#### `flask db migrate -m "message"`

Creates a new database migration with the specified message.

#### `flask db upgrade`

Applies pending migrations to the database.

#### `flask db downgrade`

Reverts the last database migration.

#### `python seed.py`

Seeds the database with sample data for development.

---

## 🔌 API Documentation

### Base URL

**Development:** `http://localhost:5000/api`  
**Production:** `https://phase-5-group-10-electronics-shop-9.onrender.com/api`

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response: { "access_token": "JWT_TOKEN", "user": {...} }
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer JWT_TOKEN
```

### Product Endpoints

#### Get All Products
```http
GET /products
Query Parameters: ?category=electronics&search=laptop&page=1&limit=20
```

#### Get Single Product
```http
GET /products/:id
```

#### Create Product (Admin)
```http
POST /products
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "price": number,
  "category": "string",
  "stock": number,
  "image_url": "string"
}
```

### Cart Endpoints

#### Get User Cart
```http
GET /cart
Authorization: Bearer JWT_TOKEN
```

#### Add to Cart
```http
POST /cart
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "product_id": number,
  "quantity": number
}
```

#### Update Cart Item
```http
PATCH /cart/:item_id
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "quantity": number
}
```

#### Remove from Cart
```http
DELETE /cart/:item_id
Authorization: Bearer JWT_TOKEN
```

### Order Endpoints

#### Create Order
```http
POST /orders
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "shipping_address": "string",
  "payment_method": "string"
}
```

#### Get User Orders
```http
GET /orders
Authorization: Bearer JWT_TOKEN
```

#### Get Order Details
```http
GET /orders/:id
Authorization: Bearer JWT_TOKEN
```

---

## 🌐 Deployment

### Live Application

**🔗 URL:** [https://phase-5-group-10-electronics-shop-18.onrender.com](https://phase-5-group-10-electronics-shop-18.onrender.com)

**Status:** ✅ Live and operational

### Deployment Platform: Render

This application is deployed on Render with the following configuration:

#### Frontend Deployment

- **Service Type:** Static Site
- **Build Command:** `cd client && npm install && npm run build`
- **Publish Directory:** `client/build`

#### Backend Deployment

- **Service Type:** Web Service
- **Build Command:** `cd server && pip install -r requirements.txt`
- **Start Command:** `cd server && gunicorn app:app`
- **Environment Variables:** Set in Render dashboard

#### Database

- **Service Type:** PostgreSQL
- **Plan:** Starter (or appropriate tier)

### Deployment Steps

1. **Prepare for Deployment**
   - Ensure all environment variables are configured
   - Update CORS settings for production domain
   - Test the build locally

2. **Deploy Backend**
   - Create new Web Service on Render
   - Connect GitHub repository
   - Configure build and start commands
   - Add environment variables
   - Create and connect PostgreSQL database

3. **Deploy Frontend**
   - Create new Static Site on Render
   - Connect GitHub repository
   - Configure build command and publish directory
   - Set environment variables (API URL)

4. **Post-Deployment**
   - Run database migrations
   - Seed database if needed
   - Test all functionality
   - Monitor logs for errors

### Continuous Deployment

The application is configured for automatic deployment:
- Push to `main` branch triggers automatic deployment
- Render rebuilds and deploys the application
- Zero-downtime deployment strategy

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with clear messages**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Coding Standards

- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

### Pull Request Guidelines

- Provide a clear description of changes
- Reference related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update README if needed



## 📚 Learn More

### Create React App Documentation

- [Getting Started](https://facebook.github.io/create-react-app/docs/getting-started)
- [Code Splitting](https://facebook.github.io/create-react-app/docs/code-splitting)
- [Analyzing Bundle Size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
- [Making a Progressive Web App](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
- [Advanced Configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)
- [Deployment](https://facebook.github.io/create-react-app/docs/deployment)
- [Troubleshooting](https://facebook.github.io/create-react-app/docs/troubleshooting)

### React Documentation

- [React Documentation](https://reactjs.org/)
- [React Tutorial](https://reactjs.org/tutorial/tutorial.html)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)

### Flask Documentation

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Flask-RESTful](https://flask-restful.readthedocs.io/)
- [SQLAlchemy](https://docs.sqlalchemy.org/)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

If you encounter any issues or have questions:

- **📧 Email:** support@electronicsshop.com
- **🐛 Issues:** [GitHub Issues](https://github.com/your-username/phase-5-group-10-electronics-shop/issues)
- **💬 Discussions:** [GitHub Discussions](https://github.com/your-username/phase-5-group-10-electronics-shop/discussions)

---

## 🙏 Acknowledgments

- Thanks to all team members for their dedication and hard work
- Instructors and mentors for guidance throughout the project
- [Create React App](https://github.com/facebook/create-react-app) for the frontend boilerplate
- [Flask](https://flask.palletsprojects.com/) for the backend framework
- [Render](https://render.com/) for hosting services
- All open-source contributors whose libraries made this project possible

---

<div align="center">

**Made with ❤️ by Group 10**

[⬆ Back to Top](#-phase-5-group-10-electronics-shop)

</div>

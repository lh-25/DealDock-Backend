# Deal Dock - Back-End

This repository contains the back-end code for Deal Dock, a MERN stack application for secure product management, bidding, and commenting on products.

## 🌐 Front-End Repository
Find more details about the project and access the front-end repository here:  [DealDock-Frontend](https://github.com/lh-25/DealDock-Frontend).

## 🔧 Features
- **JWT Authentication**:
  - Secure sign-up and login for users.
  - Associate products with their respective creators using the authenticated user's ID.
  
- **CRUD Operations**:
  - Create, read, update, and delete products (only by the product's creator).

## 🛠️ Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- RESTful API principles

## 🚀 Getting Started
1. Clone this repository.
2. Install dependencies with `npm install`.
3. Set up a `.env` file with the required variables (e.g., database URI, JWT secret).
4. Run the server with `nodemon server.js`.

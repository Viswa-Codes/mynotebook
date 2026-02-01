# 📝 MyNotebook - Scalable Knowledge Management System

A professional personal notebook application built with the **MERN** stack. This project has been engineered to transition from a basic CRUD prototype to a high-performance, production-ready system.

[![Release](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/Viswa-Codes/mynotebook/releases)
[![Tech Stack](https://img.shields.io/badge/stack-MERN-green.svg)](#-tech-stack)

---

## 🚀 Evolution: From v1.0 to v2.0 (Architectural Foundation)

While v1.0 focused on basic functionality, **v2.0 (The Professional Refactor)** builds the structural foundation required for enterprise-level scaling.

### Key Architectural Improvements:
- **TypeScript Migration:** Entire backend refactored for strict type safety to eliminate runtime exceptions.
- **Layered Architecture:** Implemented the **Controller-Service-Repository** pattern. This decouples business logic from data access, allowing for independent scaling of the database layer.
- **Robust Validation:** Integrated **Zod** schemas to ensure data integrity before it reaches the database.
- **Centralized Error Handling:** Standardized API responses using a global error-handling middleware.

---

## 🏗️ System Architecture

The backend is designed using a modular "Clean Architecture" approach:

- **Routes:** API endpoint definitions.
- **Controllers:** Handle HTTP transport logic (Request parsing/Response formatting).
- **Services:** The "Brain" of the app. Contains business logic and domain rules.
- **Repositories:** The Data Access Layer. Isolated Mongoose queries for better testability.
- **Middlewares:** Authentication guards (JWT) and Zod validation layers.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Context API, CSS3  
- **Backend:** Node.js, Express.js (TypeScript)  
- **Database:** MongoDB (Mongoose)  
- **Security:** JWT (JSON Web Tokens), Bcrypt.js  
- **Validation:** Zod  

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Viswa-Codes/mynotebook.git
```
### 2. Backend Setup

```bash
cd server
npm install
# Ensure you create a .env file in the server root with:
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
npm start
```

### 🛡️ API Features (v2.0)
| Feature          | Implementation                                         |
| ---------------- | ------------------------------------------------------ |
| Authentication   | Secure JWT-based stateless authentication.             |
| Input Integrity  | Strict schema validation using Zod.                    |
| Error Management | Custom AppError class for standardized API errors.     |
| Clean Code       | 100% Type-safe codebase with modular folder structure. |


🛤️ Roadmap: Moving to Phase B (Scalability & Performance)

The next evolution of this project focuses on optimizing for high-traffic scenarios:

    [ ] v3.0 (Database Performance): Implementing Compound Indexing in MongoDB to optimize query execution plans from O(N) to O(logN).

    [ ] v3.1 (Caching Layer): Integrating Redis to implement the Cache-Aside pattern for frequently accessed notes.

    [ ] v3.2 (Data Handling): Implementing Cursor-based Pagination and Search indexing for large datasets.

    [ ] v4.0 (Cloud Infrastructure): Media storage via AWS S3/Cloudinary and distributed logging.



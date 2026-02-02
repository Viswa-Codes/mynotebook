# 📝 MyNotebook - Scalable Knowledge Management System

myNotebook is a secure, performance-optimized cloud notebook application built with the MERN stack (MongoDB, Express, React, Node). This README focuses on the architecture and the database optimizations that make the application scale for large datasets.

## Tech Stack

- Frontend: React.js, Context API
- Backend: Node.js, Express.js, TypeScript
- Database: MongoDB (Mongoose)
- Security: JWT Authentication, bcrypt password hashing

## Quick Start

1. Install dependencies (root and backend):

```bash
npm install
cd backend
npm install
cd ..
```

2. Start frontend and backend:

```bash
# start frontend (default port configured in package.json)
npm start

# in a separate terminal: start backend
cd backend
npm run dev
```

Prerequisites:
- Node.js (>=14)
- MongoDB running locally or accessible via connection string

Base API URL: `http://localhost:5000/api`

## Project Structure (high level)

```
backend/
	src/
		models/       # Mongoose schemas & indexes
		repositories/ # Data access layer (note.repository.ts)
		routes/       # Express route handlers
		controllers/  # Controller logic
		services/     # Business logic
		middlewares/  # Authentication, error handling
frontend/
	src/            # React components, context
```

## Key Engineering Highlights

1. Database Optimization (IXSCAN vs COLLSCAN)

	 - Compound Indexing: The `notes` collection includes a compound index on `{ user: 1, date: -1 }` (defined in the Mongoose schema). This allows efficient retrieval of a specific user's notes sorted by newest first.
	 - Index-backed Sorting: Since `date` is part of the index (descending), MongoDB can return results already sorted and avoid expensive in-memory sort operations.
	 - Complexity Improvement: Queries that previously required scanning the entire collection (COLLSCAN) now use an index scan (IXSCAN), dramatically reducing `totalDocsExamined` and improving latency.

2. Repository Pattern

	 - Data access is isolated in `backend/src/repositories/note.repository.ts` (see `findAllNotes`), keeping business logic and controllers decoupled from persistence concerns.

## Database Optimization (Verified via mongosh)

The following table summarizes the observed improvements after adding the compound index `{ user: 1, date: -1 }` and aligning the query sort order to the index.

| Metric | Before (COLLSCAN + in-memory sort) | After (IXSCAN using compound index) |
|--------|-------------------------------------:|------------------------------------:|
| Execution Stage | COLLSCAN + SORT | IXSCAN |
| Docs Examined | All documents in the collection | Only matched user documents |
| Sorting Overhead | In-memory sort (RAM) | Zero — index provides ordering |
| Typical Latency | Tens to hundreds ms (depends on collection size) | 0–2 ms for indexed hits (warm) |

### Example optimized query (repository)

In `backend/src/repositories/note.repository.ts`:

```ts
import Note from '../models/Note';

export const findAllNotes = async (userId: string) => {
	// Query that matches the compound index: filter by user, sort by date desc
	return await Note.find({ user: userId }).sort({ date: -1 });
};
```

Run `explain("executionStats")` in `mongosh` to verify the execution plan and metrics:

```js
const stats = db.notes.find({ user: ObjectId("<userId>") }).sort({ date: -1 }).explain('executionStats');
console.log({
	Time_ms: stats.executionStats.executionTimeMillis,
	Docs_Examined: stats.executionStats.totalDocsExamined,
	Results_Returned: stats.executionStats.nReturned,
	Stage: stats.executionStats.executionStages.stage
});
```

When the query uses the compound index you should see `Stage: "IXSCAN"` and `Docs_Examined` close to `Results_Returned`.

## Notes on Caching and Further Optimizations

- Redis (Cache-Aside) was implemented to reduce repeated database hits for frequently accessed data. Cache entries are keyed by `notes:<userId>` and expire after one hour. Invalidation occurs on create/update/delete operations so reads remain fresh.
- Consider cursor-based pagination and additional compound indexes (e.g., `{ user: 1, tag: 1, date: -1 }`) for multi-field filter performance.

## Security and Production

- Replace hard-coded secrets with environment variables (JWT secret, DB connection string, Redis credentials).
- Use HTTPS and enable CORS restrictions for production frontends.
- Use a managed MongoDB and Redis in production (e.g., Atlas, ElastiCache).

## Contact / Contribution

Contributions welcome. Open issues or PRs with performance-focused improvements or bug fixes.

---

Last updated: February 2, 2026

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



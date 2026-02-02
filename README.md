# myNotebook

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

**Tech stack:** React, Express, MongoDB, Mongoose, JWT authentication

**Key ports:** frontend: 3000 (React), backend: 5000 (Express)

**Quick start**

1. Install dependencies in the root (frontend) and backend:

```bash
npm install
cd backend
npm install
cd ..
```

2. Start both frontend and backend concurrently from the project root:

```bash
npm run both
```

Alternatively run each part individually:

- Frontend only: `npm start` (from project root)
- Backend only: `cd backend && nodemon index.js` (or `node index.js`)

Prerequisites
- Node.js (>=14)
- MongoDB running locally (default connection: `mongodb://localhost:27017/mynotebook`)

Backend / API
- Base URL: `http://localhost:5000/api`

Authentication
- This app uses JWT. On success, login/register endpoints return an `authtoken`.
- Protected routes require the header `auth-token: <token>`.

Available endpoints
- `POST /api/auth/createuser` — Register a new user. Body: `{ name, email, password }`.
- `POST /api/auth/login` — Login. Body: `{ email, password }`.
- `POST /api/auth/getuser` — Get logged-in user details. Protected (send `auth-token` header).

- `GET /api/notes/fetchallnotes` — Get all notes for the logged-in user. Protected.
- `POST /api/notes/addnote` — Add a new note. Protected. Body: `{ title, description, tag? }`.
- `PUT /api/notes/updatenote/:id` — Update note by id. Protected.
- `DELETE /api/notes/deletenote/:id` — Delete note by id. Protected.

Folder structure (high level)
- `backend/` — Express server, routes, models, MongoDB connection
- `src/` — React app (components, context)
- `public/` — Static frontend assets

Notes and configuration
- MongoDB connection string is set in `backend/db.js`. Change it if you use a remote DB.
- JWT secret is `JWTSecretKey` inside backend files; replace with a secure secret for production.

Testing the API (example curl)

Register:
```bash
curl -X POST http://localhost:5000/api/auth/createuser -H "Content-Type: application/json" -d '{"name":"Alice","email":"a@a.com","password":"secret"}'
```

Login:
```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"a@a.com","password":"secret"}'
```

Next steps
- Replace hard-coded secrets and connection strings with environment variables.
- Add tests and input validation on the frontend where needed.
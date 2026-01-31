# myNotebook

A simple full-stack notebook app (React + Express + MongoDB) to create, read, update and delete personal notes. This README explains how to install, run and test the project locally.

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
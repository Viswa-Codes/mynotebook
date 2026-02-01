# MyNotebook v2 - Architecture Flow

**Total 7 Endpoints**

**User Endpoints (3):**
- Create User (Signup)
- Existing User (Login)
- Get User (Fetch user-specific notes)

**Notes Endpoints (4):**
- Create (AddNote)
- Read (FetchAllNotes)
- Update (UpdateNote)
- Delete (DeleteNote)

---

## Entry Point to Backend

**index.ts**
- Connects to MongoDB via `db.ts`
- Initializes Express app
- Applies middlewares: CORS, JSON
- Sets up routes
- Applies global error handler
- Starts server on port 5000

---

## Complete Data Flow

```
                                    Routes
                                      |
                        ┌─────────────┴──────────────┐
                        |                            |
                    authRoutes                   notesRoutes
                    (auth.ts)                    (notes.ts)
                        |                            |
        ┌───────────────┼───────────────┐   ┌───────┼────────────┬──────────┐
        |               |               |   |       |            |          |
   /createUser      /login         /getUser /addnote /fetchallnotes /updatenote /deletenote
        |               |               |   |       |            |          |
        ↓               ↓               ↓   ↓       ↓            ↓          ↓
fetchuser middleware (for protected routes - validates JWT token)
        |
        ↓
   auth.controller.ts / note.controller.ts
```

---

## Authentication Flow

### POST /api/auth/createUser
```
1. Route: POST /api/auth/createuser
   ↓
2. Middleware: (None - public endpoint)
   ↓
3. Controller: createUser(req, res, next)
   │
   ├─ Zod Validation
   │  └─ Validates: { name, email, password }
   │     └─ auth.validation.ts → createUserSchema
   │
   ├─ Service: registerUser(name, email, password)
   │  │     └─ auth.service.ts
   │  │
   │  ├─ Repository: findUserByEmail(email)
   │  │  │     └─ auth.repository.ts
   │  │  │
   │  │  └─ Database: User.findOne({ email })
   │  │            └─ MongoDB
   │  │
   │  ├─ Check: User exists?
   │  │  └─ Yes → Throw AppError(400, "User with this email already exists")
   │  │  └─ No → Continue
   │  │
   │  ├─ Hash Password: bcrypt.hash(password, salt)
   │  │
   │  ├─ Repository: createNewUser({ name, email, hashedPassword })
   │  │  │     └─ auth.repository.ts
   │  │  │
   │  │  └─ Database: User.create({ name, email, password })
   │  │            └─ MongoDB → Returns saved user
   │  │
   │  └─ Generate Token: jwt.sign({ user: { id: userId } }, JWT_SECRET)
   │
   ├─ Response: res.status(201).json({ success: true, authtoken })
   │
   └─ Error Handling:
      ├─ Zod Validation Error → res.status(400).json({ errors })
      ├─ AppError → next(error) → errorHandler middleware
      └─ Unexpected Error → next(error) → errorHandler middleware
```

### POST /api/auth/login
```
1. Route: POST /api/auth/login
   ↓
2. Middleware: (None - public endpoint)
   ↓
3. Controller: login(req, res, next)
   │
   ├─ Zod Validation
   │  └─ Validates: { email, password }
   │     └─ auth.validation.ts → loginSchema
   │
   ├─ Service: loginUser(email, password)
   │  │     └─ auth.service.ts
   │  │
   │  ├─ Repository: findUserByEmail(email)
   │  │  │     └─ auth.repository.ts
   │  │  │
   │  │  └─ Database: User.findOne({ email })
   │  │            └─ MongoDB
   │  │
   │  ├─ Check: User exists?
   │  │  └─ No → Throw AppError(400, "Please try to login with correct credentials")
   │  │
   │  ├─ Compare Password: bcrypt.compare(password, user.password)
   │  │
   │  ├─ Check: Password matches?
   │  │  └─ No → Throw AppError(400, "Please try to login with correct credentials")
   │  │
   │  └─ Generate Token: jwt.sign({ user: { id: userId } }, JWT_SECRET)
   │
   ├─ Response: res.status(200).json({ success: true, authtoken })
   │
   └─ Error Handling:
      ├─ Zod Validation Error → res.status(400).json({ errors })
      ├─ AppError → next(error) → errorHandler middleware
      └─ Unexpected Error → next(error) → errorHandler middleware
```

### POST /api/auth/getuser
```
1. Route: POST /api/auth/getuser
   ↓
2. Middleware: fetchuser(req, res, next)
   │
   ├─ Get Token: req.header('auth-token')
   │
   ├─ Check: Token exists?
   │  └─ No → next(AppError(401, "Please authenticate using a valid token"))
   │
   ├─ Verify Token: jwt.verify(token, JWT_SECRET)
   │
   └─ Check: Token valid?
      └─ No → next(AppError(401, "Please authenticate using a valid token"))
      └─ Yes → Extract userId from token → req.user.id → next()
   ↓
3. Controller: getUser(req, res, next)
   │
   ├─ Extract: userId = req.user.id
   │
   ├─ Service: getUserDetails(userId)
   │  │     └─ auth.service.ts
   │  │
   │  ├─ Repository: findUserById(userId)
   │  │  │     └─ auth.repository.ts
   │  │  │
   │  │  └─ Database: User.findById(userId).select('-password')
   │  │            └─ MongoDB
   │  │
   │  ├─ Check: User exists?
   │  │  └─ No → Throw AppError(404, "User not found")
   │  │
   │  └─ Return: user (without password)
   │
   ├─ Response: res.status(200).json(user)
   │
   └─ Error Handling:
      ├─ AppError → next(error) → errorHandler middleware
      └─ Unexpected Error → next(error) → errorHandler middleware
```

---

## Notes Operations Flow

### POST /api/notes/addnote
```
1. Route: POST /api/notes/addnote
   ↓
2. Middleware: fetchuser (JWT validation - see getuser flow)
   │
   └─ Extract userId from validated token → req.user.id
   ↓
3. Controller: addNote(req, res, next)
   │
   ├─ Zod Validation
   │  └─ Validates: { title, description, tag }
   │     └─ note.validation.ts → createNoteSchema
   │
   ├─ Extract: userId = req.user.id
   │
   ├─ Service: createNote(userId, { title, description, tag })
   │  │     └─ note.service.ts
   │  │
   │  ├─ Repository: createNewNote({ title, description, tag, user: userId })
   │  │  │     └─ note.repository.ts
   │  │  │
   │  │  └─ Database: Note.create({ title, description, tag, user: userId })
   │  │            └─ MongoDB → Returns saved note
   │  │
   │  └─ Return: saved note
   │
   ├─ Response: res.status(201).json(newNote)
   │
   └─ Error Handling:
      ├─ Zod Validation Error → res.status(400).json({ errors })
      ├─ AppError → next(error) → errorHandler middleware
      └─ Unexpected Error → next(error) → errorHandler middleware
```

### GET /api/notes/fetchallnotes
```
1. Route: GET /api/notes/fetchallnotes
   ↓
2. Middleware: fetchuser (JWT validation)
   │
   └─ Extract userId from validated token → req.user.id
   ↓
3. Controller: getAllNotes(req, res, next)
   │
   ├─ Extract: userId = req.user.id
   │
   ├─ Service: getNotesForUser(userId)
   │  │     └─ note.service.ts
   │  │
   │  ├─ Repository: findAllNotes(userId)
   │  │  │     └─ note.repository.ts
   │  │  │
   │  │  └─ Database: Note.find({ user: userId }).sort({ date: -1 })
   │  │            └─ MongoDB → Returns array of notes
   │  │
   │  ├─ Check: Notes exist?
   │  │  └─ Empty array → Throw AppError(404, "No notes found for this user")
   │  │
   │  └─ Return: array of notes
   │
   ├─ Response: res.status(200).json(notes)
   │
   └─ Error Handling:
      ├─ AppError → next(error) → errorHandler middleware
      └─ Unexpected Error → next(error) → errorHandler middleware
```

### PUT /api/notes/updatenote/:id
```
1. Route: PUT /api/notes/updatenote/:id
   ↓
2. Middleware: fetchuser (JWT validation)
   │
   └─ Extract userId from validated token → req.user.id
   ↓
3. Controller: updateNote(req, res, next)
   │
   ├─ Zod Validation
   │  └─ Validates: { title?, description?, tag? }
   │     └─ note.validation.ts → updateNoteSchema
   │
   ├─ Extract: 
   │  ├─ noteId = req.params.id
   │  ├─ userId = req.user.id
   │  └─ updateData = { title?, description?, tag? }
   │
   ├─ Service: updateNote(noteId, userId, updateData)
   │  │     └─ note.service.ts
   │  │
   │  ├─ Repository: findNoteById(noteId)
   │  │  │     └─ note.repository.ts
   │  │  │
   │  │  └─ Database: Note.findById(noteId)
   │  │            └─ MongoDB
   │  │
   │  ├─ Check: Note exists?
   │  │  └─ No → Throw AppError(404, "Note not found")
   │  │
   │  ├─ Check: User owns this note?
   │  │  ├─ note.user.toString() === userId?
   │  │  └─ No → Throw AppError(401, "Not authorized to update this note")
   │  │
   │  ├─ Repository: updateNoteById(noteId, updateData)
   │  │  │     └─ note.repository.ts
   │  │  │
   │  │  └─ Database: Note.findByIdAndUpdate(noteId, { $set: updateData }, { new: true })
   │  │            └─ MongoDB → Returns updated note
   │  │
   │  └─ Return: updated note
   │
   ├─ Response: res.status(200).json(updatedNote)
   │
   └─ Error Handling:
      ├─ Zod Validation Error → res.status(400).json({ errors })
      ├─ AppError → next(error) → errorHandler middleware
      └─ Unexpected Error → next(error) → errorHandler middleware
```

### DELETE /api/notes/deletenote/:id
```
1. Route: DELETE /api/notes/deletenote/:id
   ↓
2. Middleware: fetchuser (JWT validation)
   │
   └─ Extract userId from validated token → req.user.id
   ↓
3. Controller: deleteNote(req, res, next)
   │
   ├─ Extract: 
   │  ├─ noteId = req.params.id
   │  └─ userId = req.user.id
   │
   ├─ Service: deleteNote(noteId, userId)
   │  │     └─ note.service.ts
   │  │
   │  ├─ Repository: findNoteById(noteId)
   │  │  │     └─ note.repository.ts
   │  │  │
   │  │  └─ Database: Note.findById(noteId)
   │  │            └─ MongoDB
   │  │
   │  ├─ Check: Note exists?
   │  │  └─ No → Throw AppError(404, "Note not found")
   │  │
   │  ├─ Check: User owns this note?
   │  │  ├─ note.user.toString() === userId?
   │  │  └─ No → Throw AppError(401, "Not authorized to delete this note")
   │  │
   │  ├─ Repository: deleteNoteById(noteId)
   │  │  │     └─ note.repository.ts
   │  │  │
   │  │  └─ Database: Note.findByIdAndDelete(noteId)
   │  │            └─ MongoDB → Returns deleted note
   │  │
   │  └─ Return: deleted note
   │
   ├─ Response: res.status(200).json({ success: true, message, note })
   │
   └─ Error Handling:
      ├─ AppError → next(error) → errorHandler middleware
      └─ Unexpected Error → next(error) → errorHandler middleware
```

---

## Global Error Handler

**errorHandler Middleware** (Applied at end of index.ts)

```
Any Error thrown anywhere in the application
    ↓
If caught by controller's try-catch:
    ├─ If Zod Validation Error:
    │  └─ res.status(400).json({ success: false, errors: [...] })
    │
    └─ Else:
       └─ next(error) → pass to errorHandler
    ↓
errorHandler(err, req, res, next)
    ├─ Extract statusCode: err.statusCode || 500
    ├─ Extract message: err.message || "Internal Server Error"
    └─ Check NODE_ENV:
       ├─ development: Include stack trace in response
       └─ production: Don't include stack trace
    ↓
Response: res.status(statusCode).json({
    success: false,
    message,
    stack: (only in development)
})
```

---

## Project Structure

```
backend/src/
├── controllers/
│   ├── auth.controller.ts      (HTTP handlers for auth)
│   └── note.controller.ts      (HTTP handlers for notes)
├── services/
│   ├── auth.service.ts         (Business logic: register, login, getUser)
│   └── note.service.ts         (Business logic: CRUD operations)
├── repositories/
│   ├── auth.repository.ts      (DB queries: user operations)
│   └── note.repository.ts      (DB queries: note operations)
├── validations/
│   ├── auth.validation.ts      (Zod schemas for auth)
│   └── note.validation.ts      (Zod schemas for notes)
├── middlewares/
│   ├── errorHandler.ts         (Global error handler)
│   └── fetchuser.ts            (JWT authentication)
├── utils/
│   └── AppError.ts             (Custom error class)
├── models/
│   ├── User.ts                 (MongoDB schema)
│   └── Note.ts                 (MongoDB schema)
├── routes/
│   ├── auth.ts                 (Auth endpoints)
│   └── notes.ts                (Notes endpoints)
├── db.ts                        (MongoDB connection)
└── index.ts                     (Express app setup)
```

---

## Key Features

✅ **Layered Architecture:** Controller → Service → Repository → Database

✅ **Type Safety:** Full TypeScript with Zod validation

✅ **Error Handling:** Global error middleware catches all errors

✅ **Authentication:** JWT-based with fetchuser middleware

✅ **Authorization:** Checks if user owns the resource before modifications

✅ **Validation:** Zod schemas for all inputs

✅ **Clean Routes:** Super readable, 13-16 lines each

---

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **JWT** - Authentication
- **bcryptjs** - Password hashing

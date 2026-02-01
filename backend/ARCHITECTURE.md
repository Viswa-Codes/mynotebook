# MyNotebook Backend - PBC-Level Architecture Refactor

## What Changed?

✅ **Global Error Handler** - All errors caught and handled consistently
✅ **Zod Validation** - Type-safe input validation (replaces express-validator)  
✅ **Controller-Service-Repository Pattern** - Clean separation of concerns
✅ **TypeScript** - Full type safety across all files
✅ **Custom Error Class** - Standardized error handling
✅ **Centralized Business Logic** - Services contain all business rules
✅ **Database Abstraction** - Repositories isolate DB operations

---

## New Project Structure

```
src/
├── controllers/        ← HTTP handlers (req/res)
├── services/          ← Business logic
├── repositories/      ← Database operations
├── validations/       ← Zod schemas
├── middlewares/       ← errorHandler, fetchuser
├── utils/             ← AppError class
├── models/            ← Mongoose schemas
├── routes/            ← API routes (now clean!)
├── db.ts              ← MongoDB connection
└── index.ts           ← Main app (clean setup)
```

---

## Running the App

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

---

## Key Files to Understand

1. **[src/utils/AppError.ts](./src/utils/AppError.ts)** - Custom error class
2. **[src/middlewares/errorHandler.ts](./src/middlewares/errorHandler.ts)** - Global error handler
3. **[src/services/note.service.ts](./src/services/note.service.ts)** - Business logic example
4. **[src/controllers/note.controller.ts](./src/controllers/note.controller.ts)** - HTTP handler example
5. **[src/repositories/note.repository.ts](./src/repositories/note.repository.ts)** - Database operations
6. **[src/validations/note.validation.ts](./src/validations/note.validation.ts)** - Zod schemas
7. **[src/index.ts](./src/index.ts)** - Main app setup

---

## Testing Checklist

- [ ] POST /api/auth/createuser - Create new user
- [ ] POST /api/auth/login - Login user
- [ ] POST /api/auth/getuser - Get user details (with auth token)
- [ ] GET /api/notes/fetchallnotes - Get all notes (with auth token)
- [ ] POST /api/notes/addnote - Create note (with auth token)
- [ ] PUT /api/notes/updatenote/:id - Update note (with auth token)
- [ ] DELETE /api/notes/deletenote/:id - Delete note (with auth token)

---

## Setup .env File

```bash
cp .env.example .env
```

Then edit `.env` with your MongoDB URI and JWT secret.

---

## Common Issues

**Q: TypeScript errors?**  
A: Run `npm run build` to see all errors. They should be minimal.

**Q: Module not found?**  
A: Make sure you're using ES modules. Check `package.json` has `"type": "module"`.

**Q: Port already in use?**  
A: Change `PORT` in `index.ts` or kill the process using port 5000.

---

## Interview Talking Points

**"How do you handle errors?"**
- Global error middleware catches everything
- Custom AppError class standardizes responses
- Never exposes stack traces in production

**"Why separate services from repositories?"**
- Services contain business logic (what to do)
- Repositories contain database logic (how to do it)
- Easy to test and swap implementations

**"How do you validate input?"**
- Zod schemas validate and transform data
- Type-safe with automatic TypeScript types
- Clear error messages for clients

**"What's your code organization strategy?"**
- Controllers: HTTP handlers only
- Services: Business logic
- Repositories: Database access
- This follows industry best practices

---

## Read the Full Guide

See [../REFACTOR_GUIDE.md](../REFACTOR_GUIDE.md) for detailed documentation with code examples and deep explanations.

---

Good luck! 🚀

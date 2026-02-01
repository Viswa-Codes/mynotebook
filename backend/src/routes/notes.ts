import express from 'express';
import fetchuser from '../middleware/fetchuser';
import * as NoteController from '../controllers/note.controller';

const router = express.Router();

// ROUTE 1: Get All the Notes using: GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, NoteController.getAllNotes);

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, NoteController.addNote);

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote/:id". Login required
router.put('/updatenote/:id', fetchuser, NoteController.updateNote);

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote/:id". Login required
router.delete('/deletenote/:id', fetchuser, NoteController.deleteNote);

export default router;
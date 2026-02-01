import { Request, Response, NextFunction } from 'express';
import * as NoteService from '../services/note.service';
import { createNoteSchema, updateNoteSchema } from '../validations/note.validation';

// Get all notes for the logged-in user
export const getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const notes = await NoteService.getNotesForUser(userId);
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

// Create a new note
export const addNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input with Zod
    const validatedData = createNoteSchema.parse({ body: req.body });
    const { title, description, tag } = validatedData.body;
    const userId = (req as any).user?.id;

    const newNote = await NoteService.createNote(userId, {
      title,
      description,
      tag,
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

// Update an existing note
export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input with Zod
    const validatedData = updateNoteSchema.parse({ body: req.body });
    const { title, description, tag } = validatedData.body;
    const noteId = req.params.id as string;
    const userId = (req as any).user?.id;

    const updatedNote = await NoteService.updateNote(noteId, userId, {
      title,
      description,
      tag,
    });

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// Delete a note
export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const noteId = req.params.id as string;
    const userId = (req as any).user?.id;

    const deletedNote = await NoteService.deleteNote(noteId, userId);
    res.status(200).json({
      success: true,
      message: "Note has been deleted",
      note: deletedNote,
    });
  } catch (error) {
    next(error);
  }
};

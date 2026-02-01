import * as NoteRepository from '../repositories/note.repository';
import { AppError } from '../utils/AppError';

export const getNotesForUser = async (userId: string) => {
  try {
    const notes = await NoteRepository.findAllNotes(userId);
    if (!notes || notes.length === 0) {
      throw new AppError(404, "No notes found for this user");
    }
    return notes;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, error.message || "Failed to retrieve notes");
  }
};

export const getNoteById = async (noteId: string, userId: string) => {
  try {
    const note = await NoteRepository.findNoteById(noteId);
    if (!note) {
      throw new AppError(404, "Note not found");
    }
    if (note.user.toString() !== userId) {
      throw new AppError(401, "You are not authorized to access this note");
    }
    return note;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, error.message || "Failed to retrieve note");
  }
};

export const createNote = async (
  userId: string,
  noteData: { title: string; description: string; tag?: string }
) => {
  try {
    const note = await NoteRepository.createNewNote({
      ...noteData,
      user: userId,
    });
    return note;
  } catch (error: any) {
    throw new AppError(500, error.message || "Failed to create note");
  }
};

export const updateNote = async (
  noteId: string,
  userId: string,
  updateData: { title?: string; description?: string; tag?: string }
) => {
  try {
    const note = await NoteRepository.findNoteById(noteId);
    if (!note) {
      throw new AppError(404, "Note not found");
    }
    if (note.user.toString() !== userId) {
      throw new AppError(401, "You are not authorized to update this note");
    }
    const updatedNote = await NoteRepository.updateNoteById(noteId, updateData);
    return updatedNote;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, error.message || "Failed to update note");
  }
};

export const deleteNote = async (noteId: string, userId: string) => {
  try {
    const note = await NoteRepository.findNoteById(noteId);
    if (!note) {
      throw new AppError(404, "Note not found");
    }
    if (note.user.toString() !== userId) {
      throw new AppError(401, "You are not authorized to delete this note");
    }
    const deletedNote = await NoteRepository.deleteNoteById(noteId);
    return deletedNote;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, error.message || "Failed to delete note");
  }
};

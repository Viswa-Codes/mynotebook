import Note from '../models/Note';

export const findAllNotes = async (userId: string) => {
  return await Note.find({ user: userId }).sort({ date: -1 });
};

export const findNoteById = async (noteId: string) => {
  return await Note.findById(noteId);
};

export const createNewNote = async (noteData: {
  title: string;
  description: string;
  tag?: string;
  user: string;
}) => {
  const note = new Note(noteData);
  return await note.save();
};

export const updateNoteById = async (
  noteId: string,
  updateData: {
    title?: string;
    description?: string;
    tag?: string;
  }
) => {
  return await Note.findByIdAndUpdate(noteId, { $set: updateData }, { new: true });
};

export const deleteNoteById = async (noteId: string) => {
  return await Note.findByIdAndDelete(noteId);
};

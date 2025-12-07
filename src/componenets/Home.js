 import { useContext } from 'react';
 import NoteContext from '../context/notes/noteContext';

export const Home = () => {
    const context = useContext(NoteContext);
    const { notes, setNotes } = context;
    return (
        <div>

            <div className="container my-3">
                <h2>Add a Note</h2>
                <form></form>
            </div>

            <div className="container my-3">
                <h2>Your Notes</h2>
                {notes.map((note) => {
                    return <div key={note._id}>
                        <h3>{note.title}</h3>
                        <p>{note.description}</p>
                    </div>
                })}
            </div>
        </div>
    )
}
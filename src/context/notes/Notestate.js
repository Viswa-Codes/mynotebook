import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props)=>{
    const host = "http://localhost:5000";
    const notesInitial = []

    const [notes, setNotes] = useState(notesInitial);

    const getNotes = async () => {
    // API Call 
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjkxZDc3NTc1MWE3MzRkZDMzZWM5ZWQ4In0sImlhdCI6MTc2NDM5NzIxOH0.-6uurEfwYoj_bLbHPKcrLSKfu0oGTw0m88nZikn2HUg"
        }
        });
        const json = await response.json()
        console.log(json)
        setNotes(json)
    }

    // Add a Note
      const addNote = async(title, description, tag)=>{
        // TODO: API Call
        //API call
        const response = await fetch(`${host}/api/notes/addnote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjkxZDc3NTc1MWE3MzRkZDMzZWM5ZWQ4In0sImlhdCI6MTc2NDM5NzIxOH0.-6uurEfwYoj_bLbHPKcrLSKfu0oGTw0m88nZikn2HUg"
                },
            body:JSON.stringify({title, description, tag})
        });
        // Handle response and validation errors
        const json = await response.json();
        if (!response.ok) {
            console.error('Failed to add note', response.status, json);
            return; // don't update state on bad request
        }
        console.log("Adding a new note");
        const note = json;
        setNotes(notes.concat(note));
      }

      // Delete a Note
       const deleteNote = async (id) => {
    // API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjkxZDc3NTc1MWE3MzRkZDMzZWM5ZWQ4In0sImlhdCI6MTc2NDM5NzIxOH0.-6uurEfwYoj_bLbHPKcrLSKfu0oGTw0m88nZikn2HUg"
      }
    });
    const json = response.json();
    console.log(json)

    console.log("Deleting the note with id" + id);
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes)
  }


      // Edit a Note
      const editNote = async(id, title, description, tag)=>{
        //API call
            const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjkxZDc3NTc1MWE3MzRkZDMzZWM5ZWQ4In0sImlhdCI6MTc2NDM5NzIxOH0.-6uurEfwYoj_bLbHPKcrLSKfu0oGTw0m88nZikn2HUg"
                },
                body: JSON.stringify({title, description, tag})
                });
            const json = response.json();

        // Logic to edit in client
            for (let index = 0; index < notes.length; index++) {
            const element = notes[index];
                if (element._id === id) {
                    element.title = title;
                    element.description = description;
                    element.tag = tag;
                }
            }
      }

    return (
        <NoteContext.Provider value={{notes,addNote,deleteNote, editNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;
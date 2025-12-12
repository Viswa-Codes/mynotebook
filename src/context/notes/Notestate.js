import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props)=>{
    const notesInitial = [
        {
            "_id": "692aa2f63d323c703666f1d76",
            "user": "691d775751a734dd33ec9ed8",
            "title": "Mt title",
            "description": "Wake Up my friend",
            "tag": "personal",
            "date": "2025-11-29T07:38:30.521Z",
            "__v": 0
        },
         {
            "_id": "692aa2f63d323c703666f1d75",
            "user": "691d775751a734dd33ec9ed8",
            "title": "Mt title",
            "description": "Wake Up my friend",
            "tag": "personal",
            "date": "2025-11-29T07:38:30.521Z",
            "__v": 0
        },
         {
            "_id": "692aa2f63d323c703666f1d74",
            "user": "691d775751a734dd33ec9ed8",
            "title": "Mt title",
            "description": "Wake Up my friend",
            "tag": "personal",
            "date": "2025-11-29T07:38:30.521Z",
            "__v": 0
        },
         {
            "_id": "692aa2f63d323c703666f1d73",
            "user": "691d775751a734dd33ec9ed8",
            "title": "Mt title",
            "description": "Wake Up my friend",
            "tag": "personal",
            "date": "2025-11-29T07:38:30.521Z",
            "__v": 0
        },
         {
            "_id": "692aa2f63d323c703666f1d72",
            "user": "691d775751a734dd33ec9ed8",
            "title": "Mt title",
            "description": "Wake Up my friend",
            "tag": "personal",
            "date": "2025-11-29T07:38:30.521Z",
            "__v": 0
        },
         {
            "_id": "692aa2f63d323c703666f1d71",
            "user": "691d775751a734dd33ec9ed8",
            "title": "Mt title",
            "description": "Wake Up my friend",
            "tag": "personal",
            "date": "2025-11-29T07:38:30.521Z",
            "__v": 0
        }
    ]

    const [notes, setNotes] = useState(notesInitial);

    // Add a Note
      const addNote = (title, description, tag)=>{
        // TODO: API Call
        console.log("Adding a new note")
        const note = {
          "_id": "61322f119553781a8ca8d0e08",
          "user": "6131dc5e3e4037cd4734a0664",
          "title": title,
          "description": description,
          "tag": tag,
          "date": "2021-09-03T14:20:09.668Z",
          "__v": 0
        };
        setNotes(notes.concat(note)) 
      }

      // Delete a Note
      const deleteNote = ()=>{

      }
      // Edit a Note
      const editNote = ()=>{

      }

    return (
        <NoteContext.Provider value={{notes,addNote,deleteNote, editNote }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;
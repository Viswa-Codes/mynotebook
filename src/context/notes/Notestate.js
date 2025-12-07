import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props)=>{
    const notesInitial = [
        {
            "_id": "692aa2f63d323c703666f1d7",
            "user": "691d775751a734dd33ec9ed8",
            "title": "Mt title",
            "description": "Wake Up my friend",
            "tag": "personal",
            "date": "2025-11-29T07:38:30.521Z",
            "__v": 0
        }
    ]

    const [notes, setNotes] = useState(notesInitial);
    return (
        <NoteContext.Provider value={{notes,setNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;
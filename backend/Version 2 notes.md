Total 7 End points



User - 3 -->

New user(signup),Existing user(login),Getuser(getting user specific notes)



Notes - 4 --> Create(addnote),Read(fetchallnotes),Update(updatenote),Delete(deletenote)





Entry Point to Backend



**index.ts**

connectToMongo();-->db.ts
**var app initialized as express
used middlewares like CORS,JSON**

**-----------------------------------------------------------------------------------------------------------------------------------------------------------**



**Routes**

**|**

**|-->authRoutes->router/auth.ts**

**|		 |**

**|		 |-->/createUser-->auth.controller.ts**

**|		 |    			 |**

**|		 |    			 |-->createUser(req,res,next)**

**|		 |			 	|<==> Zod Validation(auth.validation.ts)=createUserSchema**

**|		 |				|**

**|		 |				|<==>registerUser(n,e,p)-->auth.service.ts** 

**|		 |				|				|<=>findUserByEmail-->auth.repository.ts**

**|		 |				|				|	 		 |<=>User(mongoose model).finds<==>MongoDB**

**|		 |				|				|**

**|		 | 				|				|<=>if existingUser<=>AppError.ts**

**|		 |				|				|<=>Hash the passoword**

**|		 |				|				|<=>createNewUser-->auth.repository.ts**

**|		 |				|				|			|<=>new User(mongoose model).save<==>MongoDB**

**|		 |				|				|<=>generateToken(JWT)->function written**

**|		 |				|				|<=>return { success: true, authtoken: token };**

**|		 |				|				|<=>Else error ? <=>AppError.ts**

**|		 |				|<==>res.(201).json(result)**

**|		 |				|<=>Else if Zoderror ? res.(400).errors : next(error)\[500]**

**|		 |**			

**|		 |**

**|		 |-->/login-->auth.controller.ts**

**|		 |    			 |**

**|		 |    			 |-->login(req,res,next)**

**|		 |			 	|<==> Zod Validation(auth.validation.ts)=loginSchema**

**|		 |				|**

**|		 |				|<==>loginUser(e,p)-->auth.service.ts**

**|		 |				|				|<=>loginUser-->auth.repository.ts**

**|		 |				|				|	 		 |<=>UserEmail(mongoose model).finds<==>MongoDB**

**|		 |				|				|**

**|		 | 				|				|<=>if !user<=>AppError.ts**

**|		 |				|				|<=>Compare the passoword ? true : AppError.ts**

**|		 |				|				|<=>generateToken(JWT)->function written**

**|		 |				|				|<=>return { success: true, authtoken: token };**

**|		 |				|				|<=>Else error ? <=>AppError.ts**

**|		 |				|<==>res.(200).json(result)**

**|		 |				|<=>Else if Zoderror ? res.(400).errors : next(error)\[500]**

**|		 |**

**|		 |**

**|		 |-->/getUser--->fetchuser.ts\[middleware]**

**|		 	|		|<=>fetchuser(req,res,next)**

**|		 	|			|<=>if token ? true:next(AppError.ts)**

**|		 	|			|<=> jwt verify ? next() :next(AppError.ts)**

**|		 	|-->auth.controller.ts**

**|		     			 |**

**|		    			 |-->getUser(req,res,next)**

**|		 			 	|<==> userId from req**

**|		 				|**

**|		 				|<==>getUserDetails(userId)-->auth.service.ts**

**|		 				|				|<=>findUserById-->auth.repository.ts**

**|		 				|				|	 		|<=>findUserById(mongoose model).finds<=>MongoDB**

**|		 				|				|**

**|		 				|				|<=>if !user<=>AppError.ts**

**|		 				|				|<=>return user;**

**|		 				|				|<=>Else error ? <=>AppError.ts**

**|		 				|<==>res.(200).json(user)**

**|		 				|<=>Else next(error)\[500]**

**|**

**|**

**|-->notesRoutes->router/notes.ts**

**|		 |**

**|		 |-->/addnote--->fetchuser.ts\[middleware]**

**|		 |	|		|<=>fetchuser(req,res,next)**

**|		 |	|			|<=>if token ? true:next(AppError.ts)**

**|		 |	|			|<=> jwt verify ? next() :next(AppError.ts)**

**|		 |	|-->note.controller.ts**

**|		 |    			 |**

**|		 |    			 |-->addNote(req,res,next)**

**|		 |			 	|<==> Zod Validation(note.validation.ts)=createNoteSchema**

**|		 |				|**

**|		 |				|<=>userId = req.id**

**|		 |				|**

**|		 |				|<==>createNote(userId,t,d,tag)-->note.service.ts**

**|		 |				|				|<=>createNewNote-->auth.repository.ts**

**|		 |				|				|	 		 |<=>Note(mongoose model).save<==>MongoDB**

**|		 |				|				|**

**|		 |				|				|<=>return note;**

**|		 |				|				|<=>Else error ? <=>AppError.ts**

**|		 |				|<==>res.(201).json(newNote)**

**|		 |				|<=>Else next(error)\[500]**

**|		 |**

**|		 |**

**|		 |-->/fetchallnotes-->--->fetchuser.ts\[middleware]**

**|		 |	|		|<=>fetchuser(req,res,next)**

**|		 |	|			|<=>if token ? true:next(AppError.ts)**

**|		 |	|			|<=> jwt verify ? next() :next(AppError.ts)**

**|		 |	|-->note.controller.ts**

**|		 |    			 |**

**|		 |    			 |-->getAllNotes(req,res,next)**

**|		 |				|**

**|		 |				|<=>userId = req.id**

**|		 |				|**

**|		 |				|<==>getNotesForUser(userId)-->note.service.ts**

**|		 |				|				|<=>findAllNotes-->auth.repository.ts**

**|		 |				|				|	 		 |<=>Note(mongoose model).find<==>MongoDB**

**|		 |				|				|**

**|		 |				|				|<=>if(!notes)<=>AppError.ts**

**|		 |				|				|<=>return notes;**

**|		 |				|				|<=>Else error ? <=>AppError.ts**

**|		 |				|<==>res.(200).json(notes)**

**|		 |				|<=>Else next(error)\[500]**

**|		 |**

**|		 |**

**|		 |-->/updatenote:id-->--->fetchuser.ts\[middleware]**

**|		 |	|		|<=>fetchuser(req,res,next)**

**|		 |	|			|<=>if token ? true:next(AppError.ts)**

**|		 |	|			|<=> jwt verify ? next() :next(AppError.ts)**

**|		 |	|-->note.controller.ts**

**|		 |    			 |**

**|		 |    			 |-->updateNote(req,res,next)**

**|		 |				|**

**|		 |				|<=>Zod Validation(note.validation.ts)=updateNoteSchema**

**|		 |				|<=>{noteId,userId} = req.body;**

**|		 |				|<==>updateNote(noteId, userId)-->note.service.ts**

**|		 |				|				|<=>findNoteById-->auth.repository.ts**

**|		 |				|				|	 		 |<=>Note(mongoose model).findById<==>MongoDB**

**|		 |				|				|**

**|		 |				|				|<=>if(!note)<=>AppError.ts**

**|		 |				|				|<=>if(note.user != userId)<=>AppError.ts**

**|		 |				|				|<=>updateNoteById-->auth.repository.ts**

**|		 |				|				|	 		|<=>Note(mongoose model).findById\&Update<=>MongoDB**

**|		 |				|				|<=>return updatedNote;**

**|		 |				|				|<=>Else error ? <=>AppError.ts**

**|		 |				|<==>res.(200).json(updatedNote)**

**|		 |				|<=>Else next(error)\[500]**

**|		 |-->/fetchallnotes-->--->fetchuser.ts\[middleware]**

**|		 |	|		|<=>fetchuser(req,res,next)**

**|		 |	|			|<=>if token ? true:next(AppError.ts)**

**|		 |	|			|<=> jwt verify ? next() :next(AppError.ts)**

**|		 |	|-->note.controller.ts**

**|		 |    			 |**

**|		 |    			 |-->getAllNotes(req,res,next)**

**|		 |				|**

**|		 |				|<=>userId = req.id**

**|		 |				|**

**|		 |				|<==>getNotesForUser(userId)-->note.service.ts**

**|		 |				|				|<=>findAllNotes-->auth.repository.ts**

**|		 |				|				|	 		 |<=>Note(mongoose model).find<==>MongoDB**

**|		 |				|				|**

**|		 |				|				|<=>if(!notes)<=>AppError.ts**

**|		 |				|				|<=>return notes;**

**|		 |				|				|<=>Else error ? <=>AppError.ts**

**|		 |				|<==>res.(200).json(notes)**

**|		 |				|<=>Else next(error)\[500]**

**|		 |**

**|		 |**

**|		 |-->/deletenote:id-->--->fetchuser.ts\[middleware]**

**|		 |	|		|<=>fetchuser(req,res,next)**

**|		 |	|			|<=>if token ? true:next(AppError.ts)**

**|		 |	|			|<=> jwt verify ? next() :next(AppError.ts)**

**|		 |	|-->note.controller.ts**

**|		 |    			 |**

**|		 |    			 |-->deleteNote(req,res,next)**

**|		 |				|**

**|		 |				|<=>{noteId,userId} = req.body;**

**|		 |				|<==>deleteNote(noteId, userId)-->note.service.ts**

**|		 |				|				|<=>findNoteById-->auth.repository.ts**

**|		 |				|				|	 		 |<=>Note(mongoose model).findById<==>MongoDB**

**|		 |				|				|**

**|		 |				|				|<=>if(!note)<=>AppError.ts**

**|		 |				|				|<=>if(note.user != userId)<=>AppError.ts**

**|		 |				|				|<=>deleteNoteById-->auth.repository.ts**

**|		 |				|				|	 		|<=>Note(mongoose model).findById\&Delete<=>MongoDB**

**|		 |				|				|<=>return deletedNote;**

**|		 |				|				|<=>Else error ? <=>AppError.ts**

**|		 |				|**

**|		 |				|<==>res.(200).json(success,msg,deletedNote)**

**|		 |				|<=>Else next(error)\[500]**



**-----------------------------------------------------------------------------------------------------------------------------------------------------------**



**used middlewares like errorHandler (Global Error Handler for next(err))**

**start server at port**









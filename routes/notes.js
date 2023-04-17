const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');

const { body, validationResult } = require('express-validator'); //require for body and validator we are using in input end....

//route 1: 

router.get('/fetchallnotes' ,fetchuser ,async(req,res) => {
    
    //console.log(req.user);
    //const notes = await Notes.find({user:req.user.id});
    //const notes =[];
    //res.json(notes);

    try {

        //console.log(req);
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

// route 2:post method for adding note;;
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 5 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {

            const { title, description, tag } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save(); //it return a promise what to add with all other information

            res.json(savedNote)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

    //route 3: update an existing note by the login time and by the correct user

    router.put('/updatenote/:id', fetchuser,[
        body('title', 'Enter a valid title').isLength({ min: 5 }),
        body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        const {title, description, tag} = req.body;
        // Create a newNote object
        const newNote  = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};
    
        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")} //whether that note is existing or not..
    
         //whether correct person is updating or not so as we have to check the userid
        // console.log(req);
        if(note.user.toString() !== req.user.id){    
            return res.status(401).send("Not Allowed");
        }

    
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})  // {new:true} krne se hmko updated one milega..
        res.json({note});
    
        })
    
//route 4: delete an existing note by the login time and by the correct user

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;
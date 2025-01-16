const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Notes = require("../models/Notes");

// ROUTE 1: Get all the notes using: GET "/api/notes/fetchallnotes". Login required.
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required.
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Title must be atleast of length 3").isLength({ min: 3 }),
    body("description", "Description must be atleast of 3 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      // If there are errors, return Bad request and the errors.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, description, tag } = req.body;
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch(error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server error" });
    }
  }
);

module.exports = router;

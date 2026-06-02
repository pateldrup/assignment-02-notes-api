const express = require("express");
const router = express.Router();
const {
    createBulkNotes,
    deleteBulkNotes,
    getNotesByCategory,
    createNote,
    getAllNotes,
    getNoteById,
    replaceNote,
    updateNote,
    deleteNote
} = require("../controllers/note.controller");

// CRUD bulk routes first
router.post("/bulk", createBulkNotes);
router.delete("/bulk", deleteBulkNotes);

// Route param sections
router.get("/category/:category", getNotesByCategory);

// CRUD single-item routes LAST
router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;

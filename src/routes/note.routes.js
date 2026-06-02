const express = require("express");
const router = express.Router();
const {
    createBulkNotes,
    createNote,
    getAllNotes
} = require("../controllers/note.controller");

// CRUD bulk routes first
router.post("/bulk", createBulkNotes);

// CRUD single-item routes LAST
router.post("/", createNote);
router.get("/", getAllNotes);

module.exports = router;

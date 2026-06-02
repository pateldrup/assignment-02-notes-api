const express = require("express");
const router = express.Router();
const {
    createBulkNotes,
    createNote
} = require("../controllers/note.controller");

// CRUD bulk routes first
router.post("/bulk", createBulkNotes);

// CRUD single-item routes LAST
router.post("/", createNote);

module.exports = router;

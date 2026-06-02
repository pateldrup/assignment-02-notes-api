const express = require("express");
const router = express.Router();
const {
    createBulkNotes,
    deleteBulkNotes,
    getNotesByCategory,
    getNotesByStatus,
    filterNotes,
    getPinnedNotes,
    filterByCategory,
    filterByDateRange,
    paginateNotes,
    paginateByCategory,
    sortNotes,
    sortPinnedNotes,
    createNote,
    getAllNotes,
    getNoteSummary,
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
router.get("/status/:isPinned", getNotesByStatus);

// Query param sections
router.get("/filter", filterNotes);
router.get("/filter/pinned", getPinnedNotes);
router.get("/filter/category", filterByCategory);
router.get("/filter/date-range", filterByDateRange);

// Pagination
router.get("/paginate", paginateNotes);
router.get("/paginate/category/:category", paginateByCategory);

// Sorting
router.get("/sort", sortNotes);
router.get("/sort/pinned", sortPinnedNotes);

// CRUD single-item routes LAST
router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id/summary", getNoteSummary);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;

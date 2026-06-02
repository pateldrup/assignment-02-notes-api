const Note = require("../models/note.model");

exports.createNote = async (req, res) => {
    try {
        const { title, content, category, isPinned } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required",
                data: null
            });
        }

        const note = await Note.create({ title, content, category, isPinned });

        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error",
            data: null
        });
    }
};

exports.createBulkNotes = async (req, res) => {
    try {
        const { notes } = req.body;

        if (!notes || !Array.isArray(notes) || notes.length === 0) {
            return res.status(400).json({
                success: false,
                message: "notes array is required and cannot be empty",
                data: null
            });
        }

        const createdNotes = await Note.insertMany(notes);

        return res.status(201).json({
            success: true,
            message: `${createdNotes.length} notes created successfully`,
            data: []
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error",
            data: null
        });
    }
};

exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find();

        return res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            count: notes.length,
            data: notes
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error",
            data: null
        });
    }
};


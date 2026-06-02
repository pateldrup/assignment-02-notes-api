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

exports.getNoteById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid note ID",
                data: null
            });
        }

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note fetched successfully",
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

exports.replaceNote = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid note ID",
                data: null
            });
        }

        const note = await Note.findByIdAndUpdate(
            id,
            req.body,
            { new: true, overwrite: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note replaced successfully",
            data: note
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(val => val.message).join(', ') || error.message,
                data: null
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error",
            data: null
        });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid note ID",
                data: null
            });
        }

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided to update",
                data: null
            });
        }

        const note = await Note.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: note
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(val => val.message).join(', ') || error.message,
                data: null
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error",
            data: null
        });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid note ID",
                data: null
            });
        }

        const note = await Note.findByIdAndDelete(id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully",
            data: null
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error",
            data: null
        });
    }
};

exports.deleteBulkNotes = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "ids array is required and cannot be empty",
                data: null
            });
        }

        const result = await Note.deleteMany({ _id: { $in: ids } });

        return res.status(200).json({
            success: true,
            message: `${result.deletedCount} notes deleted successfully`,
            data: null
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error",
            data: null
        });
    }
};

exports.getNotesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const allowed = ["work", "personal", "study"];

        if (!allowed.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category. Allowed: work, personal, study",
                data: null
            });
        }

        const notes = await Note.find({ category });

        if (notes.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No notes found for category: ${category}`,
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: `Notes fetched for category: ${category}`,
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

exports.getNotesByStatus = async (req, res) => {
    try {
        const { isPinned } = req.params;

        if (isPinned !== "true" && isPinned !== "false") {
            return res.status(400).json({
                success: false,
                message: "isPinned must be true or false",
                data: null
            });
        }

        const pinned = isPinned === "true";
        const notes = await Note.find({ isPinned: pinned });

        return res.status(200).json({
            success: true,
            message: "Fetched all pinned notes",
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

exports.getNoteSummary = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid note ID",
                data: null
            });
        }

        const note = await Note.findById(id).select("title category isPinned createdAt");

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note summary fetched successfully",
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

exports.filterNotes = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.isPinned !== undefined) filter.isPinned = req.query.isPinned === "true";

        const notes = await Note.find(filter);

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

exports.getPinnedNotes = async (req, res) => {
    try {
        const filter = { isPinned: true };
        if (req.query.category) filter.category = req.query.category;

        const notes = await Note.find(filter);

        return res.status(200).json({
            success: true,
            message: "Pinned notes fetched successfully",
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

exports.filterByCategory = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Query param 'name' is required",
                data: null
            });
        }

        const notes = await Note.find({ category: name });

        return res.status(200).json({
            success: true,
            message: `Notes filtered by category: ${name}`,
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

exports.filterByDateRange = async (req, res) => {
    try {
        const { from, to } = req.query;

        if (!from || !to) {
            return res.status(400).json({
                success: false,
                message: "Both 'from' and 'to' query params are required",
                data: null
            });
        }

        const filter = {
            createdAt: {
                $gte: new Date(from),
                $lte: new Date(to)
            }
        };

        const notes = await Note.find(filter);

        return res.status(200).json({
            success: true,
            message: `Notes fetched between ${from} and ${to}`,
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

exports.paginateNotes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Note.countDocuments();
        const totalPages = Math.ceil(total / limit);
        const notes = await Note.find().skip(skip).limit(limit);

        return res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            data: notes,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error",
            data: null
        });
    }
};

exports.paginateByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { category };
        const total = await Note.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        const notes = await Note.find(filter).skip(skip).limit(limit);

        return res.status(200).json({
            success: true,
            message: `Notes fetched for category: ${category}`,
            data: notes,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error",
            data: null
        });
    }
};

exports.sortNotes = async (req, res) => {
    try {
        const allowed = ["title", "createdAt", "updatedAt", "category"];
        const sortBy = req.query.sortBy || "createdAt";
        const order = req.query.order === "asc" ? 1 : -1;

        if (!allowed.includes(sortBy)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sortBy. Allowed: title, createdAt, updatedAt, category",
                data: null
            });
        }

        const notes = await Note.find().sort({ [sortBy]: order });

        return res.status(200).json({
            success: true,
            message: `Notes sorted by ${sortBy} in ${req.query.order === 'asc' ? 'ascending' : 'descending'} order`,
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

exports.sortPinnedNotes = async (req, res) => {
    try {
        const allowed = ["title", "createdAt", "updatedAt", "category"];
        const sortBy = req.query.sortBy || "createdAt";
        const order = req.query.order === "asc" ? 1 : -1;

        if (!allowed.includes(sortBy)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sortBy. Allowed: title, createdAt, updatedAt, category",
                data: null
            });
        }

        const notes = await Note.find({ isPinned: true }).sort({ [sortBy]: order });

        return res.status(200).json({
            success: true,
            message: `Pinned notes sorted by ${sortBy} in ${req.query.order === 'asc' ? 'ascending' : 'descending'} order`,
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


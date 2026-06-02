const express = require("express");
const connectDB = require("./config/db");
const noteRoutes = require("./routes/note.routes");

const app = express();

// Connect Database
connectDB();

app.use(express.json());

app.use("/api/notes", noteRoutes);

module.exports = app;

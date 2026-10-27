const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require("fs");
require('dotenv').config()
const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db.js")
const authRoutes = require('./routes/authRoutes')
const protect = require('./middleware/authMiddleware')
const noteRoutes = require('./routes/noteRoutes.js')

const app = express()

app.use(cors())
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/notes', noteRoutes)

app.get('/', (req, res) => {
    res.send("Study notes Backend is running");
})

app.get("/api/notes/:id/download", async (req, res) => {
    try {
        const Note = require("./models/Note");

        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        const filename = require("path").basename(note.fileURL);
        const filePath = require("path").join(__dirname, "uploads", filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                message: "PDF file not found"
            });
        }

        res.download(filePath, filename, (error) => {
            if (error && !res.headersSent) {
                res.status(500).json({
                    message: "Failed to download PDF"
                });
            }
        });

    } catch (error) {
        console.error("Download error:", error);

        res.status(500).json({
            message: "Failed to download PDF"
        });
    }
});

app.use((err, req, res, next) => {
    if(err.message === 'Only PDF files are allowed') {
        return res.status(400).json({message: err.message})
    }

    if(err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({message: 'File size must not exceed 10 MB'})
    }

    console.error(err);

    res.status(500).json({
        message: "Something went wrong"
    })
})
app.listen(PORT, () => {
    console.log(`server is runnning on port ${PORT}`)
})

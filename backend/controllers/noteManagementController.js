
const Note = require("../models/Note");
const fs = require("fs");
const path = require("path");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments();
    const myNotes = await Note.countDocuments({
      uploadedBy: req.user.userId
    });

    res.json({ totalNotes, myNotes });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

// Get notes uploaded by logged-in user
const getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      uploadedBy: req.user.userId
    }).sort({ createdAt: -1 });

    res.json({ count: notes.length, notes });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your notes" });
  }
};

// Delete a note uploaded by logged-in user
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.uploadedBy.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only delete your own notes"
      });
    }

    const filename = path.basename(note.fileURL);
    const filePath = path.join(__dirname, "../uploads", filename);

    await Note.findByIdAndDelete(note._id);

    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Could not delete PDF file:", error);
      }
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete note" });
  }
};

module.exports = {
  getDashboardStats,
  getMyNotes,
  deleteNote
};

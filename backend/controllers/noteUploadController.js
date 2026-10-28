
const fs = require("fs");
const Note = require("../models/Note");

const uploadNote = async (req, res) => {
  try {
    const { title, subject, semester, description } = req.body;

    if (!title || !subject || !semester) {
      if (req.file?.path) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({
        message: "Title, subject, and semester are required"
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF file"
      });
    }

    const userId = req.user?.userId || req.user?.id || req.user?._id;
    if (!userId) {
      if (req.file?.path) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(401).json({
        message: "User session invalid. Please log in again."
      });
    }

    const descText = (description && description.trim()) 
      ? description.trim() 
      : `${title.trim()} notes for ${subject.trim()}`;

    const note = await Note.create({
      title: title.trim(),
      subject: subject.trim(),
      semester: Number(semester),
      description: descText,
      fileURL: `/uploads/${req.file.filename}`,
      uploadedBy: userId
    });

    res.status(201).json({
      message: "Note uploaded successfully",
      note
    });

  } catch (error) {
    console.error("Error uploading note:", error);

    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }

    res.status(500).json({
      message: error.message || "Failed to upload note"
    });
  }
};

module.exports = { uploadNote };

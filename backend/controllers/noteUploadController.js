
const Note = require("../models/Note");

const uploadNote = async (req, res) => {
  try {
    const { title, subject, semester, description } = req.body;

    if (!title || !subject || !semester) {
      return res.status(400).json({
        message: "Title, subject, and semester are required"
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF file"
      });
    }

    const note = await Note.create({
      title,
      subject,
      semester: Number(semester),
      description: description || "",
      fileURL: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.userId
    });

    res.status(201).json({
      message: "Note uploaded successfully",
      note
    });

  } catch (error) {
    console.error("Error uploading note:", error);

    res.status(500).json({
      message: "Failed to upload note"
    });
  }
};

module.exports = {uploadNote};

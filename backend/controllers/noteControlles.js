
const Note = require("../models/Note");

const getAllNotes = async (req, res) => {
  try {
    const { search, semester } = req.query;

    const filter = {};

    // Search by title or subject
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { subject: { $regex: search.trim(), $options: "i" } }
      ];
    }

    // Filter by semester
    if (semester) {
      const semesterNumber = Number(semester);

      if (
        !Number.isInteger(semesterNumber) ||
        semesterNumber < 1
      ) {
        return res.status(400).json({
          message: "Semester must be a positive integer"
        });
      }

      filter.semester = semesterNumber;
    }

    const notes = await Note.find(filter)
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: notes.length,
      notes
    });

  } catch (error) {
    console.error("Error fetching notes:", error);

    res.status(500).json({
      message: "Server error while fetching notes"
    });
  }
};

module.exports = {
  getAllNotes
};

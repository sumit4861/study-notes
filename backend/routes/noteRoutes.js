const express = require('express')

const router = express.Router()

const {getAllNotes} = require("../controllers/noteControlles")

const {uploadNote} = require("../controllers/noteUploadController")
const protect = require("../middleware/authMiddleware")
const upload = require('../config/multer')

const {
  getDashboardStats,
  getMyNotes,
  deleteNote
} = require("../controllers/noteManagementController");

router.get("/", getAllNotes)
router.post("/", protect, upload.single("file"), uploadNote);

router.get("/dashboard/stats", protect, getDashboardStats);
router.get("/my", protect, getMyNotes);
router.delete("/:id", protect, deleteNote);
module.exports = router;
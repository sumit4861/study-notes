import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  UploadCloud,
  FileText,
  BookOpen,
  Layers,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  X,
  FileCode,
  ArrowRight
} from "lucide-react";

function UploadNote() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    semester: "",
    description: ""
  });

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const processFile = (selectedFile) => {
    setMessage("");
    setSuccess(false);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setFile(null);
      setMessage("Invalid format: Only PDF documents are supported.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setMessage("File size exceeds 10 MB limit. Please compress your PDF.");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a PDF document to upload.");
      setSuccess(false);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("subject", formData.subject.trim());
    data.append("semester", formData.semester);
    const descText = formData.description.trim() || `${formData.title.trim()} notes for ${formData.subject.trim()}`;
    data.append("description", descText);
    data.append("file", file);

    try {
      setLoading(true);
      setMessage("");
      setSuccess(false);

      const response = await api.post("/api/notes", data);

      setSuccess(true);
      setMessage(
        response.data.message || "Notes uploaded and published successfully!"
      );

      setFormData({
        title: "",
        subject: "",
        semester: "",
        description: ""
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Smooth redirection to browse notes
      setTimeout(() => {
        navigate("/browse-notes");
      }, 1400);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(
        error.response?.data?.message ||
        "Failed to upload notes. Please check all fields and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="upload-card-wrapper">
        <div className="card form-card" style={{ maxWidth: "680px" }}>
          <div className="page-header" style={{ marginBottom: "24px" }}>
            <h1>Upload Study Notes</h1>
            <p>
              Share your lecture summaries, hand-written notes, or syllabus resources with the student community.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Note Title */}
            <div className="form-group">
              <label htmlFor="title">Note Title *</label>
              <div className="input-wrapper">
                <BookOpen className="input-icon" size={18} />
                <input
                  id="title"
                  type="text"
                  name="title"
                  className="form-input input-with-icon"
                  placeholder="e.g., Computer Networks Unit 3 - Transport Layer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* 2-Column row: Subject & Semester */}
            <div className="form-grid-2col">
              <div className="form-group">
                <label htmlFor="subject">Subject / Course *</label>
                <div className="input-wrapper">
                  <Layers className="input-icon" size={18} />
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    className="form-input input-with-icon"
                    placeholder="e.g., Computer Networks"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="semester">Semester *</label>
                <div className="input-wrapper">
                  <GraduationCap className="input-icon" size={18} />
                  <select
                    id="semester"
                    name="semester"
                    className="form-input form-select input-with-icon"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description (required)</label>
              <div className="input-wrapper">
                <textarea
                  id="description"
                  name="description"
                  className="form-input form-textarea"
                  placeholder="Summarize key topics covered, professor references, or exam relevance..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <span className="form-hint">
                Briefly mention what makes these notes helpful for fellow students.
              </span>
            </div>

            {/* Drag & Drop File Upload Zone */}
            <div className="form-group">
              <label>PDF Document *</label>

              {!file ? (
                <div
                  className={`dropzone-container ${isDragging ? "drag-active" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="dropzone-icon">
                    <UploadCloud size={28} />
                  </div>
                  <div className="dropzone-title">
                    Click to browse or drag & drop PDF here
                  </div>
                  <div className="dropzone-sub">
                    Only PDF documents allowed • Maximum 10 MB
                  </div>
                  <input
                    ref={fileInputRef}
                    id="file"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
              ) : (
                <div className="selected-file-card">
                  <div className="selected-file-info">
                    <div className="file-pdf-icon">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="file-name" title={file.name}>
                        {file.name}
                      </div>
                      <div className="file-size">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    title="Remove selected file"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Status Feedback Alert */}
            {message && (
              <div
                className={`alert ${success ? "alert-success" : "alert-danger"}`}
                role="status"
              >
                {success ? (
                  <CheckCircle2 className="alert-icon" size={18} />
                ) : (
                  <AlertCircle className="alert-icon" size={18} />
                )}
                <span>{message}</span>
              </div>
            )}

            {/* Form Actions */}
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Uploading Notes...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={18} />
                    <span>Publish Notes</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/browse-notes")}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadNote;

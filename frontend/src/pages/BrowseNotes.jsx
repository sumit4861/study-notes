import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../api";
import PdfModal from "../components/PdfModal";
import {
  Search,
  BookOpen,
  Calendar,
  User,
  Eye,
  Download,
  Filter,
  X,
  FileText
} from "lucide-react";

function BrowseNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");

  // PDF Preview Modal state
  const [previewNote, setPreviewNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/notes", {
          params: {
            search: search.trim(),
            semester: semester
          }
        });

        setNotes(response.data.notes || []);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to load notes. Please verify backend connection.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly for responsive typing
    const timer = setTimeout(() => {
      fetchNotes();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, semester]);

  const clearFilters = () => {
    setSearch("");
    setSemester("");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="page-container">
      {/* Search & Filter Header Card */}
      <div className="browse-header-card">
        <div className="page-header" style={{ marginBottom: "16px" }}>
          <h1>Browse Study Notes</h1>
          <p>
            Explore verified university study notes, summaries, and exam guides shared by students.
          </p>
        </div>

        <div className="search-filter-bar">
          <div className="input-wrapper">
            <Search className="input-icon" size={18} />
            <input
              type="text"
              className="form-input input-with-icon input-with-action"
              placeholder="Search by note title, subject, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="input-action-btn"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="input-wrapper">
            <Filter className="input-icon" size={18} />
            <select
              className="form-input form-select input-with-icon"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Semester Filter Pills */}
        <div className="semester-chips-row">
          <button
            type="button"
            className={`semester-chip ${semester === "" ? "active" : ""}`}
            onClick={() => setSemester("")}
          >
            All Semesters
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <button
              key={s}
              type="button"
              className={`semester-chip ${semester === String(s) ? "active" : ""}`}
              onClick={() => setSemester(semester === String(s) ? "" : String(s))}
            >
              Semester {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="results-meta-bar">
        <div>
          Showing <span className="results-count-pill">{notes.length}</span>{" "}
          {notes.length === 1 ? "note" : "notes"}
          {semester && ` in Semester ${semester}`}
          {search && ` matching "${search}"`}
        </div>

        {(search || semester) && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={clearFilters}
          >
            <X size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Notes State Handling */}
      {loading ? (
        <div className="loading-container">
          <span className="spinner spinner-primary" style={{ width: "36px", height: "36px", borderWidth: "3px" }}></span>
          <p>Loading study materials...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" style={{ maxWidth: "600px", margin: "20px auto" }}>
          <p>{error}</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <BookOpen size={30} />
          </div>
          <h3>No study notes found</h3>
          <p>
            We couldn't find any notes matching your search criteria. Try searching for a different subject or reset filters.
          </p>
          {(search || semester) && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div className="note-card" key={note._id}>
              <div>
                <div className="note-card-top">
                  <span className="badge badge-semester">
                    Semester {note.semester}
                  </span>
                  <span className="badge badge-subject">
                    {note.subject}
                  </span>
                </div>

                <h3 className="note-title" title={note.title}>
                  {note.title}
                </h3>

                <p className="note-desc">
                  {note.description || "No specific description provided for this note."}
                </p>
              </div>

              <div>
                <div className="note-meta">
                  <div className="note-author">
                    <div className="note-author-avatar">
                      {getInitials(note.uploadedBy?.name)}
                    </div>
                    <span>{note.uploadedBy?.name || "Student"}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={13} />
                    <span>
                      {note.createdAt
                        ? new Date(note.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })
                        : "Recent"}
                    </span>
                  </div>
                </div>

                <div className="note-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      setPreviewNote({
                        title: note.title,
                        fileURL: `${API_BASE_URL}${note.fileURL}`,
                        downloadURL: `${API_BASE_URL}/api/notes/${note._id}/download`
                      })
                    }
                  >
                    <Eye size={15} />
                    <span>Preview</span>
                  </button>

                  <a
                    className="btn btn-primary btn-sm"
                    href={`${API_BASE_URL}/api/notes/${note._id}/download`}
                  >
                    <Download size={15} />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewNote && (
        <PdfModal
          isOpen={Boolean(previewNote)}
          onClose={() => setPreviewNote(null)}
          title={previewNote.title}
          fileURL={previewNote.fileURL}
          downloadURL={previewNote.downloadURL}
        />
      )}
    </div>
  );
}

export default BrowseNotes;

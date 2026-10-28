import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { API_BASE_URL } from "../api";
import PdfModal from "../components/PdfModal";
import ConfirmModal from "../components/ConfirmModal";
import {
  FolderOpen,
  Plus,
  Eye,
  Download,
  Trash2,
  Calendar,
  Layers,
  Search,
  BookOpen
} from "lucide-react";

function MyNotes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  // Modals state
  const [previewNote, setPreviewNote] = useState(null);
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    noteId: null,
    noteTitle: "",
    isDeleting: false
  });

  const fetchMyNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/notes/my");
      setNotes(response.data.notes || []);
    } catch (error) {
      console.error("Error fetching my notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyNotes();
  }, []);

  const handleOpenDelete = (note) => {
    setDeleteModalState({
      isOpen: true,
      noteId: note._id,
      noteTitle: note.title,
      isDeleting: false
    });
  };

  const handleConfirmDelete = async () => {
    const { noteId } = deleteModalState;
    if (!noteId) return;

    try {
      setDeleteModalState((prev) => ({ ...prev, isDeleting: true }));

      await api.delete(`/api/notes/${noteId}`);

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));

      setDeleteModalState({
        isOpen: false,
        noteId: null,
        noteTitle: "",
        isDeleting: false
      });
    } catch (error) {
      console.error("Delete error:", error);
      alert(
        error.response?.data?.message ||
        "Failed to delete note. Please try again."
      );
      setDeleteModalState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const filteredNotes = notes.filter((n) => {
    const search = filterText.toLowerCase();
    return (
      n.title?.toLowerCase().includes(search) ||
      n.subject?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1>My Uploaded Notes</h1>
        <p>
          Manage the study materials, summaries, and exam guides you've contributed to the library.
        </p>
      </div>

      {/* Toolbar */}
      <div className="my-notes-toolbar">
        <div className="my-notes-stats">
          <span>Total Uploads:</span>
          <span className="my-notes-badge">{notes.length} {notes.length === 1 ? "Note" : "Notes"}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {notes.length > 0 && (
            <div className="input-wrapper" style={{ width: "240px" }}>
              <Search className="input-icon" size={16} />
              <input
                type="text"
                className="form-input input-with-icon"
                placeholder="Filter my notes..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{ padding: "8px 12px 8px 36px", fontSize: "13px" }}
              />
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/upload-note")}
          >
            <Plus size={16} />
            <span>Upload New Note</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-container">
          <span className="spinner spinner-primary" style={{ width: "36px", height: "36px", borderWidth: "3px" }}></span>
          <p>Loading your study materials...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FolderOpen size={30} />
          </div>
          <h3>No notes uploaded yet</h3>
          <p>
            You haven't uploaded any study materials yet. Help your fellow students by publishing your first note!
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/upload-note")}
          >
            <Plus size={18} />
            <span>Upload Your First Note</span>
          </button>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="empty-state">
          <h3>No matching notes found</h3>
          <p>None of your uploads match "{filterText}".</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setFilterText("")}
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
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
                  {note.description || "No description provided."}
                </p>
              </div>

              <div>
                <div className="note-meta">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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

                  <span className="badge badge-accent" style={{ fontSize: "11px" }}>
                    Verified PDF
                  </span>
                </div>

                <div className="note-actions-my">
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
                    title="Preview PDF"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>

                  <a
                    className="btn btn-secondary btn-sm"
                    href={`${API_BASE_URL}/api/notes/${note._id}/download`}
                    title="Download PDF"
                  >
                    <Download size={14} />
                    <span>Save</span>
                  </a>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleOpenDelete(note)}
                    title="Delete Note"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
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

      {/* Custom Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalState.isOpen}
        onClose={() =>
          !deleteModalState.isDeleting &&
          setDeleteModalState({
            isOpen: false,
            noteId: null,
            noteTitle: "",
            isDeleting: false
          })
        }
        onConfirm={handleConfirmDelete}
        title="Delete Study Note?"
        message={`Are you sure you want to permanently delete "${deleteModalState.noteTitle}"? This action cannot be reversed.`}
        confirmText="Yes, Delete Note"
        loading={deleteModalState.isDeleting}
      />
    </div>
  );
}

export default MyNotes;

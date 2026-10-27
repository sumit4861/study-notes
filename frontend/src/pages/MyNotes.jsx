
import { useEffect, useState } from "react";
import axios from "axios";

function MyNotes() {
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("Loading your notes...");

  const fetchMyNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/notes/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNotes(response.data.notes);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to load your notes.");
    }
  };

  useEffect(() => {
    fetchMyNotes();
  }, []);

  const handleDelete = async (noteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/notes/${noteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNotes((previousNotes) =>
        previousNotes.filter((note) => note._id !== noteId)
      );

      alert("Note deleted successfully!");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to delete note."
      );
    }
  };

  return (
    <div>
      <h1>My Uploaded Notes</h1>

      {message && <p>{message}</p>}

      {!message && notes.length === 0 && (
        <p>You haven't uploaded any notes yet.</p>
      )}

      {notes.map((note) => (
        <div key={note._id}>
          <h3>{note.title}</h3>
          <p>Subject: {note.subject}</p>
          <p>Semester: {note.semester}</p>

          <a
            href={`http://localhost:5000${note.fileURL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View PDF
          </a>

          {" "}

          <button onClick={() => handleDelete(note._id)}>
            Delete Note
          </button>
        </div>
      ))}
    </div>
  );
}

export default MyNotes;

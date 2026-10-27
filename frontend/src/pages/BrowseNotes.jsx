import {useEffect, useState} from 'react'
import axios from 'axios'
import "./BrowseNotes.css";

function BrowseNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/notes",
          {
            params: {
              search: search,
              semester: semester
            }
          }
        );

        setNotes(response.data.notes);

      } catch(error) {
        console.error("Erro fetching notes: ", error)
        setError("Failed to load notes. please try again")
      } finally {
        setLoading(false)
      }
    }

    fetchNotes();
  }, [search, semester])

  if(loading) {
    return <p>Loading notes...</p>
  } 
  if(error) {
    return <p>{error}</p>
  }

  return (
    <div className='browse-notes'>
      <h1>Browse Study Notes</h1>

      <div className="notes-filters">
        <input
          type="text"
          placeholder="Search by title or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="">All Semesters</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="5">Semester 5</option>
          <option value="6">Semester 6</option>
          <option value="7">Semester 7</option>
          <option value="8">Semester 8</option>
        </select>
      </div>


      {notes.length === 0 ? (<p>No notes available yet.</p>) : (
        <div className='notes-grid'>
          {notes.map((note) => (
            
            <div className='note-card' key={note._id}>
              <h3>{note.title}</h3>

              <p>Subject: {note.subject}</p>
              <p>Semester: {note.semester}</p>

              <p>Description: {note.description || "No description"}</p>

              <p>Uploaded by: {note.uploadedBy?.name || "Unknown"}</p>

              <p>Uploaded on:{" "} {new Date(note.createdAt).toLocaleDateString()}</p>

              <a className='view-pdf'
                href={`http://localhost:5000${note.fileURL}`}
                target="_blank"
                rel="noopener noreferrer"
              >View PDF</a>


              <a
                className="view-pdf"
                href={`http://localhost:5000/api/notes/${note._id}/download`}
              >Download PDF</a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BrowseNotes;
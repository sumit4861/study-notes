
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadNote() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    semester: "",
    description: ""
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a PDF file.");
      return;
    }

    if (file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")) {
      setMessage("Only PDF files are allowed.");
      return;
    }

    const data = new FormData();

    data.append("title", formData.title);
    data.append("subject", formData.subject);
    data.append("semester", formData.semester);
    data.append("description", formData.description);
    data.append("file", file);

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/notes",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);

      setFormData({
        title: "",
        subject: "",
        semester: "",
        description: ""
      });

      setFile(null);
      e.target.reset();

      setTimeout(() => {
        navigate("/browse-notes");
      }, 1000);

    } catch (error) {
      console.log("Upload error: ", error)
      setMessage(
        error.response?.data?.message ||
        error.message || 
        "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Study Notes</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Note title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="number"
          name="semester"
          placeholder="Semester"
          min="1"
          value={formData.semester}
          onChange={handleChange}
          required
        />
        <br /><br />

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => setFile(e.target.files[0] || null)}
          required
        />
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Note"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadNote;

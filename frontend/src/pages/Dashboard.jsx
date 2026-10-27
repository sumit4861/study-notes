
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalNotes: 0,
    myNotes: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/notes/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => setStats(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Study Notes Dashboard</h1>
      <h2>Total Notes: {stats.totalNotes}</h2>
      <h2>My Uploaded Notes: {stats.myNotes}</h2>

      <button onClick={() => navigate("/upload-note")}>
        Upload Notes
      </button>

      <button onClick={() => navigate("/browse-notes")}>
        Browse Notes
      </button>

      <button onClick={() => navigate("/my-notes")}>
        My Notes
      </button>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;

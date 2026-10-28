import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import {
  BookOpen,
  UploadCloud,
  FolderOpen,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Layers,
  FileCheck2,
  TrendingUp
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalNotes: 0,
    myNotes: 0
  });
  const [loading, setLoading] = useState(true);

  // Read stored user
  const storedUser = localStorage.getItem("user");
  let user = null;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/notes/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="page-container">
      {/* Hero Welcome Banner */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-text">
          <div className="dashboard-hero-badges">
            <span className="hero-pill">
              <Sparkles size={14} />
              <span>Student Workspace</span>
            </span>
            {user?.semester && (
              <span className="hero-pill">
                <GraduationCap size={14} />
                <span>Semester {user.semester}</span>
              </span>
            )}
          </div>

          <h1>
            {getGreeting()}, {user?.name ? user.name.split(" ")[0] : "Student"}! 👋
          </h1>
          <p>
            Welcome to your academic study dashboard. Explore notes from peers or share your lecture summaries with the community.
          </p>
        </div>

        <div className="dashboard-hero-action">
          <button
            className="btn"
            onClick={() => navigate("/upload-note")}
          >
            <UploadCloud size={18} />
            <span>Upload Notes</span>
          </button>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">
            <BookOpen size={26} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Notes Available</div>
            <div className="stat-value">
              {loading ? "-" : stats.totalNotes}
            </div>
            <div className="stat-subtext">
              Active study materials shared by peers
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">
            <FileCheck2 size={26} />
          </div>
          <div className="stat-content">
            <div className="stat-label">My Uploaded Notes</div>
            <div className="stat-value">
              {loading ? "-" : stats.myNotes}
            </div>
            <div className="stat-subtext">
              Your contribution to the shared library
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-violet">
            <Layers size={26} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Supported Semesters</div>
            <div className="stat-value">8</div>
            <div className="stat-subtext">
              Complete engineering & degree modules
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section>
        <div className="section-title">
          <h2>Quick Actions</h2>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            What would you like to do?
          </span>
        </div>

        <div className="quick-actions-grid">
          <Link to="/browse-notes" className="quick-action-card">
            <div>
              <div className="action-top">
                <div
                  className="action-icon-box"
                  style={{ background: "var(--primary-light)", color: "var(--primary)" }}
                >
                  <BookOpen size={24} />
                </div>
                <ArrowRight className="action-arrow" size={20} />
              </div>
              <div className="action-title">Browse Notes</div>
              <div className="action-desc">
                Search, filter by semester, preview PDFs, and download university course materials.
              </div>
            </div>
          </Link>

          <Link to="/upload-note" className="quick-action-card">
            <div>
              <div className="action-top">
                <div
                  className="action-icon-box"
                  style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                >
                  <UploadCloud size={24} />
                </div>
                <ArrowRight className="action-arrow" size={20} />
              </div>
              <div className="action-title">Upload New Note</div>
              <div className="action-desc">
                Share your lecture summaries, cheat sheets, or previous exam solutions with peers.
              </div>
            </div>
          </Link>

          <Link to="/my-notes" className="quick-action-card">
            <div>
              <div className="action-top">
                <div
                  className="action-icon-box"
                  style={{ background: "var(--violet-light)", color: "var(--violet)" }}
                >
                  <FolderOpen size={24} />
                </div>
                <ArrowRight className="action-arrow" size={20} />
              </div>
              <div className="action-title">Manage My Notes</div>
              <div className="action-desc">
                View your upload statistics, review documents, download, or delete previous uploads.
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Tip / Retention Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
          border: "1px solid var(--primary-border)",
          borderRadius: "var(--radius-lg)",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginTop: "16px"
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "var(--primary)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <TrendingUp size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--primary-dark)", marginBottom: "2px" }}>
            Study Tip of the Day
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Reviewing your peer notes within 24 hours of a lecture increases long-term retention by up to 60%. Keep learning!
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;

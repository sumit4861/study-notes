import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  Search,
  UploadCloud,
  FolderOpen,
  LogOut,
  Menu,
  X,
  User as UserIcon
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Retrieve user data from localStorage if available
  const storedUser = localStorage.getItem("user");
  let user = null;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMobileMenuOpen(false);
    navigate("/login");
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
    <header className="main-navbar">
      <div className="navbar-container">
        {/* Brand */}
        <NavLink
          to="/dashboard"
          className="navbar-brand"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="brand-icon-wrapper">
            <GraduationCap size={24} strokeWidth={2.2} />
          </div>
          <div className="brand-text">
            <span className="brand-title">EduNotes</span>
            <span className="brand-subtitle">Knowledge Hub</span>
          </div>
        </NavLink>

        {/* Desktop Links */}
        <nav className="navbar-links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/browse-notes"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <Search size={18} />
            <span>Browse Notes</span>
          </NavLink>

          <NavLink
            to="/upload-note"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <UploadCloud size={18} />
            <span>Upload Notes</span>
          </NavLink>

          <NavLink
            to="/my-notes"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <FolderOpen size={18} />
            <span>My Notes</span>
          </NavLink>
        </nav>

        {/* Desktop User Info & Logout */}
        <div className="navbar-actions">
          {user && (
            <div className="user-badge" title={user.email}>
              <div className="user-avatar">{getInitials(user.name)}</div>
              <div className="user-badge-info">
                <span className="user-badge-name">{user.name}</span>
                {user.semester && (
                  <span className="user-badge-sub">Sem {user.semester}</span>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            className="btn-logout"
            onClick={handleLogout}
            title="Sign out of your account"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {user && (
            <div className="mobile-user-profile">
              <div className="user-avatar">{getInitials(user.name)}</div>
              <div className="user-badge-info">
                <span className="user-badge-name">{user.name}</span>
                <span className="user-badge-sub">
                  {user.email} • Sem {user.semester || "-"}
                </span>
              </div>
            </div>
          )}

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/browse-notes"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            <Search size={18} />
            <span>Browse Notes</span>
          </NavLink>

          <NavLink
            to="/upload-note"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            <UploadCloud size={18} />
            <span>Upload Notes</span>
          </NavLink>

          <NavLink
            to="/my-notes"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            <FolderOpen size={18} />
            <span>My Notes</span>
          </NavLink>

          <button
            type="button"
            className="btn btn-danger btn-logout"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    semester: ""
  });

  const [showPassword, setShowPassword] = useState(false);
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
    setMessage("");

    try {
      setLoading(true);

      await api.post("/api/auth/register", formData);

      // On successful registration, redirect to login with query or directly
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(
        error.response?.data?.message ||
        "Registration failed. Please verify your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Hero Side */}
        <div className="auth-hero-side">
          <div className="auth-hero-brand">
            <div className="auth-hero-logo">
              <GraduationCap size={24} />
            </div>
            <span className="auth-hero-brand-name">EduNotes</span>
          </div>

          <div className="auth-hero-content">
            <span className="auth-hero-tagline">Join Student Network</span>
            <h1 className="auth-hero-title">
              Start sharing and discovering study notes.
            </h1>
            <p className="auth-hero-desc">
              Create your account in seconds to download high-yield semester notes and contribute your own lecture summaries.
            </p>

            <div className="auth-features-list">
              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <CheckCircle2 size={16} />
                </div>
                <span>Organized by semester for rapid syllabus matching</span>
              </div>
              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <CheckCircle2 size={16} />
                </div>
                <span>Safe PDF storage with high-speed direct downloads</span>
              </div>
              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <CheckCircle2 size={16} />
                </div>
                <span>Join thousands of motivated college peers</span>
              </div>
            </div>
          </div>

          <div className="auth-hero-footer">
            <p>© {new Date().getFullYear()} EduNotes Community</p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side">
          <div className="auth-form-header">
            <h2>Create Account</h2>
            <p>Join the academic community today</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-input input-with-icon"
                  placeholder="Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-input input-with-icon"
                  placeholder="alex@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input input-with-icon input-with-action"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="input-action-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="semester">Current Semester</label>
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
                  <option value="">Select your semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                    <option key={number} value={number}>
                      Semester {number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {message && (
              <div className="alert alert-danger" role="alert">
                <AlertCircle className="alert-icon" size={18} />
                <span>{message}</span>
              </div>
            )}

            <button
              className="btn btn-primary auth-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

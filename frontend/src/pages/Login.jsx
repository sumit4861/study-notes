import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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

      const response = await api.post("/api/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setMessage(
        error.response?.data?.message ||
        "Invalid email or password. Please try again."
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
            <span className="auth-hero-tagline">Academic Knowledge Hub</span>
            <h1 className="auth-hero-title">
              Collaborative learning made seamless.
            </h1>
            <p className="auth-hero-desc">
              Access thousands of peer-reviewed notes, exam guides, and university resources shared by fellow students.
            </p>

            <div className="auth-features-list">
              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <CheckCircle2 size={16} />
                </div>
                <span>Free unlimited access to verified study materials</span>
              </div>
              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <CheckCircle2 size={16} />
                </div>
                <span>Filter notes by semester and core subject modules</span>
              </div>
              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <CheckCircle2 size={16} />
                </div>
                <span>Instant PDF previews and high-speed downloads</span>
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
            <h2>Welcome back</h2>
            <p>Enter your student credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-input input-with-icon"
                  placeholder="student@university.edu"
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
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

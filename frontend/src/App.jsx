import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BrowseNotes from "./pages/BrowseNotes";
import UploadNote from "./pages/UploadNote";
import MyNotes from "./pages/MyNotes";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function ProtectedLayout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} EduNotes Sharing System — Empowering Students Everywhere</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/browse-notes"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <BrowseNotes />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-note"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <UploadNote />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-notes"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <MyNotes />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

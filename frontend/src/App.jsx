import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from './components/ProtectedRoute'
import BrowseNotes from './pages/BrowseNotes'
import UploadNote from './pages/UploadNote'
import MyNotes from "./pages/MyNotes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" 
          element={<ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/browse-notes" 
          element={<ProtectedRoute>
                    <BrowseNotes />
                  </ProtectedRoute>} />
        <Route path="/upload-note"
          element={
            <ProtectedRoute>
              <UploadNote />
            </ProtectedRoute> }/>
          
        <Route
          path="/my-notes"
          element={
            <ProtectedRoute>
              <MyNotes />
            </ProtectedRoute>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
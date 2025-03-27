
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Favorites from "./pages/Favorites";
import EditSong from "./pages/EditSong";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGate from "./components/AuthGate";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthGate>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/edit/:id" element={<EditSong />} />
          </Routes>
        </AuthGate>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SolarSystemPage from "./components/solar-system-3d/SolarSystemPage";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solar-system" element={<SolarSystemPage />} />
      </Routes>
    </Router>
  );
}

export default App;

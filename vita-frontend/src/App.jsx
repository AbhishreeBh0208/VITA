import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import MiniGames from "./pages/MiniGames";
import QrScanner from "./pages/QrScanner";

// Import individual game pages
import CatchPill from "./pages/games/CatchPill";
import MemoryMatch from "./pages/games/MemoryMatch";
import ReactionClick from "./pages/games/ReactionClick";

export default function App() {
  return (
    <div className="parent">
      <nav className="topbar">
        <div className="main-logo">
          <p className="main-logo-text">VITA</p>
          <p className="main-logo-cap">Healing is better with a friend</p>
        </div>

        <div className="nav_links">
          <Link to="/" className="nav_link">Home</Link>
          <Link to="/minigames" className="nav_link">Mini Games</Link>
          <Link to="/QrScanner" className="nav_link">Scan Meds</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/minigames" element={<MiniGames />} />
        <Route path="/QrScanner" element={<QrScanner />} />
        <Route path="/minigames/catch-pill" element={<CatchPill />} />
        <Route path="/minigames/memory-match" element={<MemoryMatch />} />
        <Route path="/minigames/reaction-click" element={<ReactionClick />} />
      </Routes>
    </div>
  );
}

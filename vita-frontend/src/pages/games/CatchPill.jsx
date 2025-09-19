import React, { useState, useEffect } from "react";
import "./CatchPill.css";

export default function CatchPill() {
  const [basketX, setBasketX] = useState(50);
  const [pillY, setPillY] = useState(0);
  const [pillX, setPillX] = useState(Math.random() * 90);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") setBasketX((prev) => Math.max(0, prev - 5));
      if (e.key === "ArrowRight") setBasketX((prev) => Math.min(90, prev + 5));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPillY((prev) => {
        if (prev >= 90) {
          if (Math.abs(pillX - basketX) < 10) setScore((s) => s + 1);
          setPillX(Math.random() * 90);
          return 0;
        }
        return prev + 5;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [pillX, basketX]);

  return (
    <div className="game">
      <h1>💊 Catch the Pill</h1>
      <p>Score: {score}</p>
      <div className="game-area">
        <div className="pill" style={{ top: `${pillY}%`, left: `${pillX}%` }}>💊</div>
        <div className="basket" style={{ left: `${basketX}%` }}>🧺</div>
      </div>
      <p>Use ◀️ ▶️ arrow keys!</p>
    </div>
  );
}

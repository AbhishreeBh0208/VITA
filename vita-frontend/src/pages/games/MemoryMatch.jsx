import React, { useState } from "react";
import "./MemoryMatch.css";

const cardsArray = ["💊","🐾","⚡","🧠","💊","🐾","⚡","🧠"];

export default function MemoryMatch() {
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);

  function handleFlip(index) {
    if (flipped.length === 2 || flipped.includes(index)) return;
    setFlipped([...flipped, index]);

    if (flipped.length === 1) {
      const first = cardsArray[flipped[0]];
      const second = cardsArray[index];
      if (first === second) {
        setMatched([...matched, flipped[0], index]);
        setScore(score + 1);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  }

  return (
    <div className="game">
      <h1>🧠 Memory Match</h1>
      <p>Score: {score}</p>
      <div className="grid">
        {cardsArray.map((card, i) => (
          <div
            key={i}
            className={`card ${flipped.includes(i) || matched.includes(i) ? "flipped" : ""}`}
            onClick={() => handleFlip(i)}
          >
            {flipped.includes(i) || matched.includes(i) ? card : "❓"}
          </div>
        ))}
      </div>
    </div>
  );
}

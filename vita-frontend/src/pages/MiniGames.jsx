import React from "react";
import { Link } from "react-router-dom";
import "./MiniGames.css";

export default function MiniGames() {
  const games = [
    {
      id: "catch-pill",
      title: "Catch the Pill 💊",
      description: "Move the basket to catch falling pills. Improve your reaction speed!",
      link: "/minigames/catch-pill",
    },
    {
      id: "memory-match",
      title: "Memory Match 🧠",
      description: "Flip cards and match pairs before time runs out!",
      link: "/minigames/memory-match",
    },
    {
      id: "reaction-click",
      title: "Reaction Click ⚡",
      description: "Tap as fast as you can when the screen turns green!",
      link: "/minigames/reaction-click",
    },
  ];

  return (
    <div className="minigames">
      <h1>Mini Games</h1>
      <p className="subtitle">Play fun games to keep your pet happy!</p>

      <div className="game-cards">
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <p className="game-title">{game.title}</p>
            <p className="game-des">{game.description}</p>
            <Link to={game.link} className="play-btn">Play</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

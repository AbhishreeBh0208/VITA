import React from "react";

const allBadges = [
  { id: 1, name: "First Dose", unlocked: true },
  { id: 2, name: "7 Day Streak", unlocked: false },
  { id: 3, name: "30 Day Warrior", unlocked: false },
];

export default function Achievements() {
  return (
    <div className="achievements">
      <h2 className="panel-title">🏆 Achievements</h2>
      <div className="badges-grid">
        {allBadges.map((badge) => (
          <div
            key={badge.id}
            className={`badge ${badge.unlocked ? "unlocked" : "locked"}`}
          >
            {badge.unlocked ? "🌟" : "🔒"} {badge.name}
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from "react";

export default function HabitTracker({ onHabitChange }) {
  const [habits, setHabits] = useState({
    water: false,
    exercise: false,
    sleep: false,
  });

  function toggleHabit(habit) {
    const next = { ...habits, [habit]: !habits[habit] };
    setHabits(next);
    if (typeof onHabitChange === "function") onHabitChange(next);
  }

  return (
    <div className="habit-tracker">
      <h3>Daily Habits</h3>
      <div className="habit-list">
        {Object.keys(habits).map((h) => (
          <button
            key={h}
            className={`habit-btn ${habits[h] ? "done" : ""}`}
            onClick={() => toggleHabit(h)}
          >
            {habits[h] ? "✅" : "⬜"} {h.charAt(0).toUpperCase() + h.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

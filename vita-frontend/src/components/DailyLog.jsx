import React from "react";

export default function DailyLog({ log }) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });

  return (
    <div className="daily-log">
      <h2 className="panel-title">📅 Dose Log</h2>
      <div className="log-grid">
        {days.map((day, idx) => (
          <div key={idx} className="log-day">
            <span className="day-label">{day}</span>
            <span className={`log-mark ${log[idx] ? "taken" : "missed"}`}>
              {log[idx] ? "✅" : "❌"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

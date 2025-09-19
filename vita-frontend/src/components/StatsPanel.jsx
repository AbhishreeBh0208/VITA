import React from "react";

export default function StatsPanel({ streak, stage, nextEvolution }) {
  return (
    <div className="stats-panel">
      <h2 className="panel-title">Pet Stats</h2>
      <div className="stats-item">
        <span className="label">Current Stage:</span>
        <span className="value">{stage}</span>
      </div>
      <div className="stats-item">
        <span className="label">Streak:</span>
        <span className="value">{streak} days</span>
      </div>
      <div className="stats-item">
        <span className="label">Next Evolution:</span>
        <span className="value">{nextEvolution} days</span>
      </div>
    </div>
  );
}

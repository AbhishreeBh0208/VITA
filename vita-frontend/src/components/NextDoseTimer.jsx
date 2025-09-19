import React, { useState, useEffect } from "react";

export default function NextDoseTimer({ disease, nextDoseAt }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [customHours, setCustomHours] = useState(6); // default = 6h
  const [targetTime, setTargetTime] = useState(null);

  // Function to start/reset timer
  const startTimer = (hours) => {
    const now = Date.now();
    setTargetTime(now + hours * 60 * 60 * 1000);
  };

  // Sync with backend-provided nextDoseAt
  useEffect(() => {
    if (nextDoseAt) {
      setTargetTime(new Date(nextDoseAt).getTime());
    } else {
      startTimer(customHours);
    }
  }, [nextDoseAt]);

  useEffect(() => {
    if (!targetTime) return;

    const interval = setInterval(() => {
      const diff = targetTime - Date.now();

      if (diff <= 0) {
        setTimeLeft(`Time to take your ${disease} pill!`);
        clearInterval(interval);
      } else {
        const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
        const minutes = String(
          Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        ).padStart(2, "0");
        const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(
          2,
          "0"
        );
        setTimeLeft(`Next pill in ${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, disease]);

  return (
    <div className="dose-timer-container">
      <p className="dose-timer">{timeLeft}</p>

      <div className="timer-settings" style={{ marginTop: "10px" }}>
        <label>
          Custom hours:{" "}
          <input
            className="timer"
            type="number"
            value={customHours}
            min="1"
            max="24"
            onChange={(e) => setCustomHours(Number(e.target.value))}
            style={{ width: "50px", marginLeft: "5px" }}
          />
        </label>
        <button
          className="timer-btn"
          onClick={() => startTimer(customHours)}
          style={{ marginLeft: "10px", padding: "4px 10px" }}
        >
          Set Timer
        </button>
      </div>
    </div>
  );
}

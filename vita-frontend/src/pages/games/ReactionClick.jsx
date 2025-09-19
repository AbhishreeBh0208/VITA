import React, { useState, useEffect } from "react";
import "./ReactionClick.css";

export default function ReactionClick() {
  const [status, setStatus] = useState("waiting"); // waiting | ready | go
  const [message, setMessage] = useState("Click to start!");
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);

  function startGame() {
    setStatus("ready");
    setMessage("Wait for green...");
    const timeout = Math.random() * 3000 + 2000;
    setTimeout(() => {
      setStatus("go");
      setMessage("CLICK NOW!");
      setStartTime(Date.now());
    }, timeout);
  }

  function handleClick() {
    if (status === "go") {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setMessage(`⚡ Your reaction: ${time}ms`);
      setStatus("waiting");
    } else if (status === "ready") {
      setMessage("Too soon! ❌");
      setStatus("waiting");
    } else {
      startGame();
    }
  }

  return (
    <div
      className={`reaction-area ${status}`}
      onClick={handleClick}
    >
      <h1>⚡ Reaction Test</h1>
      <p>{message}</p>
      {reactionTime && <p>Last: {reactionTime}ms</p>}
    </div>
  );
}

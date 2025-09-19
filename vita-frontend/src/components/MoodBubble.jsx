import React, { useEffect, useState } from "react";
import "./MoodBubble.css";

export default function MoodBubble({ mood }) {
  const [displayedText, setDisplayedText] = useState("");
  const messages = {
    happy: "Yay! Thanks for taking your dose 💊",
    sad: "Oh no... I feel weak 😢",
    neutral: "I’m waiting for my next dose 🕒",
  };

  // Typing effect
useEffect(() => {
  setDisplayedText(""); 
  const message = messages[mood];
  let i = 0;

  const interval = setInterval(() => {
    i++;
    if (i <= message.length) {
      setDisplayedText(message.substring(0, i));
    } else {
      clearInterval(interval);
    }
  }, 50);

  return () => clearInterval(interval);
}, [mood]);

  return (
    <div className="mood-bubble">
      <p>{displayedText}</p>
    </div>
  );
}


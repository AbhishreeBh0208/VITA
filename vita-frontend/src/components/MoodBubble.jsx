import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./MoodBubble.css";

export default function MoodBubble({ mood }) {
  const { t } = useTranslation();
  const [displayedText, setDisplayedText] = useState("");

  // Typing effect with translations
  useEffect(() => {
    setDisplayedText(""); 
    const message = t(`mood.${mood}`);
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
  }, [mood, t]);

  return (
    <div className="mood-bubble">
      <p>{displayedText}</p>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import StatsPanel from "../components/StatsPanel";
import Achievements from "../components/Achievements";
import MoodBubble from "../components/MoodBubble";
import DailyLog from "../components/DailyLog";
import Footer from "../components/Footer";
import HabitTracker from "../components/HabitTracker";
import NextDoseTimer from "../components/NextDoseTimer";

export default function Home() {
  const [activeTab, setActiveTab] = useState("diabetes");

  // Pets state
  const [pets, setPets] = useState({
    diabetes: { streak: 0, mood: "neutral", stage: 1 },
    hypertension: { streak: 0, mood: "neutral", stage: 1 },
    asthma: { streak: 0, mood: "neutral", stage: 1 },
  });

  // Habits state
  const [habits, setHabits] = useState({
    water: false,
    exercise: false,
    sleep: false,
    games: false,
  });

  const thresholds = { 1: 0, 2: 5, 3: 15 };
  const userId = "demoUser";

  const petNames = {
    diabetes: "Glucobud",
    hypertension: "PulsePup",
    asthma: "Inhalo",
  };

  function PetRenderer({ stage, mood }) {
    const petSvgs = {
      1: {
        happy: "/images/pet1_happy.svg",
        sad: "/images/pet1_sad.svg",
        neutral: "/images/pet1_neutral.svg",
      },
      2: {
        happy: "/images/pet2_happy.svg",
        sad: "/images/pet2_sad.svg",
        neutral: "/images/pet2_neutral.svg",
      },
      3: {
        happy: "/images/pet3_happy.svg",
        sad: "/images/pet3_sad.svg",
        neutral: "/images/pet3_neutral.svg",
      },
    };

    const petImage = petSvgs[stage]?.[mood] || petSvgs[stage]?.neutral;

    return (
      <motion.img
        src={petImage}
        alt="pet"
        className="pet"
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ width: "220px", height: "220px" }}
      />
    );
  }

  // Fetch initial state
  useEffect(() => {
    const diseases = ["diabetes", "hypertension", "asthma"];
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
    diseases.forEach(async (diseaseId) => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/state?userId=${userId}&disease=${diseaseId}`
        );

        setPets((prev) => ({
          ...prev,
          [diseaseId]: {
            ...prev[diseaseId],
            streak: typeof res.data.streak === "number" ? res.data.streak : prev[diseaseId].streak,
            stage: typeof res.data.stage === "number" ? res.data.stage : prev[diseaseId].stage,
            mood: res.data.mood || prev[diseaseId].mood || "neutral",
          },
        }));
      } catch (err) {
        console.error(`❌ Error fetching state for ${diseaseId}:`, err);
      }
    });
  }, [userId]);

  const currentPet = pets[activeTab] ?? { streak: 0, stage: 1, mood: "neutral" };
  const { streak, stage, mood } = currentPet;

  // Progress bar calc
  const currentThreshold =
    stage === 1 ? thresholds[2] : stage === 2 ? thresholds[3] : thresholds[3];
  const stageBase = thresholds[stage];
  const progress = Math.max(
    0,
    Math.min(1, (streak - stageBase) / (currentThreshold - stageBase || 1))
  );

  // Mood helper
  function setMoodTemporary(diseaseId, newMood, ms = 2000) {
    setPets((prev) => ({
      ...prev,
      [diseaseId]: { ...prev[diseaseId], mood: newMood },
    }));
    setTimeout(() => {
      setPets((prev) => ({
        ...prev,
        [diseaseId]: { ...prev[diseaseId], mood: "neutral" },
      }));
    }, ms);
  }

  // Dose functions
  async function takeDose(diseaseId) {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const res = await axios.post(`${API_BASE}/api/take`, {
        userId,
        disease: diseaseId,
      });

      setPets((prev) => ({
        ...prev,
        [diseaseId]: {
          ...prev[diseaseId],
          streak: res.data.streak ?? prev[diseaseId].streak,
          stage: res.data.stage ?? prev[diseaseId].stage,
          mood: "happy",
        },
      }));

      setTimeout(() => setMoodTemporary(diseaseId, "neutral", 0), 2500);
    } catch (err) {
      console.error("❌ Error taking dose:", err);
    }
  }

  async function missDose(diseaseId) {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const res = await axios.post(`${API_BASE}/api/miss`, {
        userId,
        disease: diseaseId,
      });

      setPets((prev) => ({
        ...prev,
        [diseaseId]: {
          ...prev[diseaseId],
          streak: res.data.streak ?? 0,
          stage: res.data.stage ?? 1,
          mood: "sad",
        },
      }));
    } catch (err) {
      console.error("❌ Error missing dose:", err);
    }

    setTimeout(() => setMoodTemporary(diseaseId, "neutral", 0), 2500);
  }

  // Happiness score
function calculateHappiness(streakVal, stageVal, habitsObj) {
  let score = 0;
  score += Math.min(60, streakVal * 4); // streak effect
  score += (stageVal - 1) * 10; // stage effect
  if (habitsObj.water) score += 6;
  if (habitsObj.exercise) score += 7;
  if (habitsObj.sleep) score += 7;
  if (habitsObj.games) score += 10; // 🎮 games boost
  return Math.max(0, Math.min(100, Math.round(score)));
}

  const happiness = calculateHappiness(streak, stage, habits);

  return (
    <div className="home">
      {/* Tabs */}
      <div className="tabs">
        {["diabetes", "hypertension", "asthma"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Pet Card */}
      <section className="pet-card">
        <div className="pet-container">
          <PetRenderer stage={stage} mood={mood} />
          <MoodBubble mood={mood} />
          <h1 className="pet-name">{petNames[activeTab]}</h1>
        </div>

        <div className="stats">
          <StatsPanel streak={streak} stage={stage} nextEvolution={currentThreshold} />
          <Achievements />
          <NextDoseTimer
            nextDoseAt={
              Date.now() +
              (activeTab === "diabetes" ? 4 : activeTab === "hypertension" ? 6 : 8) *
                60 *
                60 *
                1000
            }
          />
        </div>
      </section>

      {/* Controls */}
      <section className="controls">
        {/* Progress bar */}
        <div className="progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ transform: `scaleX(${progress})` }} />
          </div>
          <div className="progress-meta">
            <span>Stage {stage}</span>
            <span>{streak} day streak</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="buttons">
          <button className="btn take" onClick={() => takeDose(activeTab)}>
            Take Dose
          </button>
          <button className="btn miss" onClick={() => missDose(activeTab)}>
            Miss Dose
          </button>
        </div>

        <div className="happiness-and-habits">
          <div className="happiness">
            <h3>Pet Happiness: {happiness}%</h3>
            <div className="happiness-bar">
              <div className="happiness-fill" style={{ width: `${happiness}%` }} />
            </div>
          </div>

          <HabitTracker onHabitChange={(updated) => setHabits(updated)} />

        <div style={{ marginTop: "15px" }}>
          <button
          className="btn-game"
          onClick={() =>
            setHabits((prev) => ({ ...prev, games: !prev.games }))
            }
          >
          {habits.games ? "✔ Played Game Today" : "Play with Pet"}
          </button>
        </div>
      </div>

        {/* Daily log */}
        <DailyLog log={[true, true, false, true, true, true, false]} />
      </section>

      <Footer />
    </div>
  );
}



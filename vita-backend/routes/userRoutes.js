const express = require("express");
const User = require("../models/user"); 
const router = express.Router();

// helper: create or fetch disease progress
async function findOrCreateProgress(user, disease) {
  let progress = user.progresses.find((p) => p.disease === disease);

  if (!progress) {
    progress = {
      disease,
      streak: 0,
      stage: 1,
      lastUpdate: new Date(),
      nextDoseAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // default 8h later
    };
    user.progresses.push(progress);
  }

  // 🛠️ if nextDoseAt missing, fix it
  if (!progress.nextDoseAt) {
    progress.nextDoseAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
  }

  return progress;
}

// ✅ GET state (returns streak, stage, and nextDoseAt)
router.get("/state", async (req, res) => {
  try {
    const { userId, disease } = req.query;

    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({
        userId,
        progresses: [],
      });
    }

    const progress = await findOrCreateProgress(user, disease);
    await user.save();

    res.json({
      disease: progress.disease,
      streak: progress.streak,
      stage: progress.stage,
      lastUpdate: progress.lastUpdate,
      nextDoseAt: progress.nextDoseAt,
    });
  } catch (err) {
    console.error("❌ Error in /api/state:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST take dose
router.post("/take", async (req, res) => {
  try {
    const { userId, disease } = req.body;

    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ userId, progresses: [] });
    }

    const progress = await findOrCreateProgress(user, disease);

    // update streak
    progress.streak += 1;

    // update stage
    if (progress.streak >= 15) progress.stage = 3;
    else if (progress.streak >= 5) progress.stage = 2;

    progress.lastUpdate = new Date();
    progress.nextDoseAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // reset timer

    await user.save();

    res.json(progress);
  } catch (err) {
    console.error("❌ Error in /api/take:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST miss dose
router.post("/miss", async (req, res) => {
  try {
    const { userId, disease } = req.body;

    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ userId, progresses: [] });
    }

    const progress = await findOrCreateProgress(user, disease);

    // reset streak and stage
    progress.streak = 0;
    progress.stage = 1;
    progress.lastUpdate = new Date();
    progress.nextDoseAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

    await user.save();

    res.json(progress);
  } catch (err) {
    console.error("❌ Error in /api/miss:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

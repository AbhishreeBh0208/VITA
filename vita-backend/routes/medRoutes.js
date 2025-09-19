const express = require("express");
const User = require("../models/user");
const router = express.Router();

// Log medicine from QR
router.post("/logMed", async (req, res) => {
  const { userId, disease, medicine } = req.body;

  try {
    let user = await User.findOne({ userId });
    if (!user) user = new User({ userId, progresses: [] });

    let progress = user.progresses.find((p) => p.disease === disease);
    if (!progress) {
      progress = { disease, streak: 0, stage: 1, lastUpdate: new Date(), meds: [] };
      user.progresses.push(progress);
    }

    if (!progress.meds) progress.meds = [];
    progress.meds.push({ medicine, time: new Date() });

    await user.save();
    res.json({ success: true, progress });
  } catch (err) {
    console.error("❌ Error logging medicine:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

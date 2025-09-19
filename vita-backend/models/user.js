const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  disease: String,
  streak: { type: Number, default: 0 },
  stage: { type: Number, default: 1 },
  lastUpdate: { type: Date, default: Date.now },
  meds: [
    {
      medicine: String,
      time: { type: Date, default: Date.now },
    },
  ],
});

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  progresses: [progressSchema],
});

module.exports = mongoose.model("User", userSchema);


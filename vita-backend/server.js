const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(cors({ origin: "*" }));
app.use(express.json());

const medRoutes = require("./routes/medRoutes");
app.use("/api", medRoutes);

// Routes
app.use("/api", userRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 VITA backend running on port ${PORT}`));

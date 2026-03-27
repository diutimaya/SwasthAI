require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db"); // db.js is in the same folder as server.js

const app = express();
const PORT = process.env.PORT || 3000;

// ──────────────────────────────
// Connect to MongoDB FIRST
// ──────────────────────────────
connectDB();

// ──────────────────────────────
// Middleware
// ──────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// ──────────────────────────────
// Routes
// ──────────────────────────────
const symptomsRouter     = require("./routes/symptoms");
const appointmentsRouter = require("./routes/appointments");

app.use("/api/symptoms",     symptomsRouter);
app.use("/api/appointments", appointmentsRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "SwasthAI API is running 🚀" });
});

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ──────────────────────────────
// Global Error Handler
// ──────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error." });
});

// ──────────────────────────────
// Start Server
// ──────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📋 Health check:     http://localhost:${PORT}/api/health`);
  console.log(`💊 Symptoms API:     http://localhost:${PORT}/api/symptoms`);
  console.log(`📅 Appointments API: http://localhost:${PORT}/api/appointments\n`);
});

module.exports = app;
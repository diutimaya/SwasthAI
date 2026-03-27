const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(path.join(__dirname, '../../Data/symptoms.json'))
const doctorsData = fs.readFileSync(path.join(__dirname, "../../Data/doctors.json"))

function normalize(str) {
  return str.toLowerCase().trim().replace(/\s+/g, "_");
}

function analyzeSymptoms(userSymptoms) {
  const normalized = userSymptoms.map(normalize);

  const scored = symptomsData.map((entry) => {
    const diseaseSymptoms = entry.symptoms.map(normalize);
    const matched = normalized.filter((us) =>
      diseaseSymptoms.some((ds) => ds.includes(us) || us.includes(ds) || ds === us)
    );
    const matchPercent = matched.length > 0
      ? Math.round((matched.length / diseaseSymptoms.length) * 100)
      : 0;
    return {
      disease: entry.disease,
      specialist: entry.specialist,
      severity: entry.severity,
      matchedSymptoms: matched,
      totalSymptoms: diseaseSymptoms.length,
      score: matched.length,
      matchPercent,
    };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || b.matchPercent - a.matchPercent)
    .slice(0, 3);
}

router.post("/analyze", (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ success: false, message: "Please provide at least one symptom." });
  }

  const results = analyzeSymptoms(symptoms);

  if (results.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No specific match found. Recommending a General Physician.",
      conditions: [],
      recommendedDoctors: doctorsData.filter((d) => d.specialization === "General Physician"),
    });
  }

  const topSpecialist = results[0].specialist;
  let recommendedDoctors = doctorsData.filter((d) => d.specialization === topSpecialist);
  if (recommendedDoctors.length === 0) {
    recommendedDoctors = doctorsData.filter((d) => d.specialization === "General Physician");
  }

  res.status(200).json({
    success: true,
    inputSymptoms: symptoms,
    conditions: results.map((r) => ({
      disease: r.disease,
      specialist: r.specialist,
      severity: r.severity,
      matchedSymptoms: r.matchedSymptoms,
      matchPercent: r.matchPercent,
    })),
    recommendedDoctors,
  });
});

router.get("/list", (req, res) => {
  const all = new Set();
  symptomsData.forEach((entry) => entry.symptoms.forEach((s) => all.add(s)));
  res.status(200).json({ success: true, count: all.size, symptoms: [...all].sort() });
});

router.get("/diseases", (req, res) => {
  res.status(200).json({
    success: true,
    count: symptomsData.length,
    diseases: symptomsData.map((d) => ({ disease: d.disease, specialist: d.specialist, severity: d.severity, symptomCount: d.symptoms.length })),
  });
});

module.exports = router;
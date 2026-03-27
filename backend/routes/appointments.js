const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Appointment = require("../models/Appointment"); // Mongoose model

const doctorsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../Data/doctors.json'), 'utf-8')
);

// ─────────────────────────────────────────────────────────────
// GET /api/appointments
// Fetch all appointments (latest first)
// ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch appointments.", error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/appointments/:id
// Fetch single appointment by appointmentId (e.g. APT-XXXX)
// ─────────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ appointmentId: req.params.id });
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }
    res.status(200).json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching appointment.", error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/appointments/book
// Book a new appointment — saves to MongoDB
// ─────────────────────────────────────────────────────────────
router.post("/book", async (req, res) => {
  const { patientName, patientAge, patientPhone, doctorId, date, slot, condition, symptoms } = req.body;

  // Basic validation
  if (!patientName || !doctorId || !date || !slot) {
    return res.status(400).json({
      success: false,
      message: "Please provide patient name, doctor, date, and time slot.",
    });
  }

  // Find doctor from JSON data
  const doctorData = doctorsData.find((d) => d.id === parseInt(doctorId));
  if (!doctorData) {
    return res.status(404).json({ success: false, message: "Doctor not found." });
  }

  try {
    // Check if this exact slot is already booked in MongoDB
    const slotTaken = await Appointment.findOne({
      doctorId: parseInt(doctorId),
      date,
      slot,
      status: "confirmed",
    });

    if (slotTaken) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked. Please choose another slot.",
      });
    }

    // Create and save appointment to MongoDB
    const appointment = new Appointment({
      patientName,
      patientAge:   patientAge || "",
      patientPhone: patientPhone || "",
      doctorId:     parseInt(doctorId),
      doctorName:   doctorData.name,
      specialization: doctorData.specialization,
      hospital:     doctorData.hospital || doctorData.city || "N/A",
      date,
      slot,
      condition:    condition || "General Consultation",
      symptoms:     symptoms || [],
      fee:          doctorData.fee || 0,
    });

    const saved = await appointment.save(); // persists to MongoDB

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointment: saved.getSummary(),
      fee: `₹${doctorData.fee || 0}`,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to book appointment.", error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/appointments/:id
// Cancel an appointment by appointmentId
// ─────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ appointmentId: req.params.id });
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    appointment.cancel();
    await appointment.save(); // save updated status back to MongoDB

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully.",
      appointmentId: appointment.appointmentId,
      status: appointment.status,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to cancel appointment.", error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/appointments/doctors/all
// ─────────────────────────────────────────────────────────────
router.get("/doctors/all", (req, res) => {
  res.status(200).json({ success: true, doctors: doctorsData });
});

// ─────────────────────────────────────────────────────────────
// GET /api/appointments/doctors/:specialization
// ─────────────────────────────────────────────────────────────
router.get("/doctors/:specialization", (req, res) => {
  const spec = req.params.specialization;
  const doctors = doctorsData.filter(
    (d) => d.specialization.toLowerCase() === spec.toLowerCase()
  );
  res.status(200).json({ success: true, doctors });
});

module.exports = router;
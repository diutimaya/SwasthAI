const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const AppointmentSchema = new mongoose.Schema(
  {
    // Auto-generated friendly ID (e.g. APT-xxxx) shown to user
    appointmentId: {
      type: String,
      default: () => "APT-" + uuidv4().slice(0, 8).toUpperCase(),
      unique: true,
    },

    // Patient details
    patientName:  { type: String, required: true, trim: true },
    patientAge:   { type: String, trim: true },
    patientPhone: { type: String, trim: true },

    // Doctor details (denormalised for fast reads)
    doctorId:       { type: Number, required: true },
    doctorName:     { type: String, required: true },
    specialization: { type: String, required: true },
    hospital:       { type: String },

    // Appointment details
    date:      { type: String, required: true },   // "YYYY-MM-DD"
    slot:      { type: String, required: true },   // "10:00 AM"
    condition: { type: String, default: "General Consultation" },
    symptoms:  { type: [String], default: [] },
    fee:       { type: Number, default: 0 },

    // Status lifecycle
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Instance method — mirrors the OOP model from before
AppointmentSchema.methods.getSummary = function () {
  return {
    id:             this.appointmentId,
    patient:        this.patientName,
    doctor:         this.doctorName,
    specialization: this.specialization,
    hospital:       this.hospital,
    date:           this.date,
    slot:           this.slot,
    condition:      this.condition,
    status:         this.status,
    fee:            this.fee,
  };
};

AppointmentSchema.methods.cancel = function () {
  this.status = "cancelled";
  return { message: "Appointment cancelled successfully.", appointmentId: this.appointmentId };
};

module.exports = mongoose.model("Appointment", AppointmentSchema);
// Doctor Model - OOPs concept demonstrated
class Doctor {
  constructor({ id, name, specialization, experience, rating, hospital, availability, slots, fee, image }) {
    this.id = id;
    this.name = name;
    this.specialization = specialization;
    this.experience = experience;
    this.rating = rating;
    this.hospital = hospital;
    this.availability = availability;
    this.slots = slots;
    this.fee = fee;
    this.image = image;
  }

  // Check if doctor is available on a given day
  isAvailableOn(day) {
    return this.availability.includes(day);
  }

  // Get available slots for a given day
  getAvailableSlots(day) {
    if (!this.isAvailableOn(day)) return [];
    return this.slots;
  }

  // Get display info
  getDisplayInfo() {
    return {
      id: this.id,
      name: this.name,
      specialization: this.specialization,
      experience: `${this.experience} years`,
      rating: this.rating,
      hospital: this.hospital,
      fee: `₹${this.fee}`,
      availability: this.availability.join(", ")
    };
  }
}

module.exports = Doctor;
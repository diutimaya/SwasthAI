# SwasthAI — Symptom Checker and Doctor Recommendation System

SwasthAI is a full-stack healthcare web application that analyzes user symptoms, predicts possible medical conditions, and recommends appropriate doctors with real-time appointment booking functionality.

---

## Live Demo

Frontend and Backend:
https://swasthai-cbiy.onrender.com

---

## Problem Statement

Access to quick and reliable medical guidance remains a challenge, especially in remote areas.
This system bridges the gap between symptom understanding and doctor consultation by providing instant analysis and recommendations.

---

## Features

* Symptom-based disease prediction
* Match percentage and severity indication
* Doctor recommendation based on specialization
* Real-time appointment booking system
* Slot validation to prevent double booking
* Persistent data storage using MongoDB
* Fully deployed full-stack application

---

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Deployment

* Render (Full-stack deployment)

---

## Project Structure

```
├── backend
│   ├── server.js
│   ├── db.js
│   ├── routes
│   │   ├── symptoms.js
│   │   ├── appointments.js
│   ├── models
│   │   ├── Appointment.js
│   │   ├── Doctor.js
│
├── frontend
│   ├── index.html
│
├── Data
│   ├── symptoms.json
│   ├── doctors.json
```

---

## How It Works

1. User enters symptoms
2. Backend analyzes symptoms using a matching algorithm
3. Top diseases are predicted with match percentage
4. Doctors are recommended based on specialization
5. User selects a doctor and books an appointment
6. Appointment data is stored in MongoDB

---

## API Endpoints

### Symptom Analysis

POST /api/symptoms/analyze

### Book Appointment

POST /api/appointments/book

### Get All Appointments

GET /api/appointments

---

## Sample Request

```
{
  "symptoms": ["fever", "headache"]
}
```

---

## Key Learnings

* Developed a full-stack production-ready application
* Designed RESTful APIs for real-world use cases
* Implemented a dynamic recommendation system
* Integrated MongoDB for persistent storage
* Resolved deployment challenges such as API routing and CORS

---

## Future Improvements

* Machine learning-based disease prediction
* Chatbot-based medical assistance
* Prescription scanner using OCR
* Mobile application integration
* Multi-language support

---

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request.

---

## Contact

Diutimaya Mohanty
GitHub: https://github.com/diutimaya
LinkedIn: https://www.linkedin.com/in/diutimaya-mohanty17/

---


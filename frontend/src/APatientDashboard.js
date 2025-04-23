import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TherapistScheduler.css';

const APatientDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [requested, setRequested] = useState([]);
  const patientId = localStorage.getItem("userID");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    if (role !== "adult_patient") {
      window.location.href = "/";
      return;
    }

    fetch(`http://localhost:5050/available-appointments?date=${date.toISOString().split('T')[0]}`)
      .then(res => res.json())
      .then(setAvailableAppointments)
      .catch(err => console.error("Error loading appointments:", err));
  }, [date, role]);

  const requestAppointment = async (appointment) => {
    try {
      const response = await fetch('http://localhost:5050/request-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          therapistId: appointment.therapist_id,
          date: appointment.date,
          time_slot: appointment.time_slot
        })
      });

      if (response.ok) {
        alert("Appointment requested!");
        setRequested(prev => [...prev, appointment]);
      } else {
        alert("Failed to request appointment.");
      }
    } catch (error) {
      console.error("Request error:", error);
      alert("Error requesting appointment.");
    }
  };

  if (role !== "adult_patient") return null;

  const filteredAppointments = availableAppointments.filter(app => app.date === date.toISOString().split('T')[0]);

  return (
    <div className="dashboard-container">
      <div className="title-bar">
        <h1 className="title">Adult Patient Dashboard</h1>
        <button className="dashboard-button" onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}>
          Log Out
        </button>
      </div>
      <div className="scheduler-layout">
        <div className="left-panel">
          <h2>Available Appointments</h2>
          <Calendar onChange={setDate} value={date} />
          {filteredAppointments.length > 0 ? (
            <ul className="availability-list">
              {filteredAppointments.map((app, index) => (
                <li key={index}>
                  {app.date} - {app.time_slot} @ {app.location}
                  <button 
                    disabled={requested.some(r => r.date === app.date && r.time_slot === app.time_slot && r.therapist_id === app.therapist_id)}
                    onClick={() => requestAppointment(app)}>
                    {requested.some(r => r.date === app.date && r.time_slot === app.time_slot && r.therapist_id === app.therapist_id) ? "Requested" : "Request"}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointments available for this day.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default APatientDashboard;

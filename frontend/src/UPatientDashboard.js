// src/UPatientDashboard.js
import React, { useEffect, useState } from "react";
import './UPatientDashboard.css';

export default function UPatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const upatId = localStorage.getItem("upat_id");

  useEffect(() => {
    if (!upatId) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/minor/${upatId}/appointments`);
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      }
    };

    fetchAppointments();
  }, [upatId]);

  return (
    <div className="minor-dashboard">
      <h1>Minor Patient Dashboard</h1>
      <div className="dashboard-columns">
        <div className="appointment-section">
          <h2>Guardian's Appointments</h2>
          {appointments.length === 0 ? (
            <p className="empty-text">No appointments found.</p>
          ) : (
            <ul className="appointment-list">
              {appointments.map((appt) => (
                <li key={appt.aappt_id}>
                  📅 <strong>{appt.aappt_date}</strong><br />
                  🧠 {appt.aappt_type} with <strong>{appt.ther_name}</strong><br />
                  ⏱ {appt.aappt_duration} mins<br />
                  📍 {appt.aappt_addr}<br />
                  📝 Status: {appt.status}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="read-only-reminder">
          <h2>Notice</h2>
          <p>This view is read-only. You can only view your guardian’s appointments.</p>
        </div>
      </div>
    </div>
  );
}

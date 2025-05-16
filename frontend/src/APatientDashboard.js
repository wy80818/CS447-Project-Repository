import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TherapistScheduler.css';

const APatientDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [requested, setRequested] = useState([]);
  const patientId = sessionStorage.getItem("userId");
  const role = sessionStorage.getItem("userRole");
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);


  useEffect(() => {
    if (role !== "adult_patient") {
      window.location.href = "/";
      return;
    }

    fetch(`http://localhost:5050/available-appointments?date=${date.toISOString().split('T')[0]}`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched available appointments:", data);
        setAvailableAppointments(data);
      })
      .catch(err => console.error("Error loading appointments:", err));

       // Fetch upcoming appointments
    fetch(`http://localhost:5050/upcoming-appointments?patientId=${patientId}`)
      .then(res => res.json())
      .then(data => setUpcomingAppointments(data))
      .catch(err => console.error("Error loading upcoming appts:", err));
  }, [date, role, patientId]);

  const requestAppointment = async (appointment) => {
    try {
      const formattedDate = new Date(appointment.date).toISOString().split('T')[0];
      const [start, end] = appointment.time_slot.split('-');
      const startTime = new Date(`1970-01-01T${start}:00Z`);
      const endTime = new Date(`1970-01-01T${end}:00Z`);
      const duration = (endTime - startTime) / (1000 * 60); // duration in minutes
      const apptType = "standard";

      console.log("Sending request with:", {
        patientId,
        therapistId: appointment.therapist_id,
        date: formattedDate,
        time_slot: appointment.time_slot,
        appt_type: apptType,
        duration,
        location: appointment.location
      });

      const response = await fetch('http://localhost:5050/request-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          therapistId: appointment.therapist_id,
          date: formattedDate,
          time_slot: appointment.time_slot,
          appt_type: apptType,
          duration,
          location: appointment.location
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

  const filteredAppointments = Array.isArray(availableAppointments)
    ? availableAppointments.filter(app => {
        const appDate = new Date(app.date).toISOString().split('T')[0];
        const selectedDate = date.toISOString().split('T')[0];
        return appDate === selectedDate;
      })
    : [];

    return (
      <div className="dashboard-container">
        <div className="title-bar">
          <h1 className="title">Adult Patient Dashboard</h1>
          <button className="dashboard-button" onClick={() => {
            sessionStorage.clear();
            window.location.href = '/';
          }}>
            Log Out
          </button>
        </div>
        <div className="scheduler-layout">
          {/* LEFT PANEL: Available appointments */}
          <div className="left-panel">
            <h2>Available Appointments</h2>
            <Calendar onChange={setDate} value={date} />
            {Array.isArray(filteredAppointments) && filteredAppointments.length > 0 ? (
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
    
          {/* RIGHT PANEL: Upcoming appointments */}
          <div className="right-panel">
            <h2>Upcoming Appointments</h2>
            {upcomingAppointments.length > 0 ? (
              <ul className="availability-list">
                {upcomingAppointments.map((appt, idx) => (
                  <li key={idx}>
                    {appt.aappt_date} - {appt.aappt_type} for {appt.aappt_duration} min @ {appt.aappt_addr} ({appt.status})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming appointments.</p>
            )}
          </div>
        </div>
      </div>
    );
  };    

export default APatientDashboard;

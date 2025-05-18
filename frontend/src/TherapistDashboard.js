import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TherapistScheduler.css';

const TherapistDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [availability, setAvailability] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const therapistId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (therapistId) {
      fetch(`http://localhost:5050/get-availability/${therapistId}`)
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(item => {
            const [startTime, endTime] = item.time_slot.split("-");
            return {
              date: item.date,
              startTime,
              endTime,
              location: item.location
            };
          });
          setAvailability(formatted);
        })
        .catch(err => console.error("Error loading availability:", err));

      fetch(`http://localhost:5050/get-appointments/${therapistId}`)
        .then(res => res.json())
        .then(data => {
          console.log("Fetched appointments:", data);
          setAppointments(data);
        })
        .catch(err => console.error("Error loading appointments:", err));
    }
  }, [therapistId]);

  const handleAppointment = async (id, decision) => {
    try {
      const res = await fetch(`http://localhost:5050/handle-appointment/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision })
      });
      if (res.status === 409){
        const err = await res.json();
        alert(err.error);
        return;
      }
      if(!res.ok){
        alert("Something went wrong.");
        return;
      }
      setAppointments(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      console.error('Error handling appointment:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="title-bar">
        <h1 className="title">Therapist Dashboard</h1>
        <button className="dashboard-button" onClick={() => window.location.href = '/therapistscheduler'}>
          Set Availability
        </button>
        <button className='dashboard-button' onClick={() => {
          sessionStorage.clear();
          window.location.href = '/';
        }}>
          Log Out
        </button>
      </div>
      <div className="scheduler-layout">
        {/* LEFT: Availability calendar */}
        <div className="left-panel">
          <h2>Your Availability</h2>
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={({ date, view }) => {
              const day = date.toISOString().split('T')[0];
              const matches = availability.filter(avail => avail.date === day);
              return matches.length > 0 ? (
                <ul className="calendar-availability">
                  {matches.map((match, i) => (
                    <li key={i}>
                      {match.startTime} - {match.endTime}
                    </li>
                  ))}
                </ul>
              ) : null;
            }}
          />
        </div>

        {/* RIGHT: Appointment requests */}
        <div className="right-panel">
        <h2>Appointment Requests</h2>
        {Array.isArray(appointments) && appointments.filter(app => !app.status || app.status === 'requested').length > 0 ? (
            <ul className="appointment-list">
                {appointments
                    .filter(app => !app.status || app.status === 'requested')
                    .map(app => (
                        <li 
                            key={app.id} className="appointment-card"
                             style={{ color: '#0b1c3c' }}
                        >
                        <p><strong style={{ color: '#12345a' }} >Date:</strong> {app.date}</p>
                        <p><strong style={{ color: '#12345a' }} >Duration:</strong> {app.duration} minutes</p>
                        <p><strong style={{ color: '#12345a' }} >Type:</strong> {app.appt_type}</p>
                        <p><strong style={{ color: '#12345a' }} >Location:</strong> {app.location}</p>
                        <p><strong style={{ color: '#12345a' }} >Client:</strong> {app.client_name}</p>
                        <div className="appointment-actions">
                            <button onClick={() => handleAppointment(app.id, 'accept')}>Accept</button>
                            <button onClick={() => handleAppointment(app.id, 'deny')}>Deny</button>
                        </div>
                    </li>
                ))}
                </ul>
            ) : (
                <p>No appointment requests at the moment.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;
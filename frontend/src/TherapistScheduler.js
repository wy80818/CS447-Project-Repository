import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TherapistScheduler.css';

const TherapistDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState([]);

  const therapistId = sessionStorage.getItem("userId");

  const addAvailability = () => {
    if (!startTime || !endTime || !location) {
      alert('Please complete all fields');
      return;
    }

    const newEntry = {
      date: date.toISOString().split('T')[0],
      startTime,
      endTime,
      location,
    };

    setAvailability((prev) => [...prev, newEntry]);
  };

  const saveAvailability = async () => {
    try {
      const payload = availability.map((entry) => ({
        therapistId,
        date: entry.date,
        location: entry.location,
        slots: [`${entry.startTime}-${entry.endTime}`],
      }));

      for (const avail of payload) {
        await fetch('http://localhost:5050/save-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(avail),
        });
      }

      alert('Availability saved!');
      setAvailability([]);
    } catch (err) {
      console.error(err);
      alert('Error saving availability');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="title-bar">
        <h1 className="title">Therapist Scheduler</h1>
        <button className="dashboard-button" onClick={() => window.location.href = '/therapistdashboard'}>
          Go To Dashboard
        </button>
      </div>
      <div className="scheduler-layout">
        {/* LEFT: Calendar and inputs */}
        <div className="left-panel">
          <h2>Select Date</h2>
          <Calendar
            onChange={setDate}
            value={date}
          />
          <div className="input-group">
            <label>Start Time:</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <label>End Time:</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            <label>Location:</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            <button onClick={addAvailability}>Add</button>
          </div>
        </div>

        {/* RIGHT: Availability preview */}
        <div className="right-panel">
          <h2>Availability Preview</h2>
          <ul className="availability-list">
            {availability.map((entry, index) => (
              <li key={index}>
                {entry.date}: {entry.startTime} - {entry.endTime} @ {entry.location}
              </li>
            ))}
          </ul>
          <button onClick={saveAvailability}>Save Availability</button>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;

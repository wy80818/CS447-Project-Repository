import "./Login.css";
import { useState } from "react";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5050/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("userRole", data.role);
        sessionStorage.setItem("userId", data.id);

        if (data.role === "under_patient") {
          localStorage.setItem("upat_id", data.id);
        }

        setStatus("✅ " + data.message);

        if (data.role === "therapist") {
          navigate("/therapistdashboard");
        } else if (data.role === "adult_patient") {
          navigate("/patientdashboard");
        } else if (data.role === "under_patient") {
          navigate("/minordashboard");
        } else {
          navigate("/");
        }
      } else {
        setStatus("❌ " + data.message);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setStatus("❌ Could not connect to server.");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-avatar">
          <img

            src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
            alt="User Avatar"
          />
        </div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
        </form>
        <button type="button" onClick={handleRegisterRedirect}>Register</button>
        <p className="login-status">{status}</p>
      </div>
    </div>
  );
}
//                   <button onClick={() => rateAppointment(appt.aappt_id)}>Rate</button>
//                 </li>
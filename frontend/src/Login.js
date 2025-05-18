import "./Login.css";
import { useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
import { useNavigate } from "react-router-dom"; // 👈 import useNavigate
>>>>>>> 59cc939e9d22ae6e2ab8b4849a8e5f8b06be586a

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
<<<<<<< HEAD
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

=======
  const navigate = useNavigate(); // 👈 create navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
  
>>>>>>> 59cc939e9d22ae6e2ab8b4849a8e5f8b06be586a
    try {
      const response = await fetch("http://localhost:5050/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
<<<<<<< HEAD

      const data = await response.json();

      if (response.ok) {
        // ✅ Save user info to sessionStorage
        sessionStorage.setItem("userRole", data.role);
        sessionStorage.setItem("userId", data.id);

        // ✅ Also save upat_id separately if under_patient
        if (data.role === "under_patient") {
          localStorage.setItem("upat_id", data.id); // Used by UPatientDashboard
        }

        setStatus("✅ " + data.message);

        // ✅ Redirect based on role
        if (data.role === "therapist") {
          navigate("/therapistdashboard");
        } else if (data.role === "adult_patient") {
          navigate("/patientdashboard");
        } else if (data.role === "under_patient") {
          navigate("/minordashboard");
        } else {
          navigate("/");
=======
  
      const data = await response.json();
  
      if (response.ok) {
        // ✅ Save user info to localStorage
        sessionStorage.setItem("userRole", data.role);
        sessionStorage.setItem("userId", data.id);
  
        setStatus("✅ " + data.message);
  
        // ✅ Redirect based on role
        if (data.role === "therapist") {
          navigate("/therapistdashboard"); // or your TherapistDashboard route
        } else if (data.role === "adult_patient"){
          navigate("/patientdashboard"); // to patient dashboard
        }else{
          navigate("/home");
>>>>>>> 59cc939e9d22ae6e2ab8b4849a8e5f8b06be586a
        }
      } else {
        setStatus("❌ " + data.message);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setStatus("❌ Could not connect to server.");
    }
  };
<<<<<<< HEAD

  const handleRegisterRedirect = () => {
    navigate("/register");
=======
  

  const handleRegisterRedirect = () => {
    navigate("/register"); // 👈 redirect to register page
>>>>>>> 59cc939e9d22ae6e2ab8b4849a8e5f8b06be586a
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-avatar">
          <img 
<<<<<<< HEAD
            src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
            alt="User Avatar"
=======
          src ="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
          alt = "User Avatar"
>>>>>>> 59cc939e9d22ae6e2ab8b4849a8e5f8b06be586a
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
<<<<<<< HEAD
        <button type="button" onClick={handleRegisterRedirect}>Register</button>
=======
        <button type="button" onClick={handleRegisterRedirect}>Register</button> {/* 👈 updated */}
>>>>>>> 59cc939e9d22ae6e2ab8b4849a8e5f8b06be586a
        <p className="login-status">{status}</p>
      </div>
    </div>
  );
}

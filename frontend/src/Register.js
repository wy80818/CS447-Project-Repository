import { useState } from "react";

export default function Register() {
  const [role, setRole] = useState("administrator");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [insurance, setInsurance] = useState("");
  const [primaryCare, setPrimaryCare] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const goToLogin = () => {
    window.location.href = "/login";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5050/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          username,
          password,
          name,
          age,
          birthday,
          address,
          insurance,
          primaryCare,
          email
        })
      });

      const data = await response.json();
      setStatus(response.ok ? "✅ " + data.message : "❌ " + data.message);
    } catch (error) {
      console.error("Error during registration:", error);
      setStatus("❌ Could not connect to server.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="administrator">Administrator</option>
          <option value="therapist">Therapist</option>
          <option value="adult_patient">Adult Patient</option>
          <option value="under_patient">Underage Patient</option>
        </select><br /><br />
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required /><br />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br />
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} /><br />
        <input type="date" placeholder="Birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} /><br />
        <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} /><br />
        <input placeholder="Insurance" value={insurance} onChange={(e) => setInsurance(e.target.value)} /><br />
        <input placeholder="Primary Care Provider" value={primaryCare} onChange={(e) => setPrimaryCare(e.target.value)} /><br />
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <button type="submit">Register</button>
        </form>
        
        <button onClick={goToLogin} style={{ marginTop: "1rem" }}>
          Back to Login
        </button>

      
      <p>{status}</p>
    </div>
  );
}

import { useState } from "react";
import "./Register.css";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

export default function Register() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)

  const [autocomplete, setAutocomplete] = useState(null);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
const [submitted, setSubmitted] = useState(false);

  const [role, setRole] = useState("adult_patient");
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

  const onLoad = (autoC) => {
    setAutocomplete(autoC);
  };



  const onPlaceChanged = () => {
  if (autocomplete !== null) {
    const place = autocomplete.getPlace();
    if (place.formatted_address) {
      setAddress(place.formatted_address);
      setAddressConfirmed(true);
    } else {
      setAddressConfirmed(false);
    }
  }
};


  const goToLogin = () => {
    window.location.href = "/login";
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

   if (loading) return;
    setLoading(true);

  if (!addressConfirmed) {
  setStatus("❌ Please select a valid address from the suggestions.");
  setLoading(false);
  return;
}

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
        email,
      }),
    });

     const data = await response.json();
    if (response.ok) {
      setSubmitted(true);
      setStatus("✅ " + data.message);
    } else {
      setStatus("❌ " + data.message);
    }
  } catch (err) {
    setStatus("❌ Could not connect to server.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>User Registration Form</h2>
        <form onSubmit={handleSubmit}>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="therapist">Therapist</option>
            <option value="adult_patient">Adult Patient</option>
            <option value="under_patient">Underage Patient</option>
          </select>
          <input
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
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
          <input type="date" placeholder="Birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} />

          {isLoaded ? (
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Autocomplete>
          ) : (
            <input placeholder="Loading address autocomplete..." disabled />
          )}

          <input placeholder="Insurance" value={insurance} onChange={(e) => setInsurance(e.target.value)} />
          <input
            placeholder="Primary Care Provider"
            value={primaryCare}
            onChange={(e) => setPrimaryCare(e.target.value)}
          />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" disabled={loading || submitted}>
            {loading ? "Registering..." : submitted ? "Registered" : "Register"}
          </button>
        </form>
        <button onClick={goToLogin} className="back-to-login-button">
          Back to Login
        </button>
        <p>{status}</p>
      </div>
    </div>
  );
}

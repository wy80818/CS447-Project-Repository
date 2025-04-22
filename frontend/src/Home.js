import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const goToLogin = async () => {
    try {
      const response = await fetch("http://localhost:5050/init-db", {
        method: "POST"
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message); // Or show a toast/message
        navigate("/login");
      } else {
        alert("❌ Failed to initialize database: " + data.message);
      }
    } catch (error) {
      console.error("Initialization error:", error);
      alert("❌ Could not connect to backend.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1>Group 6's Appointment Scheduler</h1>
      <button onClick={goToLogin} style={{ marginTop: "2rem", padding: "0.5rem 1rem" }}>
        Start
      </button>
    </div>
  );
}

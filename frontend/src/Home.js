import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1>Group 6's Appointment Scheduler</h1>
      <button onClick={goToLogin} style={{ marginTop: "2rem", padding: "0.5rem 1rem" }}>
        Login
      </button>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [therapists, setTherapists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5050/admin/all-therapists")
      .then((res) => res.json())
      .then((data) => setTherapists(data))
      .catch((err) => console.error("Error fetching therapists:", err));
  }, []);

  const verifyTherapist = (ther_id) => {
    fetch("http://localhost:5050/admin/verify-therapist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ther_id }),
    })
      .then((res) => res.json())
      .then(() => {
        setTherapists((prev) =>
          prev.map((t) =>
            t.ther_id === ther_id ? { ...t, verified: 1 } : t
          )
        );
      })
      .catch((err) => console.error("Verification error:", err));
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Dashboard - Therapist Verification</h2>
        <button onClick={handleLogout}>🚪 Logout</button>
      </div>

      {therapists.length === 0 ? (
        <p>No therapists found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {therapists.map((therapist) => (
              <tr key={therapist.ther_id}>
                <td>{therapist.ther_name}</td>
                <td>{therapist.ther_email}</td>
                <td>
                  {therapist.verified ? (
                    <span>✅ Verified</span>
                  ) : (
                    <button onClick={() => verifyTherapist(therapist.ther_id)}>
                      ✅ Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

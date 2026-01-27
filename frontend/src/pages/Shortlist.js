import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Shortlist() {
  const [universities, setUniversities] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/universities/shortlisted/${userId}`)
      .then(res => setUniversities(res.data || []))
      .catch(err => {
        console.error("Failed to load shortlist:", err);
        setUniversities([]);
      });
  }, [userId]);

  const lockUniversity = async (uniId) => {
    try {
      await api.post("/universities/lock", {
        userId,
        universityId: uniId // Backend will use this as universityName
      });
      alert("University locked. Application stage unlocked.");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to lock university. Please try again.");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Your Shortlisted Universities</h1>

      {universities.length === 0 ? (
        <p>No universities in your shortlist yet. Get recommendations from the AI Counsellor!</p>
      ) : (
        universities.map(u => (
          <div
            key={u.id}
            style={{ border: "1px solid #ccc", marginBottom: 15, padding: 15 }}
          >
            <h3>{u.name}</h3>
            <p>Country: {u.country}</p>
            <p>Cost: {u.cost_level}</p>
            <p>Acceptance Chance: {u.acceptance_chance}</p>
            <p>Risk: {u.risk_reason}</p>

            <button onClick={() => lockUniversity(u.name)}>
              Lock This University
            </button>
          </div>
        ))
      )}
    </div>
  );
}

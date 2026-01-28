import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Shortlist() {
  const [universities, setUniversities] = useState([]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const res = await api.get(`/onboarding/status/${userId}`);
        if (!res.data.onboardingCompleted) {
          alert("Please complete onboarding first to view shortlist.");
          navigate("/onboarding");
          return;
        }
        setOnboardingComplete(true);

        const shortlistRes = await api.get(`/universities/shortlisted/${userId}`);
        setUniversities(shortlistRes.data || []);
      } catch (err) {
        console.error("Failed to load shortlist:", err);
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      checkOnboarding();
    } else {
      navigate("/login");
    }
  }, [userId, navigate]);

  const lockUniversity = async (uniId) => {
    try {
      await api.post("/universities/lock", {
        userId,
        universityId: uniId
      });
      alert("University locked. Application stage unlocked.");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to lock university. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (!onboardingComplete) {
    return null; // Will redirect
  }

  return (
    <div className="two-column-layout">
      <section className="card">
        <div className="card-header">
          <div className="card-title">Shortlisted Universities</div>
          <span className="card-tag">Stage 2–3 · Discovery & Finalization</span>
        </div>
        {universities.length === 0 ? (
          <div className="empty-state">
            No universities in your shortlist yet. Ask the AI counsellor to recommend Dream / Target / Safe options and
            add them directly from the chat.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 6 }}>
            {universities.map((u) => (
              <div
                key={u.id}
                style={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  padding: 14,
                  background: "#ffffff",
                  boxShadow: "0 1px 2px rgba(15,23,42,0.06)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <h3 style={{ margin: 0 }}>{u.name}</h3>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{u.country}</span>
                </div>
                <p style={{ margin: "2px 0", fontSize: 13 }}>
                  <strong>Cost:</strong> {u.cost_level}
                </p>
                <p style={{ margin: "2px 0", fontSize: 13 }}>
                  <strong>Acceptance Chance:</strong> {u.acceptance_chance}
                </p>
                <p style={{ margin: "2px 0", fontSize: 13 }}>
                  <strong>Risk:</strong> {u.risk_reason}
                </p>

                <button
                  type="button"
                  className="primary-button"
                  style={{ marginTop: 8 }}
                  onClick={() => lockUniversity(u.name)}
                >
                  Lock This University
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0, marginBottom: 10 }}>How locking works</h3>
        <ul style={{ paddingLeft: 18, fontSize: 13, color: "#d1d5db" }}>
          <li>Lock at least one university to unlock the Application Guidance stage.</li>
          <li>You can still unlock later, but your tasks and strategy will reset.</li>
          <li>Use a mix of Dream, Target, and Safe universities before locking your final choices.</li>
        </ul>
        <button
          type="button"
          className="secondary-button"
          style={{ marginTop: 12 }}
          onClick={() => navigate("/counsellor")}
        >
          Ask AI to refine this list
        </button>
      </section>
    </div>
  );
}

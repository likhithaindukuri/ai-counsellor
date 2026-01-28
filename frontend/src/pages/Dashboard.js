import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    const load = async () => {
      try {
        const p = await api.get(`/onboarding/profile/${userId}`);
        const profileData = p.data;

        const t = await api.get(`/application/todos/${userId}`);
        const todosData = t.data.todos || [];
        const todoStrings = todosData
          .filter((todo) => !(todo.status === "completed" || todo.completed === true))
          .map((todo) => todo.task || todo);

        setProfile({
          ...profileData,
          name: userName,
          profile_strength: profileData.profile_strength || "Calculating..."
        });
        setTodos(todoStrings);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      }
    };
    load();
  }, [userId, userName]);

  if (!profile) {
    return <div className="loading-state">Loading dashboard...</div>;
  }

  return (
    <div className="two-column-layout">
      <section className="card">
        <div className="card-header">
          <div className="card-title">Dashboard</div>
          <span className="card-tag">Control Center</span>
        </div>
        <div className="page-header">
          <h2 className="page-title" style={{ fontSize: 22 }}>
            Welcome, {profile.name}
          </h2>
          <p className="page-subtitle">
            This is your home base. Follow the stages in order and keep an eye on your AI-generated tasks.
          </p>
        </div>

        <div style={{ marginBottom: 20 }} className="form-row-inline">
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/counsellor")}
          >
            Chat with AI Counsellor
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/shortlist")}
          >
            View Shortlist
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/profile")}
          >
            Edit Profile
          </button>
          {profile.stage === "APPLICATION_PREP" && (
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/application")}
            >
              Prepare Application
            </button>
          )}
        </div>

        <section style={{ marginBottom: 18 }}>
          <h3 className="section-heading">Current Stage</h3>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#a5b4fc" }}>
            {profile.stage === "PROFILE_BUILDING" && "Stage 1: Building Profile"}
            {profile.stage === "UNIVERSITY_DISCOVERY" && "Stage 2: Discovering Universities"}
            {profile.stage === "UNIVERSITY_FINALIZATION" && "Stage 3: Finalizing Universities"}
            {profile.stage === "APPLICATION_PREP" && "Stage 4: Preparing Applications"}
            {!["PROFILE_BUILDING", "UNIVERSITY_DISCOVERY", "UNIVERSITY_FINALIZATION", "APPLICATION_PREP"].includes(profile.stage) && profile.stage}
          </p>
        </section>

        <section>
          <h3 className="section-heading">Your Next Actions</h3>
          {todos.length === 0 ? (
            <div className="empty-state">
              No active tasks yet. Start by chatting with the AI counsellor or reviewing your profile.
            </div>
          ) : (
            <ul style={{ paddingLeft: 18 }}>
              {todos.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}
        </section>
      </section>

      <section className="card">
        <h3 className="section-heading" style={{ marginTop: 0 }}>
          Profile Snapshot
        </h3>
        <div style={{ marginBottom: 14 }}>
          <div className="small muted">Education</div>
          <div>{profile.current_education || "Not specified"}</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div className="small muted">Target Degree</div>
          <div>{profile.target_degree || "Not specified"}</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div className="small muted">Preferred Countries</div>
          <div>{profile.preferred_countries?.join(", ") || "Not specified"}</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div className="small muted">Budget</div>
          <div>{profile.budget_range || "Not specified"}</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div className="small muted">Profile Strength</div>
          <div>{profile.profile_strength || "Calculating..."}</div>
        </div>
      </section>
    </div>
  );
}

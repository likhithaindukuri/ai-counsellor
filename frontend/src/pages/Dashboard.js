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
        // Fetch profile with stage (existing endpoint: /api/onboarding/profile/:userId)
        const p = await api.get(`/onboarding/profile/${userId}`);
        const profileData = p.data;
        
        // Fetch todos (existing endpoint: /api/application/todos/:userId returns { todos: [...] })
        const t = await api.get(`/application/todos/${userId}`);
        const todosData = t.data.todos || [];
        
        // Extract task strings from todos array (todos are objects with { task, status })
        const todoStrings = todosData.map(todo => todo.task || todo);
        
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

  if (!profile) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>Welcome, {profile.name}</h1>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("/counsellor")} style={{ marginRight: 10, padding: 10 }}>
          Chat with AI Counsellor
        </button>
        <button onClick={() => navigate("/shortlist")} style={{ padding: 10 }}>
          View Shortlist
        </button>
      </div>

      {/* Stage */}
      <section>
        <h2>Current Stage</h2>
        <p>{profile.stage}</p>
      </section>

      {/* Profile Strength */}
      <section>
        <h2>Profile Strength</h2>
        <p>{profile.profile_strength || "Calculating..."}</p>
      </section>

      {/* AI To-Dos */}
      <section>
        <h2>Your Next Actions</h2>
        <ul>
          {todos.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

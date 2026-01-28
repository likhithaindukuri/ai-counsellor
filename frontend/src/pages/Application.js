import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Application() {
  const [university, setUniversity] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const u = await api.get(`/universities/locked/${userId}`);

        const lockedName = u.data?.name || u.data?.lockedUniversity || null;
        if (!lockedName) {
          alert("Please lock a university first to access application guidance.");
          navigate("/shortlist");
          return;
        }
        setUniversity({ name: lockedName });

        const t = await api.get(`/ai/application-tasks/${userId}`);
        const todosData = t.data.todos || [];
        const taskList = todosData.map((todo) => {
          if (typeof todo === "string") return { task: todo, completed: false, id: null };
          return {
            task: todo.task || todo,
            completed: todo.status === "completed" || todo.completed || false,
            id: todo.id || null
          };
        });
        setTasks(taskList);
      } catch (error) {
        console.error("Failed to load application data:", error);
        console.error("Error details:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      load();
    } else {
      navigate("/login");
    }
  }, [userId, navigate]);

  const toggleTask = async (task) => {
    try {
      const res = await api.post("/application/todos/complete", {
        userId,
        taskId: task.id,
        taskIndex: task.id
      });

      const updatedTodos = res.data.todos || [];
      const taskList = updatedTodos.map((todo) => ({
        task: todo.task || todo,
        completed: todo.status === "completed" || todo.completed || false,
        id: todo.id || null
      }));
      setTasks(taskList);
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  if (loading) return <div className="loading-state">Loading application guidance...</div>;

  if (!university || !university.name) {
    return (
      <div className="loading-state">
        <p>Please lock a university to access application guidance.</p>
        <button
          type="button"
          className="primary-button"
          style={{ marginTop: 10 }}
          onClick={() => navigate("/shortlist")}
        >
          Go to Shortlist
        </button>
      </div>
    );
  }

  return (
    <div className="two-column-layout">
      <section className="card">
        <div className="card-header">
          <div className="card-title">Application Preparation</div>
          <span className="card-tag">Stage 4 · Preparing Applications</span>
        </div>
        <p className="section-muted">
          These tasks are tied to your locked university. As you complete them, your progress will automatically update.
        </p>

        <h3 className="section-heading" style={{ marginTop: 0 }}>
          Locked University
        </h3>
        <p style={{ fontSize: 15, marginBottom: 16 }}>{university.name}</p>

        <h3 className="section-heading">Required Documents</h3>
        <ul style={{ marginTop: 0, marginBottom: 16, paddingLeft: 18, fontSize: 14 }}>
          <li>Statement of Purpose</li>
          <li>Academic Transcripts</li>
          <li>Letters of Recommendation</li>
          <li>Test Scores (IELTS/TOEFL, GRE/GMAT if applicable)</li>
        </ul>

        <h3 className="section-heading">Your Application Tasks</h3>
        <ul style={{ listStyle: "none", padding: 0, marginTop: 0 }}>
          {tasks.map((task, i) => (
            <li key={task.id || i} style={{ marginBottom: 8 }}>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task)}
                  style={{ marginRight: 8 }}
                />
                <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>{task.task}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0, marginBottom: 10 }}>Timeline & Tips</h3>
        <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 10 }}>
          A good rule of thumb is to start serious preparation{" "}
          <strong>3–6 months before your earliest deadline</strong>.
        </p>
        <ul style={{ paddingLeft: 18, fontSize: 13, color: "#d1d5db" }}>
          <li>Finish tests (IELTS/TOEFL, GRE/GMAT) as early as possible.</li>
          <li>Lock your final list of universities before writing your final SOP drafts.</li>
          <li>Keep track of deadline dates for each university separately.</li>
        </ul>
        <button
          type="button"
          className="secondary-button"
          style={{ marginTop: 12 }}
          onClick={() => navigate("/counsellor")}
        >
          Ask AI to review my plan
        </button>
      </section>
    </div>
  );
}

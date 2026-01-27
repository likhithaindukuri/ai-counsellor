import { useEffect, useState } from "react";
import api from "../services/api";

export default function Application() {
  const [university, setUniversity] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const load = async () => {
      try {
        const u = await api.get(`/universities/locked/${userId}`);
        console.log("Locked university response:", u.data);
        console.log("User ID:", userId);
        
        // Handle different response formats
        const lockedName = u.data?.name || u.data?.lockedUniversity || null;
        if (lockedName) {
          setUniversity({ name: lockedName });
        } else {
          console.warn("No locked university found for userId:", userId);
        }
        
        const t = await api.get(`/ai/application-tasks/${userId}`);
        console.log("Todos response:", t.data);
        
        // Handle todos format - backend returns { task: string, status: "pending" | "completed" }
        const todosData = t.data.todos || [];
        const taskList = todosData.map(todo => {
          if (typeof todo === "string") return { task: todo, completed: false };
          return { 
            task: todo.task || todo, 
            completed: todo.status === "completed" || todo.completed || false 
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
    load();
  }, [userId]);

  const toggleTask = async (index) => {
    try {
      const res = await api.post("/application/todos/complete", {
        userId,
        taskIndex: index
      });
      
      // Update local state from backend response
      const updatedTodos = res.data.todos || [];
      const taskList = updatedTodos.map(todo => ({
        task: todo.task || todo,
        completed: todo.status === "completed" || todo.completed || false
      }));
      setTasks(taskList);
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!university || !university.name) {
    return (
      <div style={{ padding: 30 }}>
        <p>Please lock a university to access application guidance.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Application Preparation</h1>

      <h2>Locked University</h2>
      <p>{university.name}</p>

      <h3>Required Documents</h3>
      <ul>
        <li>Statement of Purpose</li>
        <li>Academic Transcripts</li>
        <li>Letters of Recommendation</li>
        <li>Test Scores</li>
      </ul>

      <h3>Your Application Tasks</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task, i) => (
          <li key={i} style={{ marginBottom: 10 }}>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(i)}
                style={{ marginRight: 10 }}
              />
              <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                {task.task}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

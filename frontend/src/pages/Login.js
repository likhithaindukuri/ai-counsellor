import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("userId", res.data.userId);
      if (res.data.userName || res.data.name) {
        localStorage.setItem("userName", res.data.userName || res.data.name);
      } else if (form.email) {
        const fallbackName = form.email.split("@")[0];
        localStorage.setItem("userName", fallbackName);
      }
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="two-column-layout">
      <section className="card">
        <div className="card-header">
          <div className="card-title">Welcome back</div>
          <span className="card-tag">Step 2 · Authentication</span>
        </div>

        <div className="page-header">
          <h2 className="page-title" style={{ fontSize: 20 }}>
            Log in to your workspace
          </h2>
          <p className="page-subtitle">
            Use the same email you used during signup to continue your study-abroad plan.
          </p>
        </div>

        <div className="form-layout">
          <label className="field-label">
            Email
            <input
              placeholder="you@example.com"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
            />
          </label>
          <label className="field-label">
            Password
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field"
            />
          </label>
          <button type="button" className="primary-button" onClick={submit}>
            Continue
          </button>
          <button
            type="button"
            className="ghost-button"
            style={{ alignSelf: "flex-start", fontSize: 12 }}
            onClick={() => alert("Basic prototype – forgot password flow is not implemented yet. Please contact support if you get stuck.")}
          >
            Forgot password?
          </button>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div className="card-title">First time here?</div>
        </div>
        <p className="section-muted">
          Create a free account, complete a short onboarding, and let the AI counsellor suggest universities for you.
        </p>
        <ul className="list-subtle" style={{ marginTop: 4, marginBottom: 12 }}>
          <li>2–3 minutes onboarding questionnaire.</li>
          <li>Stage-based dashboard with your tasks.</li>
          <li>AI suggestions for Dream / Target / Safe options.</li>
        </ul>
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/signup")}
        >
          Create an account
        </button>
      </section>
    </div>
  );
}

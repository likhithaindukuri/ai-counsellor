import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/auth/signup", form);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userName", form.fullName);
      navigate("/onboarding");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="two-column-layout">
      <section className="card">
        <div className="card-header">
          <div className="card-title">Create your account</div>
          <span className="card-tag">Step 2 · Authentication</span>
        </div>

        <div className="page-header">
          <h2 className="page-title" style={{ fontSize: 20 }}>
            Start your study-abroad workspace
          </h2>
          <p className="page-subtitle">
            A single place to store your profile, shortlist universities, and track application tasks.
          </p>
        </div>

        <div className="form-layout">
          <label className="field-label">
            Full name
            <input
              placeholder="Your full name"
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="input-field"
            />
          </label>
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
              placeholder="Create a password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field"
            />
          </label>
          <button type="button" className="primary-button" onClick={submit}>
            Create account &amp; start onboarding
          </button>
          <p className="small muted">
            By continuing, you agree to use this prototype for personal planning only. Do not paste sensitive data.
          </p>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div className="card-title">Already have an account?</div>
        </div>
        <p className="section-muted">
          Log in to pick up from your current stage in the journey.
        </p>
        <ul className="list-subtle" style={{ marginTop: 4, marginBottom: 12 }}>
          <li>Resume onboarding from where you left it.</li>
          <li>See your existing shortlist and locked universities.</li>
          <li>Continue application tasks without re-entering details.</li>
        </ul>
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/login")}
        >
          Go to login
        </button>
      </section>
    </div>
  );
}

import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const submit = async () => {
    try {
      // Map frontend fields to backend fields
      const profileData = {
        current_education: data.degree,
        graduation_year: data.graduationYear ? parseInt(data.graduationYear, 10) : null,
        target_degree: data.targetDegree,
        preferred_countries: data.countries ? data.countries.split(",").map((c) => c.trim()) : [],
        budget_range: data.budget,
        gpa: data.gpa ? parseFloat(data.gpa) : null,
        ielts_status: data.ielts || "Not started",
        gre_gmat_status: data.greGmat || "Not started",
        sop_status: data.sop || "Not started"
      };

      await api.post("/onboarding/complete", { userId, profileData });
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.error || "Onboarding failed. Please try again.");
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Onboarding – Step {step} of 4</div>
        <span className="card-tag">Stage 1 · Building Profile</span>
      </div>

      <div
        style={{
          width: "100%",
          height: 6,
          borderRadius: 999,
          background: "rgba(51,65,85,0.7)",
          overflow: "hidden",
          marginBottom: 18
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg,#4f46e5,#22c55e)"
          }}
        />
      </div>

      {step === 1 && (
        <>
          <h3 className="section-heading">Academic Background</h3>
          <p className="section-muted">
            Tell us where you are coming from so we can understand your academic context.
          </p>
          <div className="form-layout">
            <input
              placeholder="Degree (e.g., B.Tech Computer Science)"
              onChange={(e) => setData({ ...data, degree: e.target.value })}
              className="input-field"
            />
            <div className="form-row-inline">
              <input
                placeholder="Graduation Year (e.g., 2024)"
                type="number"
                onChange={(e) => setData({ ...data, graduationYear: e.target.value })}
                className="input-field"
                style={{ maxWidth: 220 }}
              />
              <input
                placeholder="GPA (out of 10, e.g., 8.5)"
                type="number"
                step="0.1"
                min="0"
                max="10"
                onChange={(e) => setData({ ...data, gpa: e.target.value })}
                className="input-field"
                style={{ maxWidth: 220 }}
              />
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h3 className="section-heading">Study Goals</h3>
          <p className="section-muted">
            What do you want to study and where would you like to go?
          </p>
          <div className="form-layout">
            <input
              placeholder="Intended Degree (e.g., Master's in Data Science)"
              onChange={(e) => setData({ ...data, targetDegree: e.target.value })}
              className="input-field"
            />
            <input
              placeholder="Preferred Countries (comma-separated, e.g., USA, Canada)"
              onChange={(e) => setData({ ...data, countries: e.target.value })}
              className="input-field"
            />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h3 className="section-heading">Budget</h3>
          <p className="section-muted">
            A rough idea of your budget helps us filter realistic options.
          </p>
          <div className="form-layout">
            <input
              placeholder="Annual Budget (e.g., 20–30 LPA or 30,000 USD)"
              onChange={(e) => setData({ ...data, budget: e.target.value })}
              className="input-field"
            />
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <h3 className="section-heading">Exams &amp; Readiness</h3>
          <p className="section-muted">
            Where do you stand with exams and your Statement of Purpose?
          </p>
          <div className="form-layout">
            <label className="field-label">
              IELTS/TOEFL Status
              <select
                onChange={(e) => setData({ ...data, ielts: e.target.value })}
                className="select-field"
                style={{ marginTop: 4, maxWidth: 260 }}
              >
                <option>Not started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </label>
            <label className="field-label">
              GRE/GMAT Status
              <select
                onChange={(e) => setData({ ...data, greGmat: e.target.value })}
                className="select-field"
                style={{ marginTop: 4, maxWidth: 260 }}
              >
                <option>Not started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </label>
            <label className="field-label">
              SOP Status
              <select
                onChange={(e) => setData({ ...data, sop: e.target.value })}
                className="select-field"
                style={{ marginTop: 4, maxWidth: 260 }}
              >
                <option>Not started</option>
                <option>Draft</option>
                <option>Ready</option>
              </select>
            </label>
          </div>
        </>
      )}

      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
        <div>
          {step > 1 && (
            <button type="button" className="secondary-button" onClick={back}>
              Back
            </button>
          )}
        </div>
        <div>
          {step < 4 && (
            <button type="button" className="primary-button" onClick={next}>
              Next
            </button>
          )}
          {step === 4 && (
            <button type="button" className="primary-button" onClick={submit} style={{ marginLeft: 8 }}>
              Finish Onboarding
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

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
        graduation_year: data.graduationYear ? parseInt(data.graduationYear) : null,
        target_degree: data.targetDegree,
        preferred_countries: data.countries ? data.countries.split(",").map(c => c.trim()) : [],
        budget_range: data.budget,
        ielts_status: data.ielts || "Not started",
        gre_gmat_status: "Not started",
        sop_status: "Not started"
      };

      await api.post("/onboarding/complete", { userId, profileData });
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.error || "Onboarding failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Onboarding – Step {step}/4</h2>

      {step === 1 && (
        <>
          <h3>Academic Background</h3>
          <input placeholder="Degree" onChange={e => setData({ ...data, degree: e.target.value })} />
          <input placeholder="Graduation Year" onChange={e => setData({ ...data, graduationYear: e.target.value })} />
        </>
      )}

      {step === 2 && (
        <>
          <h3>Study Goals</h3>
          <input placeholder="Intended Degree" onChange={e => setData({ ...data, targetDegree: e.target.value })} />
          <input placeholder="Preferred Countries (comma-separated)" onChange={e => setData({ ...data, countries: e.target.value })} />
        </>
      )}

      {step === 3 && (
        <>
          <h3>Budget</h3>
          <input placeholder="Annual Budget" onChange={e => setData({ ...data, budget: e.target.value })} />
        </>
      )}

      {step === 4 && (
        <>
          <h3>Exams & Readiness</h3>
          <select onChange={e => setData({ ...data, ielts: e.target.value })}>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </>
      )}

      <div>
        {step > 1 && <button onClick={back}>Back</button>}
        {step < 4 && <button onClick={next}>Next</button>}
        {step === 4 && <button onClick={submit}>Finish</button>}
      </div>
    </div>
  );
}

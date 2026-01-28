import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/onboarding/profile/${userId}`)
      .then((res) => {
        const profileData = res.data;
        setProfile({
          ...profileData,
          countries: profileData.preferred_countries || [],
          budget: profileData.budget_range || ""
        });
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        alert("Failed to load profile. Please try again.");
      });
  }, [userId]);

  const saveProfile = async () => {
    try {
      const profileData = {
        preferred_countries: profile.countries || [],
        budget_range: profile.budget || "",
        sop_status: profile.sop_status || "Not started"
      };

      await api.put(`/onboarding/profile/${userId}`, profileData);
      alert("Profile updated. Recommendations recalculated.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert(error.response?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  if (!profile) return <div className="loading-state">Loading profile...</div>;

  return (
    <div className="two-column-layout">
      <section className="card">
        <div className="card-header">
          <div className="card-title">Edit Profile</div>
          <span className="card-tag">Stage 1 · Building Profile</span>
        </div>
        <p className="section-muted">
          Adjust your high-level preferences. The AI counsellor will recompute recommendations based on the latest
          values.
        </p>

        <div className="form-layout">
          <label className="field-label">
            Target Country
            <input
              value={profile.countries?.[0] || ""}
              onChange={(e) => setProfile({ ...profile, countries: [e.target.value] })}
              className="input-field"
              placeholder="e.g., USA, Canada"
            />
          </label>

          <label className="field-label">
            Budget (per year)
            <input
              value={profile.budget || ""}
              onChange={(e) => setProfile({ ...profile, budget: e.target.value })}
              className="input-field"
              placeholder="e.g., 20–30 LPA or 30,000 USD"
            />
          </label>

          <label className="field-label">
            SOP Status
            <select
              value={profile.sop_status || "Not started"}
              onChange={(e) => setProfile({ ...profile, sop_status: e.target.value })}
              className="select-field"
              style={{ marginTop: 4, maxWidth: 320 }}
            >
              <option value="Not started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </label>

          <div style={{ marginTop: 8 }}>
            <button type="button" className="primary-button" onClick={saveProfile}>
              Save Profile
            </button>
            <button
              type="button"
              className="secondary-button"
              style={{ marginLeft: 8 }}
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="section-heading" style={{ marginTop: 0 }}>
          Why this matters
        </h3>
        <ul className="list-subtle">
          <li>Target countries and budget directly affect which universities are considered realistic.</li>
          <li>SOP status helps the AI decide whether to push you towards drafting or polishing your statement.</li>
          <li>Keeping this up to date keeps recommendations and risk assessments accurate.</li>
        </ul>
      </section>
    </div>
  );
}

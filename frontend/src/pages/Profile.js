import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/onboarding/profile/${userId}`)
      .then(res => {
        const profileData = res.data;
        // Map database fields to form fields
        setProfile({
          ...profileData,
          countries: profileData.preferred_countries || [],
          budget: profileData.budget_range || ""
        });
      })
      .catch(err => {
        console.error("Failed to load profile:", err);
        alert("Failed to load profile. Please try again.");
      });
  }, [userId]);

  const saveProfile = async () => {
    try {
      // Map form fields back to database fields
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

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>Edit Profile</h1>

      <div style={{ marginBottom: 15 }}>
        <label style={{ display: "block", marginBottom: 5 }}>Target Country</label>
        <input
          value={profile.countries?.[0] || ""}
          onChange={(e) =>
            setProfile({ ...profile, countries: [e.target.value] })
          }
          style={{ width: "300px", padding: 8 }}
          placeholder="e.g., USA, Canada"
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label style={{ display: "block", marginBottom: 5 }}>Budget (per year)</label>
        <input
          value={profile.budget || ""}
          onChange={(e) =>
            setProfile({ ...profile, budget: e.target.value })
          }
          style={{ width: "300px", padding: 8 }}
          placeholder="e.g., 20-30 LPA"
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label style={{ display: "block", marginBottom: 5 }}>SOP Status</label>
        <select
          value={profile.sop_status || "Not started"}
          onChange={(e) =>
            setProfile({ ...profile, sop_status: e.target.value })
          }
          style={{ width: "300px", padding: 8 }}
        >
          <option value="Not started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <button 
          onClick={saveProfile}
          style={{ padding: 10, backgroundColor: "#007bff", color: "white", border: "none", borderRadius: 5, cursor: "pointer", marginRight: 10 }}
        >
          Save Profile
        </button>
        <button 
          onClick={() => navigate("/dashboard")}
          style={{ padding: 10, backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

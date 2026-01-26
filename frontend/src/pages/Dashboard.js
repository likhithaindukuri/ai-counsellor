import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/onboarding/profile/${userId}`);
        if (!res.data.onboarding_completed) {
          navigate("/onboarding");
          return;
        }
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        alert("Failed to load profile. Please try again.");
      }
    };
    fetchProfile();
  }, [userId, navigate]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Current Stage: {profile.stage}</p>
    </div>
  );
}

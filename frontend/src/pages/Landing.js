import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40 }}>
      <h1>AI Counsellor</h1>
      <h3>Plan your study-abroad journey with a guided AI counsellor.</h3>
      <p>
        No confusion. No endless browsing. Just clear decisions and next steps.
      </p>

      <button onClick={() => navigate("/signup")}>Get Started</button>
      <button onClick={() => navigate("/login")} style={{ marginLeft: 10 }}>
        Login
      </button>
    </div>
  );
}

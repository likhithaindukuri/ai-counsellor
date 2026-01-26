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
      navigate("/onboarding");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input placeholder="Full Name" onChange={e => setForm({ ...form, fullName: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={submit}>Create Account</button>
    </div>
  );
}

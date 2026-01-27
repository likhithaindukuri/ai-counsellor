import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AICounsellor from "./pages/AICounsellor";
import Shortlist from "./pages/Shortlist";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={
          <ProtectedRoute><Onboarding /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/counsellor" element={
          <ProtectedRoute><AICounsellor /></ProtectedRoute>
        } />
        <Route path="/shortlist" element={
          <ProtectedRoute><Shortlist /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

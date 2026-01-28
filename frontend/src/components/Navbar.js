import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div
        className="navbar-left"
        onClick={() => navigate("/")}
        role="button"
        tabIndex={0}
      >
        <img
          src="/logo-counsellor.svg"
          alt="AI Counsellor logo"
          className="navbar-logo"
        />
        <div className="navbar-brand">
          <div className="navbar-title">AI Counsellor</div>
          <div className="navbar-subtitle">Guided study-abroad planner</div>
        </div>
      </div>

      <nav className="navbar-links">
        {userId && (
          <>
            <Link to="/dashboard" className="navbar-link">
              Dashboard
            </Link>
            <Link to="/counsellor" className="navbar-link">
              AI Counsellor
            </Link>
            <Link to="/shortlist" className="navbar-link">
              Shortlist
            </Link>
            <Link to="/application" className="navbar-link">
              Application
            </Link>
          </>
        )}
      </nav>

      <div className="navbar-right">
        {userId ? (
          <>
            <span className="navbar-user">Hi, {userName}</span>
            <button
              type="button"
              className="secondary-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="ghost-button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </header>
  );
}


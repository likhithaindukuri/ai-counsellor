import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="two-column-layout">
      <section className="card">
        <header className="page-header">
          <h1 className="page-title">
            Plan your study-abroad journey with a{" "}
            <span style={{ color: "#a5b4fc" }}>guided AI counsellor.</span>
          </h1>
          <p className="page-subtitle" style={{ maxWidth: 520 }}>
            Build your profile once, let the AI counsellor reason about your options, and move stage by stage from
            confusion to clarity.
          </p>
        </header>

        <div className="form-row-inline" style={{ marginBottom: 18 }}>
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

        <hr className="divider" />

        <div className="form-row-inline">
          <div style={{ minWidth: 0 }}>
            <div className="small muted">Stage 1</div>
            <div className="section-heading">Build Profile</div>
            <p className="section-muted" style={{ fontSize: 12 }}>
              Academic background, goals, budget and exam readiness.
            </p>
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="small muted">Stage 2–3</div>
            <div className="section-heading">Discover &amp; Lock Universities</div>
            <p className="section-muted" style={{ fontSize: 12 }}>
              AI groups options into Dream / Target / Safe and enforces a commitment step.
            </p>
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="small muted">Stage 4</div>
            <div className="section-heading">Prepare Applications</div>
            <p className="section-muted" style={{ fontSize: 12 }}>
              Clear to-dos for SOP, exams and documents tracked in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div className="card-title">What makes this different?</div>
          <span className="card-tag">Stage-based · Action-driven</span>
        </div>
        <ul className="list-subtle">
          <li>
            The AI counsellor does not just chat – it can shortlist universities, enforce locking and generate
            application tasks.
          </li>
          <li>
            Every step is locked until you finish the previous one, so you always know exactly what to do next.
          </li>
          <li>
            Built for clarity and momentum: fewer decisions at a time, more progress towards your final admit.
          </li>
        </ul>
      </section>
    </div>
  );
}

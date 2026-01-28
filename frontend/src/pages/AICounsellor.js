import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AICounsellor() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const res = await api.get(`/onboarding/status/${userId}`);
        if (!res.data.onboardingCompleted) {
          alert("Please complete onboarding first to access AI Counsellor.");
          navigate("/onboarding");
          return;
        }
        setOnboardingComplete(true);
      } catch (error) {
        console.error("Failed to check onboarding:", error);
        alert("Failed to verify onboarding status. Please try again.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      checkOnboarding();
    } else {
      navigate("/login");
    }
  }, [userId, navigate]);

  const shortlistUniversity = async (universityName) => {
    try {
      await api.post("/universities/shortlist", {
        userId,
        universityName
      });
      alert(`${universityName} added to shortlist!`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to shortlist university. Please try again.");
    }
  };

  const sendMessage = async () => {
    if (!message) return;

    const userMsg = { role: "user", text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");

    try {
      const res = await api.post("/ai/chat", {
        userId,
        message
      });

      // Handle response - can be string or object
      let responseText = "";
      let recommendations = null;

      if (typeof res.data.response === "string") {
        responseText = res.data.response;
      } else if (typeof res.data.response === "object" && res.data.response !== null) {
        // Format different types of object responses
        if (res.data.response.recommendations) {
          const rec = res.data.response.recommendations;
          recommendations = rec;
          responseText =
            `Based on your profile:\n\n` +
            `Dream: ${rec.dream?.join(", ") || "N/A"}\n` +
            `Target: ${rec.target?.join(", ") || "N/A"}\n` +
            `Safe: ${rec.safe?.join(", ") || "N/A"}\n\n` +
            `${res.data.response.reasoning || ""}`;
        } else if (res.data.response.evaluation) {
          const evaluation = res.data.response.evaluation;
          responseText =
            `Profile Evaluation:\n\n` +
            `Overall: ${evaluation.overall}\n\n` +
            `Strengths:\n${evaluation.strengths.map((s) => `• ${s}`).join("\n")}\n\n` +
            `Areas to Improve:\n${evaluation.weaknesses.map((w) => `• ${w}`).join("\n")}\n\n` +
            `${res.data.response.message || ""}`;
        } else if (res.data.response.nextSteps) {
          responseText =
            `Your Next Steps:\n\n` +
            `${res.data.response.nextSteps.map((step, i) => `${i + 1}. ${step}`).join("\n")}\n\n` +
            `${res.data.response.message || ""}`;
        } else if (res.data.response.explanation) {
          const exp = res.data.response.explanation;
          responseText =
            `University Risk Categories:\n\n` +
            `Dream Universities:\n${exp.dream}\n\n` +
            `Target Universities:\n${exp.target}\n\n` +
            `Safe Universities:\n${exp.safe}\n\n` +
            `${res.data.response.message || ""}`;
        } else {
          responseText = JSON.stringify(res.data.response, null, 2);
        }
      } else {
        responseText = "I'm here to help you with your university journey.";
      }

      const aiMsg = {
        role: "ai",
        text: responseText,
        recommendations,
        action: res.data.action,
        university: res.data.university
      };

      setChat((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = {
        role: "ai",
        text:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Sorry, I encountered an error. Please try again."
      };
      setChat((prev) => [...prev, errorMsg]);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (!onboardingComplete) {
    return null; // Will redirect
  }

  return (
    <div className="two-column-layout">
      <section className="card">
        <div className="card-header">
          <div className="card-title">AI Counsellor</div>
          <span className="card-tag">Stage-aware · Action-driven</span>
        </div>
        <p className="section-muted">
          Ask anything about your profile, universities, or application plan. The AI counsellor can also take actions
          like shortlisting universities for you.
        </p>

        <div
          style={{
            minHeight: 260,
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            padding: 12,
            overflowY: "auto",
            marginBottom: 12,
            background: "#f9fafb"
          }}
        >
          {chat.length === 0 && (
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Example prompts:{" "}
              <span style={{ color: "#111827" }}>
                \"How strong is my profile?\", \"Recommend target universities in USA\", \"What should I do next?\"
              </span>
            </p>
          )}
          {chat.map((c, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <b>{c.role === "ai" ? "Counsellor" : "You"}:</b>
              <div style={{ marginTop: 4, whiteSpace: "pre-wrap", fontSize: 14 }}>{c.text}</div>
              {c.action === "shortlisted" && c.university && (
                <div
                  style={{
                    marginTop: 5,
                    padding: 8,
                    backgroundColor: "#ecfdf3",
                    borderRadius: 6,
                    color: "#166534",
                    fontSize: 13
                  }}
                >
                  ✓ {c.university} has been added to your shortlist!
                </div>
              )}
              {c.recommendations && (
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  {Array.isArray(c.recommendations.dream) && c.recommendations.dream.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>Dream:</strong>
                      {c.recommendations.dream.map((uni, idx) => (
                        <button
                          key={`dream-${idx}`}
                          type="button"
                          className="secondary-button"
                          style={{ margin: "4px 4px 0 4px", fontSize: 11, padding: "4px 8px" }}
                          onClick={() => shortlistUniversity(uni)}
                        >
                          + {uni}
                        </button>
                      ))}
                    </div>
                  )}

                  {Array.isArray(c.recommendations.target) && c.recommendations.target.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>Target:</strong>
                      {c.recommendations.target.map((uni, idx) => (
                        <button
                          key={`target-${idx}`}
                          type="button"
                          className="secondary-button"
                          style={{ margin: "4px 4px 0 4px", fontSize: 11, padding: "4px 8px" }}
                          onClick={() => shortlistUniversity(uni)}
                        >
                          + {uni}
                        </button>
                      ))}
                    </div>
                  )}

                  {Array.isArray(c.recommendations.safe) && c.recommendations.safe.length > 0 && (
                    <div>
                      <strong>Safe:</strong>
                      {c.recommendations.safe.map((uni, idx) => (
                        <button
                          key={`safe-${idx}`}
                          type="button"
                          className="secondary-button"
                          style={{ margin: "4px 4px 0 4px", fontSize: 11, padding: "4px 8px" }}
                          onClick={() => shortlistUniversity(uni)}
                        >
                          + {uni}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask your counsellor..."
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 999,
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#111827"
            }}
          />
          <button type="button" className="primary-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </section>

      <section className="card">
        <h3 className="section-heading" style={{ marginTop: 0 }}>
          How the counsellor works
        </h3>
        <ul className="list-subtle">
          <li>Understands your profile and current stage before answering.</li>
          <li>Can recommend Dream / Target / Safe universities and explain risks.</li>
          <li>Can take actions like shortlisting universities from within the chat.</li>
          <li>In the application stage, it surfaces your tasks and locked university.</li>
        </ul>
        <button
          type="button"
          className="secondary-button"
          style={{ marginTop: 12 }}
          onClick={() => navigate("/shortlist")}
        >
          View Shortlisted Universities
        </button>
      </section>
    </div>
  );
}

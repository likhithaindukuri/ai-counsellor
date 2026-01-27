import { useState } from "react";
import api from "../services/api";

export default function AICounsellor() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const userId = localStorage.getItem("userId");

  const sendMessage = async () => {
    if (!message) return;

    const userMsg = { role: "user", text: message };
    setChat([...chat, userMsg]);
    setMessage("");

    try {
      const res = await api.post("/ai/chat", {
        userId,
        message
      });

      // Handle response - can be string or object
      let responseText = "";
      if (typeof res.data.response === "string") {
        responseText = res.data.response;
      } else if (typeof res.data.response === "object" && res.data.response !== null) {
        // Format different types of object responses
        if (res.data.response.recommendations) {
          // University recommendations
          const rec = res.data.response.recommendations;
          responseText = `Based on your profile:\n\n` +
            `Dream: ${rec.dream?.join(", ") || "N/A"}\n` +
            `Target: ${rec.target?.join(", ") || "N/A"}\n` +
            `Safe: ${rec.safe?.join(", ") || "N/A"}\n\n` +
            `${res.data.response.reasoning || ""}`;
        } else if (res.data.response.evaluation) {
          // Profile evaluation
          const evaluation = res.data.response.evaluation;
          responseText = `Profile Evaluation:\n\n` +
            `Overall: ${evaluation.overall}\n\n` +
            `Strengths:\n${evaluation.strengths.map(s => `• ${s}`).join("\n")}\n\n` +
            `Areas to Improve:\n${evaluation.weaknesses.map(w => `• ${w}`).join("\n")}\n\n` +
            `${res.data.response.message || ""}`;
        } else if (res.data.response.nextSteps) {
          // Next steps
          responseText = `Your Next Steps:\n\n` +
            `${res.data.response.nextSteps.map((step, i) => `${i + 1}. ${step}`).join("\n")}\n\n` +
            `${res.data.response.message || ""}`;
        } else if (res.data.response.explanation) {
          // Risk explanation
          const exp = res.data.response.explanation;
          responseText = `University Risk Categories:\n\n` +
            `Dream Universities:\n${exp.dream}\n\n` +
            `Target Universities:\n${exp.target}\n\n` +
            `Safe Universities:\n${exp.safe}\n\n` +
            `${res.data.response.message || ""}`;
        } else {
          // Generic object - format as JSON
          responseText = JSON.stringify(res.data.response, null, 2);
        }
      } else {
        responseText = "I'm here to help you with your university journey.";
      }

      const aiMsg = {
        role: "ai",
        text: responseText
      };

      setChat(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = {
        role: "ai",
        text: error.response?.data?.message || error.response?.data?.error || "Sorry, I encountered an error. Please try again."
      };
      setChat(prev => [...prev, errorMsg]);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>AI Counsellor</h1>

      <div style={{ minHeight: 300, border: "1px solid #ccc", padding: 10, overflowY: "auto", marginBottom: 10 }}>
        {chat.length === 0 && (
          <p style={{ color: "#666" }}>Start a conversation with your AI counsellor...</p>
        )}
        {chat.map((c, i) => (
          <div key={i} style={{ marginBottom: 15 }}>
            <b>{c.role === "ai" ? "Counsellor" : "You"}:</b>
            <div style={{ marginTop: 5, whiteSpace: "pre-wrap" }}>{c.text}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: 10 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask your counsellor..."
          style={{ width: "80%", padding: 8 }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 10, padding: 8 }}>Send</button>
      </div>
    </div>
  );
}

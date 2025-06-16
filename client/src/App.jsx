import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Poll from "./Poll";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Header() {
  return (
    <header
      style={{
        background: "#222",
        color: "#fff",
        padding: "16px 0",
        marginBottom: 32,
        textAlign: "center",
        boxShadow: "0 2px 8px #0001",
      }}
    >
      <h2 style={{ margin: 0, fontWeight: 700, letterSpacing: 1 }}>
        QuickPoll
      </h2>
      <a
        href="/"
        style={{
          color: "#fff",
          textDecoration: "underline",
          fontSize: 14,
        }}
      >
        Create New Poll
      </a>
    </header>
  );
}

function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const createPoll = async () => {
    const validOptions = options.filter((o) => o.trim() !== "");
    if (!question.trim() || validOptions.length < 2) {
      alert("Please enter a question and at least two options.");
      return;
    }
    setCreating(true);
    const res = await axios.post(`${API}/polls`, {
      question,
      options: validOptions.map((text) => ({ text })),
    });
    setCreating(false);
    navigate(`/poll/${res.data._id}`);
  };

  return (
    <div
      className="qp-container"
      style={{
        padding: 20,
        maxWidth: 400,
        margin: "auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px #0002",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Create a Poll</h1>
      <input
        placeholder="Question"
        style={{
          width: "100%",
          marginBottom: 12,
          padding: 10,
          fontSize: 16,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 10,
            fontSize: 15,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
          value={opt}
          onChange={(e) => {
            const newOpts = [...options];
            newOpts[i] = e.target.value;
            setOptions(newOpts);
          }}
        />
      ))}
      <button
        onClick={() => setOptions([...options, ""])}
        style={{
          width: "100%",
          marginBottom: 16,
          padding: 10,
          background: "#eee",
          border: "none",
          borderRadius: 6,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        + Add Option
      </button>
      <button
        onClick={createPoll}
        disabled={creating}
        style={{
          width: "100%",
          padding: 12,
          background: "#4caf50",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontWeight: 600,
          fontSize: 16,
          cursor: creating ? "not-allowed" : "pointer",
          opacity: creating ? 0.7 : 1,
        }}
      >
        {creating ? "Creating..." : "Create Poll"}
      </button>
    </div>
  );
}

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<CreatePoll />} />
        <Route path="/poll/:id" element={<Poll />} />
      </Routes>
    </>
  );
}

export default App;

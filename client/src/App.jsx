import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Poll from "./Poll";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
    <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
      <h1>Create a Poll</h1>
      <input
        placeholder="Question"
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
          value={opt}
          onChange={(e) => {
            const newOpts = [...options];
            newOpts[i] = e.target.value;
            setOptions(newOpts);
          }}
        />
      ))}
      <button onClick={() => setOptions([...options, ""])}>+ Add Option</button>
      <br />
      <br />
      <button onClick={createPoll} disabled={creating}>
        {creating ? "Creating..." : "Create Poll"}
      </button>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreatePoll />} />
      <Route path="/poll/:id" element={<Poll />} />
    </Routes>
  );
}

export default App;

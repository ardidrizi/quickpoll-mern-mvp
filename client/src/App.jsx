import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const socket = io(API);

function App() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [poll, setPoll] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const createPoll = async () => {
    const validOptions = options.filter((o) => o.trim() !== "");
    if (!question.trim() || validOptions.length < 2) {
      alert("Please enter a question and at least two options.");
      return;
    }
    const res = await axios.post(`${API}/polls`, {
      question,
      options: validOptions.map((text) => ({ text })),
    });
    setPoll(res.data);
  };

  const vote = async (index) => {
    await axios.post(`${API}/polls/${poll._id}/vote`, { optionIndex: index });
    setVoteSubmitted(true);
  };

  // Listen for real-time poll updates
  useEffect(() => {
    if (!poll) return;

    const handler = (updatedPoll) => {
      setPoll(updatedPoll);
    };

    socket.on(`pollUpdated:${poll._id}`, handler);

    // Clean up listener on unmount or poll change
    return () => {
      socket.off(`pollUpdated:${poll._id}`, handler);
    };
  }, [poll?._id]);

  if (!poll) {
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
        <button onClick={() => setOptions([...options, ""])}>
          + Add Option
        </button>
        <br />
        <br />
        <button onClick={createPoll}>Create Poll</button>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
      <h1>{poll.question}</h1>
      {!voteSubmitted
        ? poll.options.map((opt, i) => (
            <button
              key={i}
              style={{
                display: "block",
                width: "100%",
                marginBottom: 8,
                padding: 8,
              }}
              onClick={() => vote(i)}
            >
              {opt.text}
            </button>
          ))
        : poll.options.map((opt, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              {opt.text} - {opt.votes} vote{opt.votes !== 1 ? "s" : ""}
              <div
                style={{
                  background: "#ddd",
                  width: "100%",
                  height: 10,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    width: totalVotes
                      ? `${(opt.votes / totalVotes) * 100}%`
                      : "0%",
                    background: "#4caf50",
                    height: "100%",
                  }}
                />
              </div>
            </div>
          ))}
    </div>
  );
}

export default App;

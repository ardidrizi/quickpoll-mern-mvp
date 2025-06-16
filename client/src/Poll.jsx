import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const socket = io(API);

export default function Poll() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await axios.get(`${API}/polls/${id}`);
        setPoll(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id]);

  useEffect(() => {
    if (!poll) return;
    const handler = (updatedPoll) => setPoll(updatedPoll);
    socket.on(`pollUpdated:${poll._id}`, handler);
    return () => socket.off(`pollUpdated:${poll._id}`, handler);
  }, [poll?._id]);

  const vote = async (index) => {
    await axios.post(`${API}/polls/${poll._id}/vote`, { optionIndex: index });
    setVoteSubmitted(true);
  };

  if (loading) return <div>Loading...</div>;
  if (!poll) return <div>Poll not found.</div>;

  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
      <h1>{poll.question}</h1>
      {!voteSubmitted
        ? poll.options.map((opt, i) => (
            <button
              key={i}
              style={{ display: "block", width: "100%", marginBottom: 8, padding: 8 }}
              onClick={() => vote(i)}
            >
              {opt.text}
            </button>
          ))
        : poll.options.map((opt, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              {opt.text} - {opt.votes} vote{opt.votes !== 1 ? "s" : ""}
              <div style={{ background: "#ddd", width: "100%", height: 10, marginTop: 4 }}>
                <div
                  style={{
                    width: totalVotes ? `${(opt.votes / totalVotes) * 100}%` : "0%",
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

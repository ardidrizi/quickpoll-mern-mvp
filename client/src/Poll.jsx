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
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading)
    return <div style={{ textAlign: "center", marginTop: 40 }}>Loading...</div>;
  if (!poll)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>Poll not found.</div>
    );

  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 440,
        margin: "32px auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px #0002",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 18 }}>{poll.question}</h1>
      <button
        onClick={handleCopy}
        style={{
          display: "block",
          margin: "0 auto 18px auto",
          padding: "8px 18px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Copy Link
      </button>
      {copied && (
        <div
          style={{ color: "#388e3c", textAlign: "center", marginBottom: 12 }}
        >
          Link copied!
        </div>
      )}
      {!voteSubmitted
        ? poll.options.map((opt, i) => (
            <button
              key={i}
              style={{
                display: "block",
                width: "100%",
                marginBottom: 12,
                padding: 12,
                background: "#f5f5f5",
                border: "1px solid #ccc",
                borderRadius: 6,
                fontSize: 16,
                cursor: "pointer",
                fontWeight: 500,
              }}
              onClick={() => vote(i)}
            >
              {opt.text}
            </button>
          ))
        : poll.options.map((opt, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 500, marginBottom: 2 }}>
                {opt.text} - {opt.votes} vote{opt.votes !== 1 ? "s" : ""}
              </div>
              <div
                style={{
                  background: "#eee",
                  width: "100%",
                  height: 14,
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: totalVotes
                      ? `${(opt.votes / totalVotes) * 100}%`
                      : "0%",
                    background: "#4caf50",
                    height: "100%",
                    borderRadius: 6,
                    transition: "width 0.4s",
                  }}
                />
              </div>
            </div>
          ))}
      {voteSubmitted && (
        <div
          style={{
            textAlign: "center",
            marginTop: 18,
            color: "#388e3c",
            fontWeight: 500,
          }}
        >
          Thank you for voting!
        </div>
      )}
    </div>
  );
}

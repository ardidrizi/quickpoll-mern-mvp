const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/quickpoll";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PollSchema = new mongoose.Schema({
  question: String,
  options: [{ text: String, votes: { type: Number, default: 0 } }],
});

const Poll = mongoose.model("Poll", PollSchema);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Create poll
app.post("/polls", async (req, res) => {
  const poll = new Poll(req.body);
  await poll.save();
  res.json(poll);
});

// Get poll
app.get("/polls/:id", async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  res.json(poll);
});

// Vote and emit update
app.post("/polls/:id/vote", async (req, res) => {
  const { optionIndex } = req.body;
  const poll = await Poll.findById(req.params.id);
  poll.options[optionIndex].votes += 1;
  await poll.save();

  io.emit(`pollUpdated:${poll._id}`, poll); // emit update to clients

  res.json(poll);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

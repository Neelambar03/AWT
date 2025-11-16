// ================================
//  server.js (Fixed for Render)
// ================================

const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// DATABASE CONNECTION (FIXED)
// ================================
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todoApp";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// ================================
// SCHEMAS
// ================================
const User = mongoose.model("User", new mongoose.Schema({
  name: String
}));

const Task = mongoose.model("Task", new mongoose.Schema({
  user: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
}));

// ================================
// SERVE MERGED FRONTEND
// ================================
app.get("/", (req, res) => {
  res.send(`...YOUR HTML REMAINS EXACTLY THE SAME...`);
});

// ================================
// API ROUTES
// ================================
app.get("/api/users", async (req, res) => {
  const users = await User.find().lean();
  res.json(users.map(u => u.name));
});

app.post("/api/users", async (req, res) => {
  const { name } = req.body;
  if (!await User.findOne({ name })) await User.create({ name });
  res.sendStatus(200);
});

app.post("/api/users/rename", async (req, res) => {
  const { oldName, newName } = req.body;
  await User.updateOne({ name: oldName }, { name: newName });
  await Task.updateMany({ user: oldName }, { user: newName });
  res.sendStatus(200);
});

app.post("/api/users/delete", async (req, res) => {
  const { name } = req.body;
  await User.deleteOne({ name });
  await Task.deleteMany({ user: name });
  res.sendStatus(200);
});

app.get("/api/tasks/:user", async (req, res) => {
  res.json(await Task.find({ user: req.params.user }).lean());
});

app.post("/api/tasks", async (req, res) => {
  await Task.create(req.body);
  res.sendStatus(200);
});

app.post("/api/tasks/edit", async (req, res) => {
  await Task.findByIdAndUpdate(req.body.id, { text: req.body.text });
  res.sendStatus(200);
});

app.post("/api/tasks/delete", async (req, res) => {
  await Task.findByIdAndDelete(req.body.id);
  res.sendStatus(200);
});

// ================================
// START SERVER (FIXED)
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 App running on port ${PORT}`)
);

//
// FULL EXPRESS + MONGOOSE USER + TODO APP
// EVERYTHING IN ONE SINGLE FILE (server.js)
// NO .env FILE NEEDED
//

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// ------------------------------------------------------
// 1️⃣ ENVIRONMENT VARIABLES (IN SAME FILE)
// ------------------------------------------------------
const MONGODB_URI = "mongodb://localhost:27017/todoapp";  // your DB
const JWT_SECRET = "supersecretkey123";                   // your JWT key
const PORT = 3000;


// ------------------------------------------------------
// 2️⃣ CONNECT TO MONGODB
// ------------------------------------------------------
async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected:", conn.connection.host);
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
}
connectDB();


// ------------------------------------------------------
// 3️⃣ MIDDLEWARE
// ------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ------------------------------------------------------
// 4️⃣ USER MODEL
// ------------------------------------------------------
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, minlength: 3 },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);


// ------------------------------------------------------
// 5️⃣ AUTH MIDDLEWARE (JWT PROTECTION)
// ------------------------------------------------------
function auth(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}


// ------------------------------------------------------
// 6️⃣ TODO MODEL
// ------------------------------------------------------
const todoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate: Date,
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);


// ------------------------------------------------------
// 7️⃣ AUTH ROUTES (Register + Login)
// ------------------------------------------------------

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered",
      token,
      user: { id: user._id, username, email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ------------------------------------------------------
// 8️⃣ TODO ROUTES (CRUD)
// ------------------------------------------------------

// Get all todos
app.get("/api/todos", auth, async (req, res) => {
  const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json({ count: todos.length, todos });
});

// Get one todo
app.get("/api/todos/:id", auth, async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, user: req.userId });
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
});

// Create todo
app.post("/api/todos", auth, async (req, res) => {
  try {
    const todo = await Todo.create({ ...req.body, user: req.userId });
    res.status(201).json({ message: "Todo created", todo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update todo
app.put("/api/todos/:id", auth, async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true }
  );
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json({ message: "Todo updated", todo });
});

// Delete todo
app.delete("/api/todos/:id", auth, async (req, res) => {
  const todo = await Todo.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json({ message: "Todo deleted", todo });
});


// ------------------------------------------------------
// 9️⃣ DEFAULT HOME ROUTE
// ------------------------------------------------------
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});


// ------------------------------------------------------
// 🔟 START SERVER
// ------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

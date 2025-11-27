// Import packages
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

// Create app instance
const app = express();
const PORT = 3000;

// Middleware for parsing form and JSON body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route 1: Show HTML form
app.get("/", (req, res) => {
  res.send(`
    <h2>User Form</h2>
    <form action="/submit" method="post">
      <label>Username:</label>
      <input type="text" name="username" required /><br/><br/>

      <label>Email:</label>
      <input type="email" name="email" required /><br/><br/>

      <label>Message:</label><br/>
      <textarea name="message"></textarea><br/><br/>

      <button type="submit">Submit</button>
    </form>

    <br/>
    <form action="/save" method="post">
      <button type="submit">Save Data to File</button>
    </form>
  `);
});

// Route 2: Handles form and returns JSON
app.post("/submit", (req, res) => {
  const userData = {
    username: req.body.username,
    email: req.body.email,
    message: req.body.message,
  };
  res.json({ success: true, data: userData });
});

// Route 3: Save data to file system
app.post("/save", (req, res) => {
  const { username, email, message } = req.body;

  if (!username) return res.status(400).json({ error: "Username is required" });

  const userDir = path.join(__dirname, "users", username);
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

  const filePath = path.join(userDir, "data.txt");
  const fileData = { username, email, message, savedAt: new Date().toISOString() };

  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));

  res.json({ success: true, message: `Data saved at ${filePath}` });
});

// Run server
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

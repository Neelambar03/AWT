// server-step3.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route 1: Show form
app.get('/', (req, res) => {
  res.send(`
    <h2>User Form</h2>
    <form action="/save" method="post">
      <label>Username:</label>
      <input type="text" name="username" required /><br/><br/>
      
      <label>Email:</label>
      <input type="email" name="email" required /><br/><br/>
      
      <label>Message:</label><br/>
      <textarea name="message"></textarea><br/><br/>
      
      <button type="submit">Save</button>
    </form>
  `);
});

// Route 3: Save JSON into text file by username
app.post('/save', (req, res) => {
  const { username, email, message } = req.body;
  if (!username) return res.status(400).send('Username is required!');

  // Create user-specific folder
  const userDir = path.join(__dirname, 'users', username);
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

  // Save data
  const filePath = path.join(userDir, 'data.txt');
  const userData = { username, email, message, savedAt: new Date().toISOString() };
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));

  res.send(`Data saved to ${filePath}`);
});

app.listen(PORT, () => console.log(`Step 3 running on http://localhost:${PORT}`));

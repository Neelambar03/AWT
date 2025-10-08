// server-step2.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route 1: Show form
app.get('/', (req, res) => {
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
  `);
});

// Route 2: Handle form and return JSON
app.post('/submit', (req, res) => {
  const userData = {
    username: req.body.username,
    email: req.body.email,
    message: req.body.message
  };
  res.json({ success: true, data: userData });
});

app.listen(PORT, () => console.log(`Step 2 running on http://localhost:${PORT}`));

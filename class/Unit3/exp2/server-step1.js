// server-step1.js
const express = require('express');
const app = express();
const PORT = 3000;

// Route 1: Show HTML form
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

app.listen(PORT, () => console.log(`Step 1 running on http://localhost:${PORT}`));

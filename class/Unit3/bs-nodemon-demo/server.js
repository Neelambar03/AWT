// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Serve static files from public/
app.use(express.static('public'));

// Example API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

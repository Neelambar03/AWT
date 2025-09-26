// app.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const math = require('./math');
const emitter = require('./event');

const app = express();
const PORT = 3000;

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware to parse JSON
app.use(express.json());

// 🔹 Console logs
console.log("✅ App is starting...");
console.warn("⚠️ This is a warning message");
console.error("❌ This is an error message");

// 🔹 Buffer usage
const buf = Buffer.from('Hello');
console.log("📦 Buffer content:", buf);
console.log("🧵 Buffer toString:", buf.toString());

// 🔹 Emit custom event
emitter.emit('data');

// 🔹 Timer
console.time("Timer Example");
for (let i = 0; i < 1e6; i++) {} // Dummy loop
console.timeEnd("Timer Example");

// 🔹 Home Route with EJS
app.get('/', (req, res) => {
  res.render('index', {
    name: 'Prateek',
    items: ['Node.js', 'Express', 'EJS']
  });
});

// 🔹 Read File Route
app.get('/read-file', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'file.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("File Read Error:", err);
      return res.status(500).send('Internal Server Error');
    }
    res.send(`<pre>${data}</pre>`);
  });
});

// 🔹 Add numbers using query params
// Example: /add?a=5&b=10
app.get('/add', (req, res) => {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);

  if (isNaN(a) || isNaN(b)) {
    return res.status(400).send('Invalid numbers provided');
  }

  const sum = math.add(a, b);
  res.send(`Result: ${a} + ${b} = ${sum}`);
});

// 🔹 Handle POST with params and body
app.post('/user/:id', (req, res) => {
  const { id } = req.params;
  console.log('Headers:', req.headers);
  console.log('Query Params:', req.query);
  console.log('Body:', req.body);

  res.json({
    userId: id,
    query: req.query,
    body: req.body,
  });
});

// 🔹 Various response types
app.get('/text', (req, res) => res.send('Plain Text Response'));

app.get('/html', (req, res) => res.send('<h2>Hello from HTML response</h2>'));

app.get('/json', (req, res) => res.json({ message: 'JSON Response' }));

app.get('/notfound', (req, res) => res.status(404).send('Page Not Found'));

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

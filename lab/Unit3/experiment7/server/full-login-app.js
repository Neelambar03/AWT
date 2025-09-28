const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }  // 10 minutes session
}));

const users = []; // in-memory user store

// Middleware to protect routes
function authMiddleware(req, res, next) {
  if (req.session.user) next();
  else res.redirect('/login');
}

// Routes

// Register page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/register.html'));
});

// Register POST
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.send('Username and password required');
  }
  if (users.find(u => u.username === username)) {
    return res.send('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.redirect('/login');
});

// Login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

// Login POST
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.send('Invalid username or password');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.send('Invalid username or password');
  }
  req.session.user = { username };
  res.cookie('theme', 'dark', { maxAge: 900000, httpOnly: true }); // example cookie
  res.redirect('/dashboard');
});

// Dashboard (protected)
app.get('/dashboard', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/dashboard.html'));
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// To-Do List APIs (session-based)

app.get('/api/todos', authMiddleware, (req, res) => {
  if (!req.session.todos) req.session.todos = [];
  res.json(req.session.todos);
});

app.post('/api/todos', authMiddleware, (req, res) => {
  const { todoItem } = req.body;
  if (!req.session.todos) req.session.todos = [];
  if (todoItem) req.session.todos.push(todoItem);
  res.redirect('/dashboard');
});

app.post('/api/todos/delete', authMiddleware, (req, res) => {
  const { index } = req.body;
  if (req.session.todos && index !== undefined) {
    req.session.todos = req.session.todos.filter((_, i) => i != index);
  }
  res.redirect('/dashboard');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

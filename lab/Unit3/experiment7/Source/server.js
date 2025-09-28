const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // To parse form data

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 } // 1 minute session expiry
}));

// Middleware to protect dashboard
function authMiddleware(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Home redirects to dashboard or login
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// Login page
app.get('/login', (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form method="POST" action="/login">
      <input type="text" name="username" placeholder="Enter username" required />
      <button type="submit">Login</button>
    </form>
  `);
});

// Handle login
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    req.session.user = { username };
    res.cookie('theme', 'dark', { maxAge: 900000, httpOnly: true });
    res.redirect('/dashboard');
  } else {
    res.send('Please enter a username');
  }
});

// Dashboard - protected
app.get('/dashboard', authMiddleware, (req, res) => {
  res.send(`
    <h2>Dashboard</h2>
    <p>Welcome, ${req.session.user.username}!</p>
    <a href="/logout">Logout</a>
  `);
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid'); // Clear session cookie
    res.redirect('/login');
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

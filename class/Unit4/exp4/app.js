const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();

// --- Middleware ---
app.use(cookieParser());
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 } // 1 minute
}));

// --- Cookie Routes ---
app.get('/setcookie', (req, res) => {
  res.cookie('username', 'JohnDoe', {
    maxAge: 3600000, // 1 hour
    httpOnly: true,
    secure: false // true only when using HTTPS
  });
  res.send('Cookie has been set!');
});

app.get('/getcookie', (req, res) => {
  const user = req.cookies.username;
  if (user) res.send('Welcome back, ' + user);
  else res.send('No cookie found.');
});

app.get('/deletecookie', (req, res) => {
  res.clearCookie('username');
  res.send('Cookie deleted successfully!');
});

// --- Session Routes ---
app.get('/login', (req, res) => {
  req.session.username = 'JohnDoe';
  res.send('Session started for ' + req.session.username);
});

app.get('/profile', (req, res) => {
  if (req.session.username) res.send('Welcome ' + req.session.username);
  else res.send('Please log in first.');
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send('Error destroying session');
    res.send('Session destroyed successfully');
  });
});

// --- Query String Route ---
app.get('/welcome', (req, res) => {
  const user = req.query.user;
  const role = req.query.role;
  res.send(`Welcome ${user}, your role is ${role}`);
});

// --- Root Route ---
app.get('/', (req, res) => {
  res.send('Welcome! Try /login, /setcookie, or /welcome?user=Alice&role=admin');
});

// --- Start Server ---
app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
 //node app.js

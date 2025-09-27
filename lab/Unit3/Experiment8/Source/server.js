const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 1000 } // 1 minute
}));

// Health check route for Render
app.get('/healthz', (req, res) => res.send('OK'));

// Home route
app.get('/', (req, res) => {
  if (req.session.username) {
    res.send(`
      <h2>Welcome back, ${req.session.username}!</h2>
      <p><a href="/logout">Logout</a></p>
    `);
  } else {
    res.send(`
      <h2>Login</h2>
      <form action="/login" method="post">
        <input type="text" name="username" placeholder="Enter username" required/>
        <button type="submit">Login</button>
      </form>
    `);
  }
});

// Login
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username && username.trim() !== '') {
    req.session.username = username.trim();
    res.cookie('theme', 'dark', { maxAge: 15 * 60 * 1000, httpOnly: true });
    res.redirect('/');
  } else {
    res.send('Username is required. <a href="/">Try again</a>');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

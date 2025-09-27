// Import required modules
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

// Use Render's assigned port or default to 3000 locally
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'mysecretkey',          // Change this in production
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 1000 }   // 1 minute
}));

// Routes
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

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid'); // clear session cookie
    res.redirect('/');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

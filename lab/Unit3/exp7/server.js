const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  if (req.session.username) {
    res.send(`Hello ${req.session.username}! <a href="/logout">Logout</a>`);
  } else {
    res.send(`
      <form action="/login" method="post">
        <input type="text" name="username" placeholder="Enter username" required />
        <button type="submit">Login</button>
      </form>
    `);
  }
});

app.post('/login', (req, res) => {
  const { username } = req.body;
  req.session.username = username;
  res.cookie('theme', 'dark'); 
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

app.listen(PORT, () => console.log(`Main server → http://localhost:${PORT}`));

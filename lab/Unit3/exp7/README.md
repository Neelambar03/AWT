cat > README.md <<'EOF'
# exp7 – Sessions & Cookies in Node.js

This project shows how to use **sessions** and **cookies** with Node.js + Express.

---

## 🚀 How to Run

Step-by-Step: exp7 – Full Project

Step 1: Create project folder
cd Desktop\Neelambar\GITHUB\AWT\lab\Unit3
mkdir exp7
cd exp7

Step 2: Initialize Node.js
npm init -y

Step 3: Install dependencies
npm install express express-session cookie-parser

Step 4: Create cookie-example.js
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

app.use(cookieParser());

// Home route
app.get('/', (req, res) => {
    res.send(`
        <h2>Cookie Demo</h2>
        <p><a href="/set">Set Cookie</a></p>
        <p><a href="/get">Get Cookie</a></p>
        <p><a href="/delete">Delete Cookie</a></p>
    `);
});

// Set a cookie
app.get('/set', (req, res) => {
    res.cookie('username', 'JohnDoe', { maxAge: 60000 });
    res.send("Cookie has been set. <a href='/get'>Check cookie</a>");
});

// Get a cookie
app.get('/get', (req, res) => {
    const user = req.cookies.username;
    if (user) {
        res.send(`Cookie value: ${user} <br><a href='/delete'>Delete Cookie</a>`);
    } else {
        res.send("No cookie found. <a href='/set'>Set cookie first</a>");
    }
});

// Delete a cookie
app.get('/delete', (req, res) => {
    res.clearCookie('username');
    res.send("Cookie deleted. <a href='/'>Back to Home</a>");
});

app.listen(PORT, () => console.log(`Cookie demo → http://localhost:${PORT}`));

Step 5: Create session-example.js
const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Session middleware
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Home route
app.get('/', (req, res) => {
    if (req.session.views) {
        req.session.views++;
        res.send(`You visited this page ${req.session.views} times. <br><a href="/destroy">Destroy Session</a>`);
    } else {
        req.session.views = 1;
        res.send("Welcome! Refresh the page to count visits.");
    }
});

// Destroy session
app.get('/destroy', (req, res) => {
    req.session.destroy(() => {
        res.send("Session destroyed. <a href='/'>Back to Home</a>");
    });
});

app.listen(PORT, () => console.log(`Session demo → http://localhost:${PORT}`));

Step 6: Create server.js (Login + Session + Cookie Demo)
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Home route
app.get('/', (req, res) => {
    if (req.session.username) {
        res.send(`Hello ${req.session.username}! <a href="/logout">Logout</a>`);
    } else {
        res.send(`
            <h2>Login Demo</h2>
            <form action="/login" method="post">
                <input type="text" name="username" placeholder="Enter username" required />
                <button type="submit">Login</button>
            </form>
        `);
    }
});

// Login route
app.post('/login', (req, res) => {
    const { username } = req.body;
    req.session.username = username;
    res.cookie('theme', 'dark'); // example cookie
    res.redirect('/');
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

app.listen(PORT, () => console.log(`Login demo → http://localhost:${PORT}`));

Step 7: Update package.json scripts
"scripts": {
    "cookie": "node cookie-example.js",
    "session": "node session-example.js",
    "start": "node server.js"
}

Step 8: Run the demos
Cookie demo
npm run cookie


Open → http://localhost:3000

Session demo
npm run session


Open → http://localhost:3000

Login demo
npm start


Open → http://localhost:3000

Step 9: Push to GitHub
git init
git add .
git commit -m "Initial commit: exp7 full demo"
git branch -M main
git remote add origin https://github.com/your-username/exp7.git
git push -u origin main
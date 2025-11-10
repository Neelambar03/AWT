ChatGPT said:

Got it ✅ — you want a fully working, step-by-step Node.js project that demonstrates Sessions, Cookies, and Query Strings in Express — complete with terminal commands, setup steps, and runnable code examples.

Let’s build this from scratch 👇

🧠 Overview

You’ll build a small Express app showing:

Session management using express-session

Cookie handling using cookie-parser

Query string usage via URLs

🪜 Step-by-Step Implementation
🧩 Step 1: Create a New Project

Open your terminal and run:

# Create a new folder
mkdir session-control-demo
cd session-control-demo

# Initialize a new Node.js project
npm init -y

📦 Step 2: Install Required Packages
npm install express express-session cookie-parser


This installs:

express → web framework

express-session → session middleware

cookie-parser → cookie handling

🗂 Step 3: Create Your App File

Create a file named app.js:

touch app.js

🧱 Step 4: Set Up Basic Express Server
// app.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to Session Control Demo!');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

▶️ Run:
node app.js


Visit: http://localhost:3000

You should see “Welcome to Session Control Demo!”

🧮 Step 5: Add Session Handling

Now, we’ll add session support.

Edit app.js:

const express = require('express');
const session = require('express-session');
const app = express();

// --- Middleware: Session Setup ---
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 } // 1 minute
}));

// --- Routes ---

// Start session
app.get('/login', (req, res) => {
  req.session.username = 'JohnDoe';
  res.send('Session started for ' + req.session.username);
});

// Access session data
app.get('/profile', (req, res) => {
  if (req.session.username) {
    res.send('Welcome back, ' + req.session.username);
  } else {
    res.send('Please log in first.');
  }
});

// Destroy session
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send('Error ending session');
    res.send('Session ended successfully.');
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

▶️ Run:
node app.js


Test in browser:

Visit http://localhost:3000/login

Then http://localhost:3000/profile

Then http://localhost:3000/logout

✅ You’ve created working sessions in Express!

🍪 Step 6: Add Cookie Handling

Now we’ll add cookie management with cookie-parser.

Update app.js to include cookie examples:

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
  cookie: { maxAge: 60000 }
}));

// --- Cookie Routes ---
app.get('/setcookie', (req, res) => {
  res.cookie('username', 'JohnDoe', {
    maxAge: 3600000, // 1 hour
    httpOnly: true,
    secure: false // set true if using HTTPS
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

// --- Root Route ---
app.get('/', (req, res) => {
  res.send('Welcome! Try /login, /setcookie, /welcome?user=Alice');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

▶️ Run:
node app.js


Test in browser:

/setcookie

/getcookie

/deletecookie

✅ Cookies work fine now!

🔗 Step 7: Add Query String Example

Add this route to the same app.js:

app.get('/welcome', (req, res) => {
  const user = req.query.user;
  const role = req.query.role;
  res.send(`Welcome ${user}, your role is ${role}`);
});

▶️ Test:

Visit:

http://localhost:3000/welcome?user=Alice&role=admin


✅ Output:

Welcome Alice, your role is admin

⚖️ Step 8: Comparison Summary
Feature	Session	Cookie	Query String
Storage	Server	Client (Browser)	URL
Security	High	Medium	Low
Data Limit	Large	~4KB	Small
Lifetime	Until logout or expiry	Until expiry	One request
Visibility	Hidden	Visible to user	Visible in URL
Best for	Login data, cart	Preferences, tokens	Filters, search
✅ Step 9: Final Run

Start your app:

node app.js


Visit:

Sessions: /login, /profile, /logout

Cookies: /setcookie, /getcookie, /deletecookie

Query String: /welcome?user=Alice&role=admin

Everything will run from one file — app.js.

Would you like me to provide a folder structure (e.g., separating session.js, cookies.js, and query.js into modules) so it’s cleaner for a class presentation or project submission?
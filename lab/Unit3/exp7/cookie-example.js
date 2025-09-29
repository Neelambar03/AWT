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
    res.cookie('username', 'JohnDoe', { maxAge: 60000 }); // valid for 1 minute
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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

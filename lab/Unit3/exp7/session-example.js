const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    if (req.session.views) {
        req.session.views++;
        res.send(`You visited this page ${req.session.views} times.`);
    } else {
        req.session.views = 1;
        res.send("Welcome! Refresh the page to increase the count.");
    }
});

app.get('/destroy', (req, res) => {
    req.session.destroy(() => {
        res.send("Session destroyed. Refresh to start again.");
    });
});

app.listen(3000, () => console.log("Session demo → http://localhost:3000"));

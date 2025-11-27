const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

app.get("/", (req, res) => {
  if (!req.session.count) {
    req.session.count = 1;
  } else {
    req.session.count++;
  }
  res.send(`
    <h1>Welcome to Express Session Demo</h1>
    <h3>Page View Count: ${req.session.count}</h3>
    <a href="/logout">Clear Session</a>
  `);
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send("<h1>Session Cleared</h1><a href='/'>Back</a>");
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

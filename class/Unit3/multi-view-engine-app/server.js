const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set views folder
app.set('views', path.join(__dirname, 'views'));

// Register engines
app.engine('ejs', require('ejs').renderFile);
app.engine('pug', require('pug').__express);

// Routes
app.get('/', (req, res) => {
  res.send('<h1>Server is working! Try /ejs or /pug</h1>');
});

app.get('/ejs', (req, res) => {
  res.render('ejs/example.ejs', {
    name: 'Neelambar',
    users: ['Raj', 'Sumit', 'Ali', 'Sneha']
  });
});

app.get('/pug', (req, res) => {
  res.render('pug/example.pug', {
    name: 'Neelambar',
    users: ['Raj', 'Sumit', 'Ali', 'Sneha']
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const Student = require('./models/studentModel');
const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');

// ===== Session Setup =====
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 } // 1 minute
}));

// ===== MongoDB Connection =====
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/fullstackDB');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
};
connectDB();

// ===== Routes =====

// Home - display students
app.get('/', async (req, res) => {
  const students = await Student.find();
  res.render('index', { username: req.session.username || 'Guest', students });
});

// Login - start session
app.get('/login', (req, res) => {
  req.session.username = 'JohnDoe';
  res.send('Session started for JohnDoe');
});

// Logout - destroy session
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send('Error destroying session');
    res.send('Session destroyed successfully');
  });
});

// Set cookie
app.get('/setcookie', (req, res) => {
  res.cookie('username', 'JohnDoe', { maxAge: 3600000, httpOnly: true });
  res.send('Cookie set!');
});

// Read cookie
app.get('/getcookie', (req, res) => {
  const user = req.cookies.username;
  res.send(user ? `Welcome back, ${user}` : 'No cookie found');
});

// Delete cookie
app.get('/deletecookie', (req, res) => {
  res.clearCookie('username');
  res.send('Cookie deleted');
});

// CRUD Operations

// Create student
app.post('/students', async (req, res) => {
  const { name, age, course, marks } = req.body;
  const newStudent = new Student({ name, age, course, marks });
  await newStudent.save();
  res.send('Student added!');
});

// Read all students
app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Update student
app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  await Student.findByIdAndUpdate(id, req.body);
  res.send('Student updated!');
});

// Delete student
app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  await Student.findByIdAndDelete(id);
  res.send('Student deleted!');
});

// ===== Start Server =====
app.listen(3000, () => console.log('Server running at http://localhost:3000'));

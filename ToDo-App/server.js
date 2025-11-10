// server.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// ============================================
// STEP 1: MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// STEP 2: CONNECT TO MONGODB
// ============================================

const DB_URL = 'mongodb://localhost:27017/todoDB';

mongoose.connect(DB_URL)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ============================================
// STEP 3: DEFINE TASK SCHEMA
// ============================================

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ============================================
// STEP 4: CREATE MODEL
// ============================================

const Task = mongoose.model('Task', taskSchema);

// ============================================
// STEP 5: ROUTES
// ============================================

// HOME PAGE
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>To-Do App</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        .container { background: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 8px; }
        h1, h2 { color: #333; }
        input, textarea { width: 100%; padding: 10px; margin: 8px 0; box-sizing: border-box; }
        button { background: #28a745; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #218838; }
        .error { color: red; }
        .success { color: green; }
        a { text-decoration: none; color: #007bff; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>📝 To-Do Application</h1>

      <div class="container">
        <h2>Add a New Task</h2>
        <form action="/add-task" method="POST">
          <input type="text" name="title" placeholder="Task title" required>
          <textarea name="description" placeholder="Task description"></textarea>
          <button type="submit">Add Task</button>
        </form>
      </div>

      <div class="container">
        <h2>View All Tasks</h2>
        <form action="/tasks" method="GET">
          <button type="submit">Show All Tasks</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// ADD TASK
app.post('/add-task', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({ title, description });
    await newTask.save();

    res.send(`
      <h2 class="success">✅ Task added successfully!</h2>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Description:</strong> ${description}</p>
      <a href="/">Go back to home</a>
    `);
  } catch (error) {
    res.send(`
      <h2 class="error">❌ Error: ${error.message}</h2>
      <a href="/">Go back</a>
    `);
  }
});

// VIEW ALL TASKS
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();

    if (tasks.length === 0) {
      return res.send(`
        <h2>No tasks found.</h2>
        <a href="/">Go back to home</a>
      `);
    }

    let taskList = `
      <h2>📋 All Tasks</h2>
      <ul>
    `;

    tasks.forEach(task => {
      taskList += `
        <li>
          <strong>${task.title}</strong> - ${task.status.toUpperCase()} <br>
          ${task.description ? `<em>${task.description}</em><br>` : ''}
          Created on: ${task.createdAt.toDateString()} <br>
          <form action="/update-task/${task._id}" method="POST" style="display:inline;">
            <input type="hidden" name="status" value="${task.status === 'pending' ? 'completed' : 'pending'}">
            <button type="submit">${task.status === 'pending' ? 'Mark Completed' : 'Mark Pending'}</button>
          </form>
          <form action="/delete-task/${task._id}" method="POST" style="display:inline;">
            <button type="submit" style="background:#dc3545;">Delete</button>
          </form>
        </li>
        <hr>
      `;
    });

    taskList += '</ul><a href="/">Go back to home</a>';
    res.send(taskList);

  } catch (error) {
    res.send(`
      <h2 class="error">❌ Error: ${error.message}</h2>
      <a href="/">Go back</a>
    `);
  }
});

// UPDATE TASK STATUS
app.post('/update-task/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Task.findByIdAndUpdate(id, { status });
    res.redirect('/tasks');
  } catch (error) {
    res.send(`
      <h2 class="error">❌ Error updating task: ${error.message}</h2>
      <a href="/">Go back</a>
    `);
  }
});

// DELETE TASK
app.post('/delete-task/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.redirect('/tasks');
  } catch (error) {
    res.send(`
      <h2 class="error">❌ Error deleting task: ${error.message}</h2>
      <a href="/">Go back</a>
    `);
  }
});

// ============================================
// START SERVER
// ============================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

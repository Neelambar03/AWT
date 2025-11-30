// ================================
// server.js (Refined Angular + Express + MongoDB To-Do App)
// ================================

const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// DATABASE
// ================================
mongoose.connect("mongodb://localhost:27017/todoApp")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// ================================
// SCHEMAS
// ================================
const User = mongoose.model("User", new mongoose.Schema({
  name: { type: String, unique: true, required: true }
}));

const Task = mongoose.model("Task", new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}));

// ================================
// SERVE FRONTEND
// ================================
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en" ng-app="todoApp">
<head>
<meta charset="UTF-8">
<title>AngularJS To-Do App</title>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
<style>
/* === Keyframes === */
@keyframes fadeOutOnly {
  0% { opacity: 1; }
  100% { opacity: 0.3; }
}

/* --- Floating Info Boxes --- */
#datetime {
  position: fixed;
  top: 20px;
  right: 20px;
  font-size: 0.9rem;
  color: #ccc;
  font-style: italic;
  background-color: rgba(30,30,30,0.85);
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.4);
  border: 1px solid #444;
  backdrop-filter: blur(4px);
  z-index: 1000;
  animation: fadeOutOnly 3s ease-in-out 2s forwards;
  transition: background-color 0.4s ease-in-out, color 0.4s ease-in-out, transform 0.3s ease;
}

#datetime:hover {
  background-color: rgba(50,50,50,0.95);
  color: #a7d4ff;
  transform: scale(1.04);
}

/* --- Root Variables --- */
:root {
  --paper-width: 420px;
  --paper-pad: 2rem;
  --ink: #1a1a1a;
  --muted: #666;
  --line: #ddd;
  --accent: #0d47a1;
  --bg: #f9f9fa;
  --shadow-soft: 0 12px 32px rgba(0,0,0,0.05);
  --btn-radius: 6px;
}

/* === Base === */
html, body {
  height: 100%;
  margin: 0;
  background: var(--bg);
  font-family: "Segoe UI", sans-serif;
  color: var(--ink);
  scroll-behavior: smooth;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.4s ease-in-out, color 0.3s ease-in-out;
}

/* === Paper Container === */
.container {
  max-width: var(--paper-width);
  width: 100%;
  background: #fff;
  padding: var(--paper-pad);
  box-shadow: var(--shadow-soft);
  border-radius: 12px;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
}

.container:hover {
  box-shadow: 0 16px 40px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

/* === Headers and Inputs === */
h2 {
  text-align: center;
  color: var(--accent);
  margin-bottom: 12px;
}

input, select {
  width: 85%;
  padding: 10px;
  margin: 6px 0;
  border-radius: var(--btn-radius);
  border: 1px solid #ccc;
  transition: border-color 0.3s ease-in-out;
}

input:focus, select:focus {
  border-color: var(--accent);
  outline: none;
}

/* === Buttons === */
button {
  border: none;
  border-radius: var(--btn-radius);
  padding: 8px 12px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

button.add { background: #28a745; }
button.edit { background: #007bff; }
button.delete { background: #e74c3c; }
button.logout { background: #f39c12; width: 100%; margin-top: 10px; }

/* === Task List === */
ul {
  list-style: none;
  padding: 0;
  margin-top: 15px;
  max-height: 250px;
  overflow-y: auto;
}

li {
  background: #f4f4f4;
  padding: 10px;
  border-radius: var(--btn-radius);
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: background-color 0.3s ease-in-out, transform 0.2s ease;
}

li:hover {
  background-color: #fcfcfc;
}

.task-info { text-align: left; flex: 1; }
.time {
  color: var(--muted);
  font-size: 12px;
  margin-top: 4px;
}

.no-items {
  color: var(--muted);
  font-style: italic;
  text-align: center;
}

/* === Responsive === */
@media (max-width: 480px) {
  .container {
    padding: 1.4rem;
  }
  input, select {
    width: 100%;
  }
}
</style>
</head>
<body ng-controller="MainController">

<div id="datetime"></div>

<!-- LOGIN SCREEN -->
<div class="container" ng-show="!currentUser">
  <h2>Welcome</h2>
  <select ng-model="selectedUser" ng-options="u for u in users">
    <option value="">-- Choose user --</option>
  </select>
  <input ng-model="newUser" placeholder="New user name">
  <button class="add" ng-click="login()">Login</button>
  <hr>
  <h3>Manage Users</h3>
  <ul>
    <li ng-repeat="u in users">
      {{ u }}
      <span>
        <button class="edit" ng-click="renameUser(u)">Rename</button>
        <button class="delete" ng-click="deleteUser(u)">Delete</button>
      </span>
    </li>
  </ul>
</div>

<!-- MAIN APP -->
<div class="container" ng-show="currentUser">
  <h2>Hello {{ currentUser }}</h2>
  <input ng-model="newTask" placeholder="New task...">
  <button class="add" ng-click="addTask()">Add</button>
  <ul>
    <li ng-repeat="t in tasks">
      <div class="task-info">
        <strong>{{ t.text }}</strong><br>
        <small class="time">{{ t.createdAt | date:'medium' }}</small>
      </div>
      <span>
        <button class="edit" ng-click="editTask(t)">Edit</button>
        <button class="delete" ng-click="removeTask(t)">Delete</button>
      </span>
    </li>
    <li ng-if="tasks.length === 0" class="no-items">No tasks yet.</li>
  </ul>
  <button class="logout" ng-click="logout()">Logout</button>
</div>

<script>
const app = angular.module("todoApp", []);

app.controller("MainController", function($scope, $http) {
  $scope.users = [];
  $scope.tasks = [];
  $scope.currentUser = null;

  function loadUsers() {
    $http.get("/api/users").then(res => $scope.users = res.data);
  }

  function loadTasks() {
    if (!$scope.currentUser) return;
    $http.get("/api/tasks/" + $scope.currentUser).then(res => $scope.tasks = res.data);
  }

  loadUsers();

  $scope.login = function() {
    const name = $scope.selectedUser || $scope.newUser;
    if (!name) return alert("Enter username");
    $http.post("/api/users", { name }).then(() => {
      $scope.currentUser = name;
      $scope.newUser = "";
      loadTasks();
      loadUsers();
    });
  };

  $scope.logout = function() {
    $scope.currentUser = null;
    $scope.tasks = [];
  };

  $scope.addTask = function() {
    if (!$scope.newTask) return;
    $http.post("/api/tasks", { user: $scope.currentUser, text: $scope.newTask })
      .then(() => { $scope.newTask = ""; loadTasks(); });
  };

  $scope.editTask = function(task) {
    const updated = prompt("Edit task:", task.text);
    if (!updated) return;
    $http.post("/api/tasks/edit", { id: task._id, text: updated }).then(loadTasks);
  };

  $scope.removeTask = function(task) {
    $http.post("/api/tasks/delete", { id: task._id }).then(loadTasks);
  };

  $scope.renameUser = function(oldName) {
    const newName = prompt("New name:", oldName);
    if (!newName) return;
    $http.post("/api/users/rename", { oldName, newName }).then(() => {
      if ($scope.currentUser === oldName) $scope.currentUser = newName;
      loadUsers();
      loadTasks();
    });
  };

  $scope.deleteUser = function(name) {
    if (!confirm("Delete user?")) return;
    $http.post("/api/users/delete", { name }).then(() => {
      if ($scope.currentUser === name) $scope.logout();
      loadUsers();
    });
  };
});

// Live clock + greeting
function updateDateTime() {
  const now = new Date();
  const dateStr = now.toDateString();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2,'0');
  const seconds = now.getSeconds().toString().padStart(2,'0');
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const timeStr = hours + ":" + minutes + ":" + seconds + " " + ampm;

  let greeting = "";
  if (now.getHours() < 12) greeting = "Good Morning!";
  else if (now.getHours() < 18) greeting = "Good Afternoon!";
  else if (now.getHours() < 21) greeting = "Good Evening!";
  else greeting = "Good Night!";

  document.getElementById("datetime").innerHTML = \`\${dateStr} | \${timeStr}<br><span>\${greeting}</span>\`;
}
setInterval(updateDateTime, 1000);
updateDateTime();
</script>

</body>
</html>`);
});

// ================================
// BACKEND API ROUTES
// ================================

// USERS
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().lean();
    res.json(users.map(u => u.name));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send("Name required");
    if (!await User.findOne({ name })) await User.create({ name });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/users/rename", async (req, res) => {
  try {
    const { oldName, newName } = req.body;
    if (!oldName || !newName) return res.status(400).send("Invalid names");
    await User.updateOne({ name: oldName }, { name: newName });
    await Task.updateMany({ user: oldName }, { user: newName });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/users/delete", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send("Name required");
    await User.deleteOne({ name });
    await Task.deleteMany({ user: name });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// TASKS
app.get("/api/tasks/:user", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.params.user }).lean();
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { user, text } = req.body;
    if (!user || !text) return res.status(400).send("Invalid task");
    await Task.create({ user, text });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/tasks/edit", async (req, res) => {
  try {
    const { id, text } = req.body;
    if (!id || !text) return res.status(400).send("Invalid edit");
    await Task.findByIdAndUpdate(id, { text });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/tasks/delete", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).send("Invalid id");
    await Task.findByIdAndDelete(id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ================================
// START SERVER
// ================================
app.listen(3000, () => console.log("🚀 App running at http://localhost:3000"));

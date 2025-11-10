Perfect 👍 Let’s separate **all code and terminal commands step-by-step** (as if you’re following the full *Express + Mongoose User Management Tutorial*).

---

## 🧭 Step-by-Step Setup & Code Guide

### **STEP 1 – Create Project Folder**

```bash
# Create a new directory
mkdir mongoose-demo

# Navigate into the project folder
cd mongoose-demo
```

---

### **STEP 2 – Initialize Node Project**

```bash
npm init -y
```

This creates a **package.json** file with default settings.

---

### **STEP 3 – Install Dependencies**

```bash
npm install express mongoose
```

Installs **Express (server)** and **Mongoose (MongoDB ODM)**.

---

### **STEP 4 – Create Main Server File**

Create a file named **server.js** in your project folder:

```bash
touch server.js
```

---

## ⚙️ STEP-BY-STEP CODE INSIDE `server.js`

---

### **STEP 5 – Import Required Modules & Setup App**

```js
// server.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

---

### **STEP 6 – Connect to MongoDB**

You can connect either **locally** or to **MongoDB Atlas**.

```js
// ============================================
// STEP 1: CONNECT TO MONGODB
// ============================================

// Option A: Local MongoDB
const DB_URL = 'mongodb://localhost:27017/userdb';

// Option B: MongoDB Atlas (replace with your credentials)
// const DB_URL = 'mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/userdb?retryWrites=true&w=majority';

mongoose.connect(DB_URL)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
```

---

### **STEP 7 – Define Mongoose Schema**

```js
// ============================================
// STEP 2: DEFINE THE USER SCHEMA
// ============================================

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt:{ type: Date, default: Date.now }
});
```

---

### **STEP 8 – Create Model**

```js
// ============================================
// STEP 3: CREATE THE MODEL
// ============================================

const User = mongoose.model('User', userSchema);
```

---

### **STEP 9 – Create Routes**

#### **Home Route (HTML Interface)**

```js
// ============================================
// STEP 4: CREATE ROUTES
// ============================================

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>User Management System</title>
      <style>
        body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
        .container { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; cursor: pointer; }
        button:hover { background: #0056b3; }
        .success { color: green; } .error { color: red; }
      </style>
    </head>
    <body>
      <h1>User Management System</h1>

      <div class="container">
        <h2>Register New User</h2>
        <form action="/signup" method="POST">
          <input type="text" name="username" placeholder="Username" required>
          <input type="email" name="email" placeholder="Email" required>
          <input type="password" name="password" placeholder="Password" required>
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div class="container">
        <h2>Login</h2>
        <form action="/login" method="POST">
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="password" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
      </div>

      <div class="container">
        <h2>View All Users</h2>
        <form action="/users" method="GET">
          <button type="submit">Show All Registered Users</button>
        </form>
      </div>
    </body>
    </html>
  `);
});
```

---

#### **Signup Route**

```js
// SIGNUP ROUTE - Register new user
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.send(`
      <h2 class="success">User registered successfully!</h2>
      <p>Username: ${username}</p>
      <p>Email: ${email}</p>
      <a href="/">Go back</a>
    `);

  } catch (error) {
    if (error.code === 11000) {
      res.send(`
        <h2 class="error">Username or Email already exists</h2>
        <a href="/">Try again</a>
      `);
    } else {
      res.send(`<h2 class="error">Error: ${error.message}</h2><a href="/">Back</a>`);
    }
  }
});
```

---

#### **Login Route**

```js
// LOGIN ROUTE
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.send(`<h2 class="error">User not found</h2><a href="/">Back</a>`);
    }

    if (user.password !== password) {
      return res.send(`<h2 class="error">Incorrect password</h2><a href="/">Back</a>`);
    }

    res.send(`
      <h2 class="success">Login successful!</h2>
      <p>Welcome, ${user.username}!</p>
      <p>Email: ${user.email}</p>
      <p>Created: ${user.createdAt.toDateString()}</p>
      <a href="/">Go back</a>
    `);

  } catch (error) {
    res.send(`<h2 class="error">Error: ${error.message}</h2><a href="/">Back</a>`);
  }
});
```

---

#### **View All Users Route**

```js
// GET ALL USERS ROUTE
app.get('/users', async (req, res) => {
  try {
    const allUsers = await User.find();

    if (allUsers.length === 0) {
      return res.send(`<h2>No users found</h2><a href="/">Back</a>`);
    }

    let userList = '<h2>Registered Users</h2><ul>';
    allUsers.forEach(user => {
      userList += `
        <li>
          <strong>Username:</strong> ${user.username} | 
          <strong>Email:</strong> ${user.email} | 
          <strong>Joined:</strong> ${user.createdAt.toDateString()}
        </li>
      `;
    });
    userList += '</ul><a href="/">Back</a>';
    res.send(userList);

  } catch (error) {
    res.send(`<h2 class="error">Error: ${error.message}</h2><a href="/">Back</a>`);
  }
});
```

---

### **STEP 10 – Start Server**

```js
// ============================================
// START THE SERVER
// ============================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## 🧪 STEP 11 – Run and Test

### **Start MongoDB**

For Local MongoDB:

```bash
mongod
```

For MongoDB Atlas:

1. Create a cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string and replace `DB_URL` in your code.

---

### **Run the Server**

```bash
node server.js
```

Output should be:

```
Server running on http://localhost:3000
Connected to MongoDB successfully
```

---

### **Open in Browser**

Visit 👉 **[http://localhost:3000](http://localhost:3000)**

Then test:

* **Register** a user
* **Login** with that user
* **View all users**

---

## 📁 Final Project Structure

```
mongoose-demo/
├── node_modules/
├── server.js
├── package.json
└── package-lock.json
```

---

## ✅ Extra (Optional Improvements)

* Add password encryption using **bcrypt**
* Add session management (login persistence)
* Use `.env` file for database credentials
* Create routes in separate files
* Add input validation with **express-validator**

---

Would you like me to make this into a **PowerPoint-ready slide outline or PDF version** next (so you can present it as a tutorial deck)?

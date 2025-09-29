cat > README.md <<'EOF'
# exp7 – Sessions & Cookies in Node.js

This project shows how to use **sessions** and **cookies** with Node.js + Express.

---

## 🚀 How to Run

1. Install dependencies:
   ```bash
   npm install


1. Check Node.js & npm

Make sure Node.js is installed:

node -v
npm -v


If not installed → download from https://nodejs.org
.

2. Create project folder
mkdir exp7
cd exp7

3. Initialize Node.js project
npm init -y


👉 This creates a basic package.json.

4. Install dependencies
npm install express express-session cookie-parser

3. Run again in PowerShell
Run session example:
npm run session


Open → http://localhost:3000

Run cookie example:
npm run cookie


Open → http://localhost:3000/set

Run login demo:
npm start


Open → http://localhost:3000



All steps by step 

Okay 👍 I’ll keep it **super simple and step-by-step**, with only what you need to run the cookie project (`exp7`).

---

## Step 1: Create project folder

```powershell
cd Desktop\Neelambar\GITHUB\AWT\lab\Unit3
mkdir exp7
cd exp7
```

---

## Step 2: Initialize project

```powershell
npm init -y
```

This will create a `package.json` file.

---

## Step 3: Install dependencies

```powershell
npm install express cookie-parser
```

---

## Step 4: Create file `cookie-example.js`

Inside `exp7` folder, make a file named **cookie-example.js** with this code:

```js
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
```

---

## Step 5: Add script in `package.json`

Open **package.json** and inside `"scripts"` section, add:

```json
"scripts": {
  "cookie": "node cookie-example.js"
}
```

---

## Step 6: Run the project

```powershell
npm run cookie
```

If successful, you will see:

```
Server running at http://localhost:3000
```

---

## Step 7: Test in browser

* Open: [http://localhost:3000](http://localhost:3000)
* Click **Set Cookie** → then **Get Cookie** → then **Delete Cookie**

---

That’s the full step-by-step terminal + code for cookie demo.

Do you want me to now write the **same full step-wise guide for sessions** also?

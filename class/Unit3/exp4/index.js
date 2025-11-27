// index.js
// Safe, stepwise demo of os, path, fs (async), templates and Express routes.

require('dotenv').config();
const express = require('express');
const path = require('path');
const os = require('os');
const fs = require('fs').promises;
const fse = require('fs-extra'); // used safely
const ejs = require('ejs');
const handlebars = require('handlebars');
const pug = require('pug');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const PORT = process.env.PORT || 3000;

// built-in body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set view engines for EJS and Pug examples
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // default for /templates/ejs route

// ---------- Helpful utility functions ----------
async function safeEnsureDir(dirPath) {
  try {
    await fse.ensureDir(dirPath);
    return true;
  } catch (err) {
    console.error('ensureDir failed', dirPath, err);
    return false;
  }
}

async function safeWriteJSON(filePath, obj) {
  try {
    await fs.writeFile(filePath, JSON.stringify(obj, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('writeFile failed', filePath, err);
    return false;
  }
}

// ---------- Routes ----------

// Home page: links to demos
app.get('/', (req, res) => {
  res.send(`
    <h2>Node Common Packages Demo</h2>
    <ul>
      <li><a href="/os">/os</a> - OS information (os module)</li>
      <li><a href="/path">/path</a> - Path utilities (path module)</li>
      <li><a href="/file-ops">/file-ops</a> - Async file operations (fs)</li>
      <li><a href="/templates/ejs">/templates/ejs</a> - EJS example</li>
      <li><a href="/templates/handlebars">/templates/handlebars</a> - Handlebars example</li>
      <li><a href="/templates/pug">/templates/pug</a> - Pug example</li>
      <li><a href="/git-info">/git-info</a> - Demo: dotenv & axios & lodash</li>
    </ul>
  `);
});

// os module demo
app.get('/os', (req, res) => {
  const info = {
    type: os.type(),
    platform: os.platform(),
    cpus: os.cpus().length,
    totalMemBytes: os.totalmem(),
    freeMemBytes: os.freemem(),
    homedir: os.homedir(),
  };
  res.json({ success: true, os: info });
});

// path module demo
app.get('/path', (req, res) => {
  const sample = path.join(__dirname, 'some', 'folder', 'file.txt');
  res.json({
    sample,
    dirname: path.dirname(sample),
    basename: path.basename(sample),
    ext: path.extname(sample),
    joined: path.join('a', 'b', 'c.txt')
  });
});

// async fs operations demo
app.get('/file-ops', async (req, res) => {
  const demoDir = path.join(__dirname, 'demo_data');
  const filePath = path.join(demoDir, 'data.json');

  await safeEnsureDir(demoDir);

  const sampleObj = {
    message: 'Hello from file-ops',
    timestamp: new Date().toISOString()
  };

  const writeOk = await safeWriteJSON(filePath, sampleObj);

  let fileContents = null;
  try {
    fileContents = JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (err) {
    fileContents = { error: 'Could not read file yet', err: String(err) };
  }

  res.json({ writeOk, filePath, fileContents });
});

// Templates: EJS
// Create a simple EJS view on-the-fly if not exists
app.get('/templates/ejs', async (req, res, next) => {
  const viewFile = path.join(__dirname, 'views', 'ejs', 'example.ejs');
  await safeEnsureDir(path.dirname(viewFile));
  const template = `<h1>EJS Hello <%= name %></h1><ul><% users.forEach(u=>{ %><li><%= u %></li><% }) %></ul>`;
  await fse.writeFile(viewFile, template, 'utf8').catch(()=>{});
  res.render('ejs/example', { name: 'EJS User', users: ['Alice','Bob'] });
});

// Templates: Handlebars (rendered server-side, not via express-handlebars)
app.get('/templates/handlebars', (req, res) => {
  const template = `<h1>Handlebars Hello {{name}}</h1><ul>{{#each users}}<li>{{this}}</li>{{/each}}</ul>`;
  const compiled = handlebars.compile(template);
  const html = compiled({ name: 'HB User', users: ['Sam','Jen'] });
  res.send(html);
});

// Templates: Pug
app.get('/templates/pug', async (req, res) => {
  // create pug file if not exist
  const pugFile = path.join(__dirname, 'views', 'pug', 'example.pug');
  await safeEnsureDir(path.dirname(pugFile));
  const pugTemplate = `html\n  head\n    title Pug Demo\n  body\n    h1 Pug Hello #{name}\n    ul\n      each user in users\n        li= user`;
  await fse.writeFile(pugFile, pugTemplate, 'utf8').catch(()=>{});
  // compile & render
  const compiled = pug.compileFile(pugFile);
  const html = compiled({ name: 'Pug User', users: ['X','Y'] });
  res.send(html);
});

// dotenv, axios, lodash demo
app.get('/git-info', async (req, res) => {
  const apiKey = process.env.API_KEY || null;
  // make a simple public request (github API root) but catch errors
  let gitHubRoot = null;
  try {
    const r = await axios.get('https://api.github.com');
    gitHubRoot = { status: r.status, server: r.headers.server || null };
  } catch (err) {
    gitHubRoot = { error: 'Could not reach api.github.com', reason: err.message };
  }

  res.json({
    apiKey,
    gitHubRoot,
    lodashSample: {
      arr: _.chunk([1,2,3,4,5], 2),
      cloneDeepExample: _.cloneDeep({a:1,b:{c:2}})
    }
  });
});

// Fallback
app.use((req, res) => res.status(404).send('Not found'));

// Start server
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));

Below is your **entire D3.js Lab Manual code separated step-by-step**, exactly matching your slides.

This is the **cleanest, simplest, fully structured step-wise version**, ready for your report or PPT.

---

# ✅ **STEP 1 — Create Folder Structure**

```
d3-labs/
│── package.json
│── server.js
│── public/
│     ├── index.html
│     ├── script.js
│     └── data.csv
```

---

# ✅ **STEP 2 — Initialize Node.js Project**

Open terminal inside `d3-labs/` and run:

```sh
npm init -y
```

---

# ✅ **STEP 3 — Install Required Tools**

```sh
npm install express
npm install --save-dev nodemon browser-sync concurrently
```

---

# ✅ **STEP 4 — Create server.js**

Create file: **server.js**

```js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
```

---

# ✅ **STEP 5 — Update package.json Scripts**

Open **package.json** and replace `"scripts"` with:

```json
"scripts": {
  "server": "nodemon server.js",
  "sync": "browser-sync start --proxy 'localhost:3000' --files 'public/*.html, public/*.js, public/*.css'",
  "dev": "concurrently \"npm run server\" \"npm run sync\""
}
```

---

# ✅ **STEP 6 — Start Project**

```sh
npm run dev
```

This will:

✔ Start Express on port 3000
✔ Auto-restart on changes (nodemon)
✔ Auto-reload browser (browser-sync)

---

# ✅ **STEP 7 — Create index.html (with D3.js CDN)**

File: **public/index.html**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>D3.js Lab Experiments</title>
</head>
<body>

    <h1>D3.js Experiments</h1>

    <svg id="chart" width="600" height="300"></svg>

    <div id="myDiv">Original Text</div>

    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

---

# ✅ **STEP 8 — Base script.js File**

File: **public/script.js**

```js
console.log("D3 Lab Loaded");

// Base SVG reference for Experiment 10.1
const svg = d3.select("#chart");
```

---

# ✅ **STEP 9 — Experiment 10.1 (Bar Chart)**

Add below base code inside **script.js**:

```js
// -----------------------------
// Experiment 10.1 — Bar Chart
// -----------------------------
const data = [30, 80, 45, 60, 20, 90, 50];

const width = 600;
const height = 300;
const barWidth = width / data.length;

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, height]);

svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * barWidth)
    .attr("y", d => height - yScale(d))
    .attr("width", barWidth - 2)
    .attr("height", d => yScale(d))
    .attr("fill", "steelblue");
```

---

# ✅ **STEP 10 — Experiment 10.2 (Circles + Rectangles Interaction)**

Add this below previous code inside **script.js**:

```js
// ------------------------------------------
// Experiment 10.2 — Shapes & Interaction
// ------------------------------------------
const shapesSvg = d3.select("body")
    .append("svg")
    .attr("width", 500)
    .attr("height", 200);

// circles
shapesSvg.selectAll("circle")
    .data([50, 150, 250, 350])
    .enter()
    .append("circle")
    .attr("cx", d => d)
    .attr("cy", 80)
    .attr("r", 25)
    .attr("fill", "orange")
    .on("mouseover", function () {
        d3.select(this).attr("fill", "red");
    })
    .on("mouseout", function () {
        d3.select(this).attr("fill", "orange");
    });

// rectangles
shapesSvg.selectAll("rect")
    .data([60, 160, 260, 360])
    .enter()
    .append("rect")
    .attr("x", d => d)
    .attr("y", 120)
    .attr("width", 40)
    .attr("height", 30)
    .attr("fill", "green")
    .on("click", function () {
        d3.select(this).attr("fill", "purple");
    });
```

---

# ✅ **STEP 11 — Experiment 10.3 (Select & Modify Element)**

Add inside **script.js**:

```js
// ------------------------------------------
// Experiment 10.3 — Select & Modify Element
// ------------------------------------------
d3.select("#myDiv")
    .style("color", "blue")
    .style("font-size", "24px")
    .text("This text is modified by D3");
```

---

# ✅ **STEP 12 — Experiment 10.4 (Load CSV + Graph)**

### Create CSV

File: **public/data.csv**

```
year,value
2016,30
2017,50
2018,80
2019,45
2020,90
```

### Add code in **script.js**:

```js
// ------------------------------------------
// Experiment 10.4 — CSV Data Graph
// ------------------------------------------
d3.csv("data.csv").then(data => {

    data.forEach(d => {
        d.value = +d.value;
    });

    const width = 600;
    const height = 300;

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0]);

    const svg2 = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg2.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.value))
        .attr("fill", "teal");
});
```

---

# 🎉 **STEP 13 — Summary**

You completed:

✔ Node.js + Express setup
✔ Auto-reload dev server (nodemon + browser-sync)
✔ D3.js base setup
✔ Bar chart (10.1)
✔ Interactive shapes (10.2)
✔ Element styling (10.3)
✔ CSV data visualization (10.4)

---

# ⭐ Do you want me to merge EVERYTHING into one **single index.html** file also?

(YES / NO)

If yes → I will generate a full **one-file version** with all experiments.

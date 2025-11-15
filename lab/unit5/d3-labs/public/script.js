console.log("D3 Lab Loaded");

// ---------------- Experiment 10.1: Bar Chart ----------------
const data = [30, 80, 45, 60, 20, 90, 50];
const width = 600;
const height = 300;
const barWidth = width / data.length;
const svg = d3.select("#chart");

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

// ---------------- Experiment 10.2: Circles & Rectangles ----------------
const shapesSvg = d3.select("body")
    .append("svg")
    .attr("width", 500)
    .attr("height", 200);

shapesSvg.selectAll("circle")
    .data([50, 150, 250, 350])
    .enter()
    .append("circle")
    .attr("cx", d => d)
    .attr("cy", 80)
    .attr("r", 25)
    .attr("fill", "orange")
    .on("mouseover", function () { d3.select(this).attr("fill", "red"); })
    .on("mouseout", function () { d3.select(this).attr("fill", "orange"); });

shapesSvg.selectAll("rect")
    .data([60, 160, 260, 360])
    .enter()
    .append("rect")
    .attr("x", d => d)
    .attr("y", 120)
    .attr("width", 40)
    .attr("height", 30)
    .attr("fill", "green")
    .on("click", function () { d3.select(this).attr("fill", "purple"); });

// ---------------- Experiment 10.3: Modify HTML Element ----------------
d3.select("#myDiv")
    .style("color", "blue")
    .style("font-size", "24px")
    .text("This text is modified by D3");

// ---------------- Experiment 10.4: Load CSV ----------------
d3.csv("data.csv").then(data => {
    data.forEach(d => d.value = +d.value);

    const svg2 = d3.select("body")
        .append("svg")
        .attr("width", 600)
        .attr("height", 300);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, 600])
        .padding(0.3);

    const yScale2 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([300, 0]);

    svg2.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale2(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => 300 - yScale2(d.value))
        .attr("fill", "teal");
});

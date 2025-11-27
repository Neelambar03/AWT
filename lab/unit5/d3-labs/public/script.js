console.log("D3 Lab Loaded");

// Base SVG reference for Experiment 10.1
const svg = d3.select("#chart");


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

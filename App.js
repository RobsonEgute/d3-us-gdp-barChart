let link = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const height = 500;
const width = 600;
const padding = 40;

async function getData() {
    let reqData = null;
    let dataArr = null;
let dataSet = await fetch(link)
    .then(response => response.json())
    .then(data => reqData = data)
    .catch(() => console.log("error!"));
//console.log(reqData)
dataArr = reqData.data;
//console.log(dataArr);

const svg = d3.select("body")
              .append("svg")
              .attr("class", "svg-chart")
              .attr("height", height)
              .attr("width", width)
              

const minVal = d3.min(dataArr, (d) => d[1]);
const maxVal = d3.max(dataArr, (d) => d[1]);
console.log(minVal, maxVal);

let datesArr = dataArr.map(val => new Date(val[0]));
//console.log(datesArr);
let xAxisScale = d3.scaleTime()
                   .domain([d3.min(datesArr), d3.max(datesArr)])
                   .range([padding, width - padding])

let yAxisScale = d3.scaleLinear()
                    .domain([0, maxVal])
                    .range([height - padding, padding])

let xScale = d3.scaleLinear().domain([0, dataArr.length - 1]).range([padding, width -  padding]);
let heightScale = d3.scaleLinear().domain([0, maxVal]).range([0, height - (padding * 2)]);
const xAxis = d3.axisBottom(xAxisScale);
const yAxis = d3.axisLeft(yAxisScale);
let toolTipMenu = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("width", "auto")
                    .style("height", "auto")
                    .style("visibility", "hidden")
                    .style("margin", "30px")

svg.append("g")
   .attr("transform", "translate(0," + (height - padding) + ")")
   .call(xAxis)
   .attr("id", "x-axis");

svg.append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
    .attr("id", "y-axis");

svg.selectAll("rect")
    .data(dataArr)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", (width - (2 * padding)) / dataArr.length)
    .attr("data-date", (val) => val[0])
    .attr("data-gdp", (val) => val[1])
    .attr("height", (val) => heightScale(val[1]))
    .attr("x", (val, index) => xScale(index))
    .attr("y", (val, index) => (height - padding) - heightScale(val[1]))
    .on('mouseover', function() {
        let val = d3.select(this);
        console.log(val.attr('data-date'));
        toolTipMenu.transition().style('visibility', 'visible');
        toolTipMenu.text(val.attr('data-date'))
        document.getElementById('tooltip').setAttribute('data-date', val.attr('data-date'))
    })
    .on('mouseout', (val, index) => {
        toolTipMenu.transition().style("visibility", "hidden")
    })




}
getData()
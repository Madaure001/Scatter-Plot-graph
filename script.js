/** 
Madaure Thulani
Happy coding 
**/

//My variables and functions

let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
let req = new XMLHttpRequest()    //method to request data as JS

let values = []     // to be filled by import data from request
let xScales         //for x-axis and placing elements on horizontal canvas
let yScales         // for y-axis and placing donts on left canvas

//dimensions of the svg canvas
let width = 800
let height = 600
let padding = 60

// Define the tooltip for the tooltip

let svg = d3.select('svg');
let tooltip = d3.select('#tooltip');
let color = d3.scaleOrdinal(d3.schemeCategory10)


let drawCanvas = () => {        //canvas drawing with set dimensions
  svg.attr('width', width)
  svg.attr('height',height)
}

let generateScales = () => {    //generate x and y scales set to linear & time

  xScales = d3.scaleLinear()
              .domain([d3.min(values, (item) => {
                return item['Year']
              }) -1, d3.max(values, (item) => {
                return item['Year']
              }) +1]) 
              .range([padding, width - padding])
              
  
  let datesArray = values.map((item) => {
    return new Date(item[0])
  })

  yScales = d3.scaleTime()
              .domain([d3.min(values, (item) => {
                return new Date(item['Seconds'] * 1000)
              }), d3.max(values, (item) => {
                return new Date(item['Seconds'] * 1000)
              })])
              .range([height - padding, padding])
  
  
}

let drawPoints = () => {        //draw circles for the points
  
  svg.selectAll('circle')
      .data(values)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', '6')
      .attr('data-xvalue', (item) => {
        return item['Year']            
      })
      .attr('data-yvalue', (item) => {
         return new Date(item['Seconds'] * 1000)
      })
      .attr('cx', (item) => {
        return xScales(item['Year'])
      })
      .attr('cy', (item) => {
        return yScales(new Date(item['Seconds'] * 1000))
      })
      .style('fill', (item) => {
        return color(item['Doping'] !== '');
      })
      .on('mouseover', (item) => {
        tooltip.transition()
                .style('visibility', 'visible')
        if (item['Doping'] != ''){
          tooltip.text(`${item['Name']}: ${item['Nationality']} Year: ${item['Year']}, Time: ${item['Time']} ${item['Doping']}`)
        }else{
          tooltip.text(`${item['Name']}: ${item['Nationality']} Year: ${item['Year']}, Time: ${item['Time']} No allegations`)
        }
        tooltip.attr('data-year', item['Year'])
      })
      .on('mouseout', (item)  => {
        tooltip.style('visibility', 'hidden');
      });
}

let generateAxes = () => {      //draw the axes on the graph

  let xAxis = d3.axisBottom(xScales)
                .tickFormat(d3.format('d'))
  let yAxis = d3.axisLeft(yScales)
                .tickFormat(d3.timeFormat('%M:%S'))

  //draw the x-axis
  svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', `translate(0,${height - padding})`);

  svg.append('text')
      .attr('class', 'label')
      .attr('transform', `translate(0,${height - padding * 0.5})`)
      .attr('y', 10)
      .attr('x', width/2)
      .style('text-anchor', 'end')
      .text('---Year---');

  //draw the y-axis
  svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding + ', 0)');

  svg.append('text')
    .attr('class', 'label')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('x', -250)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Best Time (minutes)');
}

//Handle all Titles in one function
function descriptions() {
  d3.select('body')
    .select('svg')
    .append('text')
    .attr('id', 'title')
    .attr('x', width / 4)
    .attr('y', padding - 35)
    .attr('text-anchor', 'midlle')
    .style('font-size', '30px')
    .text('Doping in Professional Bicycle Racing')

  // subtitle
  d3.select('body')
    .select('svg')
    .append('text')
    .attr('x', width / 2)
    .attr('y', padding - 10)
    .attr('text-anchor', 'middle')
    .style('font-size', '20px')
    .text("35 Fastest times up Alpe d'Huez")

}
//Create a legend function
var makeLegend = () => {
var legendContainer = svg.append('g').attr('id', 'legend');

var legend = legendContainer
    .selectAll('#legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend-label')
    .attr('transform', function (d, i) {
      return 'translate(0,' + (height / 2 - i * 20) + ')';
    });

legend
    .append('rect')
    .attr('x', width - padding)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', color);

legend
    .append('text')
    .attr('x', width - padding - 24)
    .attr('y', 9)
    .attr('dy', '.13em')
    .style('text-anchor', 'end')
    .text((item) => {
      if (item) {
        return 'Riders with doping allegations';
      } else {
        return 'No doping allegations';
      }
    });
}


//import data as JSON
req.open('GET', url, true)
req.onload = () => {
  values = JSON.parse(req.responseText)
  console.log(values)

  drawCanvas()
  descriptions()
  generateScales()
  drawPoints()
  generateAxes()
  makeLegend()
}
req.send()










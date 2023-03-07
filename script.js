const projectName = 'scatter-plot';
localStorage.setItem('example_project', 'D3: Scatter Plot');

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

function scatterPlot(data) {

    const margin = {top: 50, right: 50, left: 50, bottom: 120},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    const xArrYears = data.map((d) => {
        return new Date("" + d.Year + "-01-01")
    });
    const xArrYearsNum = data.map(d => d.Year);

    const yArrRunTime = data.map((d) => {
        let tempTime = d.Time.split(":");
        let dt = new Date(1970,1,1,0,Number(tempTime[0]),Number(tempTime[1]));
        return dt;
    });
    const yArrRunTimeNum = data.map(d => d.Seconds);
    data.map((d) => {
        d.bDoped = d.Doping.length ? 1 : -1;
    });

    let minutes = d3.timeParse("%M:%S")
    let minYear =(d3.min(data,(d)=>d.Year))
    let maxYear =(d3.max(data,(d)=>d.Year))
    let minTime =minutes((d3.min(data,(d)=>d.Time)))
    let maxTime =minutes((d3.max(data,(d)=>d.Time)))
    
    xArrYears[xArrYears.length] = new Date("" + Number(maxYear+1) + "-01-01")
    xArrYears[xArrYears.length] = new Date("" + Number(minYear-1) + "-01-01")
    console.log(d3.extent(xArrYears))

    const key = ["No doping allegations", "Yes doping allegations"];
    let colorD3 = d3.scaleOrdinal().domain(key).range(d3.schemeCategory10);
    let color = d3.scaleOrdinal().domain([-1, 1]).range(["#cd7e26", "#133bfc"]);
    let timeFormat = d3.timeFormat('%M:%S');
    
    // Axes time
    let xTime = d3.scaleTime().domain(d3.extent(xArrYears)).range([0, width])
    let yTime = d3.scaleTime().domain(d3.extent(yArrRunTime)).range([0, height])

    // Axes scales
    let xScale = d3.scaleLinear().domain([d3.min(xArrYearsNum)-2, d3.max(xArrYearsNum)]).range([0, width]);
    let yScale = d3.scaleLinear().domain([d3.min(yArrRunTimeNum), d3.max(yArrRunTimeNum)]).range([0, height])

    // Axes:
    let xAxis = d3.axisBottom(xTime);
    let yAxis = d3.axisLeft(yTime).tickFormat(timeFormat);
    console.log([minYear, maxYear, minTime, maxTime])

    let toolTip = d3.select('.container')
        .append("div")
            .style("position","absolute")
            .attr("id","tooltip")
            .style("background","white")
            .style("display","none")
            .style("border-radius","5px")
            .style("padding","5px")
            .classed('tooltip',true)
    toolTip.append('div')
        .classed("person_nationality", true)
        .classed("age_time",true)
        .classed("drugged",true)

    // Add an svg object to the body of the page
    let svg = d3.select('.container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

    // Add x-axis
    svg.append("g")
    .attr("transform", "translate(0, " + (height) +")")
    .classed('axis', true)
    .attr('id','x-axis')
    .call(xAxis)

    // Add y-axis
    svg.append("g")
    .attr("transform", "translate(" + (0) +", 0)")
    .classed('axis', true)
    .attr('id','y-axis')
    .call(yAxis);

    // Add scattered dots
    svg.selectAll('circle')
    .data(data)
    .enter().append('circle')
        .attr('class','dot')
        .attr('cx', d => xScale(d.Year))
        .attr('cy', d => yScale(d.Seconds))
        .attr('r', 8.5)
        .style("fill", (d) => color(d.bDoped))
    .on('mouseover', function(d) {
        let data_Mouse = d.target.__data__;
        toolTip.transition()
            .style('display','block')
            .style('opacity',1)
            
        d3.select('.tooltip .person_nationality')
            .html(() => 'Name: ' + data_Mouse.Name + ', Nationality: ' + data_Mouse.Nationality +
            '<br>' + 'Year: ' + data_Mouse.Year + ' Time: ' + data_Mouse.Time + '<br><br>' +
            'Doping: ' + data_Mouse.Doping)
            .style('background','white')
            .style('font-size', '1.2em')
            .style('font-weight', 'bold')
        toolTip
            .style('left', (d.pageX-145)+'px')
            .style('top', (d.pageY-45)+'px')
        d3.select(this)
            .style('opacity', 0.5)
            .attr('r', 10)
        console.log(data_Mouse)
    })
}

async function scatterPlotAsync(dataURL) {
    try {
        await fetch(dataURL)
            .then(response => response.json())
            .then(json => {
                scatterPlot(json);
            })
            .catch(err => {
                console.log(err);
            });
    } catch (error) {
        console.log(error)
    }
}

scatterPlotAsync(url);
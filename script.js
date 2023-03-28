const projectName = 'scatter-plot';
localStorage.setItem('example_project', 'D3: Scatter Plot');

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

function scatterPlot(data) {
    //We will make the time and year JS date objects, All the other fields can be interpretted as text
	let timeData=[];
	let yearData=[];
	let date;
	for (let i = 0; i<data.length; ++i)
	{
		date = new Date(null);
		date.setMinutes(data[i].Seconds / 60); // Value for Minutes here
		date.setSeconds(data[i].Seconds % 60); // Value for SECONDS here
		timeData.push(date);			//Store time here
		yearData.push(new Date(data[i].Year, 1));
		// console.log(data[i].Seconds + " - " + data[i].Time + " : " + date.toISOString());	//Test output for correct time conversion
		console.log(data[i].Year + " - " + yearData[i].toISOString());	//Test output for correct year conversion
	}

    const margin = {top: 50, right: 50, left: 70, bottom: 50},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding_top = 50;
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
        .classed('tooltip',true)
        .style("position","absolute")
        .style("background","lightblue")
        .style("border-radius","5px")
        .style("width","200px")
        .style("padding","5px")
        .style("display","none")
        .attr("id","tooltip")

    // Add an svg object to the body of the page
    let svg = d3.select('.container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + padding_top)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

    // Add x-axis
    svg.append("g")
        .attr("transform", "translate(0, " + (height + padding_top) +")")
        .classed('axis', true)
        .attr('id','x-axis')
        .call(xAxis)

    // Add y-axis
    svg.append("g")
        .attr("transform", "translate(" + (0) +", "+ (padding_top) +" )")
        .classed('axis', true)
        .attr('id','y-axis')
        .call(yAxis);

    // Add scattered dots
    svg.append('g')
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.1)
    .selectAll('circle')
    .data(data)
    .enter().append('circle')
        .style("fill", (d) => color(d.bDoped))
        .classed("dot",true)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 8.5)
        .attr("data-xvalue", (d,i) => yearData[i])   	
        .attr("data-yvalue", (d,i) =>  timeData[i])
        .style('pointer-events', 'all')
        // Add hover effect
        .on('mouseover', function(d, i) {
            let data_Mouse = d.target.__data__;
            let yearData = (new Date(data_Mouse.Year, 1));
            toolTip
                .attr("data-year", yearData)
                .style('display','block')
                .style('opacity',0.9)
                .style('left', (d.pageX+15)+'px')
                .style('top', (d.pageY-50)+'px')
                .html(() => 'Name: ' + data_Mouse.Name + ', Nationality: ' + data_Mouse.Nationality +
                '<br>' + 'Year: ' + data_Mouse.Year + ' Time: ' + data_Mouse.Time + '<br><br>' +
                'Doping: ' + data_Mouse.Doping)
                .style('background','lightblue')
                .style('font-size', '0.8em')
                .style('font-weight', 'bold')
                
            d3.select(this)
                .style('opacity', 0.5)
                .attr('r', 10)
            
            console.log(data_Mouse)
        })
        // Add hover off effect
        .on('mouseout', function(d) {
            // Remove tooltip
            toolTip
            .style("opacity", 0)
            // Change color of rect back to normal
            d3.select(this)
            .style('opacity',1)
            .attr('r', 8.5)
        })
        .transition()
            .attr('cx', d => xScale(d.Year))
            .attr('cy', d => yScale(d.Seconds)+padding_top)
            .delay((d, i) => i * 5)
            .duration(1000)
            .ease(d3.easeElastic)
    // Ylabel
    d3.select('svg')
        .append('text')
          .classed('ylabelText', true)
          .text('Time in Minutes')
          .attr('transform', 'translate(' + (margin.left - 50) + ', ' + (margin.top+padding_top) + ') rotate(-90)')
          .style('text-anchor', 'end')
    // Titles
    d3.select('svg')
        .append('text')
        .classed('titleText', true)
        .attr("id","title")
        .text('Doping in Professional Bicycle Racing')
        .attr('transform', 'translate(' + ((width+ margin.right + margin.left)/2) + ', ' + (margin.top-20) + ')')
        .style('text-anchor', 'middle')
    d3.select('svg')
        .append('text')
        .classed('supTitleText', true)
        .text("35 Fastest times up Alpe d'Huez")
        .attr('transform', 'translate(' + ((width+ margin.right + margin.left)/2) + ', ' + (margin.top+20) + ')')
        .style('text-anchor', 'middle')
    // Legends
    svg.append("rect")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("x", (d) => xScale(maxYear))
        .attr("y", (d) => yScale(2300))
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", color(-1));
    svg.append("text")
        .attr("x", (d) => xScale(maxYear-0.3))
        .attr("y", (d) => yScale(2306))
        .attr("text-anchor", "left")
        .attr("class", "legend")
        .attr("id", "legend")
        .text("No doping allegations")
        .style('text-anchor', 'end')
    svg.append("rect")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("x", (d) => xScale(maxYear))
        .attr("y", (d) => yScale(2315))
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", color(1));
    svg.append("text")
        .attr("x", (d) => xScale(maxYear-0.3))
        .attr("y", (d) => yScale(2321.8))
        .attr("text-anchor", "left")
        .attr("class", "legend")
        .attr("id", "legend")
        .text("Riders with doping allegations")
        .style('text-anchor', 'end')
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
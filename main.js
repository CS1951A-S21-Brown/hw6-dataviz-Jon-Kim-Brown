// Add your JavaScript code here

const MAX_WIDTH = Math.max(1000, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let filename = "data/video_games.csv";

let width = 900,
    height = 500;

var radius = Math.min(width, height) * 0.75 - margin.left

// TODO: Set up SVG object with width, height and margin
let svg = d3.select("#graph2")
    .append("svg")
    .attr("width", width)     // HINT: width
    .attr("height", height)     // HINT: height
    .append("g")
    .attr("transform", "translate(" + width / 3 + "," + height / 2 + ")");    // HINT: transform


// TODO: Add chart title
let title = svg.append("text")
    .attr("transform", `translate(${(width - margin.left - margin.right) / 2}, ${-10})`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);
/*
    We declare global references to the y-axis label and the chart title to update the text when
    the data source is changed.
*/

function setDataVG2(region) {
    // TODO: Load the artists CSV file into D3 by using the d3.csv() method. Index into the filenames array
    d3.csv(filename).then(function(data) {
        // TODO: Clean and strip desired amount of data for barplot
        data = cleanDataVG2(data, region);
        console.log(data);

        let color = d3.scaleOrdinal()
        // .domain(data)
        .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]);
        

        /*
            This next line does the following:
                1. Select all desired elements in the DOM
                2. Count and parse the data values
                3. Create new, data-bound elements for each data value
        */
        let pie = d3.pie()
                .value(function(d) {return d.value;});

        let pied_data = pie(d3.entries(data));
        console.log(pied_data);
        // TODO: Render the bar elements on the DOM
        /*
            This next section of code does the following:
                1. Take each selection and append a desired element in the DOM
                2. Merge bars with previously rendered elements
                3. For each data point, apply styling attributes to each element

            Remember to use the attr parameter to get the desired attribute for each data point
            when rendering.
        */
        let sections = svg.selectAll("pieces").data(pied_data)

        sections.enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(175)         // This is the size of the donut hole
                .outerRadius(radius)
            )
            .attr('fill', function(d){ return(color(d.data.key)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 1)

        let legend = svg.append('g')
                    .attr('transform', `translate(${radius * 2 + 20},0)`);


        let labels = legend.selectAll("pieces").data(pied_data);
        
        labels.enter()
            .append('rect')
            .attr('y', function(d){ 
                return (-165 + d.index * 20 * 1.5)})
            // .attr('x', d => )
            .attr('width', 250)
            .attr('height', 30)
            .attr('fill', "#FFFFFF")
            
        labels
            .enter()
            .append('rect')
            .attr('y', function(d) {
                    return (-160 + d.index * 20 * 1.5)})
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', function(d){ return(color(d.data.key)) })
            .attr('stroke', 'grey')
            .style('stroke-width', '1px');

        labels
            .enter()
            .append('text')
            .text(d => d.data.key + ": " + d.data.value)
            .attr('x', 20 * 1.2)
            .attr('y', function(d) {
                return (-145 + d.index * 20 * 1.5)})
            .style('font-family', 'sans-serif')
            .style('font-size', `18px`);
        
        



        if (region == 'Global_Sales') {
            title.text(`Global Sales`);
        } else if (region == 'NA_Sales') {
            title.text(`North American Sales`);
        } else if (region == 'EU_Sales') {
            title.text(`European Sales`);
        } else if (region == 'JP_Sales') {
            title.text(`Japanese Sales`);
        }

        // Remove elements not in use if fewer groups in new dataset
        sections.exit().remove();
        legend.exit().remove();
        labels.exit().remove();
    });
}




/**
 * Cleans the provided data using the given comparator then strips to first numExamples
 * instances
 */
function cleanDataVG2(data, region) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    genres = {}
    for (i = 0; i < data.length; i++) {
        newG = true;
        genre = data[i]["Genre"];
        for (let exists in genres) {
            if (genre == exists) {
                newG = false;
            }
        }
        if (newG) {
            genres[genre] = parseInt(data[i][region]);
        } else {
            genres[genre] += parseInt(data[i][region]);
        }
    }
    return genres;
}


(function() {
    // TODO: Set up SVG object with width, height and margin
    let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", width - 50)     // HINT: width
    .attr("height", height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

    // TODO: Create a linear scale for the x axis (number of occurrences)
    let x = d3.scaleLinear().range([0, width - 50 - margin.left - margin.right]);

    // TODO: Create a scale band for the y axis (artist)
    let y = d3.scaleBand().range([0, height - margin.top - margin.bottom]).padding(0.1);  // Improves readability
    /*
    Here we will create global references to the x and y axis with a fixed range.
    We will update the domain of the axis in the setData function based on which data source
    is requested.
    */

    // Set up reference to count SVG group
    let countRef = svg.append("g");
    // Set up reference to y axis label to update text in setData
    let y_axis_label = svg.append("g");

    // TODO: Add x-axis label
    svg.append("text")
    .attr("transform", `translate(${(width-50 - margin.left - margin.right)/2},
                                ${(height - margin.top - margin.bottom) + 15})`)       // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Number of Global Sales");
    // Since this text will not update, we can declare it outside of the setData function


    // TODO: Add y-axis label
    let y_axis_text = svg.append("text")
    .attr("transform", `translate(-120, ${((height - margin.top - margin.bottom)/2) + 10})`)       // HINT: Place this at the center left edge of the graph
    .style("text-anchor", "middle");

    // TODO: Add chart title
    let title = svg.append("text")
    .attr("transform", `translate(${(width-50 - margin.left - margin.right) / 2}, ${-10})`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);
    /*
    We declare global references to the y-axis label and the chart title to update the text when
    the data source is changed.
    */

    /**
     * Sets the data on the barplot using the provided index of valid data sources and an attribute
     * to use for comparison
     */
    // TODO: Load the artists CSV file into D3 by using the d3.csv() method. Index into the filenames array
    d3.csv(filename).then(function(data) {
        // TODO: Clean and strip desired amount of data for barplot
        // data = cleanDataVG1(data, year, all_time);
        data = cleanDataVG1(data);
        // TODO: Update the x axis domain with the max count of the provided data
        x.domain([0, d3.max(data, function(d) {return parseInt(d.Global_Sales) } )]);

        // TODO: Update the y axis domains with the desired attribute
        y.domain(data.map(function(d) { return d["Name"] }));
        // HINT: Use the attr parameter to get the desired attribute for each data point

        // TODO: Render y-axis label
        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

        let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["Name"] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 10));

        /*
            This next line does the following:
                1. Select all desired elements in the DOM
                2. Count and parse the data values
                3. Create new, data-bound elements for each data value
        */
        let bars = svg.selectAll("rect").data(data);

        // TODO: Render the bar elements on the DOM
        /*
            This next section of code does the following:
                1. Take each selection and append a desired element in the DOM
                2. Merge bars with previously rendered elements
                3. For each data point, apply styling attributes to each element

            Remember to use the attr parameter to get the desired attribute for each data point
            when rendering.
        */
        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("fill", function(d) {return color(d["Name"])})
            .attr("x", x(0))
            .attr("y", function(d) {return y(d["Name"])})               // HINT: Use function(d) { return ...; } to apply styles based on the data point
            .attr("width", function(d) {return x(parseInt(d["Global_Sales"]))})
            .attr("height",  y.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height

        /*
            In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
            bar plot. We will be creating these in the same manner as the bars.
        */
        let counts = countRef.selectAll("text").data(data);

        // TODO: Render the text elements on the DOM
        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d) {return x(parseInt(d.Global_Sales)) + 10})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
            .attr("y", function(d) {return y(d["Name"]) + 20})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
            .style("text-anchor", "start")
            .text(function(d) {return parseInt(d.Global_Sales)});           // HINT: Get the count of the artist

        y_axis_text.text(`Games`);
        title.text(`Top 10 Games of All-Time`);

        // Remove elements not in use if fewer groups in new dataset
        bars.exit().remove();
        counts.exit().remove();
    });
    /**
     * Cleans the provided data using the given comparator then strips to first numExamples
     * instances
     */
    // function cleanDataVG1(data, year, all_time) {
    function cleanDataVG1(data) {
        // TODO: sort and return the given data with the comparator (extracting the desired number of examples)

        return data.sort(function(a, b) {
            return parseInt(b.Global_Sales) - parseInt(a.Global_Sales)}).slice(0, 10);
    }
})();


(function() {
    // TODO: Set up SVG object with width, height and margin
    let svg = d3.select("#graph3")
    .append("svg")
    .attr("width", width)     // HINT: width
    .attr("height", height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

    let tooltip = d3.select("#graph3")     // HINT: div id for div containing scatterplot
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    // TODO: Create a linear scale for the x axis (number of occurrences)
    let x = d3.scaleLinear().range([0, width - margin.left - margin.right]);

    // TODO: Create a scale band for the y axis (artist)
    let y = d3.scaleBand().range([0, height - margin.top - margin.bottom]).padding(0.1);  // Improves readability
    /*
    Here we will create global references to the x and y axis with a fixed range.
    We will update the domain of the axis in the setData function based on which data source
    is requested.
    */

    // Set up reference to count SVG group
    let countRef = svg.append("g");
    // Set up reference to y axis label to update text in setData
    let y_axis_label = svg.append("g");

    // TODO: Add x-axis label
    svg.append("text")
    .attr("transform", `translate(${(width - margin.left - margin.right)/2},
                                ${(height - margin.top - margin.bottom) + 15})`)       // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Number of Global Sales");
    // Since this text will not update, we can declare it outside of the setData function


    // TODO: Add y-axis label
    let y_axis_text = svg.append("text")
    .attr("transform", `translate(-120, ${((height - margin.top - margin.bottom)/2) + 10})`)       // HINT: Place this at the center left edge of the graph
    .style("text-anchor", "middle");

    // TODO: Add chart title
    let title = svg.append("text")
    .attr("transform", `translate(${(width - margin.left - margin.right) / 2}, ${-10})`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);
    /*
    We declare global references to the y-axis label and the chart title to update the text when
    the data source is changed.
    */

    /**
     * Sets the data on the barplot using the provided index of valid data sources and an attribute
     * to use for comparison
     */
    // TODO: Load the artists CSV file into D3 by using the d3.csv() method. Index into the filenames array
    d3.csv(filename).then(function(data) {
        // TODO: Clean and strip desired amount of data for barplot
        // data = cleanDataVG1(data, year, all_time);
        data = cleanDataVG3(data);
        
        // TODO: Update the x axis domain with the max count of the provided data
        x.domain([0, d3.max(data, function(d) {return parseInt(d.GlobalSales) } )]);

        // TODO: Update the y axis domains with the desired attribute
        y.domain(data.map(function(d) { return d.Genre }));
        // HINT: Use the attr parameter to get the desired attribute for each data point

        // TODO: Render y-axis label
        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

        let color = d3.scaleOrdinal()
            .domain(data.map(function(d) {return d.Publisher}))
            .range(["#b2df8a","#1f78b4","#6a3d9a", "#b15928","#a6cee3","#ffff99", "#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6"]);


        let mouseover = function(d) {
            let color_span = `<span style="color: ${color(d.Publisher)};">`;
            let html = `<b>Top Publisher: ${d.Publisher}<br/>
                    Global ${d.Genre} Game Sales by ${d.Publisher}: ${d.GlobalSales}</b></span>`;       // HINT: Display the song here

            // Show the tooltip and set the position relative to the event X and Y location
            tooltip.html(html)                 
                .transition()
                .duration(200)
                .style("opacity", 0.9)

        };
    
            // Mouseout function to hide the tool on exit
        let mouseout = function(d) {
            // Set opacity back to 0 to hide
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        };
        /*
            This next line does the following:
                1. Select all desired elements in the DOM
                2. Count and parse the data values
                3. Create new, data-bound elements for each data value
        */
        let bars = svg.selectAll("rect").data(data);

        // TODO: Render the bar elements on the DOM
        /*
            This next section of code does the following:
                1. Take each selection and append a desired element in the DOM
                2. Merge bars with previously rendered elements
                3. For each data point, apply styling attributes to each element

            Remember to use the attr parameter to get the desired attribute for each data point
            when rendering.
        */
        bars.enter()
            .append("rect")
            .on("mouseover", mouseover) // HINT: Pass in the mouseover and mouseout functions here
            .on("mouseout", mouseout)
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("fill", function(d) {return color(d.Publisher)})
            .attr("x", x(0))
            .attr("y", function(d) {return y(d.Genre)})               // HINT: Use function(d) { return ...; } to apply styles based on the data point
            .attr("width", function(d) {return x(parseInt(d.GlobalSales))})
            .attr("height",  y.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height
            
        y_axis_text.text(`Games`);
        title.text(`Number of Global Sales for the Top Publisher in each Genre`);

        // Remove elements not in use if fewer groups in new dataset
        bars.exit().remove();
        // counts.exit().remove();
    });




    /**
     * Cleans the provided data using the given comparator then strips to first numExamples
     * instances
     */
    // function cleanDataVG1(data, year, all_time) {
    function cleanDataVG3(data) {
        // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
        let genres = {};
        let publishers = []
        for (i = 0; i < data.length; i++) {
            newG = true;
            newP = true;
            genre = data[i]["Genre"];
            publisher = data[i]["Publisher"]
            for (let exists in genres) {
                if (genre == exists) {
                    newG = false;
                }
            }
            if (newG) {
                genres[genre] = {};
            }

            for (j = 0; j < publishers.length; j++) {
                if (publisher == publishers[j]) {
                    newP = false;
                }
            }
            if (newP) {
                publishers.push(publisher)
            }
        } 

        for (let genre in genres) {
            console.log("hello")
            for (j = 0; j < publishers.length; j++) {
                genres[genre][publishers[j]] = 0;
            }
        }

        for (i = 0; i < data.length; i++) {
            genre = data[i]["Genre"];
            publisher = data[i]["Publisher"]
            genres[genre][publisher] += parseInt(data[i]["Global_Sales"])
        }

        toReturn = []
        for (let genre in genres) {
            sales = 0;
            choice = 0;
            for (j = 0; j < publishers.length; j++) {
                if (genres[genre][publishers[j]] > sales) {
                    sales = genres[genre][publishers[j]];
                    choice = publishers[j];
                }
            }
            toReturn.push({Genre : genre, Publisher: choice, GlobalSales: sales})
        } 

        return toReturn;
    }

})();


setDataVG2('Global_Sales')

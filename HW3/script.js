
/*globals d3, topojson, document*/
// These are helpers for those using JSHint

var data,
    locationData,
    teamSchedules,
    selectedSeries,
    colorScale;

var sum;
var x;
/* EVENT RESPONSE FUNCTIONS */

function setHover(d) {
    // There are FOUR data_types that can be hovered;
    // nothing (null), a single Game, a Team, or
    // a Location
   // ******* TODO: PART V *******
var x="";
    if(d.data_type=="Game")
    {
        x=d["Visit Team Name"]+"@"+d["Home Team Name"];

    }
    else if(d.data_type=="Team")
    {
        x= d.name;

    }
    else if(d.data_type=="Location")
    {
         for (values in d.games) {

             if(values==0)
                 x =  d.games[values]["Visit Team Name"] + "@" + d.games[values]["Home Team Name"];
             else
                 x = x +","+ d.games[values]["Visit Team Name"] + "@" + d.games[values]["Home Team Name"];
         }
    }
    else
    {
        x="";
    }
   // document.getElementById("info").innerHTML=JSON.stringify(x);
   }
    function clearHover() {
    setHover(null);
}

function changeSelection(d) {
    // There are FOUR data_types that can be selected;
    // an empty selection (null), a single Game,
    // a Team, or a Location.

    // ******* TODO: PART V *******
    //  console.log(d)
    if(d.data_type=="Game")
    {
        selectedSeries= [d];


    }
    else if(d.data_type=="Team")
    {
        var name_1 = d.name;
        selectedSeries = teamSchedules[name_1];

    }
    else if(d.data_type=="Location") {
        selectedSeries = d["games"];

    }
    else
    {
        selectedSeries="";

    }
    // Update everything that is data-dependent
    // Note that updateBarChart() needs to come first
    // so that the color scale is set
 //   console.log();
 sum=0;
 x=0;

    for(i in selectedSeries)
    {
   sum=sum+selectedSeries[i]["attendance"];
        x++;
    }
   console.log(sum+","+x);
    updateBarChart();
    updateMap();
    updateForceDirectedGraph();
}

/* DRAWING FUNCTIONS */

function updateBarChart() {

    var margin ={top:30, right:30, bottom:30, left:40},
        width  = 427 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    var textHeight = 40;
    var textWidth  = 40;
    var max = d3.max(selectedSeries, function(d) { return d.attendance; });
    var min = d3.min(selectedSeries, function(d) { return d.attendance; });
    // Create the x and y scales; make
    // sure to leave room for the axes

    var xScale = d3.scale.ordinal()
        .rangeRoundBands([textWidth, 400], .1);
    xScale.domain(selectedSeries.map(function (d) {
        return d.Date;
    }))
    var yScale = d3.scale.linear()
        .domain([0, max])
        .range([0, 300])
        .nice();

    // Create colorScale (note that colorScale
    // is global! Other functions will refer to it)
     colorScale = d3.scale.linear()
        .domain([min, max])
        .range(["#4587de", "#606f5b"]);

    // Create the axes (hint: use #xAxis and #yAxis)

    var xAxisG = d3.select("#xAxis");
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    xAxisG
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.15em")
        .attr("dy", ".02em")
        .attr("transform", "rotate(-65)" );

    var yAxisG = d3.select("#yAxis");
    var yScaleInverted = d3.scale.linear()
        .domain([90000, 0])
        .range([0, 300])
        .nice();
    var yAxis = d3.svg.axis()
        .scale(yScaleInverted)
        .orient("left");
    yAxisG
        .call(yAxis);


    var barchartG = d3.select("#barChart")
        .attr({
            width: 427,
            height: 500
        })
        .append("g")
        .attr("transform", "translate(" + margin.left  + "," + margin.top + ")");


    // Create the bars (hint: use #bars)
    spacing = (width - textWidth)/ selectedSeries.length;

    var bars = d3.select("#bars")
        .selectAll("rect")
        .data(selectedSeries);
    bars
        .enter()
        .append("rect");
    bars .transition().duration(2000)
        .attr("x", function (d, i) {
            return xScale(d.Date);
        })
        .attr("y", margin.top + textHeight)
        .attr("height", function(d, i) {
            return yScale(d.attendance);
        })
        .attr("width", spacing * 0.8)
        .style("trans",1000)
        .style("fill", function (d){
            return colorScale(d.attendance);
        });
    bars.on("mouseover", function(d) {setHover(d);})
    bars.on("click", function(d)  {

        changeSelection(d);
    });
    bars
        .exit()
        .remove();

}

function updateForceDirectedGraph() {
    // ******* TODO: PART II *******
    var svgBounds = document.getElementById("graph").getBoundingClientRect();
    var width = svgBounds.width;
    var height = svgBounds.height;

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([width, height]);
    force
        .nodes(data.vertices)
        .links(data.edges)
        .start();
 //console.log(selectedSeries);
    var link = d3.select("#links").selectAll("line").data(data.edges);
       link .enter().append("line");


    var node=d3.select("#graph").selectAll("path").data(data.vertices);
   node
        .enter().append("path")
        .attr("class", "node")
        .attr("d", d3.svg.symbol()
            .type(function(d) {

                   if (d.data_type=="Team")return d3.svg.symbolTypes[5];
               else if(d.data_type=="Game") {
                       return d3.svg.symbolTypes[0];
                   }}))
        .style("fill",function(d){
           return "gray";
       })
        .call(force.drag);

    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });


        node.attr("transform", function(d) {
            if(isObjectInArray(d,selectedSeries))
            return "translate(" + d.x + "," + d.y + ") scale(2)";
            else
                return "translate(" + d.x + "," + d.y + ") scale(1)";

        });
        node.style("fill",function(d){
          //  console.log("hi");
            if(isObjectInArray(d,selectedSeries))
            {

                return colorScale(d.attendance);
            }
            else
            {
                return "black";
            }});


    });
    node.on("mouseover", function(d) {setHover(d);});

    node.on("click",function(d){
       // d3.select(this).style("fill","blue");
        changeSelection(d);


    });

    node.append("title")
        .text(function(d) { return d.name; });

    node.exit().remove();
    link.exit().remove();


}

function updateMap() {
    // ******* TODO: PART III *******


    var svgBounds = document.getElementById("map").getBoundingClientRect();

    width = svgBounds.width;
    height = svgBounds.height;

    var svg = d3.select("#map");
    projection = d3.geo.albersUsa()
        .translate([width / 2, height / 2]).scale([700]);
    Location_data =  d3.values(locationData);
    location_keys = d3.keys(locationData);

var cl;
    var sum=0;
  var c=  d3.select("#points").selectAll("circle").data(Location_data);

       c .enter()
        .append("circle");

        c.attr("cx", function (d) {
            return projection([d.longitude, d.latitude])[0];
        })
        .attr("cy", function (d) {
            return projection([d.longitude, d.latitude])[1];
        })
        .attr("r", function (d) {

            for(i=0;i<d["games"].length;i++)
            {
               // console.log(d["games"][i]["attendance"]);
                if (isObjectInArray(d["games"][i], selectedSeries)) {

                   return "6px";
                }
            }
            return "3px";
        })


        //.attr("class","circles")
            .style("fill",function(d){

                for(i=0;i<d["games"].length;i++)
                {
                    // console.log(d["games"][i]["attendance"]);
                    if (isObjectInArray(d["games"][i], selectedSeries)) {
                       console.log(colorScale(sum/x)+","+"in map");
                        return colorScale(sum);
                    }
                }
                return "black";
            })
        .on("click",function(d){ changeSelection(d);})
        .on("mouseover", function(d) {setHover(d);});

   //s svg.remove();

    // ******* TODO: PART V *******

    // Update the circle appearance (set the fill to the
    // mean attendance of all selected games... if there
    // are no matching games, revert to the circle's default style)

}

function drawStates(usStateData) {
    // ******* TODO: PART III *******

    // Draw the background (state outlines; hint: use #states)

    var svgBounds = document.getElementById("map").getBoundingClientRect();

    width = svgBounds.width;
    height = svgBounds.height;

    var svg = d3.select("#map");
    projection = d3.geo.albersUsa()
        .translate([width / 2, height / 2]).scale([700]);

    var path = d3.geo.path().projection(projection);

    svg.selectAll("#states")
        .datum(topojson.feature(usStateData,usStateData.objects.states))
        .attr("d", path);


}


/* DATA DERIVATION */

// You won't need to edit any of this code, but you
// definitely WILL need to read through it to
// understand how to do the assignment!

function dateComparator(a, b) {
    // Compare actual dates instead of strings!

    return Date.parse(a.Date) - Date.parse(b.Date);
}

function isObjectInArray(obj, array) {
    // With Javascript primitives (strings, numbers), you
    // can test its presence in an array with
    // array.indexOf(obj) !== -1

    // However, with actual objects, we need this
    // helper function:
    var i;
    for (i = 0; i < array.length; i += 1) {
     //   console.log(JSON.stringify(array[i])+","+JSON.stringify(obj));
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}

function deriveGraphData() {
    // Currently, each edge points to the "_id" attribute
    // of each node with "_outV" and "_inV" attributes.
    // d3.layout.force expects source and target attributes
    // that point to node index numbers.

    // This little snippet adds "source" and "target"
    // attributes to the edges:
    var indexLookup = {};
    data.vertices.forEach(function (d, i) {
        indexLookup[d._id] = i;
    });
    data.edges.forEach(function (d) {
        d.source = indexLookup[d._outV];
        d.target = indexLookup[d._inV];
    });
}

function deriveLocationData() {
    var key;

    // Obviously, lots of games are played in the same location...
    // ... but we only want one interaction target for each
    // location! In fact, when we select a location, we want to
    // know about ALL games that have been played there - which
    // is a different slice of data than what we were given. So
    // let's reshape it ourselves!

    // We're going to create a hash map, keyed by the
    // concatenated latitude / longitude strings of each game
    locationData = {};

    data.vertices.forEach(function (d) {
        // Only deal with games that have a location
        if (d.data_type === "Game" &&
            d.hasOwnProperty('latitude') &&
            d.hasOwnProperty('longitude')) {

            key = d.latitude + "," + d.longitude;

            // Each data item in our new set will be an object
            // with:

            // latitude and longitude properties,

            // a data_type property, similar to the ones in the
            // original dataset that you can use to identify
            // what type of selection the current selection is,

            // and a list of all the original game objects that
            // happened at this location

            if (!locationData.hasOwnProperty(key)) {
                locationData[key] = {
                    "latitude": d.latitude,
                    "longitude": d.longitude,
                    "data_type": "Location",
                    "games": []
                };
            }
            locationData[key].games.push(d);
        }
    });

    // Finally, let's sort each list of games by date
    for (key in locationData) {
        if (locationData.hasOwnProperty(key)) {
            locationData[key].games = locationData[key].games.sort(dateComparator);
        }
    }
}

function deriveTeamSchedules() {
    var teamName;

    // We're going to need a hash map, keyed by the
    // Name property of each team, containing a list
    // of all the games that team played, ordered by
    // date
    teamSchedules = {};

    // First pass: I'm going to sneakily iterate over
    // the *edges*... this will let me know which teams
    // are associated with which games
    data.edges.forEach(function (d) {
        // "source" always refers to a game; "target" always refers to a team
        teamName = data.vertices[d.target].name;
        if (!teamSchedules.hasOwnProperty(teamName)) {
            teamSchedules[teamName] = [];
        }
        teamSchedules[teamName].push(data.vertices[d.source]);
    });

    // Now that we've added all the game objects, we still need
    // to sort by date
    for (teamName in teamSchedules) {
        if (teamSchedules.hasOwnProperty(teamName)) {
            teamSchedules[teamName] = teamSchedules[teamName].sort(dateComparator);
        }
    }
}


/* DATA LOADING */

// This is where execution begins; everything
// above this is just function definitions
// (nothing actually happens)

d3.json("data/us.json", function (error, usStateData) {
    if (error) throw error;

    drawStates(usStateData);
});
d3.json("data/pac12_2013.json", function (error, loadedData) {
    if (error) throw error;

    // Store the data in a global variable for all functions to access
    data = loadedData;

    // These functions help us get slices of the data in
    // different shapes
    deriveGraphData();
    deriveLocationData();
    deriveTeamSchedules();
sum=0;
    x=0;
    // Start off with Utah's games selected
    selectedSeries = teamSchedules.Utah;
    for(i in selectedSeries)
    {
        sum=sum+selectedSeries[i]["attendance"];
        x++;
    }
    console.log(sum+","+x);
    // Draw everything for the first time
    updateBarChart();
    updateForceDirectedGraph();
    updateMap();
});


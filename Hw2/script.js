/*globals alert, document, d3, console*/
// These keep JSHint quiet if you're using it (highly recommended!)
window.onload=function()
{
    changeData();
}

function staircase() {
    // ****** TODO: PART II ****
    //window.alert("i am here");
   // var xmlns = "http://www.w3.org/2000/svg";

    var c=document.getElementById("bg1").children;
    var a=20;

    for(i=0;i< c.length;i++)
    {
        c[i].setAttribute("height",a);
        a=a+10;
    }

}

function update(error, data) {
    if (error !== null) {
        alert("Couldn't load the dataset!");
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()
        data.forEach(function (d) {
            d.a = parseInt(d.a);
            d.b = parseFloat(d.b);
        });
    }

    // Set up the scales
    var aScale = d3.scale.linear()
        .domain([0, d3.max(data, function (d) {
            return d.a;
        })])
        .range([0, 150]);
    var bScale = d3.scale.linear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([0, 150]);
    var iScale = d3.scale.linear()
        .domain([0, data.length])
        .range([0, 110]);

   // console.log("data");
    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
    //console.log("data");
    //console.log(data);
/*
   var a= d3.select("#bc1");
       a.selectAll("rect")
        .data(data)
        .attr("y", 0)
        .attr("x", function (d, i) {
          //  i=i+20;
            return i*10+10;
        })
        .attr("height", function (d, i) {
            return d.a*10;
        })
        .attr("width",10)
        .on("mouseover", function(d) {
            d3.select(this).attr("class", "barChartHover");
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("class", "barChart");
        });
*/

    var a= d3.select("#bg1").selectAll("rect")
        .data(data);
    a.enter().append("rect")
        .classed("barChart", true);
    a.exit().remove();
    a.attr("y", 0)
        .attr("x", function (d, i) {
             i=i*10;
            return i;
        })
        .attr("height", function (d, i) {
            return d.a*10;
           // return aScale(d)
        })
        .attr("width",10)
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "black");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", "steelblue");
        });
   // a.exit().remove();




    // now we do something with the incoming selection
        //selection


    // TODO: Select and update the 'b' bar chart bars

var b=
    d3.select("#bc2").selectAll("rect")
        .data(data);
    b.enter().append("rect")
        .classed("barChart", true);
    b.exit().remove();
       b .attr("y", 0)

        .attr("x", function (d, i) {
              i=i*10;
            //return i*10+10;
            return i;
        })
        .attr("height", function (d, i) {
            return d.b*10;
        })
        .attr("width",10)
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "black");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", "steelblue");
        });

    // TODO: Select and update the 'a' line chart path using this line generator



    var aLineGenerator = d3.svg.line()
        .x(function (d, i) {
           // i=i+10;
            return iScale(i);
        })
        .y(function (d) {
            return aScale(d.a);
        });
    d3.select("#li1").selectAll("path")
        .data(data)
        .attr("d",aLineGenerator(data));
       // .style("fill", "steelblue")
    // TODO: Select and update the 'b' line chart path (create your own generator)


    var bLineGenerator = d3.svg.line()
        .x(function (d, i) {
           // i=i+10;
            return iScale(i);
        })
        .y(function (d) {
            return bScale(d.b);
        });
    d3.select("#li2").select("path")
        .data(data)
        .attr("d",bLineGenerator(data));


    // TODO: Select and update the 'a' area chart path using this line generator
    var aAreaGenerator = d3.svg.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return aScale(d.a);
        });
    d3.select("#ac1").selectAll("path")
        .data(data)
        .attr("d",aAreaGenerator(data));


    // TODO: Select and update the 'b' area chart path (create your own generator)


    var bAreaGenerator = d3.svg.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return bScale(d.b);
        });
    d3.select("#ac2").selectAll("path")
        .data(data)
        .attr("d",bAreaGenerator(data));

    // TODO: Select and update the scatterplot points

   var c= d3.select("#sp").selectAll("circle")
        .data(data);
    c.enter().append("circle").classed("circle", true);
    c.exit().remove();
        c.attr("cx", function (d) { //return d.a*10;
        return aScale(d.a); })
        .attr("cy", function (d) { //return d.b*10
                return bScale(d.b);
         })
        .attr("r", 5)
        .on("mouseover", function(d) {
           var x=d3.select(this).attr("cx");
            var y=    d3.select(this).attr("cy");
             console.log(x+" , "+y);
         var new_x= d3.select("#te");
                var p = d3.selectAll("p");
                p.text(x+","+y);

        })
            .on("mouseout", function(d) {


            }

        );



}

function changeData() {
    // Load the file indicated by the select menu
    var dataFile = document.getElementById('dataset').value;
    d3.csv('data/' + dataFile + '.csv', update);

}

function randomSubset() {
    // Load the file indicated by the select menu,
    // and then slice out a random chunk before
    // passing the data to update()

    var dataFile = document.getElementById('dataset').value;
    d3.csv('data/' + dataFile + '.csv', function (error, data) {
        var subset = [];
        data.forEach(function (d) {
            if (Math.random() > 0.5) {
                subset.push(d);
            }
        });

        update(error, subset);
    });
}

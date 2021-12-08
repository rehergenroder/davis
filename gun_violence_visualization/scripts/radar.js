// dimensions
var width = 700;
var height = 640;

// svg append
var radarSVG = d3.select("body")
    .select("#radar")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    var allAxis = {};
    var filteredData = [];
    var colorArr = [];


function drawRadar(data, dropSelection) {
    console.log(d3.select("#radar").selectAll("*"));
    d3.select("#radar")
        .select("svg").remove();
    var radarSVG = d3.select("body")
        .select("#radar")
        .append("svg")
        .attr("width", 700)
        .attr("height", 640);

    var domain = d3.max(data, function (d) {
        return +d["Percent of adults with a bachelor's degree or higher"];
    });

    filteredData = [];
    colorArr = [];
    allAxis = {};
   
    if(dropSelection == "poverty_all") {
        data.forEach(function (d) {
            filteredData.push(
                [d.poverty_all, d.poverty_children, d.unemployment]
            );
            colorArr.push(colorObj(d.poverty_all));
        });
        allAxis = ["Population in poverty", "Children in poverty", "Unemployed"];

        domain = d3.max(data, function (d) {
            return +d.poverty_children;
        });

    }
    else if(dropSelection == "Percent of adults with less than a high school diploma"){
        data.forEach(function (d) {
            filteredData.push(
                [d["Percent of adults with less than a high school diploma"],
                d["Percent of adults completing some college or associate's degree6"],
                d["Percent of adults with a bachelor's degree or higher"],
                d["Percent of adults with a high school diploma only"]              
                ]);
                colorArr.push(colorObj(d["Percent of adults with less than a high school diploma"]));
        });
        allAxis = ["Less than a high school diploma", "Some College", "Bachelor's or higher","HS diploma only"];

    }
    else {
        data.forEach(function (d) {
            filteredData.push(
                [d.poverty_all, d.poverty_children, d.unemployment,
                d["Percent of adults with less than a high school diploma"],
                d["Percent of adults completing some college or associate's degree6"],
                d["Percent of adults with a bachelor's degree or higher"],
                d["Percent of adults with a high school diploma only"],
                d.apply_weights]);
            colorArr.push(colorObj(d.apply_weights));
        allAxis = ["Population in poverty", "Children in poverty", "Unemployed", "Less than a high school diploma", "Some College", "Bachelor's or higher", "HS diploma only", "Custom weight"];
        });

    }


 
    var radius = Math.min(280, 250);
    var radiusScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, domain]);


    var g = radarSVG.append("g")
        .attr("transform", "translate(350, 380)");

    var axisGrid = g.append("g")
        .attr("class", "axisWrapper");
    
    axisGrid.selectAll(".levels")
        .data(d3.range(1,11).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function (d, i) {
            return radius/11*d;
        })
        .style("fill", "#4e4e4e")
        .style("stroke", "#FFFFFF")
        .style("fill-opacity", .2);

    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1,11).reverse())
        .enter()
        .append("text")
        .attr("x", 4)
        .attr("y", function (d) {
            return -d*radius/11;
        })
        .attr("dy", "0.1em")
        .attr("font-size", "10px")
        .attr("fill", "#FFFFFF")
        .text(function (d, i) {
            return d3.format(".2")(domain*d/10) +"%";
        });

    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    var numLines = allAxis.length;
    var angleSlice = Math.PI *2 / numLines;

    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function (d, i) {
            return radiusScale(domain) * Math.cos(angleSlice * i - Math.PI/2);
        })
        .attr("y2", function (d, i) {
            return radiusScale(domain) * Math.sin(angleSlice * i - Math.PI/2);
        })
        .attr("class", "line")
        .style("stroke", "#FFFFFF")
        .style("stroke-width", "2px");

    axis.append("text")
        .attr("class", "axisLabel")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("font-weight", 500)
        .attr("dy", "1.5em")
        .attr("transform", function (d,i) {
            return "translate(0, -10)";
        })
        .attr("x", function (d, i) {
            return radiusScale(domain)* Math.cos(angleSlice * i - Math.PI/2);
        })
        .attr("y", function (d, i) {
            return radiusScale(domain) * Math.sin(angleSlice * i - Math.PI/2);
        })
        .attr("fill", "#FFFFFF")
        .text(function (d) {
            return d;
        });

    var num = 0;
    
    filteredData.forEach(function (d) {
        var nodeVal = [];
        g.selectAll(".nodes")
            .data(d, function(j, i) {
                nodeVal.push([
                    radiusScale(j/1.1) * Math.cos(angleSlice * i - Math.PI/2),
                    radiusScale(j/1.1) * Math.sin(angleSlice * i - Math.PI/2)
                ]);
            });

        nodeVal.push(nodeVal[0]);

        g.selectAll(".area")
            .data([nodeVal])
            .enter()
            .append("polygon")
            .attr("class", "radar" + num)
            .style("stroke-width", "2px")
            .style("stroke", "#FFFFFF")
            .style("fill", colorArr[num])
            .attr("opacity", .1)
            .attr("points", function (d) {
                var str = "";
                for(var i = 0; i < d.length; i++){
                    str = str + d[i][0] + ", " + d[i][1] + " ";
                }
                return str;
            })
            .on("mousemove", function (d) {
                var q = this;
                hoverMap((q.className.baseVal.substring(5)*2-1 + 6000), data[+q.className.baseVal.substring(5)]["Area name"]);
    //            radarHover(this, data);
            })
            .on("mouseout", function (d) {
                resetHoverMap((this.className.baseVal.substring(5)*2-1+6000));
//                resetRadar(this);
            });
            num++;
    });

    num=0;
}

function getRadarObject(q, d, data) {
    return data[+q.className.baseVal.substring(5)];
}

function getRadarPoly(id) {
    return (d3.select(".radar" + ((id - 5999)/2)))._groups[0][0];
}

function radarHover(q, data) {
    d3.select(q).attr("opacity", 1).style("stroke", "#daa520").style("stroke-width", "5px");
    console.log(q.className.baseVal.substring(5)*2-1 + 6000);
    var name = data[q.className.baseVal.substring(5)]["Area name"];

    appendRadarText(filteredData[+q.className.baseVal.substring(5)], name);
}

function appendRadarText(d, name){
    var hoverDisplay = d3.select("#radar").select("svg").append("g")
        .attr("class", "radarHover");
    
    hoverDisplay.append("text")
        .attr("transform", "translate(350, 30)")
        .attr("font-size", "18px")
        .attr("font-weight", 700)
        .attr("text-anchor", "middle")
        .attr("fill", "#FFFFFF")
        .text(name);

    d.forEach(function (d, i) {
        hoverDisplay.append("text")
            .attr("transform", "translate(350, " + (40+(i * 15)) + ")")
            .attr("font-size","10px")
            .attr("font-weight", 700)
            .attr("text-anchor", "middle")
            .attr("fill", "#daa520")
            .text(allAxis[i] + " " + d);
    });
}

function resetRadar(q){
//    resetHoverMap();
    d3.selectAll(".radarHover").remove();
    d3.select(q).attr("opacity", .1).style("stroke", "#FFFFFF").style("stroke-width","2px");
}

// append svg
var map = d3.select("body")
    .select("#map")
    .append("svg")
    .attr("width", 550)
    .attr("height", 900);

var projection = d3.geoAlbersUsa()
    .scale(4000)
    .translate([1575, 460]);


var color = {};
var clickLocation = null;
var resetGunData = {}
var currentScatterData = {};
var ratebyid = {};
var popData =[];

function colorObj(obj){
    return color(obj);
}

function drawMap(jsonData, popFilter, dropSelection, gunData){
    map.selectAll("*").remove();
    var path = d3.geoPath().projection(projection);
    popData = popFilter;
    ratebyid = extractDropDownField(popFilter, dropSelection);
    color = defineChoroplethColor(ratebyid, dropSelection);
    var legend = map.append("g")
        .attr("id", "legend");


    map.append("g")
        .attr("transform", "translate(-100,0)")
        .selectAll("path")
        .data(topojson.feature(jsonData, jsonData.objects.subunits).features)
        .enter()
        .append("path")
        .attr("fill", function (d) {
            var buff = +d.id;
            return color(ratebyid[buff]);
        })
        .attr("d", path)
        .on("mouseover", function (d) {
            hoverMap(+d.id, d["properties"]["fullName"]);
        })
        .on("mouseout", function (d) {
            resetHoverMap(+d.id);
        })
        .on("click", mapClick);

    makeLegend(color, dropSelection, legend);
    drawScatter(gunData);

    function mapClick(d, i) {
        if(clickLocation == null) {
            map.selectAll("path")
                .attr("opacity", .2);
            clickLocation = this;
            setMapSelection(d.id);
        }
        else {
            map.selectAll("path")
                .attr("opacity", 1)
            clickLocation = null;
            clearMapSelection(d.id);
            drawParallelLines(currentScatterData);
        }
        d3.select(this).attr('opacity', 1);
    }



}

function hoverMap(id, name){
    var hoverDisplay = map.append("g")
        .attr("class", "hoverDisplay");

    hoverDisplay.append("text")
        .attr("transform", "translate(400,220)")
        .attr("font-size", "18px")
        .attr("font-weight", 700)
        .attr("text-anchor", "middle")
        .attr("fill", "#FFFFFF")
        .text(name);

    hoverDisplay.append("text")
        .attr("transform", "translate(400,240)")
        .attr("font-size", "18px")
        .attr("font-weight", 700)
        .attr("text-anchor", "middle")
        .attr("fill", "#daa520")
        .text(d3.format(".3")(ratebyid[id]) + "%");
        console.log(id);
   radarHover(getRadarPoly(id), popData); 
}

function resetHoverMap(id) {
    d3.select("#map").selectAll(".hoverDisplay").selectAll("text").remove();
    resetRadar(getRadarPoly(id));
}

function drawScatter(data) {
    console.log(data);
    var scatterSelection = map.selectAll("circle")
        .data(data);

    currentScatterData = data;

    scatterSelection
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return projection([d["lon"], d["lat"]])[0] -100;
        })
        .attr("cy", function (d) {
            return projection([d["lon"], d["lat"]])[1];
        })
        .on("mouseover", hover)
        .on("mouseout", hoverReset)
        .attr("r", 3)
            .transition()
            .duration(400)
            .attr("r", 10)
            .transition()
        .attr("r", 3)
        .attr("fill", "#000000")
        .attr("opacity", .3);

    scatterSelection.exit().remove();
}

function clearScatter() {
    map.selectAll("circle").remove();
}


function makeLegend(color, dropSelection, legend) {
    var legendItem = legend.selectAll(".legendItem")
        .data(d3.range(9))
        .enter()
        .append("g")
            .attr("class", "legendItem")
            .attr("transform", function(d, i) {
                return "translate(" + i*44 + ",0)";
            });
        
    legendItem.append("rect")
        .attr("x", 80)
        .attr("y", 800)
        .attr("width", 40)
        .attr("height", 15)
        .attr("class", "rect")
        .style("fill", function (d, i) {
            return color.range()[i];
        });

    var legendText = d3.ticks(color.domain()[0], color.domain()[1], 9);

    legendItem.append("text")
        .attr("x", 100)
        .attr("y", 835)
        .attr("fill", "#FFFFFF")
        .attr("font-size", "10x")
        .attr("font-weight", 700)
        .attr("text-anchor", "middle")
        .text(function (d, i) {
            return legendText[i] + "%";
        });
       
    legend.append("text")
        .attr("transform", "translate(275, 860)")
        .attr("fill", "#FFFFFF")
        .attr("font-size", "10x")
        .attr("font-weight", 700)
        .attr("text-anchor", "middle")
        .text(function () {
            if(dropSelection == "poverty_all"){
                return "% People in Poverty";
            }
            else if(dropSelection == "Percent of adults with less than a high school diploma"){
                return "% Adults Without High School Diploma";
            }
            else if(dropSelection = "apply_weights"){
                var weight = getWeight();
                return "(" + weight/100 + ")*(% Poverty) + (" + (100 - weight)/100 + ")*(% No Diploma)";
            }
        });
         
}



function extractDropDownField(popData, field) {
    var extractedField = {};

     popData.forEach(function (d) {
        extractedField[d["FIPS Code"]] = +d[field];
        if(d["FIPS Code"] % 1000 == 0){
            extractedField[d["FIPS Code"] / 1000] = +d[field];
        }
    });
    
    return extractedField;
}

function defineChoroplethColor(ratebyid, dS) {
    var colorRange = [
        {"id" : "Percent of adults with less than a high school diploma", "range" : d3.schemeReds[9]},
        {"id" : "poverty_all", "range" : d3.schemeBlues[9]},
        {"id" : "apply_weights", "range" : d3.schemePurples[9]}];

    var color = d3.scaleQuantize()
        .domain(d3.extent(d3.values(ratebyid)))
        .range(colorRange.filter(function (d) {
            return d.id == dS;
        })[0].range);

    console.log(color.domain());
    return color;
}

function key(d) {
    return d["id"];
}

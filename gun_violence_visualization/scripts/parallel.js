// dimensions 
var width = 550;
var height = 900;

// svg append
var parallel = d3.select("body")
    .select("#parallel")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

function key(d) {
    return d["id"];
}

var y = {};
var x = {};
var dimensions = {};
var dragging = {};
var parallelData = {};
var brushSel = [];
var sliderSelection =[];
var dropDownSelection = {};


var parallel2 = d3.select("body")
    .select("#parallel")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");

function drawParallel(data, dropSelection, sliderDataSelection){
    parallel.selectAll("*").remove();

    sortData(dropSelection, data);
    dimensions.sort();
    
    x = d3.scalePoint().domain(dimensions)
    .range([0, 550])
    .padding(.4);

    sliderSelection = sliderDataSelection;
    dropDownSelection = dropSelection;

    parallelData = data;
    drawParallelLines(sliderDataSelection);    
    drawAxes(data);
}

function drawAxes(data){
   parallel.selectAll("*").remove();

    var axis = parallel.selectAll("axis")
        .data(dimensions)
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + x(d) + ")";
        })
        .attr("class", "axis");

    // append brush to axis
    axis.append("g")
        .each(function (d) {
            d3.select(this).call(d3.axisLeft().scale(y[d]));
        })
        .selectAll("*").attr("fill", "#FFFFFF");
    axis.append("g")
        .attr("class", "brush")
        .each(function (d) {
            d3.select(this).
                call(y[d].brush = d3.brushY(y[d])
                    .extent([[-15, 150], [11, 850]])
                    .on("start", brushstart).on("end", brushend))
                    .selectAll("rect")
                        .attr("x", -8)
                        .attr("width", 16);
            });

    // axis text
    axis.append("g")
        .attr("transform", "translate(0,140)")
        .append("text")
        .style("text-anchor", "middle")
        .attr("fill", "#FFFFFF")
        .attr("font-size", "12px")
        .attr("y", -9)
        .text(function (d) {
            return d;
        });

//    parallelData = data;
    brushSel = data;
}

function brushend() {
    if(this.__brush.selection == null){
        d3.selectAll(".brush").remove();
        d3.select("#parallel").selectAll("rect").remove();
       
//        sliderSelection = parallelData; 
        drawAxes(parallelData); 
        clearParallelSelection();
        return;
    }
    console.log("wut2");

    var start = this.__brush.selection[0][1];
    var end = this.__brush.selection[1][1];
    var n = this.__data__;

    var brushSel = sliderSelection.filter(function (d) {
        return y[n](d[n]) >= start && y[n](d[n]) <= end; 
    });

    console.log(brushSel);

    sliderSelection = brushSel;
    
    parallel2.selectAll("path")
        .remove();
    parallel2.selectAll("path")
        .data(brushSel)    
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("fill-opacity" ,1)
        .attr("stroke", function (d) {
            return colorObj(d["pov_all"]);
        })
        .attr("stroke-width", "1px");
 
    clearScatter(); 
    drawScatter(brushSel);
}

function brushstart() {
    d3.event.sourceEvent.stopPropagation();
}

function path(d) {
    return d3.line()(dimensions.map(function (p) {
        return [x(p), y[p](d[p])];
    }));
}

function drawParallelLines(data) { 
    var parallelSelection = parallel2.selectAll("path")
        .data(data, key);

    scatterSelection = data;
    sliderSelection = data;

    parallelSelection
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", function (d) {
            return colorObj(d["pov_all"]);
        })
        .on("mousemove", hover)
        .on("mouseout", hoverReset)
        .attr("opacity", .2)
        .attr("stroke-width", "1px")
            .transition()
            .duration(400)
            .attr("stroke-width", "5px")
            .attr("opacity", 1)
            .transition()
        .attr("stroke-width", "1px")
        .attr("opacity", .2);
   
    parallelSelection
        .exit().remove();
}



function sortData(dropSelection, data) {
    if(dropSelection == "poverty_all"){
        dimensions = d3.keys(data[0]).filter(function (d) {
            return (d == "n_killed" 
                || d == "n_injured"
                || d == "unemployment"
                || d == "pov_all")
                && (y[d] = d3.scaleLinear().domain(d3.extent(data, function (p) {
                    return +p[d]; }))
                    .range([850, 150]));
        });
    }
    else if(dropSelection == "Percent of adults with less than a high school diploma"){
        dimensions = d3.keys(data[0]).filter(function (d) {
            return (d == "n_killed"
                || d == "n_injured"
                || d == "unemployment"
                || d == "less_than_hs")
                && (y[d] = d3.scaleLinear().domain(d3.extent(data, function (p) {
                    return +p[d]; }))
                    .range([850, 150]));
        });
    }
    else {
        dimensions = d3.keys(data[0]).filter(function (d) {
            return (d == "n_killed"
                || d == "n_injured"
                || d == "unemployment"
                || d == "less_than_hs"
                || d == "pov_all")
                && (y[d] = d3.scaleLinear().domain(d3.extent(data, function (p) {
                    return +p[d]; }))
                    .range([850, 150]));
        });
    }
}

function clearParallelLines(){
    parallel2.selectAll("*").remove();
}

function parallelHover(id, name) {
    var parDisplay = parallel.append("g")
        .attr("class", "parDisplay");

    parDisplay.append("text")
        .attr("transform", "translate(275, 25)")
        .attr("font-size", "18px")
        .attr("font-weight", 700)
        .attr("text-anchor", "middle")
        .attr("fill", "#FFFFFF")
        .text(name);

    var item = gunData.filter(function (d) {
        return d.id == id;
    }); 
    console.log(item);
    dimensions.forEach(function (d,i) {
        console.log(i);
        parDisplay.append("text")
            .attr("transform", "translate(275, " +(45+(i*15)) + ")")
        .attr("font-size", "14px")
        .attr("font-weight", 700)
        .attr("text-anchor", "middle")
        .attr("fill", "#daa520")
        .text(d + " = " + item[0][d]);
    });

}

function resetParallelHover() {
    d3.select("#parallel").selectAll(".parDisplay").selectAll("text").remove();
}

// dimensions
var width = 720;
var height = 200;

// append svg
var control = d3.select("body")
    .select("#control")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var sliderDataSelection ={};
var currentValue = 0;
var targetValue = 500;
var weight = null;
var dropOption = "poverty_all";
var mapSelection = null;
var parallelSelection = null;
var currentSliderPosition = {};
var gunData = {};
var popData = [];

function setUpControlBox(data, pop, jsonData) {
    var textGroup = control.append("g");
    var optionGroup = control.append("g");
    var sliderGroup = control.append("g");

    popData = pop;
    sliderDataSelection = data;
    gunData = data;
    setupText(textGroup);
    appendDropdown();
    appendTimeSlider(sliderGroup, data);

    // dropdown control
    d3.select("#dropDownDemographics").on("change", function (d) {
        console.log(this.value);
        weight = null;
        if(this.value == "apply_weights"){
            while(weight != parseInt(weight, 10) || weight < 0 || weight > 100) {
                weight = window.prompt("Please enter the weight to apply to poverty level\nWeight applied to education will be (100 - your_input)" , "Please enter an integer (0-100)");

                weight = +weight;
            
            }
            pop.forEach(function (d) {
                d["apply_weights"] = (weight/100)*d["poverty_all"] + (((100 - weight)/100)*d["Percent of adults with less than a high school diploma"]);
            });
        }
        dropOption = this.value;
        drawMap(jsonData, pop, this.value, sliderDataSelection);
        clearParallelLines();
        drawParallel(data, this.value, sliderDataSelection);
        drawRadar(pop, this.value);
    });
}

function getWeight(){
    return weight;
}

function appendTimeSlider(sliderGroup, data) {
    var startDate = new Date("2016-01-01");
    var endDate = new Date("2016-12-31");
    currentSliderPostion = startDate;

    var timeScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, 500])
        .clamp(true);

    var slider = sliderGroup
        .attr("class", "slider")
        .attr("transform", "translate(110,160)");

    slider.append("line")
        .attr("class", "track")
        .style("stroke", "#FFFFFF")
        .style("stroke-width", "10px")
        .attr("x1", timeScale.range()[0])
        .attr("x2", timeScale.range()[1])
        .select(function() {
            return this.parentNode.appendChild(this.cloneNode(true));
            })
        .attr("class", "track-overlay")
        .style("pointer-events", "stroke")
        .style("stroke-width", "50px")
        .style("stroke", "transparent")
        .style("cursor", "crosshair")
        .call(d3.drag()
            .on("start.interrupt", function () {
                slider.interrupt();
            })
            .on("start drag", function () {
                updateSlider(timeScale.invert(d3.event.x));
            }));


    var formatDateIntoMonth = d3.timeFormat("%b")
    var formatDate = d3.timeFormat("%b %d, %Y");

    slider.insert("g", "track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 +")")
        .selectAll("text")
        .data(timeScale.ticks(10))
        .enter()
        .append("text")
        .attr("x", timeScale)
        .attr("y", 10)
        .attr("text-anchor", "right")
        .attr("font-weight", 700)
        .attr("font-size", "14px")
        .attr("fill", "#FFFFFF")
        .text(function (d) {
            return formatDateIntoMonth(d);
        });

    var label = slider.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("font-weight", 700)
        .attr("fill", "#FFFFFF")
        .attr("font-size", "12px")
        .text(formatDate(startDate))
        .attr("transform", "translate(0," + (-10) +")");

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    function updateSlider(position) {
        handle.attr("cx", timeScale(position));
        
        currentValue = timeScale(position);
        currentSliderPosition = position;
        console.log(data.filter(function (d) {
            return d.date < position && d.county == "06029";
        }));
        sliderDataSelection = data.filter(function (d) {
            if(mapSelection == null){
                return d.date < position;
            }
            else{
                return d.date < position && d.county === mapSelection;
            }
        });
        
        label.attr("x", timeScale(position))
            .text(formatDate(position));
       
        console.log(sliderDataSelection);
        drawScatter(sliderDataSelection);
        drawParallel(data, dropOption, sliderDataSelection);
    }

   var playButton = d3.select("#play-button"); 
   var moving = false;

   playButton.on("click", function (d) {
        var button = d3.select(this);
        if(button.text() == "Pause"){
            moving = false;
            clearInterval(timer);
            button.text("Play");
            drawAxes(data);
        }
        else {
            moving = true;
            timer = setInterval(step, 10);
            button.text("Pause");
        }
    });

    function step() {
        updateSlider(timeScale.invert(currentValue));
        currentValue = currentValue + (targetValue/365);
        if(currentValue > targetValue){
            moving = false;
            clearInterval(timer);
            playButton.text("Play");
        }
    }

}

function setMapSelection(input) {
    mapSelection = input;
    clearScatter();
    var buff = sliderDataSelection.filter(function (d) {
        return d.county == input;
    });
    var buff2 = popData.filter(function (d) {
        return +d["FIPS Code"] == input;
    });
    drawScatter(buff);
    drawParallel(gunData, dropOption, buff);
  //  drawRadar(buff2, dropOption);
//    radarHover(getRadarPoly(input), popData);
}   
function clearMapSelection() {
    mapSelection = null;
    var buff = gunData.filter(function (d) {
        return d.date < currentSliderPosition; 
    });
    console.log("clear");
    console.log(gunData);
    sliderDataSelection = buff;
    drawScatter(buff);
    drawParallelLines(buff);   
//    drawRadar(popData, dropOption); 
}
function setParallelSelection(input) {
    parallelSelection = input;
}
function clearParallelSelection(){
    parallelSelection = null;
    if(mapSelection != null) {
        setMapSelection(mapSelection);
        return;
    }
    var buff = gunData.filter(function (d) {
        return d.date < currentSliderPosition;
    });
    sliderDataSelection = buff;
    drawScatter(buff);
    drawParallelLines(buff);
}


    
function appendDropdown() {

    var testData = [
        {"id" : "poverty_all", "text" : "Percentage of People in Poverty"},
        {"id" : "Percent of adults with less than a high school diploma", "text" : "Percent of adults with less than a high school diploma"},
        {"id" : "apply_weights", "text" : "Define weights for Poverty and Education"}];
   

    d3.select("body").append("select")
        .attr("id", "dropDownDemographics")
        .style("position", "absolute")
        .style("left", "790px")
        .style("top", "80px")
        .selectAll("option")
        .data(testData)
        .enter()
        .append("option")
        .attr("value", function (d) {
            return d.id;
        })
        .text(function (d) {
            return d.text;
        });
}


function setupText(textGroup) {
    // title
    textGroup.append("text")
        .attr("transform", "translate(360, 30)")
        .attr("font-weight", 700)
        .attr("text-anchor", "middle")
        .attr("font-size", "28px")
        .attr("fill", "#FFFFFF")
        .text("2016: Gun Violence in California");

    // box title(s)
    textGroup.append("text")
        .attr("transform", "translate (360, 60)")
        .attr("font-weight", 700)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "#FFFFFF")
        .text("Please select a population demographics filter:");

    textGroup.append("text")
        .attr("transform", "translate (360, 130)")
        .attr("font-weight", 700)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "#FFFFFF")
        .text("Please select a time frame:");
}

function hover(d) {
    var scatterCorrespond = d3.select("#map")
        .selectAll("circle")
        .filter(function (q) {
            return q == d;
        });

    var parallelCorrespond = d3.select("#parallel")
        .selectAll("path")
        .filter(function (q) {
            return q == d;
        });

    var radarCorrespond = d3.select("#radar")
        .selectAll("polygon")
        .filter(function (q) {
            return q == d;
        });
    console.log(d);

    d3.select(parallelCorrespond._groups[0][0])
        .attr("stroke-width", "5px")
        .attr("opacity", 1)
        .attr("stroke", "#daa520");

    d3.select(scatterCorrespond._groups[0][0])
        .attr("r", 10)
        .attr("fill", "#daa520")
        .attr("opacity", 1);


    console.log(d);

    hoverMap(+d.county, d.loc);
    parallelHover(+d.id, d.loc);
}

function hoverReset(d) {
    console.log(d.county);
    var scatterCorrespond = d3.select("#map")
        .selectAll("circle")
        .filter(function (q) {
            return q == d;
        });

    var parallelCorrespond = d3.select("#parallel")
        .selectAll("path")
        .filter(function (q) {
            return q == d;
        });
   
    d3.select(parallelCorrespond._groups[0][0])
        .attr("stroke-width", "1px")
        .attr("opacity", .2)
        .attr("stroke", colorObj(d["pov_all"]));

    d3.select(scatterCorrespond._groups[0][0])
        .attr("r", 3)
        .attr("fill", "#000000")
        .attr("opacity", .3);

    resetHoverMap(+d.county);
    resetParallelHover();
}

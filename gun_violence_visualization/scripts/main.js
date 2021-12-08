// queue files
d3.queue()
    .defer(d3.csv, "./data/gun.csv")
    .defer(d3.csv, "./data/populationDemographics.csv")
    .defer(d3.json, "./data/county.json")
    .await(ready);

function ready(error, data, pop, jsonData) {
    if (error) throw error;

    var dateparse = d3.timeParse("%Y-%m-%d");
    var features = topojson.feature(jsonData, jsonData.objects.subunits).features;
    console.log(features);
    var filter = data.filter(function (d) {
        d.date = dateparse(d.date.substring(0, 10));

        return d["state"] == "California"
            && d["lon"] != 0
            && d["lat"] != 0;

    });

    console.log(filter);
    var popFilter = pop.filter(function (d) {
        return d["State"] == "CA" 
            && d["lon"] != 0
            && d["lat"] != 0;
    });

    setUpControlBox(filter, popFilter, jsonData);

    drawMap(jsonData, popFilter, "poverty_all", filter);

    drawParallel(filter, "poverty_all",filter);
    
    drawRadar(popFilter, "poverty_all");
}

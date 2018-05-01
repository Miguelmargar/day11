// composite graph - main difference between this graph and the others previously done is the need to create different groups for each line that we want to show in the graph. 


queue ()
.defer(d3.json, "data/transactions.json")
.await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);
    
    let parseDate = d3.time.format("%d/%m/%Y").parse;
    
    transactionsData.forEach(function(d) {
        d.date = parseDate(d.date);
    });
    
    let dateDim = ndx.dimension(dc.pluck("date"));
    
    let minDate = dateDim.bottom(1)[0].date;
    let maxDate = dateDim.top(1)[0].date;
// instead of dc.pluck below we create our own function for each name to create a group which will display along the X and Y-axis for each name
// the below reads: if the name is Tom return each value as a number
    let tomSpend = dateDim.group().reduceSum(function(d) {
        if (d.name === "Tom") {
            return +d.spend; // the + sign makes sure that d.spend is a number and not a string
        } else {
            return 0;
        }
    });
    
    let aliceSpend = dateDim.group().reduceSum(function(d) {
        if (d.name === "Alice") {
            return +d.spend; // the + sign makes sure that d.spend is a number and not a string
        } else {
            return 0;
        }
    });
    
    let bobSpend = dateDim.group().reduceSum(function(d) {
        if (d.name === "Bob") {
            return +d.spend; // the + sign makes sure that d.spend is a number and not a string
        } else {
            return 0;
        }
    });
    
    let compositeChart = dc.compositeChart("#composite-chart")
        compositeChart
            .width(1000)
            .height(200)
            .dimension(dateDim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .yAxisLabel("spend")
            .renderHorizontalGridLines(true)
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .compose([ // the below creates the different groups to show in the graph
                dc.lineChart(compositeChart)
                .colors("green")
                .group(tomSpend, "Tom"),
                dc.lineChart(compositeChart)
                .colors("red")
                .group(bobSpend, "Bob"),
                dc.lineChart(compositeChart)
                .colors("blue")
                .group(aliceSpend, "Alice")
                ])
                .render() // this renders the dc.lineChart groups of tomSpend, bobSpend and aliceSpend
                .yAxis().ticks(12);
                
                dc.renderAll(); // this renders everything together


// do not need the parseDate for the x-axis as it is already defined above within the initial function
    let  storeASpend = dateDim.group().reduceSum(function(d) {
        if (d.store === "A") {
            return +d.spend;
        } else {
            return 0;
        }
    })
    let storeBSpend = dateDim.group().reduceSum(function(d) {
        if (d.store === "B") {
            return +d.spend; 
            } else {
                return 0;
            };
        });
    
    let compositeChartStore = dc.compositeChart("#composite-chart-by-store")
        compositeChartStore 
            .width(1000)
            .height(200)
            .dimension(dateDim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .yAxisLabel("store")
            .renderHorizontalGridLines(true)
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .compose([
                dc.lineChart(compositeChart)
                .colors("green")
                .group(tomSpend, "A"),
                dc.lineChart(compositeChart)
                .colors("red")
                .group(bobSpend, "B"),
                ])
                .render()
                .yAxis().ticks(12);
                
                dc.renderAll();
                
        
    let nySpend = dateDim.group().reduceSum(function(d) {
        if (d.state === "NY") {
            return +d.spend;
        } else {
            return 0
        };
    })
    let flSpend = dateDim.group().reduceSum(function(d) {
         if (d.state === "FL") {
            return +d.spend;
        } else {
            return 0
        };
    })
    let caSpend = dateDim.group().reduceSum(function(d) {
         if (d.state === "CA") {
            return +d.spend;
        } else {
            return 0
        };
    })
    let tnSpend = dateDim.group().reduceSum(function(d) {
         if (d.state === "TN") {
            return +d.spend;
        } else {
            return 0
        };
    })
    let wiSpend = dateDim.group().reduceSum(function(d) {
         if (d.state === "WI") {
            return +d.spend;
        } else {
            return 0
        };
    });
                
    let compositeChartState = dc.compositeChart("#composite-chart-by-state")            
        compositeChartState
            .width(1000)
            .height(200)
            .dimension(dateDim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .yAxisLabel("store")
            .renderHorizontalGridLines(true)
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .compose([
                dc.lineChart(compositeChart)
                .colors("red")
                .group(nySpend, "NY"),
                dc.lineChart(compositeChart)
                .colors("blue")
                .group(flSpend, "FL"),
                dc.lineChart(compositeChart)
                .colors("yellow")
                .group(caSpend, "CA"),
                dc.lineChart(compositeChart)
                .colors("black")
                .group(tnSpend, "TN"),
                dc.lineChart(compositeChart)
                .colors("orange")
                .group(wiSpend, "WI"),
                ])
                .render()
                .yAxis().ticks(8);
                
                dc.renderAll();
            
}
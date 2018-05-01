queue()
    .defer(d3.csv, "../data/Salaries.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);
//Gender split --------------------------------
    let sexDim = ndx.dimension(dc.pluck("sex"));
    let sexGroup = sexDim.group();    

    dc.pieChart("#gender-split")
        .height(300)
        .radius(100)
        .dimension(sexDim)
        .group(sexGroup);
  
// Job to Salary ------------------------------------------ 
    let jobDim = ndx.dimension(dc.pluck("rank"));
    let salaryGroup = jobDim.group().reduceSum(dc.pluck("salary"));
    
    dc.barChart("#job-salary")
        .height(300)
        .width(300)
        .dimension(jobDim)
        .group(salaryGroup)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Rank")
        .yAxisLabel("Salary")
        .yAxis().ticks(4);
    
// job to age ---------------------------------------------------
    
    let yearsSinceGroup = jobDim.group().reduceSum(dc.pluck("yrs.since.phd"));

    dc.barChart("#job-since-phd")
        .height(300)
        .width(300)
        .dimension(jobDim)
        .group(yearsSinceGroup)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Rank")
        .yAxisLabel("Years")
        .yAxis().ticks(8);
    
    
    dc.renderAll();

    
}
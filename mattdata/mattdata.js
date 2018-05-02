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

    // job to age - needed an average of with a customer reduce function otherwise it will add together the years that each group has ------------------------------------

    let yearsSinceGroup = jobDim.group().reduce(
        function reduceAdd(p, v) {
            p.count++;
            p.total += +v["yrs.since.phd"];
            p.average = p.total / p.count;
            return p;
        },
        function reduceRmove(p, v) {
            p.count--;
            if (p.count == 0) {
                p.total = 0;
                p.average = 0;
            }
            else {
                p.total -= +v["yrs.since.phd"];
                p.average = p.total / p.count;
            }
            return p;
        },
        function reduceInit() {
            return { count: 0, total: 0, average: 0 };
        }
    );

    dc.barChart("#job-since-phd")
        .height(300)
        .width(300)
        .dimension(jobDim)
        .group(yearsSinceGroup)
        .valueAccessor(function(p) {
            return p.value.average;
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Rank")
        .yAxisLabel("Years")
        .yAxis().ticks(6);


//the below is a composite graph however the salaries need to be averaged out
    let yearServiceDim = ndx.dimension(dc.pluck("yrs.service"));

    let assocRank = yearServiceDim.group().reduce(
        function(p, v) {
            if (d.rank === "AssocProf") {
                p.count++;
                p.total += +v.salary;
                p.average = p.total / p.count;
            }
            return p;
        },
        function(p, v) {
            if (d.rank === "AssocProf") {
                p.count--;
                if (p.count == 0) {
                    p.total = 0;
                    p.average = 0;
                }
                else {
                    p.total -= +v.salary;
                    p.average = p.total / p.count;
                }
            }
            return p;
        },
        function() {
            return { count: 0, total: 0, average: 0 };
        })
       

let asstRank = yearServiceDim.group().reduce(
        function(p, v) {
            if (d.rank === "AsstProf") {
                p.count++;
                p.total += +v.salary;
                p.average = p.total / p.count;
            }
            return p;
        },
        function(p, v) {
            if (d.rank === "AsstProf") {
                p.count--;
                if (p.count == 0) {
                    p.total = 0;
                    p.average = 0;
                }
                else {
                    p.total -= +v.salary;
                    p.average = p.total / p.count;
                }
            }
            return p;
        },
        function() {
            return { count: 0, total: 0, average: 0 };
        }),

let profRank = yearServiceDim.group().reduce(
        function(p, v) {
            if (d.rank === "Prof") {
                p.count++;
                p.total += +v.salary;
                p.average = p.total / p.count;
            }
            return p;
        },
        function(p, v) {
            if (d.rank === "Prof") {
                p.count--;
                if (p.count == 0) {
                    p.total = 0;
                    p.average = 0;
                }
                else {
                    p.total -= +v.salary;
                    p.average = p.total / p.count;
                }
            }
            return p;
        },
        function() {
            return { count: 0, total: 0, average: 0 };
        });

let compositeChart = dc.compositeChart("#years-salary-rank")
compositeChart
    .width(1000)
    .height(200)
    .dimension(yearServiceDim)
    .group(profRank)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .yAxisLabel("salary")
    .renderHorizontalGridLines(true)
    .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
    .compose([ // the below creates the different groups to show in the graph
        dc.lineChart(compositeChart)
        .colors("green")
        .group(assocRank, "AssocProf"),
        dc.lineChart(compositeChart)
        .colors("red")
        .group(asstRank, "AsstProf"),
        dc.lineChart(compositeChart)
        .colors("blue")
        .group(profRank, "Prof"),
    ])
    .render() // this renders the dc.lineChart groups of tomSpend, bobSpend and aliceSpend
    .yAxis().ticks(12);

dc.renderAll();




}

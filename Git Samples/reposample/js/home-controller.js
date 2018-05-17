'use strict';

/* Controllers */

var myApp = angular.module('homecontroller', []);

myApp.controller('homecontroller', ['$scope','$rootScope','$q','d3DataFactory', 
  function($scope,$rootScope,$q,d3DataFactory) {
    
    $scope.selectedTest = {};
    
    $scope.listdata = {
        "Country":{values:[],selected:""},
        "Division":{values:[],selected:""},
        "Plant":{values:[],selected:""},
        "Source":{values:[],selected:""},
        "Packaging":{values:[],selected:""},
        "Format":{values:[],selected:""},
        "Brand":{values:[],selected:""},
        "Test":{values:[],selected:""},
        "Test Type":{values:[],selected:""}
    };
    
    $scope.csvData = [];
    
    $scope.importSVG = function(sourceSVG) {
        var name = "#" + sourceSVG + " svg"
        var svg_xml = unescape((new XMLSerializer()).serializeToString($(name)[0]));
        var a         = document.createElement('a');
        a.hreflang   = 'image/svg+xml';
        a.href        = 'data:image/svg+xml;utf8,' +  unescape(svg_xml);
        a.target      = '_blank';
        a.download    = sourceSVG + '.svg';

        document.body.appendChild(a);
        a.click();
    }
      
    $scope.changeTestType = function(){
        var asd = $scope.selectedTest;
    }
    
    $scope.buildGraph = function(){
        d3.selectAll("#histLineGraph svg").remove();
        d3.selectAll("#histogram svg").remove();
        buildHist();
    }
    
    $scope.showData = function(dataText){
        d3.select("#tooltipUni")
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px")
                    .style("opacity", 1)
                    .select("#value")
                    .text(dataText);
    }
    
    $scope.hideData = function(){
        d3.select("#tooltipUni")
                    .style("opacity", 0);
    }
      
    d3DataFactory.initialize().then(function(csvData){
        for (var item in $scope.listdata) {
            $scope.listdata[item].values = csvData.filter(function(obj,i) {
                return csvData.map(function(objt){return objt[item]}).indexOf(obj[item]) == i;
            });
        }
        $scope.listdata.Test.selected = $scope.listdata.Test.values[0];
        $scope.csvData = csvData;
    });
    
    function buildHist(){
        var chemical = $scope.selectedTest;
        var filteredArray = JSON.parse(JSON.stringify($scope.csvData));
        for(var key in $scope.listdata) {
            if($scope.listdata[key].selected){
                filteredArray = filteredArray.filter(function(objt){
                    return objt[key] == $scope.listdata[key].selected[key]
                });
            }
        }
        
        var maxbin = d3.max(filteredArray, function(d) { 
                            return d.Result; 
                            });
        var minbin = d3.min(filteredArray, function(d) { 
                            return d.Result; 
                            });
        var binsize = maxbin/10;
        var numbins = Math.ceil((maxbin - minbin) / binsize);
        if (maxbin == minbin){
            numbins = 1;
        }
        var binmargin = binsize/3; 
        var margin = {top: 10, right: 30, bottom: 60, left: 60},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
        
        var xmin = minbin - binsize
        var xmax = maxbin + binsize
        
        var histdata = new Array(numbins);
        for (var i = 0; i < numbins; i++) {
            histdata[i] = { numfill: 0, meta: "", data:[] };
        }

        // Fill histdata with y-axis values and meta data
        filteredArray.forEach(function(d) {
            var bin = Math.floor((d.Result - minbin) / binsize);
            if (bin.toString() != "NaN"){
                if(bin >= histdata.length){
                    bin = histdata.length-1;
                }
                histdata[bin].numfill += 1;
                histdata[bin].meta += " " + d.Test + " " + d.Result;
                histdata[bin].data.push(d);
            }
        });
        
        var x = d3.scale.linear()
          .domain([0, (xmax - xmin)])
          .range([0, width]);

        // Scale for the placement of the bars
        var x2 = d3.scale.linear()
          .domain([xmin, xmax])
          .range([0, width]);
        
        var y = d3.scale.linear()
          .domain([0, d3.max(histdata, function(d) { 
                            return d.numfill; 
                            })])
          .range([height, 0]);

        var xAxis = d3.svg.axis()
          .scale(x2)
          .orient("bottom");
        var yAxis = d3.svg.axis()
          .scale(y)
          .ticks(8)
          .orient("left");

        // put the graph in the "mpg" div
        var svg = d3.select("#histogram").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + 
                            margin.top + ")");

        // set up the bars
        var bar = svg.selectAll(".bar")
          .data(histdata)
          .enter().append("g")
          .attr("class", "bar")
          .attr("transform", function(d, i) { return "translate(" + 
               x2(i * binsize + minbin) + "," + y(d.numfill) + ")"; })
          .on("mouseover", function (d) {
                $scope.showData(d.meta);
            })
            .on("mouseout", function () {
                $scope.hideData();
            })
            .on("click", function (d) { 
                d3.selectAll("#histLineGraph svg").remove();
                $scope.buildLineChart("#histLineGraph",d.data, true);
            });

        // add rectangles of correct size at correct location
        bar.append("rect")
          .attr("x", x(binmargin))
          .attr("width", x(Math.abs(binsize - 2 * binmargin)))
          .attr("height", function(d) { return height - y(d.numfill); });

        // add the x axis and x-label
        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
        svg.append("text")
          .attr("class", "xlabel")
          .attr("text-anchor", "middle")
          .attr("x", width )
          .attr("y", height + margin.bottom)
          .text("Amount of Substance (" + $scope.selectedTest.UnitOfMeasure + ")");

        // add the y axis and y-label
        svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(0,0)")
          .call(yAxis);
        svg.append("text")
          .attr("class", "ylabel")
          .attr("y", 0 - margin.left) // x and y switched due to rotation
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("transform", "rotate(-90)")
          .style("text-anchor", "middle")
          .text("# of Tests");
    }
  }
]);

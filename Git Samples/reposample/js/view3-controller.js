'use strict';

/* Controllers */

var myApp = angular.module('view3controller', []);

myApp.controller('view3controller', ['$scope','$rootScope',
  function($scope,$rootScope) {
    $scope.bottomImage = "Dual Line Graph"
    
    $scope.export = function(svgSelect){
        this.$parent.importSVG("lineGraph");
    };
    
    var data= [
        {
            "Prod Date":"20150101",
            "good":"90",
            "bad":"10"
        },
        {
            "Prod Date":"20150201",
            "good":"95",
            "bad":"5"
        },
        {
            "Prod Date":"20150301",
            "good":"91",
            "bad":"9"
        },
        {
            "Prod Date":"20150401",
            "good":"80",
            "bad":"20"
        },
        {
            "Prod Date":"20150501",
            "good":"81",
            "bad":"19"
        },
        {
            "Prod Date":"20150601",
            "good":"72",
            "bad":"28"
        },
        {
            "Prod Date":"20150701",
            "good":"85",
            "bad":"15"
        },
        {
            "Prod Date":"20150801",
            "good":"81",
            "bad":"19"
        },
        {
            "Prod Date":"20150901",
            "good":"71",
            "bad":"29"
        },
        {
            "Prod Date":"20151001",
            "good":"93",
            "bad":"7"
        },
        {
            "Prod Date":"20151101",
            "good":"95",
            "bad":"5"
        },
        {
            "Prod Date":"20151201",
            "good":"90",
            "bad":"10"
        }
    ];
    
    var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = parseInt(d3.select('#lineGraph').style('width'), 10)-150,
        height = 300 - margin.top - margin.bottom;
        
    $scope.$parent.buildLineChart = function(container, data, realData){
        var parseDate = d3.time.format("%Y%m%d").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .interpolate("cardinal")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.result); });

        var svg = d3.select(container).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        if(realData){
            color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Prod Date"; }));
            
            var dataset =  [{
                  name: "Result",
                  values: data.map(function(d) {
                    return {date: new Date(d["Prod Date"]), result: +d.Result};
                  })
                }];
            x.domain(d3.extent(data, function(d) { return new Date(Date.parse(d["Prod Date"])); }));
            dataset[0].values.sort(function(a,b){
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.date) - new Date(a.date);
            });
        }
        else{
            color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Prod Date"; }));

            data.forEach(function(d) {
            d["Prod Date"] = parseDate(d["Prod Date"]);
            });
            
            var dataset = color.domain().map(function(name) {
            return {
              name: name,
              values: data.map(function(d) {
                return {date: d["Prod Date"], result: +d[name]};
              })
            };
            });
            x.domain(d3.extent(data, function(d) { return d["Prod Date"]; }));
        }
        
        y.domain([
            d3.min(dataset, function(c) { return d3.min(c.values, function(v) { return v.result; }); }),
            d3.max(dataset, function(c) { return d3.max(c.values, function(v) { return v.result; }); })
            ]);
        
        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Result");

        var lines = svg.selectAll(".line")
          .data(dataset)
        .enter().append("g")
          .attr("class", "line");

        lines.append("path")
          .attr("class", "line")
          .attr("d", function(d) { return line(d.values); })
          .style("stroke", function(d) { return color(d.name); });

        lines.append("text")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.result) + ")"; })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function(d) { return d.name; });
        
        // var points = svg.selectAll(".point")
            // .data(dataset[0].values)
          // .enter().append("svg:circle")
             // .attr("stroke", "black")
             // .attr("fill", function(d, i) { return "black" })
             // .attr("cx", function(d, i) { return x(d.date) })
             // .attr("cy", function(d, i) { return y(d.result) })
             // .attr("r", function(d, i) { return 3 });
             
        svg.selectAll("g.dot")
            .data(dataset)
            .enter().append("g")
            .attr("class", "dot")
            .selectAll("circle")
            .data(function(d) { return d.values; })
            .enter().append("circle")
            .attr("r", 3)
            .attr("cx", function(d,i) {  return x(d.date); })
            .attr("cy", function(d,i) { return y(d.result); })
            .on("mouseover", function (d) {
                $scope.$parent.showData(d.result + " Date:" + d.date);
            })
            .on("mouseout", function () {
                $scope.$parent.hideData();
            });
            
        svg.append("svg:text")
		   .attr("class", "title")
           .attr("x", 20)
           .attr("y", -8)
           .text("Line Graph");
    }
    
    $scope.$parent.buildLineChart("#lineGraph",data, false);
  }
]);
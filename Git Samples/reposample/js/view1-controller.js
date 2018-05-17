'use strict';

/* Controllers */

var myApp = angular.module('view1controller', []);

myApp.controller('view1controller', ['$scope','$rootScope', 
  function($scope,$rootScope) {
    $scope.leftImage = "Bar Graph";
    
    $scope.export = function(svgSelect){
        this.$parent.importSVG("barGraph");
    };
    
    var data = [
            {
                "x": "Canada",
                "value": ".83",
                "color": "red"
            },
            {
                "x": "USA",
                "value": ".92",
                "color": "blue"
            },
            {
                "x": "UK",
                "value": ".72",
                "color": "green"
            },
            {
                "x": "China",
                "value": ".81",
                "color": "yellow"
            },
            {
                "x": "Mexico",
                "value": ".91",
                "color": "orange"
            }
        ]
    
    var margin = {top: 30, right: 50, bottom: 30, left: 50}
          , width = parseInt(d3.select('#barGraph').style('width'), 10)
          , width = width - margin.left - margin.right
          , height = 300 - margin.top - margin.bottom;
    
    function buildBarGraph(){            
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y1 =  d3.scale.linear().range([height, margin.bottom]).domain([0,
          1
        ])
                
        var y = d3.scale.linear()
            .range([0,100]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y1)
            .orient("left")
            .ticks(10, "%");

        var svg = d3.select("#barGraph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          x.domain(data.map(function(d) { 
            return d.x; 
            }));
          y.domain([0, 1]);

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
              .text("Conformance");

          svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.x); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y1(d.value); })
              .attr("height", function(d) { return height - y1(d.value); })
              .style("fill", function(d) { return d.color; })
              .on("mouseover", function (d) {
                $scope.$parent.showData(d.value + " Country:" + d.x);
                })
              .on("mouseout", function () {
                    $scope.$parent.hideData();
                })
              .on("click", rebuildPie);

        function type(d) {
          d.frequency = +d.frequency;
          return d;
        }
        
        function rebuildPie(){
            $rootScope.changeData();
        }
    }
    
    // d3.select(window).on('resize', resize); 

    // function resize() {
        // // update width
        // width = parseInt(d3.select('#view1').style('width'), 10);
        // width = width - margin.left - margin.right;

        // // reset x range
        // x.range([0, width]);
        // d3.select(chart.node().parentNode)
        // .style('height', (y.rangeExtent()[1] + margin.top + margin.bottom) + 'px')
        // .style('width', (width + margin.left + margin.right) + 'px');

        // // do the actual resize...
    // }
    
    buildBarGraph();
  }
]);

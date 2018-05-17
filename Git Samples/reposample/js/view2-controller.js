'use strict';

/* Controllers */

var myApp = angular.module('view2controller', []);

myApp.controller('view2controller', ['$scope','$rootScope', 
  function($scope,$rootScope) {
    $scope.rightImage = "PIE CHARTS";
    
    $scope.export = function(svgSelect){
        this.$parent.importSVG("pieChart");
    };
    
    var salesData=[
        {label:"Basic", color:"#3366CC"},
        {label:"Plus", color:"#DC3912"},
        {label:"Lite", color:"#FF9900"},
        {label:"Elite", color:"#109618"},
        {label:"Delux", color:"#990099"}
    ];
    
    var margin = {top: 30, right: 50, bottom: 30, left: 50}
          , width = 400
          , width = width - margin.left - margin.right
          , height = 300;
    
    var Donut3D={};
    
    function drawDonuts(){
        
        function pieTop(d, rx, ry, ir ){
            if(d.endAngle - d.startAngle == 0 ) return "M 0 0";
            var sx = rx*Math.cos(d.startAngle),
                sy = ry*Math.sin(d.startAngle),
                ex = rx*Math.cos(d.endAngle),
                ey = ry*Math.sin(d.endAngle);
                
            var ret =[];
            ret.push("M",sx,sy,"A",rx,ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0),"1",ex,ey,"L",ir*ex,ir*ey);
            ret.push("A",ir*rx,ir*ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0), "0",ir*sx,ir*sy,"z");
            return ret.join(" ");
        }

        function pieOuter(d, rx, ry, h ){
            var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
            var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);
            
            var sx = rx*Math.cos(startAngle),
                sy = ry*Math.sin(startAngle),
                ex = rx*Math.cos(endAngle),
                ey = ry*Math.sin(endAngle);
                
                var ret =[];
                ret.push("M",sx,h+sy,"A",rx,ry,"0 0 1",ex,h+ey,"L",ex,ey,"A",rx,ry,"0 0 0",sx,sy,"z");
                return ret.join(" ");
        }

        function pieInner(d, rx, ry, h, ir ){
            var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
            var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);
            
            var sx = ir*rx*Math.cos(startAngle),
                sy = ir*ry*Math.sin(startAngle),
                ex = ir*rx*Math.cos(endAngle),
                ey = ir*ry*Math.sin(endAngle);

                var ret =[];
                ret.push("M",sx, sy,"A",ir*rx,ir*ry,"0 0 1",ex,ey, "L",ex,h+ey,"A",ir*rx, ir*ry,"0 0 0",sx,h+sy,"z");
                return ret.join(" ");
        }

        function getPercent(d){
            return (d.endAngle-d.startAngle > 0.2 ? 
                    Math.round(1000*(d.endAngle-d.startAngle)/(Math.PI*2))/10+'%' : '');
        }	
        
        Donut3D.transition = function(id, data, rx, ry, h, ir){
            function arcTweenInner(a) {
              var i = d3.interpolate(this._current, a);
              this._current = i(0);
              return function(t) { return pieInner(i(t), rx+0.5, ry+0.5, h, ir);  };
            }
            function arcTweenTop(a) {
              var i = d3.interpolate(this._current, a);
              this._current = i(0);
              return function(t) { return pieTop(i(t), rx, ry, ir);  };
            }
            function arcTweenOuter(a) {
              var i = d3.interpolate(this._current, a);
              this._current = i(0);
              return function(t) { return pieOuter(i(t), rx-.5, ry-.5, h);  };
            }
            function textTweenX(a) {
              var i = d3.interpolate(this._current, a);
              this._current = i(0);
              return function(t) { return 0.6*rx*Math.cos(0.5*(i(t).startAngle+i(t).endAngle));  };
            }
            function textTweenY(a) {
              var i = d3.interpolate(this._current, a);
              this._current = i(0);
              return function(t) { return 0.6*rx*Math.sin(0.5*(i(t).startAngle+i(t).endAngle));  };
            }
            
            var _data = d3.layout.pie().sort(null).value(function(d) {return d.value;})(data);
            
            d3.select("#"+id).selectAll(".innerSlice").data(_data)
                .transition().duration(750).attrTween("d", arcTweenInner); 
                
            d3.select("#"+id).selectAll(".topSlice").data(_data)
                .transition().duration(750).attrTween("d", arcTweenTop); 
                
            d3.select("#"+id).selectAll(".outerSlice").data(_data)
                .transition().duration(750).attrTween("d", arcTweenOuter); 	
                
            d3.select("#"+id).selectAll(".percent").data(_data).transition().duration(750)
                .attrTween("x",textTweenX).attrTween("y",textTweenY).text(getPercent); 	
        }
        
        var key = function(d){ return d.data.label; };
        
        Donut3D.draw=function(id, data, x /*center x*/, y/*center y*/, 
                rx/*radius x*/, ry/*radius y*/, h/*height*/, ir/*inner radius*/){
        
            var _data = d3.layout.pie().sort(null).value(function(d) {return d.value;})(data);
            
            var slices = d3.select("#"+id).append("g").attr("transform", "translate(" + x + "," + y + ")")
                .attr("class", "slices");
                
            slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
                .style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
                .attr("d",function(d){ return pieInner(d, rx+0.5,ry+0.5, h, ir);})
                .each(function(d){this._current=d;});
            
            slices.selectAll(".topSlice").data(_data, key).enter().append("path").attr("class", "topSlice")
                .style("fill", function(d) { return d.data.color; })
                .style("stroke", function(d) { return d.data.color; })
                .attr("d",function(d){ return pieTop(d, rx, ry, ir);})
                .each(function(d){this._current=d;})
                .on("mouseover", function (d) {
                    $scope.$parent.showData(d.data.label);
                })
                .on("mouseout", function () {
                    $scope.$parent.hideData();
                });    
            
            slices.selectAll(".outerSlice").data(_data).enter().append("path").attr("class", "outerSlice")
                .style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
                .attr("d",function(d){ return pieOuter(d, rx-.5,ry-.5, h);})
                .each(function(d){this._current=d;});

            slices.selectAll(".percent").data(_data).enter().append("text").attr("class", "percent")
                .attr("x",function(d){ return 0.6*rx*Math.cos(0.5*(d.startAngle+d.endAngle));})
                .attr("y",function(d){ return 0.6*ry*Math.sin(0.5*(d.startAngle+d.endAngle));})
                .text(getPercent).each(function(d){this._current=d;}); 
        }
        
        function drawLegend(id, data, x /*center x*/, y/*center y*/, 
                rx/*radius x*/, ry/*radius y*/, h/*height*/, ir/*inner radius*/){
            function onLegendClick(dt, i, that){
                            // var slices = d3.select("#"+id)
                            // slices.selectAll(".topSlice").data(data, key)
                            dt.selected=!dt.selected;
                            d3.selectAll('rect').data([dt], function(d) { return d.label}).style("opacity", function(d) {return Math.abs(1-d3.select(this).style("opacity"));})
                            dataset1.forEach(function(d, i) {
                                if (d.selected){
                                    d.value = 0;
                                }
                                else{
                                    d.value = datacopy[i].value;
                                }
                            })
                            Donut3D.transition("quotesDonut",dataset1, 130, 100, 30, 0);
                        } 
                
            var legend = d3.select("#pieChart").append("svg")
              .attr("class", "legend")
              .attr("width", rx/2)
              .attr("height", ry)
              .selectAll("g")
              .data(data)
              .enter().append("g")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
              .on('click', function(d, i){
                    onLegendClick(d, i, this);
               });

            legend.append("rect")
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", function(d) { return d.color; });

            legend.append("text")
              .attr("x", 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .text(function(d) { return d.label; });   
        };
    
        var svg = d3.select("#pieChart").append("svg").attr("width",width).attr("height",height);

        // svg.append("g").attr("id","salesDonut");
        svg.append("g").attr("id","quotesDonut");
        var dataset1 = randomData();
        var datacopy = JSON.parse(JSON.stringify(dataset1));
        Donut3D.draw("quotesDonut", dataset1, 150, 150, 130, 100, 30, 0);      
        drawLegend("quotesDonut", dataset1, 250, 150, 130, 100, 90, 0);       
        
        
    }

    function randomData(){
        return salesData.map(function(d){ 
            return {label:d.label, value:1000*Math.random(), color:d.color};});
    }    
       
    $scope.changeData = function(){
        // Donut3D.transition("salesDonut", randomData(), 130, 100, 30, 0.4);
        dataset1 = randomData();
        datacopy = JSON.parse(JSON.stringify(dataset1));
        Donut3D.transition("quotesDonut", dataset1, 130, 100, 30, 0);
        drawLegend("quotesDonut", dataset1, 450, 150, 130, 100, 30, 0); 
    }
    $rootScope.changeData = function (sId, fCallback) {
        // Donut3D.transition("salesDonut", randomData(), 130, 100, 30, 0.4);
        var dataset1 = randomData();
        var datacopy = JSON.parse(JSON.stringify(dataset1));
        Donut3D.transition("quotesDonut", dataset1, 130, 100, 30, 0);
        drawLegend("quotesDonut", dataset1, 450, 150, 130, 100, 30, 0); 
    }
    
    drawDonuts();
  }
]);
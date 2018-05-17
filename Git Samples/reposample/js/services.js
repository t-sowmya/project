'use strict';

/* Services */

var myApp = angular.module('myServices', []);

myApp.factory('d3DataFactory', ['$q','$timeout', 
  function($q,$timeout){
  
    var factory = {}; 
 
    function getData(){
        var deferred = $q.defer();
        d3.csv("Data/spec_data.csv", function(csvData) {
            csvData.forEach(function(d) {
                if(d.Result == NaN){
                    d.Result = "0";
                }
                if(d.Result.indexOf(">") > -1){
                    d.Result = d.Result.replace('>','');
                }
                if(d.Result.indexOf("<") > -1){
                    d.Result = d.Result.replace('<','');
                }
                if(d.Result == "Negative"){
                    d.Result = "-1";
                }
                d.Result = parseFloat(d.Result);
            });
            factory.csvData = csvData;
            deferred.resolve(csvData);
        });
        return deferred.promise;
    }
    
    function getUnique(stdArray){ 
        var unique = stdArray.map(function(obj) { 
            var result = {};
            Object.keys(obj).forEach(function (key) {
                if(key=="Test" || key=="Min Spec" || key=="Max Spec" || key == "Unit Of Measure"){
                    result[key.replace(/ /g,'')] = obj[key];
                }
            }); 
            return result;
        });
        unique = unique.filter(function(obj,i) {
            return unique.map(function(objt){return objt.Test}).indexOf(obj.Test) == i;
        });
        return unique;
    }
        
    factory.getSpecficTest = function(testType){
        var unique = $.grep(this.csvData, function (obj) {
            return obj[idKey].Test === testType;
        });
        return unique;
    }
    
    factory.getAllTestChemicals = function(){
        var deferred = $q.defer();
        var stdArray = JSON.parse(JSON.stringify(this.csvData));
        var unique = [];
        $timeout(function() { 
            unique = getUnique(stdArray);
        }).then(function(){
            deferred.resolve(unique);
        })
        return deferred.promise;
    }
    
    factory.getAllTestTypes = function(){
        var unique = this.csvData.filter(function(itm,i,a){
            return i==a.indexOf(itm.TestTypes);
        });
        
        return unique;
    }
    
    factory.initialize = function(){
        var deferred = $q.defer();
        if(!this.csvData){
            var promise = getData();
            promise.then(function(data){
                deferred.resolve(data);
            })
        }
        return deferred.promise;
    }
    
    return factory;
  }
]);
'use strict';

/* Controllers */

var myApp = angular.module('myApp', []);

myApp.controller('view1-controller', ['$scope', 
  function($scope) {
    $scope.leftImage = "GOODY"
  }
]);

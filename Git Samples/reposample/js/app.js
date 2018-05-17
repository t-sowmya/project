'use strict';

/* App Module */

var myApp = angular.module('myApp', [
  'ui.router',
  'door3.css',
  'homecontroller',
  'view1controller',
  'view2controller',
  'view3controller',
  'myServices'
]);

myApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
      .state('home', {
        url:'/home',
        css:  'css/home.css',
        views: {

            // the main template will be placed here (relatively named)
            '': {  
                templateUrl: 'partials/home.html',
                controller: 'homecontroller' 
            },

            // the child views will be defined here (absolutely named)
            'view1-left@home': { 
                templateUrl: 'partials/view1-left.html',
                controller: 'view1controller' 
            },
            'view2-right@home': { 
                templateUrl: 'partials/view2-right.html',
                controller: 'view2controller'
            },
            'view3-bottom@home': { 
                templateUrl: 'partials/view3-bottom.html',
                controller: 'view3controller'
            }
        }
      })
      // when('/home.view1-left', {
        // url: '/left',
        // templateUrl: 'partials/view1-left.html',
        // controller: 'view1-left'
      // }).
      // when('/home.view2-right', {
        // url: '/right',
        // templateUrl: 'partials/view2-right.html',
        // controller: 'view2-right'
      // }).
      // when('/home.view3-bottom', {
        // url: '/bottom',
        // templateUrl: 'partials/view3-bottom.html',
        // controller: 'view3-bottom'
      // }).
      // when('/phones/:phoneId', {
        // templateUrl: 'partials/phone-detail.html',
        // controller: 'PhoneDetailCtrl'
      // }).
  });

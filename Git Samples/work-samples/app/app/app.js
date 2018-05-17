/**
 * Created by kiran on 4/22/2015.
 */
/* To enable Routing we need to inject the ui.router module*/
var app = angular.module("myApp",["ui.router"]);

app.config(function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home', {
            url:"/",
            templateUrl: 'app/templates/home.html',
            controller:'homeController'
        })
        .state('electronics', {
            url:"/electronics",
            templateUrl: 'app/templates/electronics.html'
        })
        .state('apparel', {
            url:"/apparel",
            templateUrl: 'app/templates/apparel.html'
        })
        .state('furniture', {
            url:"/furniture",
            templateUrl: 'app/templates/furniture.html'
        })
        .state('contactus', {
            url:"/contactus",
            templateUrl: 'app/templates/contactus.html'
        })

});


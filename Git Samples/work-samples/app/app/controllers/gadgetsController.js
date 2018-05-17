/**
 * Created by kiran on 4/23/2015.
 */
angular.module("myApp").controller("gadgetsController"
        ,function($scope){
       $scope.gadgets = [{name:"iPhone",company:"Apple",version:"i6",price:"650",
           image:'app/images/iphone.png'},
           {name:"iPad",company:"Apple",version:"Air",price:"700",
           image:'http://media.idownloadblog.com/wp-content/uploads/2011/12/ipad-app-store.jpg'}]
    });
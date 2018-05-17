/**
 * Created by kiran on 4/25/2015.
 */
/*approach -1
* array based notation.*/
angular.module("myApp").
    controller("menuController",
    ["$scope", function($scope){
        function init(){
            $scope.menuBarUrl = "app/templates/navbar.html";
            $scope.menu ={brand:"Mythri",
                menuList:[{ name:"Home",url:"/home"},
                    {name:"Electronics",url:"/electronics"},
                    {name:"Apparel",url:"/apparel"},
                    {name:"Furniture",url:"/furniture"},
                    {name:"Contact Us",url:"/contactus"}
                ]
            };
        }

        init();
    }
    ]);
/*end of approach -1*/

/*approach-2
function menuController ($scope) {
   //codes goes here
}
angular.module("myApp")
    .controller("menuController",
    ["$scope",menuController]);
/*end of approach -2

/* approach -3
* Immediately Invoked function
(function()
{
     angular.module('myApp').controller("menuController",
         ["$scope",function($scope){

         }]);

})();



/* end of approach-3*/
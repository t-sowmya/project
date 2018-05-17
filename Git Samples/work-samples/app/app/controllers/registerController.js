/**
 * Created by kiran on 4/23/2015.
 */
angular.module("myApp").controller("registerController"
    ,function($scope){

        $scope.register = function(){
            $scope.displayWelcomePage = true;
            $scope.gadgetsUrl = "app/templates/gadgets.html";
        };

        $scope.loadCity = function(){
            console.log($scope.state);
            $scope.user.city = $scope.user.state.capital;
        };

        function init(){
            $scope.registerPage ="app/templates/register.html";
            $scope.user = {
                firstName :"",
                lastName :"",
                dob :"",
                email:"",
                password:"",
                address :""
            };
            $scope.displayWelcomePage = false;
            $scope.states = [
                {"stateCode":"AP", name:"Andhra Pradesh",capital:"vijayawada"},
                {"stateCode":"TS", name:"Telangana",capital:"Hyderabad"},
                {"stateCode":"TN", name:"Tamilnadu",capital:"chennai"},
                {"stateCode":"KA", name:"Karnataka",capital:"bangalore"}
            ];
        }
        init();
});
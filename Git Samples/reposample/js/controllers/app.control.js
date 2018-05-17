var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.edit']);

app.controller('MainCtrl', ['$scope', '$http', '$timeout', '$interval', 'uiGridConstants', function ($scope, $http, $timeout, $interval, uiGridConstants) {
    var start = new Date();
    var sec = $interval(function () {
        var wait = parseInt(((new Date()) - start) / 1000, 10);
        $scope.wait = wait + 's';
    }, 1000);

    // you could of course just include the template inline in your code, this example shows a template being returned from a function
    function rowTemplate() {
        return $timeout(function () {
            $scope.waiting = 'Your data is loaded';
            $interval.cancel(sec);
            $scope.wait = '';
            return '<div ng-class="{ \'my-css-class\': grid.appScope.rowFormatter( row ) }">' +
                       '  <div ng-if="row.entity.merge">{{row.entity.title}}</div>' +
                       '  <div ng-if="!row.entity.merge" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                       '</div>';
        }, 1000);
    }

    // Access outside scope functions from row template
    $scope.rowFormatter = function (row) {
        return row.entity.gender === 'male';
    };

    $scope.waiting = 'Colleting data...';

    $http.get('http://www.w3schools.com/website/Customers_MYSQL.php')
      .success(function (data) {
          data.forEach(function (row, index) {
              row.widgets = index % 10;
          });
          //data[1].merge = true;
          //data[1].title = "A merged row";
          //data[4].merge = true;
          //data[4].title = "Another merged row";
          $scope.data = data;
      });



    $scope.gridOptions = {
        enableFiltering: true,
        showGridFooter: true,
        enableGridMenu: true,
        rowTemplate: rowTemplate(),
        data: 'data',
        enableSorting: true,
        columnDefs: [
          { name: 'Name', enableSorting: true, enableCellEdit: true, displayName: 'Name' },
          { name: 'City', enableFiltering: true, enableCellEdit: true, }
        ]
    };

}]);

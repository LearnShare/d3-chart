// controller: Main
'use strict';

app.controller('MainController', [
  '$scope',
  '$location',
  function($scope, $location) {
    $scope.activeTab = '';

    $scope.navCollapse = true;

    $scope.toggleNavCollapse = function() {
      $scope.navCollapse = !$scope.navCollapse;
    };

    $scope.collapseNav = function() {
      $scope.navCollapse = true;
    };

    $scope.$on('$routeChangeSuccess', function() {
      var paths = $location.path().split('/');

      if(paths.length >= 2) {
        $scope.activeTab = paths[1];
      }
    });
  }
]);

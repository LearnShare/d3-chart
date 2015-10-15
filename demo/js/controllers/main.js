// controller: Main
'use strict';

app.controller('MainController', [
  '$scope',
  function($scope) {
    $scope.navCollapse = true;

    $scope.toggleNavCollapse = function() {
      $scope.navCollapse = !$scope.navCollapse;
    };
  }
]);

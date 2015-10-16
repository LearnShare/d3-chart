// controller: Chart
'use strict';

app.controller('ChartController', [
  '$scope',
  '$timeout',
  function($scope, $timeout) {
    $scope.edit = {
      title: 'D3 Chart',
      titleSize: 20,
      subTitle: 'by Tag.Hu',
      subTitleSize: 12
    };

    $scope.chartConfig = {
      padding: 10,
      autoResize: true,
      title: '',
      subTitle: '',
      titleAlign: 'center',
      legend: true,
      legendDirection: 'horizontal',
      legendAlign: 'center',
      legendVerticalAlign: 'top'
    };

    $scope.chartDatas = [];

    $scope.chartLegends = [
      'A',
      'B',
      'C'
    ];

    $scope.updateTime = new Date();

    $scope.updateConfig = function(attr, value) {
      $timeout(function() {
        $scope.chartConfig[attr] = value;

        $scope.updateTime = new Date();
      }, 1);
    };

    $scope.$watch('edit.title', function() {
      $scope.updateConfig('title', $scope.edit.title);
    });
    $scope.$watch('edit.titleSize', function() {
      $scope.updateConfig('titleSize', $scope.edit.titleSize);
    });
    $scope.$watch('edit.subTitle', function() {
      $scope.updateConfig('subTitle', $scope.edit.subTitle);
    });
    $scope.$watch('edit.subTitleSize', function() {
      $scope.updateConfig('subTitleSize', $scope.edit.subTitleSize);
    });
  }
]);

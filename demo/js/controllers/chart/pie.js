// controller: PieChart
'use strict';

app.controller('PieChartController', [
  '$scope',
  '$timeout',
  function($scope, $timeout) {
    $scope.edit = {
      chartType: 'pie', // pie|circle
      radius: 0.8,
      radiuA: 0.6,
      radiuB: 0.8,
      cornerRadius: 10,
      anglePadding: 0.005
    };

    $scope.chartConfig = {
      padding: 10,
      autoResize: true,
      title: 'D3 Line Chart',
      subTitle: 'by Tag.Hu',
      legend: true,
      legendDirection: 'vertical', // horizontal/vertical
      legendAlign: 'right', // right/left/center
      legendVerticalAlign: 'top', // top/bottom

      legendText: function(d, i) {
        return d.name
            + ': '
            + d.value
            + '('
            + d.percentage
            + '%)';
      },
      radius: 0.8,
      cornerRadius: 10,
      anglePadding: 0.005,
      sortData: function(a, b) {
        return b.value - a.value;
      },
      mouseEvent: true // true|false
    };

    $scope.chartDatas = [{
      name: 'A',
      value: '40'
    }, {
      name: 'B',
      value: '70'
    }, {
      name: 'C',
      value: '60'
    }, {
      name: 'D',
      value: '80'
    }, {
      name: 'E',
      value: '30'
    }, {
      name: 'F',
      value: '50'
    }];

    $scope.chartLegends = [
      'A',
      'B',
      'C',
      'D'
    ];

    $scope.updateTime = new Date();

    $scope.updateConfig = function(attr, value) {
      $timeout(function() {
        $scope.chartConfig[attr] = value;

        $scope.updateTime = new Date();
      }, 1);
    };

    $scope.setChartType = function(type) {
      $scope.edit.chartType = type;

      if($scope.edit.chartType == 'pie') {
        $scope.updateConfig('radius', $scope.edit.radius);
      }else if($scope.edit.chartType == 'circle') {
        $scope.updateConfig('radius',
            [$scope.edit.radiuA,
            $scope.edit.radiuB]);
      }
    };

    $scope.$watch('edit.radius', function() {
      if($scope.edit.chartType == 'pie') {
        $scope.updateConfig('radius', $scope.edit.radius);
      }
    });
    $scope.$watch('edit.radiuA', function() {
      if($scope.edit.chartType == 'circle') {
        $scope.updateConfig('radius',
            [$scope.edit.radiuA,
            $scope.edit.radiuB]);
      }
    });
    $scope.$watch('edit.radiuB', function() {
      if($scope.edit.chartType == 'circle') {
        $scope.updateConfig('radius',
            [$scope.edit.radiuA,
            $scope.edit.radiuB]);
      }
    });

    $scope.$watch('edit.cornerRadius', function() {
      $scope.updateConfig('cornerRadius', $scope.edit.cornerRadius);
    });

    $scope.$watch('edit.anglePadding', function() {
      $scope.updateConfig('anglePadding', $scope.edit.anglePadding);
    });
  }
]);

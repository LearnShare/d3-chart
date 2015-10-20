// controller: BarChart
'use strict';

app.controller('BarChartController', [
  '$scope',
  '$timeout',
  function($scope, $timeout) {
    $scope.chartConfig = {
      padding: 10,
      autoResize: true,
      title: 'D3 Bar Chart',
      subTitle: 'by Tag.Hu',
      legend: true,

      chartMarginX: 30,
      chartMarginY: 20,
      canvas: true, // true|false
      type: 'group', // group|stack
      tiltXText: false, // false|true
      sortData: function(a, b) {
        return 0;
      }
    };

    $scope.chartDatas = [{
      name: 'AAAA',
      values: [{
        name: 'a',
        value: 2
      }, {
        name: 'b',
        value: 3
      }, {
        name: 'c',
        value: 5
      }, {
        name: 'd',
        value: 4
      }]
    }, {
      name: 'BBBB',
      values: [{
        name: 'a',
        value: 4
      }, {
        name: 'b',
        value: 6
      }, {
        name: 'c',
        value: 2
      }, {
        name: 'd',
        value: 3
      }]
    }, {
      name: 'CCCC',
      values: [{
        name: 'a',
        value: 7
      }, {
        name: 'b',
        value: 4
      }, {
        name: 'c',
        value: 5
      }, {
        name: 'd',
        value: 2
      }]
    }, {
      name: 'DDDD',
      values: [{
        name: 'a',
        value: 1
      }, {
        name: 'b',
        value: 4
      }, {
        name: 'c',
        value: 3
      }, {
        name: 'd',
        value: 5
      }]
    }, {
      name: 'EEEE',
      values: [{
        name: 'a',
        value: 2
      }, {
        name: 'b',
        value: 0
      }, {
        name: 'c',
        value: 4
      }, {
        name: 'd',
        value: 3
      }]
    }, {
      name: 'FFFF',
      values: [{
        name: 'a',
        value: 5
      }, {
        name: 'b',
        value: 3
      }, {
        name: 'c',
        value: 7
      }, {
        name: 'd',
        value: 4
      }]
    }, {
      name: 'GGGG',
      values: [{
        name: 'a',
        value: 3
      }, {
        name: 'b',
        value: 3
      }, {
        name: 'c',
        value: 4
      }, {
        name: 'd',
        value: 2
      }]
    }];

    $scope.chartLegends = [
      'X',
      'Y',
      'Z',
      'T'
    ];

    $scope.updateTime = new Date();

    $scope.updateConfig = function(attr, value) {
      $timeout(function() {
        $scope.chartConfig[attr] = value;

        $scope.updateTime = new Date();
      }, 1);
    };
  }
]);

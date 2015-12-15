// controller: LineChart
'use strict';

app.controller('LineChartController', [
  '$scope',
  '$timeout',
  function($scope, $timeout) {
    $scope.edit = {
      title: '',
    };

    $scope.chartConfig = {
      padding: 10,
      autoResize: true,
      title: 'D3 Line Chart',
      subTitle: 'by Tag.Hu',
      legend: true,
      fillOpacity: 0.4,
      chartMarginX: 30,
      chartMarginY: 20,
      canvas: true, // true|false
      type: 'line', // line|area
      stack: false,
      line: 'segment', // segment|curve|step
      xFormat: 'date', // value|date
      yFormat: 'value', // value|percentage
      xTick: function(d, i) {
        var d = new Date(d);
        // return d;
        if(!d.getHours()
            && !d.getMinutes()
            && !d.getSeconds()) {
          return d3.time.format('%m-%d')(d);
        }else {
          return d3.time.format('%H:%M')(d);
        }
      },
      mouseEvent: true,
      tipType: 'separate', // separate|single
      tipText: function(i, d) {
        return $scope.chartLegends[i] + ': ' + d;
      }
    };

    $scope.chartDatas = [
      [{
        x: new Date('2015-06-10T16:27:00+08:00'),
        y: 27
      }, {
        x: new Date('2015-06-11T16:28:00+08:00'),
        y: 16
      }, {
        x: new Date('2015-06-12T16:29:00+08:00'),
        y: 12
      }, {
        x: new Date('2015-06-13T16:30:00+08:00'),
        y: 6
      }, {
        x: new Date('2015-06-14T16:37:00+08:00'),
        y: 14
      }, {
        x: new Date('2015-06-15T16:42:00+08:00'),
        y: 11
      }, {
        x: new Date('2015-06-16T16:46:00+08:00'),
        y: 5
      }, {
        x: new Date('2015-06-17T16:47:00+08:00'),
        y: 17
      }],
      [{
        x: new Date('2015-06-10T16:27:00+08:00'),
        y: 19
      }, {
        x: new Date('2015-06-11T16:28:00+08:00'),
        y: 12
      }, {
        x: new Date('2015-06-12T16:29:00+08:00'),
        y: 20
      }, {
        x: new Date('2015-06-13T16:30:00+08:00'),
        y: 15
      }, {
        x: new Date('2015-06-14T16:37:00+08:00'),
        y: 6
      }, {
        x: new Date('2015-06-15T16:42:00+08:00'),
        y: 20
      }, {
        x: new Date('2015-06-16T16:46:00+08:00'),
        y: 8
      }, {
        x: new Date('2015-06-17T16:47:00+08:00'),
        y: 16
      }],
      [{
        x: new Date('2015-06-10T16:27:00+08:00'),
        y: 4
      }, {
        x: new Date('2015-06-11T16:28:00+08:00'),
        y: 7
      }, {
        x: new Date('2015-06-12T16:29:00+08:00'),
        y: 9
      }, {
        x: new Date('2015-06-13T16:30:00+08:00'),
        y: 2
      }, {
        x: new Date('2015-06-14T16:37:00+08:00'),
        y: 17
      }, {
        x: new Date('2015-06-15T16:42:00+08:00'),
        y: 12
      }, {
        x: new Date('2015-06-16T16:46:00+08:00'),
        y: 11
      }, {
        x: new Date('2015-06-17T16:47:00+08:00'),
        y: 6
      }],
      [{
        x: new Date('2015-06-10T16:27:00+08:00'),
        y: 6
      }, {
        x: new Date('2015-06-11T16:28:00+08:00'),
        y: 6
      }, {
        x: new Date('2015-06-12T16:29:00+08:00'),
        y: 6
      }, {
        x: new Date('2015-06-13T16:30:00+08:00'),
        y: 6
      }, {
        x: new Date('2015-06-14T16:37:00+08:00'),
        y: 10
      }, {
        x: new Date('2015-06-15T16:42:00+08:00'),
        y: 6
      }, {
        x: new Date('2015-06-16T16:46:00+08:00'),
        y: 2
      }, {
        x: new Date('2015-06-17T16:47:00+08:00'),
        y: 8
      }]
    ];

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
  }
]);

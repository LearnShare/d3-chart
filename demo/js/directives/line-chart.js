// directive: d3LineChart
'use strict';

app.directive('d3LineChart', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      scope: {
        update: '=update',
        datas: '=datas',
        legends: '=legends',
        config: '=config'
      },
      link: function(scope, element, attrs) {
        scope.config.target = element[0];

        scope.lineChart = new LineChart(scope.config);

        scope.$watch('update', function() {
          scope.updateChart();
        }, true);

        scope.updateChart = function() {
          for(var attr in scope.config) {
            var value = scope.config[attr];

            scope.lineChart.config[attr] = value;
          }

          var datas = new Object();
          datas = scope.datas;

          var legends = new Object();
          legends = scope.legends;

          scope.lineChart.setData(datas, legends);
        };
      }
    };
  }
]);

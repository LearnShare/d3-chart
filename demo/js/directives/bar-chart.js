// directive: d3BarChart
'use strict';

app.directive('d3BarChart', [
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

        scope.barChart = new BarChart(scope.config);

        scope.$watch('update', function() {
          scope.updateChart();
        }, true);

        scope.updateChart = function() {
          for(var attr in scope.config) {
            var value = scope.config[attr];

            scope.barChart.config[attr] = value;
          }

          var datas = new Object();
          datas = scope.datas;

          var legends = new Object();
          legends = scope.legends;

          scope.barChart.setData(datas, legends);
        };
      }
    };
  }
]);

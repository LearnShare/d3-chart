// directive: d3Chart
'use strict';

app.directive('d3Chart', [
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

        scope.chart = new Chart(scope.config);

        scope.$watch('update', function() {
          scope.updateChart();
        }, true);

        scope.updateChart = function() {
          scope.chart.updateConfig(scope.config);

          var datas = new Object();
          datas = scope.datas;

          var legends = new Object();
          legends = scope.legends;

          scope.chart.setData(datas, legends);
        };
      }
    };
  }
]);

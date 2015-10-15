// app define and config
'use strict';

var app = angular.module('app', [
  'ngRoute'
]);

// route config
app.config([
  '$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'IndexController',
        templateUrl: 'views/index.html'
      })

      .when('/chart', {
        controller: 'ChartController',
        templateUrl: 'views/chart/chart.html'
      })
      .when('/line-chart', {
        controller: 'LineChartController',
        templateUrl: 'views/chart/line.html'
      })
      .when('/bar-chart', {
        controller: 'BarChartController',
        templateUrl: 'views/chart/bar.html'
      })
      .when('/pie-chart', {
        controller: 'PieChartController',
        templateUrl: 'views/chart/pie.html'
      })

      .otherwise({
        redirectTo: '/'
      });
  }
]);

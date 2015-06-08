var LineChart = (function(_super) {
  __extends(LineChart, _super);

  function LineChart(config) {
    var self = this;

    // check config
    if(!config
        || !config.target) {
      return;
    }
    _super.call(this, config);
  }

  // set chartData
  LineChart.prototype.setData = function(data) {
    var self = this;

    self.chartData = data;
    self.drawChart();
  };
  
  // append more data
  LineChart.prototype.appendData = function(data) {
    var self = this;

    // self.chartData = data;
    self.drawChart();
  };

  // draw chart
  LineChart.prototype.drawChart = function(data) {
    var self = this;

    self.svg.append('g')
        .attr('class', 'line-chart');
  };
  
  return LineChart;
})(Chart);

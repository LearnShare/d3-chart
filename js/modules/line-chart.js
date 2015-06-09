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

    self.config.chartMarginX = config.chartMarginX
        || 30;
    self.config.chartMarginY = config.chartMarginY
        || 20;
  }

  // set chartData
  LineChart.prototype.setData = function(data, legendData) {
    var self = this;

    self.chartData = data;
    for(var i in data) {
      // console.table(data[i]);
    }
    if(legendData) {
      self.config.legendData = legendData;
    }

    self.draw();
  };
  
  // append more data
  LineChart.prototype.appendData = function(data, legendData) {
    var self = this;

    // self.chartData = data;
    if(legendData) {
      self.config.legendData = legendData;
    }
    self.draw();
  };

  // draw chart
  LineChart.prototype.drawChart = function() {
    var self = this;

    if(!self.chartData
        || !self.chartData.length) {
      return;
    }

    self.chart = self.svg.append('g')
        .attr('class', 'line-chart')
        .attr('transform', 'translate('
            + (self.config.padding
                + self.config.chartMarginX)
            + ', '
            + self.titleYMax
            + ')'
        );

    self.drawLines();
    self.drawAxises();
  };

  // draw axises
  LineChart.prototype.drawAxises = function() {
    var self = this;

    self.chartWidth = self.config.width
        - self.config.padding * 2
        - self.config.chartMarginX
        - self.config.chartMarginX / 2;
    self.chartHeight = self.config.height
        - self.config.padding * 2
        - self.titleYMax
        - self.config.chartMarginY;
    // x/y range
    self.rangeX = d3.scale.linear()
        .range([0, self.chartWidth]);
    self.rangeY = d3.scale.linear()
        .range([self.chartHeight, 0]);

    // x/y axises
    self.axisX = d3.svg.axis()
        .scale(self.rangeX)
        .orient('bottom')
        .tickFormat(function(d, i) {
          return d;
        });
    self.axisY = d3.svg.axis()
        .scale(self.rangeY)
        .orient('left')
        .tickFormat(function(d, i) {
          return d;
        });

    self.chart.append('g')
        .attr('class', 'axis x')
        .attr('transform', 'translate(0, '
            + (self.config.height
                - self.config.padding * 2
                - self.titleYMax
                - self.config.chartMarginY)
            + ')')
        .call(self.axisX);
    self.chart.append('g')
        .attr('class', 'axis y')
        .call(self.axisY);
  };

  // draw axises
  LineChart.prototype.drawLines = function() {
    var self = this;

    //
  };
  
  return LineChart;
})(Chart);

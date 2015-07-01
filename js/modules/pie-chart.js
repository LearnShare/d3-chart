var PieChart = (function(_super) {
  __extends(PieChart, _super);

  function PieChart(config) {
    var self = this;

    // check config
    if(!config
        || !config.target) {
      return;
    }
    _super.call(this, config);

    self.config.radius = config.radius
        || 0.8;
    self.config.sortData = (config.sortData
          && (typeof config.sortData == 'function'))
        ? config.sortData
        : undefined,

    self.formater = d3.format(',.3f');
  }
  // set chartData
  PieChart.prototype.setData = function(data) {
    var self = this;

    self.chartData = data;

    if(self.config.sortData) {
      self.chartData.sort(self.config.sortData);
    }

    var sum = 0;
    for(var i in self.chartData) {
      var value = self.chartData[i].value;

      sum += parseFloat(value);
    }
    for(var i in self.chartData) {
      var d = self.chartData[i];

      d.value = +d.value;
      d.percentage = self.formater(d.value / sum)
          * 100;
    }

    self.config.legendData = self.chartData;

    self.draw();
  };

  // draw chart
  PieChart.prototype.drawChart = function() {
    var self = this;

    if(!self.chartData
        || !self.chartData.length) {
      return;
    }

    self.chartTranslateY = self.config.padding
        + self.titleYMax;

    self.chart = self.svg.append('g')
        .attr('class', 'pie-chart')
        .attr('transform', 'translate('
            + self.config.padding
            + ', '
            + self.chartTranslateY
            + ')'
        );

    // chart size
    self.chartWidth = self.config.width
        - self.config.padding * 2;

    self.chartHeight = self.config.height
        - self.chartTranslateY
        - self.config.padding;

    if(self.chartWidth <= 0
        || self.chartHeight <= 0) {
      return;
    }

    // radius for pie/circle
    self.chartR0 = 0;
    self.chartR1 = (self.chartWidth > self.chartHeight)
        ? self.chartHeight / 2
        : self.chartWidth / 2;

    if(typeof self.config.radius == 'object'
        && self.config.radius.length >= 2) {
      self.chartR0 =  self.chartR1 * self.config.radius[0];
      self.chartR1 *= self.config.radius[1];
    }else {
      self.chartR0 *= self.config.radius;
      self.chartR1 *= self.config.radius;
    }

    self.drawPie();
  };

  // draw pie
  PieChart.prototype.drawPie = function() {
    var self = this;

    self.arc = d3.svg.arc()
        .innerRadius(self.chartR0)
        .outerRadius(self.chartR1);

    self.pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });

    self.chart.append('g')
        .attr('class', 'pie')
        .attr('transform', 'translate('
            + self.chartWidth / 2
            + ', '
            + self.chartHeight / 2
            + ')');

    var g = self.svg.selectAll('.pie')
        .selectAll('.arc')
            .data(self.pie(self.chartData))
            .enter().append('g')
                .attr('class', 'arc');

    g.append('path')
        .attr('d', self.arc)
        .style('fill', function(d, i) {
          return self.config.color(i);
        });
  };
  
  return PieChart;
})(Chart);

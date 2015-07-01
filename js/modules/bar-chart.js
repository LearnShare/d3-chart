var BarChart = (function(_super) {
  __extends(BarChart, _super);

  function BarChart(config) {
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
  BarChart.prototype.setData = function(data, legendData) {
    var self = this;

    self.chartData = data;

    self.minY = 0;
    self.maxY = 0;

    for(var i in data) {
      var data = self.chartData[i];

      for(var j in data.values) {
        var d = data.values[j];

        if(d < self.minY) {
          self.minY = d;
        }

        if(d > self.maxY) {
          self.maxY = d;
        }
      }
    }

    if(legendData) {
      self.config.legendData = legendData;
    }

    self.draw();
  };

  // draw chart
  BarChart.prototype.drawChart = function() {
    var self = this;

    if(!self.chartData
        || !self.chartData.length) {
      return;
    }

    var legendHeight = self.config.legendData.length
        * (self.config.legendItemHeight
          + self.config.legendItemMargin);

    self.chartTranslateY = self.config.padding
        + self.titleYMax;
    if(self.config.legend) {
      self.chartTranslateY += legendHeight
          + self.config.padding;
    }

    self.chart = self.svg.append('g')
        .attr('class', 'bar-chart')
        .attr('transform', 'translate('
            + (self.config.padding
                + self.config.chartMarginX)
            + ', '
            + self.chartTranslateY
            + ')'
        );

    // chart size
    self.chartWidth = self.config.width
        - self.config.padding * 2
        - self.config.chartMarginX
        - self.config.chartMarginX / 2;

    self.chartHeight = self.config.height
        - self.chartTranslateY
        - self.config.padding
        - self.config.chartMarginY;

    if(self.chartWidth <= 0
        || self.chartHeight <= 0) {
      return;
    }

    // x/y range
    self.rangeX = d3.scale.ordinal()
        .rangeRoundBands([0, self.chartWidth], 0.2, 0.5)
        .domain(self.chartData.map(function(d) {
          return d.name;
        }));

    self.rangeY = d3.scale.linear()
        .range([self.chartHeight, 0])
        .domain([self.minY, self.maxY]);

    self.drawBars();
    self.drawAxises();

    if(self.config.mouseEvent) {
      self.drawOverlay();
    }
  };

  // draw chart
  BarChart.prototype.drawBars = function() {
    var self = this;

    var g = self.chart.append('g')
        .attr('class', 'bars');

    g.selectAll('.bar')
        .data(self.chartData)
        .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) {
              return self.rangeX(d.name);
            })
            .attr('y', function(d) {
              return self.rangeY(d.values[0])
            })
            .attr('width', self.rangeX.rangeBand())
            .attr('height', function(d) {
              return self.chartHeight - self.rangeY(d.values[0]);
            })
            .style('fill', self.config.color(0));

  };

  // draw axises
  BarChart.prototype.drawAxises = function() {
    var self = this;

    var xTickStep = 60,
        yTickStep = 40;
    if(window.innerWidth >= 700) {
      xTickStep = 80;
    }
    
    var xTickTimes = parseInt(self.config.width / xTickStep)
        - 1,
        yTickTimes = parseInt(self.config.height / yTickStep)
        - 1;
    if(xTickTimes >= 10) {
      xTickTimes = 10;
    }
    if(yTickTimes >= 12) {
      yTickTimes = 12;
    }else {
      yTickTimes = 6;
    }

    // x/y axises
    self.axisX = d3.svg.axis()
        .scale(self.rangeX)
        .orient('bottom')
        .ticks(xTickTimes)
        .tickFormat(self.config.xTick);
    self.axisY = d3.svg.axis()
        .scale(self.rangeY)
        .orient('left')
        .ticks(yTickTimes)
        .tickFormat(function(d, i) {
          return d;
        });

    self.chart.append('g')
        .attr('class', 'axis x')
        .attr('transform', 'translate(0, '
            + (self.chartHeight)
            + ')')
        .call(self.axisX);
    self.chart.append('g')
        .attr('class', 'axis y')
        .call(self.axisY);
  };
  
  return BarChart;
})(Chart);

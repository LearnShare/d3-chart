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
        || 30;

    self.config.xFormat = config.xFormat
        || 'value';
    self.config.timeFormat = config.timeFormat
        || '%Y-%m-%d %H:%M:%S';
    var xTick = function(d) {
      return d;
    };
    if(self.config.xFormat == 'time') {
      xTick = d3.time.format('%H:%M');
    }
    self.config.xTick = config.xTick
        || xTick;

    self.config.type = config.type
        || 'line';
    self.config.line = config.line
        || 'segment';
    self.config.marker = config.marker
        || 'none';

    self.xFormater = function(d) {
      return d;
    };
    if(self.config.xFormat == 'time') {
      self.xFormater = d3.time.format(self.config.timeFormat).parse;
    }
  }

  // set chartData
  LineChart.prototype.setData = function(data, legendData) {
    var self = this;

    self.chartData = data;

    // all d.x
    self.dataX = [];
    self.minY = 0;
    self.maxY = 0;

    for(var i in data) {
      var data = self.chartData[i];

      for(var j in data) {
        var d = data[j];

        d.x = self.xFormater(d.x);

        if(self.dataX.indexOf(d.x) == -1) {
          self.dataX.push(d.x);
        }

        if(d.x < self.minY) {
          self.minY = d.x;
        }

        if(d.y > self.maxY) {
          self.maxY = d.y;
        }
      }
    }
    self.dataX.sort(function(a, b) {
      return a - b;
    });

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

    // chart size
    self.chartWidth = self.config.width
        - self.config.padding * 2
        - self.config.chartMarginX
        - self.config.chartMarginX / 2;
    self.chartHeight = self.config.height
        - self.config.padding
        - self.titleYMax
        - self.config.chartMarginY;

    // x/y range
    self.rangeX = d3.scale.linear()
        .range([0, self.chartWidth])
        .domain(d3.extent(self.dataX, function(d){
          return d;
        }));
    if(self.config.xFormat == 'time') {
      self.rangeX = d3.time.scale()
          .range([0, self.chartWidth])
          .domain(d3.extent(self.dataX, function(d){
            return d;
          }));
    }
    self.rangeY = d3.scale.linear()
        .range([self.chartHeight, 0])
        .domain([self.minY, self.maxY]);

    self.drawLines();
    self.drawAxises();
  };

  // draw lines
  LineChart.prototype.drawLines = function() {
    var self = this;

    for(var i in self.chartData) {
      var data = self.chartData[i];

      if(data.length) {
        self.drawLine(data, i);
      }
    }
  };

  // draw line
  LineChart.prototype.drawLine = function(data, i) {
    var self = this;

    // line interpolate
    var lineInterpolate = 'linear';
    if(self.config.line == 'curve') {
      lineInterpolate = 'cardinal';
    }else if(self.config.line == 'step') {
      lineInterpolate = 'step';
    }
    // line path
    var line = d3.svg.line()
        .interpolate(lineInterpolate)
        .x(function(d) {
          return self.rangeX(d.x);
        })
        .y(function(d) {
          return self.rangeY(d.y);
        });
    // area path
    var area = d3.svg.area()
        .interpolate(lineInterpolate)
        .x(function(d) {
          return self.rangeX(d.x);
        })
        .y0(self.chartHeight)
        .y1(function(d) {
          return self.rangeY(d.y);
        });

    // line/area
    var pathClass = 'line',
        pathData = line;
        pathStroke = true;
        pathFill = false;
    if(self.config.type == 'area') {
      pathClass = 'area';
      pathData = area;
      pathStroke = false;
      pathFill = true;
    }

    self.chart.append('g')
        .attr('class', 'item')
        .append('path')
            .datum(data)
            .attr('class', pathClass)
            .attr('d', pathData)
            .style('stroke', function() {
              if(pathStroke) {
                return self.config.color(i);
              }
            })
            .style('fill', function() {
              if(pathFill) {
                return self.config.color(i);
              }
            });
  };

  // draw axises
  LineChart.prototype.drawAxises = function() {
    var self = this;

    // x/y axises
    self.axisX = d3.svg.axis()
        .scale(self.rangeX)
        .orient('bottom')
        .tickFormat(self.config.xTick);
    self.axisY = d3.svg.axis()
        .scale(self.rangeY)
        .orient('left')
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
  
  return LineChart;
})(Chart);

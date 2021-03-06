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

    self.config.canvas = config.canvas
        || false;

    self.config.type = config.type
        || 'group';

    self.config.tiltXText = config.tiltXText
        || false;
        
    self.config.sortData = (config.sortData
          && (typeof config.sortData == 'function'))
        ? config.sortData
        : undefined;
  }

  // set chartData
  BarChart.prototype.setData = function(data, legendData) {
    var self = this;

    self.chartData = data;

    self.minY = 0;
    self.maxY = 0;
    self.maxSumY = 0;

    for(var i in data) {
      var data = self.chartData[i];

      var sum = 0;

      for(var j in data.values) {
        var d = data.values[j];

        if(d.value < self.minY) {
          self.minY = d.value;
        }

        if(d.value > self.maxY) {
          self.maxY = d.value;
        }

        sum += d.value;
        d.sum = sum;
      }

      data.sum = sum;

      if(sum > self.maxSumY) {
        self.maxSumY = sum;
      }
    }

    if(self.config.sortData) {
      self.chartData.sort(self.config.sortData);
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

    self.chartTranslateY = self.config.padding
        + self.titleYMax;
    if(self.config.legendVerticalAlign == 'top') {
      self.chartTranslateY += self.config.padding
          + self.legendYMax;
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

    self.pen.translate(self.config.padding
        + self.config.chartMarginX,
        self.chartTranslateY);
    self.pen.fillStyle = 'rgba(0, 0, 0, 0.1)';
    self.pen.strokeStyle = '#AAF';

    // chart size
    self.chartWidth = self.config.width
        - self.config.padding * 2
        - self.config.chartMarginX
        - self.config.chartMarginX / 2;

    self.chartHeight = self.config.height
        - self.chartTranslateY
        - self.config.padding
        - self.config.chartMarginY;
    if(self.config.legend
        && self.config.legendVerticalAlign == 'bottom') {
      self.chartHeight = self.chartHeight
          - self.legendYMax
          - self.config.padding;
    }

    if(self.chartWidth <= 0
        || self.chartHeight <= 0) {
      return;
    }

    // x/y range
    self.rangeX = d3.scale.ordinal()
        .rangeRoundBands([0, self.chartWidth], 0.4, 0.5)
        .domain(self.chartData.map(function(d) {
          return d.name;
        }));
    self.groupX = d3.scale.ordinal()
        .domain(self.chartData[0].values.map(function(d) {
          return d.name;
        }))
        .rangeRoundBands([0, self.rangeX.rangeBand()]);

    self.rangeY = d3.scale.linear()
        .range([self.chartHeight, 0]);

    if(self.config.type == 'stack') {
      self.rangeY.domain([self.minY, self.maxSumY]);
    }else { // group as default
      self.rangeY.domain([self.minY, self.maxY]);
    }

    self.drawBars();
    self.drawAxises();

    if(self.config.mouseEvent) {
      self.drawOverlay();
    }
  };

  // draw chart
  BarChart.prototype.drawBars = function() {
    var self = this;

    if(self.config.canvas) {
      self.drawBarsToCanvas();
    }else {
      self.drawBarsToSvg();
    }
  };

  // draw to svg
  BarChart.prototype.drawBarsToSvg = function() {
    var self = this;

    var groups = self.chart.append('g')
        .attr('class', 'groups');

    var group = groups.selectAll('.group')
        .data(self.chartData)
        .enter().append('g')
            .attr('class', 'group')
            .attr('transform', function(d) {
              return 'translate('
                  + self.rangeX(d.name)
                  + ', 0)';
            });

    if(self.config.type == 'stack') {
      group.append('text')
          .attr('y', function(d) {
            return self.rangeY(d.sum);
          })
          .attr('dx', self.rangeX.rangeBand() / 2)
          .attr('dy', -2)
          .style('text-anchor', 'middle')
          .text(function(d) {
            return d.sum;
          });

      var bars = group.selectAll('.bar')
          .data(function(d) {
            return d.values;
          })
          .enter().append('g')
              .attr('class', 'bar group');

      bars.append('rect')
        .attr('y', function(d) {
          return self.rangeY(d.sum);
        })
        .attr('width', self.rangeX.rangeBand())
        .attr('height', function(d) {
          return self.chartHeight - self.rangeY(d.value);
        })
        .style('fill', function(d, i) {
          return self.config.color(i);
        });
      bars.append('text')
        .attr('y', function(d) {
          return self.rangeY(d.sum);
        })
        .attr('dx', self.rangeX.rangeBand() / 2)
        .attr('dy', 12)
        .style('text-anchor', 'middle')
        .style('fill', '#FFF')
        .text(function(d) {
          return d.value;
        });
    }else { // group as default
      var bars = group.selectAll('.bar')
          .data(function(d) {
            return d.values;
          })
          .enter().append('g')
              .attr('class', 'bar');

      bars.append('rect')
          .attr('class', 'bar')
          .attr('x', function(d) {
            return self.groupX(d.name);
          })
          .attr('y', function(d) {
            return self.rangeY(d.value);
          })
          .attr('width', self.groupX.rangeBand())
          .attr('height', function(d) {
            return self.chartHeight - self.rangeY(d.value);
          })
          .style('fill', function(d, i) {
            return self.config.color(i);
          });
      bars.append('text')
        .attr('x', function(d) {
          return self.groupX(d.name);
        })
        .attr('y', function(d) {
          return self.rangeY(d.value);
        })
        .attr('dx', self.groupX.rangeBand() / 2)
        .attr('dy', -2)
        .style('text-anchor', 'middle')
        .text(function(d) {
          return d.value;
        });
    }
  };
  // draw to canvas
  BarChart.prototype.drawBarsToCanvas = function() {
    var self = this;

    for(var i in self.chartData) {
      var d = self.chartData[i];

      for(var j in d.values) {
        var v = d.values[j];

        // set pen style
        self.pen.fillStyle = self.config.color(j);

        if(self.config.type == 'stack') {
          self.pen.fillRect(self.rangeX(d.name),
              self.rangeY(v.sum),
              self.rangeX.rangeBand(),
              self.chartHeight - self.rangeY(v.value));
        }else {
          self.pen.fillRect(self.rangeX(d.name) + self.groupX(v.name),
              self.rangeY(v.value),
              self.groupX.rangeBand(),
              self.chartHeight - self.rangeY(v.value));
        }
      }
    }
  };

  // draw axises
  BarChart.prototype.drawAxises = function() {
    var self = this;

    var xTickStep = 60,
        yTickStep = 60;
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
          var showD = '';
          if(d >= 1 * 1000 * 1000 * 1000) {
            showD = (d / 1000000000) + 'G';
          }else if(d >= 1 * 1000 * 1000) {
            showD = (d / 1000000) + 'M';
          }else if(d >= 1 * 1000) {
            showD = (d / 1000) + 'K';
          }else {
            showD = d;
          }
          return showD;
        });
        
    var axisXGroup = self.chart.append('g')
        .attr('class', 'axis x')
        .attr('transform', 'translate(0, '
            + (self.chartHeight)
            + ')')
        .call(self.axisX);
    if(self.config.tiltXText) {
      axisXGroup.selectAll('text')
          .style('text-anchor', 'start')
          .attr('transform', 'rotate(40)');
    }
    self.chart.append('g')
        .attr('class', 'axis y')
        .call(self.axisY);
  };
  
  return BarChart;
})(Chart);

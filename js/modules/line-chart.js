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

    self.bisectX = d3.bisector(function(d) {
      return d.x;
    }).left;

    self.drawLines();
    self.drawAxises();

    if(self.config.mouseEvent) {
      self.drawOverlay();
    }
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

  // draw overlay
  LineChart.prototype.drawOverlay = function() {
    var self = this;

    if(!self.chartData.length) {
      return;
    }
    
    var overlay = self.svg.append('g')
        .attr('class', 'overlay')
        .attr('transform', 'translate('
            + (self.config.padding
                + self.config.chartMarginX)
            + ', '
            + self.titleYMax
            + ')');

    var overlayRect = overlay.append('rect')
        .attr('width', self.chartWidth)
        .attr('height', self.chartHeight)
        .style('stroke', 'none')
        .style('fill', 'rgba(0, 0, 0, 0)');

    self.markers = [];

    var marker = overlay.append('g')
        .attr('class', 'marker')
        .style('display', 'none');

    marker.append('rect')
        .style('fill', '#666');
    marker.append('text')
        .style('fill', '#FFF')
        .style('font-size', '12px')
        .style('text-anchor', 'middle');

    self.markerX = marker;

    var length = self.chartData.length;
    for(var i = 0; i < length; i++) {
      var marker = overlay.append('g')
          .attr('class', 'marker')
          .style('display', 'none');

      marker.append('rect')
          .style('stroke', self.config.color(i));
      marker.append('text')
          .style('fill', '#333')
          .style('font-size', '12px')
          .style('text-anchor', 'middle');

      self.markers.push(marker);
    }

    overlay.on('mousemove', function() {
      self.pointToX(self.rangeX.invert(d3.mouse(this)[0]));
    });
    overlay.on('mouseout', function() {
      self.hideMarkers();
    });
  };

  // point to x
  LineChart.prototype.pointToX = function(x) {
    var self = this;

    var index = self.bisectX(self.chartData[0], x, 1);

    var d = (x - self.chartData[0][index - 1].x
          > self.chartData[0][index].x - x)
        ? self.chartData[0][index]
        : self.chartData[0][index - 1];
    
    self.moveMarkerX(d);

    for(var i in self.chartData) {
      var data = self.chartData[i];

      if(data.length) {
        var index = self.bisectX(data, x, 1);

        var d = (x - data[index - 1].x
              > data[index].x - x)
            ? data[index]
            : data[index - 1];

        // 变化检测，同样的 d.x 不重复移动
        self.moveMarker(i, d);
      }
    }
  };

  // markX @ (d.x, d.y)
  LineChart.prototype.moveMarkerX = function(d) {
    var self = this;

    var point = {
      x: self.rangeX(d.x),
      y: self.rangeY(d.y)
    };

    var textElmt = self.markerX.select('text'),
        rectElmt = self.markerX.select('rect');

    var formater = function(d) {
      return d;
    };
    if(self.config.xFormat == 'time') {
      formater = d3.time.format(self.config.timeFormat);
    }
    
    textElmt.text(formater(d.x));

    var textElmtWidth = textElmt[0][0].clientWidth,
        textElmtHeight = textElmt[0][0].clientHeight;

    var rectWidth = textElmtWidth + 20,
        rectHeight = textElmtHeight + 10;

    if(rectWidth < 40) {
      rectWidth = 40;
    }

    textElmt.attr('dy', (textElmtHeight + rectHeight) / 2 - 2);

    rectElmt.attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('transform', 'translate('
            + -(rectWidth / 2)
            + ', 0)');

    var translateX = point.x;
    // left border
    if(point.x - rectWidth / 2 < 0) {
      translateX = rectWidth / 2;
    }
    // right border
    if(point.x + rectWidth / 2 > self.chartWidth) {
      translateX = self.chartWidth - rectWidth / 2;
    }
    self.markerX.style('display', 'block')
        .attr('transform', 'translate('
            + translateX
            + ', '
            + self.chartHeight
            + ')');
  };

  // mark point i @ (d.x, d.y)
  LineChart.prototype.moveMarker = function(i, d) {
    var self = this;

    var point = {
      x: self.rangeX(d.x),
      y: self.rangeY(d.y)
    };

    var textElmt = self.markers[i].select('text'),
        rectElmt = self.markers[i].select('rect');
    
    textElmt.text(d.y);

    var textElmtWidth = textElmt[0][0].clientWidth,
        textElmtHeight = textElmt[0][0].clientHeight;

    var rectWidth = textElmtWidth + 20,
        rectHeight = textElmtHeight + 10;

    if(rectWidth < 40) {
      rectWidth = 40;
    }

    textElmt.attr('transform', 'translate('
        + (rectWidth / 2 + 10)
        + ', '
        + (textElmtHeight / 2 - 2)
        + ')');

    rectElmt.attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('transform', 'translate('
            + 10
            + ', -'
            + (rectHeight / 2)
            + ')');

    self.markers[i].style('display', 'block')
        .attr('transform', 'translate('
            + point.x
            + ', '
            + point.y
            + ')');
  };

  // hide all markers
  LineChart.prototype.hideMarkers = function() {
    var self = this;

    self.markerX.style('display', 'none');
    for(var i in self.markers) {
      var marker = self.markers[i];

      marker.style('display', 'none');
    }
  };
  
  return LineChart;
})(Chart);

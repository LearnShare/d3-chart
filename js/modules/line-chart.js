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

    self.config.canvas = config.canvas
        || false;

    self.config.xFormat = config.xFormat
        || 'value';
    self.config.timeFormat = config.timeFormat
        || '%Y-%m-%d %H:%M:%S';
    self.config.yFormat = config.yFormat
        || 'value';
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
    self.config.stack = config.stack
        || false;
    self.config.line = config.line
        || 'segment';
    self.config.marker = config.marker
        || 'none';

    self.config.tipType = config.tipType
        || 'separate';

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
    self.maxSumY = 0;

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

        if(i > 0) {
          d.sum = d.y + self.chartData[i - 1][j].sum;
        }else {
          d.sum = d.y;
        }

        if(d.sum > self.maxSumY) {
          self.maxSumY = d.sum;
        }
      }
    }
    self.dataX.sort(function(a, b) {
      return a - b;
    });

    if(legendData) {
      self.config.legendData = legendData;
    }

    if(self.config.yFormat == 'percentage') {
      self.maxY = 100;
      self.maxSumY = 100;
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

    self.chartTranslateY = self.config.padding
        + self.titleYMax;
    if(self.config.legendVerticalAlign == 'top') {
      self.chartTranslateY += self.config.padding
          + self.legendYMax;
    }

    self.chart = self.svg.append('g')
        .attr('class', 'line-chart')
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
        .range([self.chartHeight, 0]);
    if(self.config.stack) {
      self.rangeY.domain([self.minY, self.maxSumY]);
    }else {
      self.rangeY.domain([self.minY, self.maxY]);
    }

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

    if(self.config.canvas) {
      self.drawLineToCanvas(data, i);
    }else {
      self.drawLineToSvg(data, i);
    }
  };
  // draw to svg
  LineChart.prototype.drawLineToSvg = function(data, i) {
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
        });
    if(self.config.stack) {
      line.y(function(d) {
        return self.rangeY(d.sum);
      });
    }else {
      line.y(function(d) {
        return self.rangeY(d.y);
      });
    }
    // area path
    var area = d3.svg.area()
        .interpolate(lineInterpolate)
        .x(function(d) {
          return self.rangeX(d.x);
        })
        .y0(self.chartHeight);
    if(self.config.stack) {
      area.y1(function(d) {
        return self.rangeY(d.sum);
      });
    }else {
      area.y1(function(d) {
        return self.rangeY(d.y);
      });
    }

    // line/area
    var pathClass = 'line',
        pathData = line,
        pathStroke = true,
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
            })
            .style('opacity', function() {
              if(pathFill) {
                return 0.7;
              }
            });
  };
  // draw to canvas
  LineChart.prototype.drawLineToCanvas = function(data, i) {
    var self = this;

    // set pen style
    var rgb = self.hexToRgb(self.config.color(i));

    self.pen.strokeStyle = self.config.color(i);
    self.pen.fillStyle = 'rgba('
        + rgb.r
        + ', '
        + rgb.g
        + ', '
        + rgb.b
        + ', 0.7)';

    self.pen.beginPath();
    if(self.config.type == 'area') {
      self.pen.moveTo(0, self.chartHeight);
    }
    for(var j in data) {
      var d = data[j];

      var p = {
        x: self.rangeX(d.x),
        y: self.rangeY(d.y)
      };

      if(j == 0
          && self.config.type == 'line') {
        self.pen.moveTo(p.x, p.y);
      }else {
        self.pen.lineTo(p.x, p.y);
      }
    }
    if(self.config.type == 'area') {
      self.pen.lineTo(self.chartWidth, self.chartHeight);
      self.pen.lineTo(0, self.chartHeight);
      self.pen.fill();
    }else {
      self.pen.stroke();
    }
  };

  // draw axises
  LineChart.prototype.drawAxises = function() {
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
            + self.chartTranslateY
            + ')');

    // single tip
    if(self.config.tipType == 'single') {
      self.markerLine = overlay.append('line')
          .attr('class', 'marker line')
          .attr('y1', 0)
          .attr('y2', self.chartHeight)
          .style('display', 'none');
      self.markerSingle = overlay.append('g')
          .attr('class', 'marker single')
          .style('display', 'none');

      self.markerSingle.append('rect')
          .attr('class', 'bg-rect');
      self.markerSingle.append('text')
          .attr('class', 'text-x')
          .attr('dx', 10)
          .attr('dy', self.config.legendItemHeight - 3 + 10)
          .style('fill', '#333')
          .style('font-size', self.config.legendItemHeight - 4);

      var length = self.chartData.length;
      for(var i = 0; i < length; i++) {
        var g = self.markerSingle.append('g')
            .attr('class', 'item')
            .attr('transform', function(d) {
              return 'translate(10, '
                  + ((parseInt(i) + 1) * (self.config.legendItemHeight
                      + self.config.legendItemMargin) + 10)
                  + ')';
            });

        g.append('rect')
            .attr('width', self.config.legendItemWidth)
            .attr('height', self.config.legendItemHeight)
            .style('fill', function(d) {
              return self.config.color(i);
            });
        g.append('text')
            .attr('class', 'text-'
                + i)
            .attr('x', self.config.legendItemWidth
                + self.config.legendItemMargin)
            .attr('dy', self.config.legendItemHeight - 3)
            .style('font-size', self.config.legendItemHeight - 4)
            .style('fill', '#333')
            .style('font-size', '12px');
      }
    }else { // separate tips
      self.markers = [];

      var marker = overlay.append('g')
          .attr('class', 'marker x')
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
            .attr('class', 'marker line')
            .style('display', 'none');

        marker.append('circle')
            .attr('cx', -5)
            .attr('cy', 0)
            .attr('r', 3)
            .style('stroke', self.config.color(i));
        marker.append('rect')
            .style('stroke', self.config.color(i));
        marker.append('text')
            .style('fill', '#333')
            .style('font-size', '12px')
            .style('text-anchor', 'middle');

        self.markers.push(marker);
      }
    }

    var overlayRect = overlay.append('rect')
        .attr('width', self.chartWidth)
        .attr('height', self.chartHeight)
        .style('stroke', 'none')
        .style('fill', 'rgba(0, 0, 0, 0)');

    self.dxCache = 0;
    overlayRect.on('mouseenter', function() {
      self.showMarkers();
    });
    overlayRect.on('mousemove', function() {
      self.pointToX(self.rangeX.invert(d3.mouse(this)[0]));
    });
    overlayRect.on('mouseout', function() {
      self.hideMarkers();
    });
  };

  // point to x
  LineChart.prototype.pointToX = function(x) {
    var self = this;
    
    if(self.chartData[0].length < 2) {
      return;
    }

    var index = self.bisectX(self.chartData[0], x, 1);

    var d = (x - self.chartData[0][index - 1].x
          > self.chartData[0][index].x - x)
        ? self.chartData[0][index]
        : self.chartData[0][index - 1];

    // 变化检测，同样的 d.x 不重复移动
    if(d.x != self.dxCache) {
      self.dxCache = d.x;

      for(var i in self.chartData) {
        var data = self.chartData[i];

        if(data.length) {
          var index = self.bisectX(data, x, 1);

          var d = (x - data[index - 1].x
                > data[index].x - x)
              ? data[index]
              : data[index - 1];

          self.moveMarker(i, d);
        }
      }
    
      self.moveMarkerX(d);
    }
  };

  // markX @ (d.x, d.y)
  LineChart.prototype.moveMarkerX = function(d) {
    var self = this;

    var point = {
      x: self.rangeX(d.x),
      y: self.rangeY(d.y)
    };

    var formater = function(d) {
      return d;
    };
    if(self.config.xFormat == 'time') {
      formater = d3.time.format(self.config.timeFormat);
    }

    if(self.config.tipType == 'single') {
      var textElmt = self.markerSingle.select('.text-x'),
          rectElmt = self.markerSingle.select('.bg-rect');
      textElmt.text(formater(d.x));

      var rectWidth = 0,
          rectHeight = 0;

      var textElmtRect = textElmt[0][0].getBoundingClientRect();

      if(rectWidth < textElmtRect.width) {
        rectWidth = textElmtRect.width;
      }

      var length = self.chartData.length;
      rectHeight = (length + 1)
          * (self.config.legendItemHeight
            + self.config.legendItemMargin)
          + 20;
      for(var i = 0; i < length; i++) {
        textElmt = self.markerSingle.select('.text-'
            + i);

        textElmtRect = textElmt[0][0].getBoundingClientRect();

        var width = textElmtRect.width
            + self.config.legendItemWidth
            + self.config.legendItemMargin;
        if(rectWidth < width) {
          rectWidth = width;
        }
      }
      rectWidth += 20;

      rectElmt.attr('width', rectWidth)
          .attr('height', rectHeight);

      var translateX = point.x + 5;
      // right border
      if(translateX + rectWidth > self.chartWidth) {
        translateX = point.x - rectWidth - 5;
      }

      self.markerLine.attr('x1', point.x)
          .attr('x2', point.x);

      self.markerSingle.attr('transform', 'translate('
          + translateX
          + ', 0)');
    }else {
      var textElmt = self.markerX.select('text'),
          rectElmt = self.markerX.select('rect');
      
      textElmt.text(formater(d.x));

      var textElmtRect = textElmt[0][0].getBoundingClientRect();

      var textElmtWidth = textElmtRect.width,
          textElmtHeight = textElmtRect.height;

      var rectWidth = textElmtWidth + 20,
          rectHeight = textElmtHeight + 10;

      if(rectWidth < 40) {
        rectWidth = 40;
      }

      textElmt.attr('dy', (textElmtHeight + rectHeight) / 2 - 3);

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
    }
  };

  // mark point i @ (d.x, d.y)
  LineChart.prototype.moveMarker = function(i, d) {
    var self = this;

    var point = {
      x: self.rangeX(d.x),
      y: self.rangeY(d.y)
    };

    if(self.config.stack) {
      point.y = self.rangeY(d.sum);
    }

    if(self.config.tipType == 'single') {
      var textElmt = self.markerSingle.select('.text-'
          + i);
      
      if(self.config.stack) {
        textElmt.text(d.sum);
      }else {
        textElmt.text(d.y);
      }
    }else {
      var textElmt = self.markers[i].select('text'),
          rectElmt = self.markers[i].select('rect'),
          circleElmt = self.markers[i].select('circle');
      
      if(self.config.stack) {
        textElmt.text(d.sum);
      }else {
        textElmt.text(d.y);
      }

      var textElmtRect = textElmt[0][0].getBoundingClientRect();

      var textElmtWidth = textElmtRect.width,
          textElmtHeight = textElmtRect.height;

      var rectWidth = textElmtWidth + 20,
          rectHeight = textElmtHeight + 10;

      if(rectWidth < 40) {
        rectWidth = 40;
      }

      textElmt.attr('transform', 'translate('
          + (rectWidth / 2)
          + ', '
          + (textElmtHeight / 2 - 3)
          + ')');

      rectElmt.attr('width', rectWidth)
          .attr('height', rectHeight)
          .attr('transform', 'translate(0, -'
              + (rectHeight / 2)
              + ')');

      var circleX = -5,
          circleY = 0;

      var translateX = point.x + 5;
      // right border
      if(translateX + rectWidth > self.chartWidth) {
        circleX = rectWidth + 5;

        translateX = point.x - rectWidth - 5;
      }

      var translateY = point.y;
      // top border
      if(translateY - rectHeight / 2 < 0) {
        translateY = rectHeight / 2;
        circleY = point.y - translateY;
      }
      // bottom border
      if(translateY + rectHeight / 2 > self.chartHeight) {
        translateY = self.chartHeight - rectHeight / 2;
        circleY = point.y - translateY;
      }

      circleElmt.attr('cx', circleX)
          .attr('cy', circleY);

      self.markers[i].style('display', 'block')
          .attr('transform', 'translate('
              + translateX
              + ', '
              + translateY
              + ')');
    }
  };

  // show all markers
  LineChart.prototype.showMarkers = function() {
    var self = this;

    if(self.config.tipType == 'single') {
      self.markerLine.style('display', 'block');
      self.markerSingle.style('display', 'block');
    }else {
      self.markerX.style('display', 'block');
      for(var i in self.markers) {
        var marker = self.markers[i];

        marker.style('display', 'block');
      }
    }
  };

  // hide all markers
  LineChart.prototype.hideMarkers = function() {
    var self = this;

    if(self.config.tipType == 'single') {
      self.markerLine.style('display', 'none');
      self.markerSingle.style('display', 'none');
    }else {
      self.markerX.style('display', 'none');
      for(var i in self.markers) {
        var marker = self.markers[i];

        marker.style('display', 'none');
      }
    }
  };
  
  return LineChart;
})(Chart);

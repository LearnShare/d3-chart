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
    self.config.anglePadding = config.anglePadding
        || 0;
    self.config.cornerRadius = config.cornerRadius
        || 0;
    self.config.sortData = (config.sortData
          && (typeof config.sortData == 'function'))
        ? config.sortData
        : undefined;

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

    self.pen.translate(self.config.padding,
        self.chartTranslateY);
    self.pen.fillStyle = 'rgba(0, 0, 0, 0.1)';
    self.pen.strokeStyle = '#AAF';

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

    self.drawPieOnSvg();
    // self.drawPieOnCanvas();
  };

  // draw on svg
  PieChart.prototype.drawPieOnSvg = function() {
    var self = this;

    self.arc = d3.svg.arc()
        .innerRadius(self.chartR0)
        .outerRadius(self.chartR1)
        .cornerRadius(self.config.cornerRadius);

    self.pie = d3.layout.pie()
      .padAngle(self.config.anglePadding)
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

    if(self.config.mouseEvent) {
      self.addMouseEvents();
    }
  };
  // draw on canvas
  PieChart.prototype.drawPieOnCanvas = function() {
    var self = this;

    var c = {
      x: self.chartWidth / 2,
      y: self.chartHeight / 2
    };
    var sum = 0;

    // get data from arc/pie, or get data from chartData
    for(var i in self.chartData) {
      var d = self.chartData[i];
      
      self.pen.fillStyle = self.config.color(i);

      self.pen.beginPath();
      self.pen.moveTo(c.x, c.y);
      self.pen.arc(c.x,
          c.y,
          self.chartR1,
          (sum / 100 * 2 - 1 / 2)
              * Math.PI,
          ((sum + d.percentage) / 100 * 2 - 1 / 2
              - self.config.anglePadding / 2)
              * Math.PI);
      self.pen.lineTo(c.x, c.y);
      self.pen.fill();

      sum += d.percentage;
    }

    self.pen.fillStyle = '#FFF';

    self.pen.beginPath();
    self.pen.arc(c.x,
        c.y,
        self.chartR0,
        0,
        2 * Math.PI);
    self.pen.fill();
  };
  // add mouse events
  PieChart.prototype.addMouseEvents = function() {
    var self = this;

    // arcs
    var arcs = self.svg.selectAll('.arc > path')[0];

    for(var i = 0; i < arcs.length; i++) {
      var arc = arcs[i];

      (function(arc, index) {
        arc.addEventListener('mouseenter', function(e) {
          e.preventDefault();
          e.stopPropagation();

          self.highlightElements(index, true);
        });
      })(arc, i);

      (function(arc, index) {
        arc.addEventListener('mouseout', function(e) {
          e.preventDefault();
          e.stopPropagation();

          self.highlightElements(index, false);
        });
      })(arc, i);
    }

    // legends
    var legends = self.svg.selectAll('.legend > .item')[0];

    for(var i = 0; i < legends.length; i++) {
      var legend = legends[i];

      (function(legend, index) {
        legend.addEventListener('mouseenter', function(e) {
          e.preventDefault();
          e.stopPropagation();

          self.highlightElements(index, true);
        });
      })(legend, i);

      (function(legend, index) {
        legend.addEventListener('mouseout', function(e) {
          e.preventDefault();
          e.stopPropagation();

          self.highlightElements(index, false);
        });
      })(legend, i);
    }
  };
  // highlight elements
  PieChart.prototype.highlightElements = function(index, enter) {
    var self = this;

    var arcs = self.svg.selectAll('.arc > path')[0];
    var legends = self.svg.selectAll('.legend > .item')[0];

    for(var i = 0; i < arcs.length; i++) {
      var arc = d3.select(arcs[i]);
      var legend = d3.select(legends[i]);

      arc.attr('class', '');
      legend.attr('class', 'item');

      if(enter
          && i == index) {
        arc.attr('class', 'active');
        legend.attr('class', 'item active');
      }
    }
  };
  
  return PieChart;
})(Chart);

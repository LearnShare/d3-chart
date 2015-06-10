var Chart = (function() {
  function Chart(config) {
    var self = this;

    // check config
    if(!config
        || !config.target) {
      return;
    }

    self.config = {
      target: config.target,

      color: d3.scale.ordinal()
          .range([
            "#AC92EC",
            "#ED5565",
            "#656D78",
            "#8CC152",
            "#FC6E51",
            "#EC87C0",
            "#37BC9B",
            "#SD9CEC"
          ]),

      width: config.width
          || config.target.clientWidth,
      height: config.height
          || config.target.clientHeight,
      padding: config.padding
          || 10,
      autoResize: config.autoResize
          || false,

      title: config.title
          || '',
      titleSize: 20,
      subTitle: config.subTitle
          || '',
      subTitleSize: 12,
      titleAlign: config.titleAlign
          || 'center',

      legend: config.legend
          || false,
      legendData: config.legendData
          || [],
      legendAlign: config.legendAlign
          || 'right',
      legendItemWidth: 18,
      legendItemHeight: 16,
      legendItemMargin: 4,
      legendText: (config.legendText
          && typeof config.legendText == 'function')
          ? config.legendText
          : undefined
    };

    // title dy
    self.titleDy = self.config.padding
        + self.config.titleSize;

    // y of title bottom
    self.titleYMax = self.config.padding;
    if(self.config.title.length) {
      self.titleYMax = self.titleDy
        + 10;
      if(self.config.subTitle.length) {
        self.titleYMax += 10
            + self.config.subTitleSize;
      }
    }

    if(self.config.autoResize) {
      window.addEventListener('resize', function() {
        // size really changed
        if(self.config.clientWidth != self.config.target.clientWidth
            || self.config.clientHeight != self.config.target.clientHeight) {
          self.resize();
        }
      });
    }

    self.chartData = null;

    self.draw();
  }

  // set chartData
  Chart.prototype.setData = function(data) {
    var self = this;

    self.draw();
  };
  
  // append more data
  Chart.prototype.appendData = function(data) {
    var self = this;

    self.draw();
  };

  // draw svg bg
  Chart.prototype.draw = function() {
    var self = this;

    // clean svg in target
    self.config.target.innerHTML = '';

    // svg
    self.svg = d3.select(self.config.target)
        .append('svg')
            .attr('width', self.config.width)
            .attr('height', self.config.height);

    self.drawChart();
    self.drawTitle();
    self.drawLegend();
  };
  Chart.prototype.drawChart = function() {
    var self = this;
  };
  Chart.prototype.drawTitle = function() {
    var self = this;
    
    // title is empty
    if(!self.config.title.length) {
      return;
    }

    // title start x
    var titleX = 0;
    // title align left
    var titleAlign = 'middle';
    // center
    titleX = self.config.width / 2;
    // left
    if(self.config.titleAlign == 'left') {
      titleX = self.config.padding;
      titleAlign = 'start';
    }
    // right
    if(self.config.titleAlign == 'right') {
      titleX = self.config.width
          - self.config.padding;
      titleAlign = 'end';
    }

    var titleGroup = self.svg.append('g')
        .attr('class', 'title');

    // draw title
    titleGroup.append('text')
        .attr('x', titleX)
        .attr('dy', self.titleDy)
        .style('text-anchor', titleAlign)
        .style('font-size', self.config.titleSize)
        .text(self.config.title);

    // draw subTitle
    if(self.config.subTitle.length) {
      titleGroup.append('text')
          .attr('x', titleX)
          .attr('dy', self.titleDy
              + 10
              + self.config.subTitleSize)
          .style('text-anchor', titleAlign)
          .style('font-size', self.config.subTitleSize)
          .text(self.config.subTitle);
    }
  };
  Chart.prototype.drawLegend = function() {
    var self = this;
    
    // legend
    if(self.config.legend) {

      // legend x
      var legendX = self.config.width
          - self.config.padding
          - self.config.legendItemWidth;
      var textX = legendX
          - self.config.legendItemMargin;
      var textAlign = 'end';
      // align left
      if(self.config.legendAlign == 'left') {
        legendX = self.config.padding;
        textX = legendX
            + self.config.legendItemWidth
            + self.config.legendItemMargin;
        textAlign = 'start';
      }

      var legend = self.svg.append('g')
          .attr('class', 'legend');

      var item = legend.selectAll('.item')
          .data(self.config.legendData)
          .enter().append('g')
            .attr('class', 'item')
            .attr('transform', function(d, i) {
              return 'translate(0, '
                  + (i * (self.config.legendItemHeight
                      + self.config.legendItemMargin)
                      + self.titleYMax)
                  + ')';
            });

      item.append('rect')
          .attr('x', legendX)
          .attr('width', self.config.legendItemWidth)
          .attr('height', self.config.legendItemHeight)
          .style('fill', function(d, i) {
            return self.config.color(i);
          });

      item.append('text')
          .attr('x', textX)
          .attr('dy', self.config.legendItemHeight - 3)
          .style('font-size', self.config.legendItemHeight - 2)
          .style('text-anchor', textAlign)
          .text(function(d, i) {
            if(self.config.legendText) {
              return self.config.legendText(d, i);
            }else {
              return d;
            }
          });
    }
  };
  
  Chart.prototype.resize = function() {
    var self = this;

    self.config.width = self.config.target.clientWidth;
    self.config.height = self.config.target.clientHeight;

    self.draw();
  };
  
  return Chart;
})();

var __extends = this.__extends ||
  function (d, b) {
    for (var p in b) {
      if (b.hasOwnProperty(p)) {
        d[p] = b[p];
      }
    }
    function __() {
      this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
  };

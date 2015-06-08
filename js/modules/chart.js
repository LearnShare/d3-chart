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
            "#1790cf",
            "#1bb2d8",
            "#99d2dd",
            "#88b0bb",
            "#1c7099",
            "#038cc4",
            "#75abd0",
            "#afd6dd"
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

    self.chartData = data;
    self.drawChart();
  };
  
  // append more data
  Chart.prototype.appendData = function(data) {
    var self = this;

    // self.chartData = data;
    self.drawChart();
  };

  // draw svg bg
  Chart.prototype.draw = function(data) {
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
  Chart.prototype.drawChart = function(data) {
    var self = this;
  };
  Chart.prototype.drawTitle = function(data) {
    var self = this;
    
    // title is empty
    if(!self.config.title.length) {
      return;
    }

    // title start x
    var titleX = 0;
    // title dy
    self.titleDy = self.config.padding
        + self.config.titleSize;
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
  Chart.prototype.drawLegend = function(data) {
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

      // legend dy
      var legendDy = self.config.padding;
      if(self.config.title.length) {
        legendDy = self.titleDy
          + 10;
        if(self.config.subTitle.length) {
          legendDy += 10
              + self.config.subTitleSize;
        }
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
                      + legendDy)
                  + ')';
            });

      item.append('rect')
          .attr('x', legendX)
          .attr('width', self.config.legendItemWidth)
          .attr('height', self.config.legendItemHeight)
          .style('fill', self.config.color);

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
  
  Chart.prototype.resize = function(data) {
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

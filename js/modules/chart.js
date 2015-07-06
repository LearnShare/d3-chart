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
            '#5D9CEC',
            '#656D78',
            '#A0D468',
            '#CCD1D9',
            '#4FC1E9',
            '#48CFAD',
            '#AC92EC',
            '#E6E9ED'
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
      titleSize: config.titleSize
          || 20,
      subTitle: config.subTitle
          || '',
      subTitleSize: config.titleSize
          || 12,
      titleAlign: config.titleAlign
          || 'center',

      legend: config.legend
          || false,
      legendData: config.legendData
          || [],
      legendDirection: config.legendDirection
          || 'horizontal',
      legendAlign: config.legendAlign
          || 'center',
      legendVerticalAlign: config.legendVerticalAlign
          || 'bottom',
      legendItemWidth: 18,
      legendItemHeight: 16,
      legendItemMargin: 4,
      legendText: (config.legendText
          && typeof config.legendText == 'function')
          ? config.legendText
          : undefined,

      mouseEvent: config.mouseEvent
          || false
    };

    // title dy
    self.titleDy = self.config.padding
        + self.config.titleSize;

    // y of title bottom
    self.titleYMax = 0;
    if(self.config.title.length) {
      self.titleYMax = self.titleDy
        + self.config.padding; // as marginBottom of title
      if(self.config.subTitle.length) {
        self.titleYMax += self.config.subTitleSize;
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

    self.drawTitle();
    self.drawLegend();
    self.drawChart();
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
        .style('font-size', self.config.titleSize + 'px')
        .text(self.config.title);

    // draw subTitle
    if(self.config.subTitle.length) {
      titleGroup.append('text')
          .attr('x', titleX)
          .attr('dy', self.titleDy
              + 10
              + self.config.subTitleSize)
          .style('text-anchor', titleAlign)
          .style('font-size', self.config.subTitleSize + 'px')
          .text(self.config.subTitle);
    }
  };
  Chart.prototype.drawLegend = function() {
    var self = this;
    
    // legend
    if(self.config.legend
        && self.config.legendData.length) {
      var legendTranslateX = 0,
          legendTranslateY = 0;

      var legend = self.svg.append('g')
          .attr('class', 'legend');

      var length = self.config.legendData.length;
      // all legend.item width/height sum
      var widthSum = 0,
          heightSum = 0,
          widthMax = 0,
          heightMax = 0;
      for(var i = 0; i < length; i++) {
        var item = legend.append('g')
            .attr('class', 'item')
            .attr('transform', function() {
              return 'translate('
                  + widthSum
                  + ', '
                  + heightSum
                  + ')';
            });

        var rect = item.append('rect')
            .attr('width', self.config.legendItemWidth)
            .attr('height', self.config.legendItemHeight)
            .style('fill', function() {
              return self.config.color(i);
            });

        var textX = self.config.legendItemWidth
            + self.config.legendItemMargin;
        var textAlign = 'start';

        var text = item.append('text')
            .attr('dx', textX)
            .attr('dy', self.config.legendItemHeight - 3)
            .style('font-size', self.config.legendItemHeight - 4)
            .style('text-anchor', textAlign)
            .text(function() {
              var d = self.config.legendData[i];

              if(self.config.legendText) {
                return self.config.legendText(d, i);
              }else {
                return d;
              }
            });

        var textElmtRect = text[0][0].getBoundingClientRect();

        var itemWidth = self.config.legendItemWidth
            + self.config.legendItemMargin
            + textElmtRect.width;

        if(self.config.legendDirection == 'horizontal') {
          widthSum += itemWidth
              + self.config.legendItemMargin
                  * 2;
          heightSum += 0;
          widthMax = widthSum;
          heightMax = self.config.legendItemHeight;
        }else {
          widthSum += 0;
          heightSum += self.config.legendItemHeight
              + self.config.legendItemMargin;
          if(widthMax < itemWidth) {
            widthMax = itemWidth;
          }
          heightMax = heightSum;
        }
      }

      if(self.config.legendAlign == 'left') {
        legendTranslateX = self.config.padding;
      }else if(self.config.legendAlign == 'center') {
        legendTranslateX = (self.config.width
            - widthMax) / 2
            - self.config.padding;
      }else { // right as default
        legendTranslateX = self.config.width
            - widthMax
            - self.config.padding;
      }

      if(self.config.legendVerticalAlign == 'bottom') {
        legendTranslateY = self.config.height
            - self.config.padding
            - heightMax;
      }else {
        legendTranslateY = self.titleYMax
            + self.config.padding;
      }

      legend.attr('transform', 'translate('
          + legendTranslateX
          + ', '
          + legendTranslateY
          + ')')
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

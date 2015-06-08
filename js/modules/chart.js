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
      legendAlign: config.legendAlign
          || 'right',
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
    //
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
    var titleDy = self.config.padding
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
        .attr('dy', titleDy)
        .style('text-anchor', titleAlign)
        .style('font-size', self.config.titleSize)
        .text(self.config.title);

    // draw subTitle
    if(self.config.subTitle.length) {
      titleGroup.append('text')
          .attr('x', titleX)
          .attr('dy', titleDy
              + 10
              + self.config.subTitleSize)
          .style('text-anchor', titleAlign)
          .style('font-size', self.config.subTitleSize)
          .text(self.config.subTitle);
    }
  };
  Chart.prototype.drawLegend = function(data) {
    var self = this;
    //
  };
  
  Chart.prototype.resize = function(data) {
    var self = this;

    self.config.width = self.config.target.clientWidth;
    self.config.height = self.config.target.clientHeight;

    self.draw();
  };
  
  return Chart;
})();

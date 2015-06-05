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
          || 0,
      autoResize: config.autoResize
          || false,

      title: config.title
          || '',
      subTitle: config.subTitle
          || '',
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
    var svg = d3.select(self.config.target)
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
    //
  };
  Chart.prototype.drawLegend = function(data) {
    var self = this;
    //
  };
  
  Chart.prototype.resize = function(data) {
    var self = this;

    self.draw();
  };
  
  return Chart;
})();

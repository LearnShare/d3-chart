var Range = (function() {
  function Range(min, max, start, end) {
    var self = this;

    self.min = min
        || 0;
    self.max = max
        || 1;

    self.start = start
      || self.min;
    self.end = end
      || self.max;
  }

  Range.prototype.data = function(min, max) {
    self.min = min;
    self.max = max;

    if(self.start < self.min) {
      self.start = self.min;
    }
    if(self.end > self.max) {
      self.end = self.max;
    }
  };

  Range.prototype.range = function(start, end) {
    if(!start && !end) {
      return {
        start: self.start,
        end: self.end
      };
    }else {
      self.start = start;
      self.end = end;

      if(self.min > self.start) {
        self.min = self.start;
      }
      if(self.max < self.end) {
        self.max = self.end;
      }
    }
  };
  
  return Range;
})();

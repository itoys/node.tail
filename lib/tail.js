var
   fs = require('fs'),
   inherits = require('util').inherits,
   EventEmitter = require('events').EventEmitter;

/**
 * @constructor
 */
function Tail(filePath, options) {
   var
      self = this,
      watcher;

   options = options || {};
   options.buffer = options.buffer || 63 * 1024 - 1;
   options.sep = '\n';
   options.lines = options.lines || 10;
   options.follow = options.follow || false;
   options.sleep = options.sleep || 500;

   function readFile(start, end, lines) {
      lines = lines || -1;
      var stream = fs.createReadStream(filePath, {start: start, end: end});
      stream.on('error', function (err) {
         if(options.follow) {
            watcher.removeAllListeners('change');
         }
         self.emit('error', err);
      });
      stream.on('data', function (data) {
         var str = data.toString();
         var result = str.split(options.sep);


         if(lines > 0){
            result = result.splice(-lines);
         }
         for(var i = 0; i < result.length; i++){
            self.emit('line', result[i]);
         }
         result.length = 0;
      });
   }

   function watchListener(curr, prev) {
      var start, end;

      var sizeCurr = curr.size;
      var sizePrev = prev.size;
      var sizeDiff = sizeCurr - sizePrev;

      var mtimeCurr = curr.mtime.valueOf();
      var mtimePrev = prev.mtime.valueOf();

      if (sizeDiff < 0 || mtimeCurr !== mtimePrev) {
         start = 0;
         end = sizeCurr;
      } else if (sizeDiff === 0) {
         return;
      } else {
         start = sizePrev;
         end = sizeCurr;
      }
      readFile(start, end);
   }

   fs.stat(filePath, function(err, stat) {
      if(err){
         self.emit('error', err);
         return;
      }
      var end = stat.size - 1;
      var start = end - options.buffer;
      readFile(start, end, options.lines);
      if(options.follow){
         watcher = fs.watchFile(filePath, {persistent: true, interval: options.sleep}, watchListener);
      }
   });
}

inherits(Tail, EventEmitter);


module.exports = Tail;
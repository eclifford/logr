/*!
 * Logr
 * http://github.com/eclifford/logr
 *
 * Author: Eric Clifford
 * Email: ericgclifford@gmail.com
 * Date: 10.01.2014
 *
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return (root.Logr = factory(root));
    });
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(root);
  } else {
    root.Logr = factory(root);
  }
}(this, function(root) {
  'use strict';

  var Logr = {
    version: '0.1.1',

    logs: {},

    defaults: {
      level: 1,
      time: true 
    },

    levels: {
      DEBUG: 1,
      INFO: 2,
      WARN: 3,
      ERROR: 4,
      NONE: 9
    },

    // set the level for all stored logs
    //
    // @param [Number] level - the level to set all the logs to
    //
    setLevel: function(level) {
      if(!level || isNaN(level)) {
        throw Error("Logr.setLevel: provide a valid number for the level to set");
      }
      for(var log in Logr.logs) {
        Logr.logs[log].setLevel(level);
      }
    },

    // get or create a log
    //
    // @param [String] logname - the name of the log to get or create
    //
    log: function(logname, options) {
      if(!logname) {
        throw Error("Logr.log: provide the name of the log to create or get");
      }
      // create a new log
      if(!Logr.logs[logname]) {
        Logr.logs[logname] = new Log(logname, options || {});
      }
      // return an existing log
      return Logr.logs[logname];
    }
  };

  // constructor for log object
  //
  // @param [String] logname - the name of the log to create
  //
  var Log = function(logname, options) {
    if(!logname) {
      throw new Error("Logr.log: logname is required");
    }
    this.logname = logname;
    extend(this, Logr.defaults, options || {});
  };

  // wrap console.debug
  Log.prototype.debug = function(msg) {
    if(root.console && root.console.debug && this.getLevel() <= Logr.levels.DEBUG) {
      root.console.debug("[" + this.logname + "] " + msg, [].slice.call(arguments).splice(1,1));
    }
  };

  // wrap console.info
  Log.prototype.info = function(msg) {
    if(root.console && root.console.info && this.getLevel() <= Logr.levels.INFO) {
      root.console.info("[" + this.logname + "] " + msg, [].slice.call(arguments).splice(1,1));
    }
  };

  // wrap console.warn
  Log.prototype.warn = function(msg) {
    if(root.console && root.console.warn && this.getLevel() <= Logr.levels.WARN) {
      console.warn("[" + this.logname + "] " + msg, [].slice.call(arguments).splice(1,1));
    }
  };

  // warp console.error
  Log.prototype.error = function(msg) {
    if(root.console && root.console.error && this.getLevel() <= Logr.levels.ERROR) {
      console.error("[" + this.logname + "] " + msg, [].slice.call(arguments).splice(1,1));
    }
  };

  // set the session level for the log instance
  //
  // @param [Number] level - the level to set the log to
  //
  Log.prototype.setLevel = function(level) {
    if(root.sessionStorage) {
      root.sessionStorage.setItem("logr:" + this.logname + ":level", level);
    }
  };

  // get the session level or initial level for the log instance
  //
  Log.prototype.getLevel = function() {
    if(root.sessionStorage) {
      return root.sessionStorage.getItem("logr:" + this.logname + ":level") || this.level;
    }
    return this.level;
  };

  // wrap the supplied object in grouped console statements
  //
  // @param [Object] obj - the object to attach logging to
  //
  Log.prototype.attach = function(obj) {
    var self = this,
        prop, fn, value;

    // without grouping methods no reason to continue
    if(!root.console || !root.console.group)
      return;

    for(prop in obj) {
      if(obj !== null && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
        this.attach(obj[prop]);
      }
      else if(typeof obj[prop] === 'function') {
        /*jshint -W083 */
        fn = obj[prop];
        var groupLevels = 0;
        obj[prop] = (function(prop, fn) {
          return function() {
            if(self.getLevel() <= Logr.levels.DEBUG) {
              root.console.groupCollapsed("[" + self.logname + "] " + prop + "()", [].slice.call(arguments));
              groupLevels++;
              if (self.time) root.console.time("time");

              // attempt to call original method bubbling up any errors
              try {
                value = fn.apply(this, arguments);
              }
              // any error we find we break out of our console.group and
              // provide full stack trace
              catch(e) {
                while(groupLevels--) root.console.groupEnd();
                root.console.error(e.stack);
                return;
              }

              if (value) root.console.debug("return: ", value);
              if (self.time) root.console.timeEnd("time");

              root.console.groupEnd();
              groupLevels--;
              return value;
            } else {
              return fn.apply(this, arguments);
            }
          };
        })(prop, fn);
      }
    }
  };

  // Simple extend
  //
  // @param [Object] target - the target object to extend
  // @param [Array] source - an array of object to extend the target with
  //
  function extend(obj) {
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
      }
    }
    return obj;
  }

  return Logr;
}));

/*!
 * Logr
 * http://github.com/eclifford/logr
 *
 * Author: Eric Clifford
 * Email: ericgclifford@gmail.com
 * Date: 09.17.2014
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
    version: '0.0.1',

    logs: {},

    defaults: {
      level: 1
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
    log: function(logname) {
      if(!logname) {
        throw Error("Logr.log: provide the name of the log to create or get");
      }
      if(Logr.logs[logname]) {
        return Logr.logs[logname];
      } else {
        var l = new Log(logname);
        Logr.logs[logname] = l;
        return l;
      }
    }
  };

  // constructor for log object
  //
  // @param [String] logname - the name of the log to create
  //
  var Log = function(logname) {
    this.logname = logname;
  };

  Log.prototype.debug = function(msg) {
    if(this.getLevel() <= Logr.levels.DEBUG) {
      console.debug("[" + this.logname + "] " + msg, [].slice.call(arguments).splice(1,1));
    }
  };

  Log.prototype.info = function(msg) {
    if(this.getLevel() <= Logr.levels.INFO) {
      console.info("[" + this.logname + "] " + msg, [].slice.call(arguments).splice(1,1));
    }
  };

  Log.prototype.warn = function(msg) {
    if(this.getLevel() <= Logr.levels.WARN) {
      console.warn("[" + this.logname + "] " + msg, [].slice.call(arguments).splice(1,1));
    }
  };

  Log.prototype.error = function(msg) {
    if(this.getLevel() <= Logr.levels.ERROR) {
      console.error("[" + this.logname + "] " + msg, [].slice.call(arguments).splice(1,1));
    }
  };

  // sets the level for the log
  //
  // @param [Number] level - the level to set the log to
  //
  Log.prototype.setLevel = function(level) {
    if(sessionStorage) {
      sessionStorage.setItem("logr:" + this.logname + ":level", level);
    }
    this.level = level;
  };

  Log.prototype.getLevel = function() {
    if(sessionStorage) {
      return sessionStorage.getItem("logr:" + this.logname + ":level") || this.level;
    }
    return this.level;
  };

  Log.prototype.attach = function(obj) {
    var prop, fn;
    var self = this;
    for (prop in obj) {
      if (obj[prop] !== null && typeof obj[prop] === 'object') {
        this.attach(obj[prop]);
      }
      if (typeof obj[prop] === 'function') {
        /*jshint -W083 */
        fn = obj[prop];
        obj[prop] = (function(prop, fn) {
          return function() {
            if(self.getLevel() <= Logr.levels.DEBUG) {
              console.group("[" + self.logname + "] " + prop + "()", [].slice.call(arguments));
              console.time("time");
              var value = fn.apply(this, arguments);
              console.timeEnd("time");
              console.groupEnd();
              return value;
            } else {
              return fn.apply(this, arguments);
            }
          };
        })(prop, fn);
      }
    }
  };

  return Logr;
}));

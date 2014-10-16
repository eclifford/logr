/*!
 * Logr
 * http://github.com/eclifford/logr
 *
 * Author: Eric Clifford
 * Email: ericgclifford@gmail.com
 * Date: 10.13.2014
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
  // 'use strict';

  var Logr = {
    version: '0.1.2',

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
    /**
     * Set internal logging level for all logs
     *
     * @example
     *     Logr.setLevel(Logr.levels.DEBUG)
     *
     * @param {Number} level the level to set the log to
     * @api public
     */
    setLevel: function(level) {
      if (isNaN(level)) {
        throw new Error("Logr.setLevel(): expects parameter level of type Number");
      }
      for (var log in Logr.logs) {
        Logr.logs[log].setLevel(level);
      }
    },
    /**
     * Get or create a contextual log instance
     *
     * @example
     *     Logr.log('foo')
     *
     * @param {String} logname the name of the contextual log
     * @param {Object} options the instance options
     * @api public
     */
    log: function(logname, options) {
      if (typeof logname !== "string") {
        throw new Error("Logr.log(): expects parameter logname of type String");
      }
      // create a new log
      if (!Logr.logs[logname]) {
        Logr.logs[logname] = new Log(logname, options || {});
      }
      // return an existing log
      return Logr.logs[logname];
    }
  };
  /**
   * Log object constructor
   *
   * @example
   *    var log = new Log('foo')
   *
   * @param {String} logname the name of the log instance
   * @param {Object} options the instance options
   */
  var Log = function(logname, options) {
    if (typeof logname !== 'string') {
      throw new Error("Logr.Log: expects parameter logname of type String");
    }
    this.logname = logname;
    extend(this, Logr.defaults, options || {});
  };
  /**
   * Browser safe `console.debug`
   *
   * @example
   *    var log = Logr.log('foo');
   *    log.debug('debug info');
   *
   * @param {String} msg the message to pass to console
   */
  Log.prototype.debug = function(msg) {
    if (root.console && root.console.debug && this.getLevel() <= Logr.levels.DEBUG) {
      root.console.debug("[" + this.logname + "] " + msg, [].slice.call(arguments).splice(1,1));
    }
  };
  /**
   * Browser safe `console.info`
   *
   * @example
   *    var log = Logr.log('foo');
   *    log.info('info');
   *
   * @param {String} msg the message to pass to console
   */
  Log.prototype.info = function(msg) {
    if (root.console && root.console.info && this.getLevel() <= Logr.levels.INFO) {
      root.console.info("[" + this.logname + "] " + msg, [].slice.call(arguments).splice(1,1));
    }
  };
  /**
   * Browser safe `console.warn`
   *
   * @example
   *    var log = Logr.log('foo');
   *    log.warn('warn');
   *
   * @param {String} msg the message to pass to console
   */
  Log.prototype.warn = function(msg) {
    if (root.console && root.console.warn && this.getLevel() <= Logr.levels.WARN) {
      console.warn("[" + this.logname + "] " + msg, [].slice.call(arguments).splice(1,1));
    }
  };
  /**
   * Browser safe `console.error`
   *
   * @example
   *    var log = Logr.log('foo');
   *    log.error('error');
   *
   * @param {String} msg the message to pass to console
   */
  Log.prototype.error = function(msg) {
    if (root.console && root.console.error && this.getLevel() <= Logr.levels.ERROR) {
      console.error("[" + this.logname + "] " + msg, [].slice.call(arguments).splice(1,1));
    }
  };
  /**
   * Set the logging level for this instance
   *
   * @example
   *    var log = Logr.log('foo');
   *    log.setLevel(Logr.levels.DEBUG);
   *
   * @param {Number} level the level to set the instance to
   */
  Log.prototype.setLevel = function(level) {
    if (root.sessionStorage) {
      root.sessionStorage.setItem("logr:" + this.logname + ":level", level);
    }
  };
  /**
   * Get the logging level for this instance
   *
   * @example
   *    var log = Logr.log('foo');
   *    log.getLevel();
   *
   * @return {Number} the level to set the instance to
   */
  Log.prototype.getLevel = function() {
    if (root.sessionStorage) {
      return root.sessionStorage.getItem("logr:" + this.logname + ":level") || this.level;
    }
    return this.level;
  };
  /**
   * Attach logging instance to object
   *
   * @example
   *    var log = Logr.log('foo');
   *    log.attach({})
   *
   * @param {Object} obj the object to attach
   */
  Log.prototype.attach = function(obj) {
    var self = this,
        prop, fn, value;

    // without grouping methods no reason to continue
    if (!root.console || !root.console.group) return;

    // enumerate all properties on object proxing all functions except the constructor
    for (prop in obj) {
      if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'function' && prop !== 'constructor') {
        self.wrap(obj, prop);
      }
    }
  };
  /**
   * Wrap original function with custom logging logic
   *
   * @example
   *    var log = Logr.log('foo');
   *    log.attach({})
   *
   * @param {Object} obj the object to attach
   */
  Log.prototype.wrap = function(obj, prop) {
    var self = this,
        func;

    func = obj[prop];

    obj[prop] = function logr() {
      if (self.getLevel() <= Logr.levels.DEBUG) {
        // attempt to call original method bubbling up any errors
        try {
          root.console.groupCollapsed("[" + self.logname + "] " + obj.constructor.name + "." + prop + "()", [].slice.call(arguments));
          value = func.apply(this, arguments);
        }
        // any error we find we break out of our console.group and
        // provide full stack trace
        catch(e) {
          var count = 15;
          while(count--) root.console.groupEnd();
          root.console.error(e.stack);
          return;
        }

        if (value) root.console.info("return: ", value);

        root.console.groupEnd();
        return value;
      } else {
        return func.apply(this, arguments);
      }
    };
  };
  /**
   * Extend obj with n-number of source objects
   *
   * @example
   *    var log = Logr.extend({}, {});
   *
   * @param {Object} obj the object extend
   */
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

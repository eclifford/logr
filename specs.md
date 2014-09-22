# Features

- Automatic logging of objects methods (INFO LEVEL)
  - optionally collapseable in webkit
  - optional time calculation
- Log levels (Error, Info, Debug)
- Manual log entries
  - log.info("shit be happening yo", obj);
- Automatic log prefix
- store settings in local storage
  -


var Foo = {
  Foo: function () {
    log.obj(this);

    var logger = Logger.get("testLogger");
    var logger = new Logger("testLogger", {
      level: Logger.NONE
    });

    Logger.setLevel(Logger.DEBUG);




    logger.obj(this);

  },
  walk: function() {
    log.error("shit be broke yo!", obj);
    log.info("shit be not really important yo", obj);
    log.debug("shit be yo yo ", obj);
  },
  run: function() {

  }
}

var logr = new Logr("context", {});

var foo = new Foo();
log.obj(foo); // obj messages on the debug  
log.setLevel(Logger.INFO);
log.debug
log.info
log.warn
log.error








# API

## config
- autoPrefix

## log

params
- object
- logging function to overwrite

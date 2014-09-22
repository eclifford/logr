# Logr [![Build Status](https://travis-ci.org/eclifford/logr.svg?branch=master)](https://travis-ci.org/eclifford/logr) [![Coverage Status](https://img.shields.io/coveralls/eclifford/logr.svg)](https://coveralls.io/r/eclifford/logr?branch=master)

> Logr.js is a JavaScript console logging replacement with support for dynamic object logging injection.

## Why Logr?

Logr is a simple contextual JavaScript logging utility for making sense of all the console logging statements
in you application. Logr supports some innovative features for reducing the amount of boilerplate logging
that you need to write and lets you access it only when you need it.

### Features

- Automatically attach console.debug statements to all the methods of any object with `log.attach`
- Contextually organize your logging statements with **Logr** logs
- Programaticaly set logging levels globally or per log
- Logging levels are stored per session allowing you to turn logging on and off in QA and Staging environments and have them stored for the
entire browsing session
- AMD and CommonJS compatible

## Quick Start

### Installation with Bower

```bash
bower install logr-js
```

### Standard integration

**Logr** can be added in either the head or before the closing body tag.

```html
<body>
  <script src='bower_components/logr/logr.js'></script>
</body>
```

### AMD integration

**Logr** may also be used via AMD

```js
  define(['logr'], function(Logr){
  })
```

### Creating a log

**Logr** internally manages logging instances. Using the `Logr.log` method will
return an existing logging instance of the same name or create you one.

```js
  var log = Logr.log('foo'); // creates a logging instance of the name foo
```

### Simple logging

```js
  log.debug("nothing to see here just debugging", {foo: 'baz'});
```

```js
  log.info("nothing to see here just sending some information", {foo: 'baz'});
```

```js
  log.warn("nothing to see here just warning you", {foo: 'baz'});
```

```js
  log.error("nothing to see here just the sky is falling", {foo: 'baz'});
```

### Dynamic Object logs

The reason I created **Logr** was I wanted to avoid having to write the same boilerplate
object method logging over and over again. It's verbose, ugly and difficult to manage. What I
wanted was a way for all the methods on my object to have wrapping console statements
baked into them for a visual timeline of the my call stack.

#### Attaching to an object

```js
  var dog = {
    bark: function() {
      console.log('bark bark!');
    },
    run: function(name) {
      console.log(name + ' runs around');
    },
    eat: function(name, food) {
      console.log(name + ' eats' + food);
    },
    today: function() {
      this.bark();
      this.run("rocket");
      this.eat("rocket", "all the things");
    }  
  }
```

Take for example this simple dog API. If I wanted to listen for all the events on this object
complete with order of operation, nested grouping, parameters operated passed in.

```js
  var dogLog = Logr.log('dog');

  dogLog.attach(dog);
```

Then you simply execute your methods as you normally would.

```js
  dog.bark(); // bark() is executed wrapped in a console grouping statement
```

![simple-example](http://cl.ly/image/040o2U1b3U09)

Calling `today` which in turns calls all the other methods showcases our nested
callstack.

```js
  dog.today();
```

![detailed-example](http://cl.ly/image/0I2l2Q423g2V)

#### Dynamic logging levels

By default all **Logr** logging instances are created with a logging level of 1 or `DEBUG` meaning all
logging messages will reach your browsers console. Changing your logging levels is simple.

##### Setting logging level globally

Calling `Logr.setLevel` will apply the supplied level to each stored logging instance.

```js
  Logr.setLevel(Logr.levels.NONE);  // no messages get through
  Logr.setLevel(Logr.levels.DEBUG); // only debug messages
  Logr.setLevel(Logr.levels.INFO);  // debug and info messages
  Logr.setLevel(Logr.levels.WARN);  // debug, info and warn messages
  Logr.setLevel(Logr.levels.ERROR); // all messages
```

##### Setting logging level per instance

```js
  var log1 = Logr.log('log1');

  log1.setLevel(Logr.levels.NONE);  // no messages get through
  log1.setLevel(Logr.levels.DEBUG); // only debug messages
  log1.setLevel(Logr.levels.INFO);  // debug and info messages
  log1.setLevel(Logr.levels.WARN);  // debug, info and warn messages
  log1.setLevel(Logr.levels.ERROR); // all messages
```

##### Logging levels and LocalStorage SessionState

All log levels are stored in your browsers session state meaning page refreshes will
return any stored logging level. This is useful in cases where you want to turn on and off
logging levels in QA/Integration environment or simply filter your debugging logs down while
working.

### Contributing

Fork the repo and issue a pull request

### License

The MIT License

Copyright (c) 2014 Eric Clifford

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

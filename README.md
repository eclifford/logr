# Logr [![Build Status](https://travis-ci.org/eclifford/logr.svg?branch=master)](https://travis-ci.org/eclifford/logr) [![Coverage Status](https://img.shields.io/coveralls/eclifford/logr.svg)](https://coveralls.io/r/eclifford/logr?branch=master)

Logr the dynamic console logging replacement.

Logr is a contextual JavaScript logging utility for making sense of all the console logging statements
in your application. Logr supports some innovative features for reducing the amount of boilerplate logging
that you need to write and makes this logging available to you only when you need it.

- Automatically attach logging to all the methods of any object with `log.attach`
- Contextually organize your logging statements named **Logr** logs
- Programaticaly set logging levels globally or per log
- Logging levels are stored per session allowing you to turn logging on and off in QA and Staging environments and have them stored for the
entire browsing session
- **AMD** and **CommonJS** compatible
- Fully supported in **Webkit** and **Gecko** won't break in IE

![responsify-example](http://f.cl.ly/items/200U1Z0v092j371g3k0o/Image%202014-09-23%20at%2012.51.22.png)

## Getting Started

### Installation with Bower

```bash
bower install logr.js
```

### Standard integration

**Logr** can be added in either the head or before the closing body tag.

```html
<body>
  <script src='bower_components/logr.js/logr.js'></script>
</body>
```

### AMD integration

**Logr** may also be used via AMD

```js
define(['logr'], function(Logr){})
```

### Creating a log

**Logr** internally manages logging instances. Using the `Logr.log` method will
return an existing logging instance of the same name or create you one.

```js
var log = Logr.log('foo'); // creates a logging instance of the name foo
```

#### Simple logging

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

The reason I created **Logr** was that I wanted to avoid having to write the same boilerplate
object method logging over and over again. It's verbose, ugly and difficult to manage. What I
wanted was a way for all the methods on my objects to be automatically wrapped in console statements
outputting their inputs, outputs, order of execution and so on.

Take for example this simple dog API.

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
We start by creating a log and then attaching the `dog` object to our logger.

```js
  var dogLog = Logr.log('dog');

  dogLog.attach(dog);
```

Finally we call a method on the `dog` object.

```js
  dog.bark(); // bark() is executed wrapped in a console grouping statement
```

Which in your **webkit/gecko** console will output the following.

![simple-example](http://f.cl.ly/items/1o3f1p2v310E2U0O283z/Image%202014-09-22%20at%2019.52.10.png)


To see a more sophisticated example we can call the `today` method which in turns
calls several other methods on the `dog` object.

```js
  dog.today();
```

![detailed-example](http://f.cl.ly/items/3F0n3E3E3o0K111h2J3A/Image%202014-09-22%20at%2019.52.47.png)

#### Dynamic logging levels

By default all **Logr** logging instances are created with a logging level of `DEBUG` meaning all
logging messages will reach your browsers console. You can override this by passing a level in the options
during log instance creation.

```js
  var log = Logr.log('foo', { level: Logr.levels.ERROR }); // set the logger level to error and above
```

**Note:** all object logging is automatically set the debug level.

##### Setting logging level globally

Calling `Logr.setLevel` will set the session based logging level for all stored instances. You should only call this from
your browser to overwrite the initial level state.

```js
  Logr.setLevel(Logr.levels.NONE);  // no messages get through
  Logr.setLevel(Logr.levels.DEBUG); // only debug messages
  Logr.setLevel(Logr.levels.INFO);  // debug and info messages
  Logr.setLevel(Logr.levels.WARN);  // debug, info and warn messages
  Logr.setLevel(Logr.levels.ERROR); // all messages
```

##### Setting logging level per instance

To set the session based logging level for a single instance simply call `setLevel` on that instance.

```js
  var log1 = Logr.log('log1');

  log1.setLevel(Logr.levels.NONE);  // no messages get through
  log1.setLevel(Logr.levels.DEBUG); // only debug messages
  log1.setLevel(Logr.levels.INFO);  // debug and info messages
  log1.setLevel(Logr.levels.WARN);  // debug, info and warn messages
  log1.setLevel(Logr.levels.ERROR); // all messages
```

##### Logging levels and SessionStorage

All log levels are stored in your browsers **sessionStorage** meaning changes to
**Logr**'s levels will persist until the end of the browser session. This is useful in cases
where you want to turn on and off logging levels in QA/Integration environment or simply filter
your debugging logs down while working.

You can for example set your all of your logs to `ERROR` by default and lower their levels
from your browser to avoid log overload.

**Example:**

Say that I create three logs foo, baz, and bar. By default I set all their
levels to `ERROR` only.

```js
  var foo = Logr.log('foo', { level: Logr.levels.ERROR });
  var baz = Logr.log('baz', { level: Logr.levels.ERROR });
  var bar = Logr.log('bar', { level: Logr.levels.ERROR });

  foo.attach(dog); // not seen as objects are always on DEBUG level
  foo.warn('foo is getting angry'); // not seen
  foo.error('foo is blowing up'); // seen
```

If at some point in the future I needed to see `INFO`, `WARN` or `DEBUG` messages
I could set that globally or per log.

In Chrome/Firefox's javascript console I could type the following.

```js
  Logr.log('foo').setLevel(Logr.levels.DEBUG); // sets foo log to DEBUG level
```
or

```js
  Logr.setLevel(Logr.levels.DEBUG); // sets all logs to DEBUG level
```

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

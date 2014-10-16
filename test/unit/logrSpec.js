/*jshint -W030 */
describe("logr", function() {
  var log1, log2;
  before(function() {
    log1 = Logr.log('log1');
    log2 = Logr.log('log2');
  });

  describe("setLevel()", function() {
    it("should accept valid parameters", function() {
      expect(function() {
        Logr.setLevel('a');
      }).to.throw();
      expect(function() {
        Logr.setLevel();
      }).to.throw();
    });
    it("should call setLevel() on all contained logs", function() {
      var log1_spy = sinon.spy(log1, "setLevel");
      var log2_spy = sinon.spy(log2, "setLevel");
      Logr.setLevel(1);
      Logr.setLevel(1);
      expect(log1_spy).to.have.been.called;
      expect(log2_spy).to.have.been.called;
    });
  });

  describe("log()", function() {
    it("should accept valid parameters", function() {
      expect(function() {
        Logr.log();
      }).to.throw();
      expect(function() {
        Logr.log('log1');
      }).to.not.throw();
    });

    it("should retrieve existing log by name", function() {
      log1.test = 'blah';
      var l = Logr.log('log1');
      expect(log1).to.deep.equal(l);
    });

    it("should create a log if one does not exist", function() {
      var l = Logr.log('log3');
      expect(l.logname).to.equal('log3');
    });

    it("should use defaults if not provided overrides", function() {
      var l = Logr.log('log4');
      expect(l.level).to.equal(Logr.defaults.level);
      delete Logr.logs.log4;
    });
  });

  describe("Log", function() {
    describe("debug()", function() {
      var debug_stub;
      beforeEach(function() {
        debug_stub = sinon.stub(console, "debug");
        log1.setLevel(1);
      });
      afterEach(function() {
        debug_stub.restore();
      });
      it("should write to console debug log correctly", function() {
        log1.debug("testing");
        expect(debug_stub).to.have.been.calledWith("[log1] testing", []);
      });
      it("should not write to log if valid level is not set", function() {
        log1.setLevel(2);
        log1.debug("testing");
        expect(debug_stub).to.have.not.been.called;
      });
    });
    describe("info()", function() {
      var info_stub;
      beforeEach(function() {
        info_stub = sinon.stub(console, "info");
        log1.setLevel(1);
      });
      afterEach(function() {
        info_stub.restore();
      });
      it("should write to console info log correctly", function() {
        log1.info("testing");
        expect(info_stub).to.have.been.calledWith("[log1] testing", []);
      });
      it("should not write to log if valid level is not set", function() {
        log1.setLevel(3);
        log1.info("testing");
        expect(info_stub).to.have.not.been.called;
      });
    });
    describe("warn()", function() {
      var warn_stub;
      beforeEach(function() {
        warn_stub = sinon.stub(console, "warn");
        log1.setLevel(1);
      });
      afterEach(function() {
        warn_stub.restore();
      });
      it("should write to console warn log correctly", function() {
        log1.warn("testing");
        expect(warn_stub).to.have.been.calledWith("[log1] testing", []);
      });
      it("should not write to log if valid level is not set", function() {
        log1.setLevel(4);
        log1.warn("testing");
        expect(warn_stub).to.have.not.been.called;
      });
    });
    describe("error()", function() {
      var error_stub;
      beforeEach(function() {
        error_stub = sinon.stub(console, "error");
        log1.setLevel(1);
      });
      afterEach(function() {
        error_stub.restore();
      });
      it("should write to console error log correctly", function() {
        log1.error("testing");
        expect(error_stub).to.have.been.calledWith("[log1] testing", []);
      });
      it("should not write to log if valid level is not set", function() {
        log1.setLevel(5);
        log1.error("testing");
        expect(error_stub).to.have.not.been.called;
      });
    });
    describe("attach()", function() {
      var foo = {
        baz: function() {},
        bar: function() {}
      };
      it("should attach debug statements to object", function() {
        var spy = sinon.spy(foo, "baz");
        log1.attach(foo);
        foo.baz();
        expect(spy).to.have.been.called;
      });
    });
    describe("wrap()", function() {
      it("should wrap an existing object method", function() {
        var foo = {
          baz: function() { return 'baz'; }
        };
        var stub = sinon.stub(console, "info");
        var spy = sinon.spy(foo, 'baz');
        log1.wrap(foo, 'baz', spy);
        log1.setLevel(1);
        foo.baz();
        expect(spy).to.have.been.called;
        stub.restore();
      });
      it("should handle errors", function() {
        var foo = {
          baz: function() { throw new Error('hi'); }
        };
        var stub = sinon.stub(console, "error");
        log1.wrap(foo, 'baz');
        log1.setLevel(1);
        foo.baz();
        expect(function() {
          foo.baz();
        }).to.not.throw();
        stub.restore();
      });
    });
    describe("Log()", function() {
      it("should be able to extend options", function() {
        Logr.log('log4', {
          level: 2
        });
        expect(Logr.log('log4').level).to.equal(2);
        delete Logr.logs.log4;
      });
    });

  });
});

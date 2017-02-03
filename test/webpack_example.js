var temp = require("temp").track();
var path = require("path");
var fs = require("fs-extra");
var assert = require("assert");
var Init = require("../");

describe("Webpack", function() {
  var destination;

  var config = {
    logger: {
      log: function() {}
    }
  };

  before("get a temp destination", function(done) {
    temp.mkdir('test-truffle-init', function(err, dirPath) {
      if (err) return done(err);

      destination = dirPath;
      done();
    });
  });

  before("download webpack example from github", function() {
    // we need to install dependencies
    this.timeout(120000);

    return Init.fromGithub(config, "webpack", destination).then(function() {
      // Note: the file we're looking for exists in the trufflesuite/truffle-init-default repo!
      var expected_file_path = path.join(destination, "truffle.js");
      assert(fs.existsSync(expected_file_path), "Expected file doesn't exist!");
    });
  });

  it("will install package.json dependencies", function() {
    var pkg = require(path.join(destination, "package.json"));

    Object.keys(pkg.devDependencies).forEach(function(dep) {
      var expected_path = path.join(destination, "node_modules", dep);
      assert(fs.existsSync(expected_path), "Couldn't find dep " + dep);
    });
  });
});

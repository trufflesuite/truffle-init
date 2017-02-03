var temp = require("temp").track();
var path = require("path");
var fs = require("fs-extra");
var assert = require("assert");
var Init = require("../");

describe("Downloader", function() {
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

  it("downloads default example from github", function() {
    this.timeout(5000);

    return Init.fromGithub(config, "default", destination).then(function(init_config) {
      assert.notEqual(init_config, null);

      // Note: the file we're looking for exists in the trufflesuite/truffle-init-default repo!
      var expected_file_path = path.join(destination, "truffle.js");
      assert(fs.existsSync(expected_file_path), "Expected file doesn't exist!");
    });
  });

  it("ignores files listed in the truffle-init.json file, and removes the truffle-init.json file", function() {
    // Assert the file is not there first.
    assert(fs.existsSync(path.join(destination, "truffle-init.json")) == false, "truffle-init.json shouldn't be available to the user!");

    // Now assert the README.md and the .gitignore file were removed.
    assert(fs.existsSync(path.join(destination, "README.md")) == false, "README.md didn't get removed!");
    assert(fs.existsSync(path.join(destination, ".gitignore")) == false, ".gitignore didn't get removed!");
  });
});

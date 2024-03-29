const test = require("tape-benchmark")(require("tape"));
const psl = require("./psl");
const pslrules = require("./pslrules");

test("benchmark", function(test) {
  test.benchmark("Search through rules", function() {
    for (const entry of pslrules.NORMAL_ENTRIES) {
      if (typeof entry === "string") {
        entry.endsWith("foobar.foo.bar.ck");
      }
    }
  });

  test.benchmark("Set implementation", function() {
    try {
      psl.getDomain("foobar.foo.bar.ck");
    } catch (err) {
      console.error(err);
    }
  });

  test.end();
});

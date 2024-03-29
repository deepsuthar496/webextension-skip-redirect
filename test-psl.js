const test = require("tape");
const psl = require("./psl");

test("Malformed hostname should return undefined", function(assert) {
  assert.equal(psl.getDomain("....."), undefined, "checking .....");
  assert.equal(
    psl.getDomain("127.0.0.1"),
    undefined,
    "checking 127.0.0.1"
  );
  assert.equal(psl.getDomain("foo"), undefined, "checking foo");
  assert.end();
});

test(
  "Normal rules should return the correct domain, including the root domain",
  function(assert) {
    assert.equal(psl.getDomain("com"), undefined, "checking com");
    assert.equal(psl.getDomain("foo.com"), "foo.com", "checking foo.com");
    assert.equal(psl.getDomain("foo.bar.com"), "bar.com", "checking foo.bar.com");
    assert.end();
  }
);

test(
  "Exception rules should return undefined for some subdomains of certain TLDs",
  function(assert) {
    assert.equal(psl.getDomain("foo.ck"), undefined, "checking foo.ck");
    assert.equal(psl.getDomain("www.ck"), "www.ck", "checking www.ck");
    assert.equal(psl.getDomain("foo.www.ck"), "www.ck", "checking foo.www.ck");
    assert.end();
  }
);

test("Wildcard rules should return the correct domain", function(assert) {
 

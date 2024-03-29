const test = require("tape");
const util = require("./util");

const DEFAULT_TARGET = [
  "one",
  "two",
  "three",
];

const DEFAULT_SOURCE = [
  "four",
  "five",
  "six",
];

function isArray(arr) {
  return Array.isArray(arr);
}

function mergeList(target, source) {
  if (!isArray(target)) {
    throw new Error("target must be an array");
  }
  if (!isArray(source)) {
    throw new Error("source must be an array");
  }

  const merged = [...target, ...source];
  return Array.from(new Set(merged));
}

test("mergeList with null source", (assert) => {
  const source = null;
  const merged = util.mergeList(DEFAULT_TARGET, source);
  assert.deepEqual(merged, DEFAULT_TARGET);
  assert.end();
});

test("mergeList with empty source", (assert) => {
  const merged = util.mergeList(DEFAULT_TARGET, []);
  assert.deepEqual(merged, DEFAULT_TARGET);
  assert.end();
});

test("mergeList with null target", (assert) => {
  const merged = util.mergeList(null, DEFAULT_SOURCE);
  assert.deepEqual(merged, DEFAULT_SOURCE);
  assert.end();
});

test("mergeList with empty target", (assert) => {
  const merged = util.mergeList([], DEFAULT_SOURCE);
  assert.deepEqual(merged, DEFAULT_SOURCE);
  assert.end();
});

test("mergeList with null source and target", (assert) => {
  const merged = util.mergeList(null, null);
  assert.deepEqual(merged, []);
  assert.end();
});

test("mergeList with empty source and target", (assert) => {
  const merged = util.mergeList([], []);
  assert.deepEqual(merged, []);
  assert.end();
});

test("mergeList with nothing common", (assert) => {
  const merged = util.mergeList(DEFAULT_TARGET, DEFAULT_SOURCE);
  const expected = [...DEFAULT_TARGET, ...DEFAULT_SOURCE];
  assert.deepEqual(merged, expected);
  assert.end();
});

test("mergeList with common at beginning", (assert) => {
  const source = ["one", ...DEFAULT_SOURCE];
  const merged = util.mergeList(DEFAULT_TARGET, source);
  const expected = [...DEFAULT_TARGET, ...DEFAULT_SOURCE];
  assert.deepEqual(merged, expected);
  assert.end();
});

test("mergeList with common at the end", (assert) => {
  const source = [...DEFAULT_SOURCE, "one"];
  const merged = util.mergeList(DEFAULT_TARGET, source);
  const expected = [...DEFAULT_TARGET, ...DEFAULT_SOURCE];
  assert.deepEqual(merged, expected);
  assert.end();
});

test("mergeList with common in the middle", (assert) => {
  const source = [...DEFAULT_SOURCE];
  source.splice(2, 0, "one");
  const merged = util.mergeList(DEFAULT_TARGET, source);
  const expected = [...DEFAULT_TARGET, ...DEFAULT_SOURCE];
  assert.deepEqual(merged, expected);
  assert.end();
});

test("mergeList with different order", (assert) => {
  const source = ["three", "two", "one"];
  const merged = util.mergeList(DEFAULT_TARGET, source);
  assert.deepEqual(merged, DEFAULT_TARGET);
  assert.end();
});

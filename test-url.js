const test = require("tape");
const base64 = require("./base64");
const url = require("./url");

const queryAndFragment = "?some=parameter&some-other=parameter;another=parameter#some-fragment";
const wwwTargetUrl = "www.redirection.target.com/" + queryAndFragment;
const wwwTargetUrlEncoded = encodeURIComponent(wwwTargetUrl);
const wwwTargetUrlDoubleEncoded = encodeURIComponent(wwwTargetUrlEncoded);
const someTargetUrl = "some.www.redirection.target.com/" + queryAndFragment;
const someTargetUrlEncoded = encodeURIComponent(someTargetUrl);
const someTargetUrlDoubleEncoded = encodeURIComponent(someTargetUrlEncoded);

test("URL in query path - http URLs url-encoded and not", function(assert) {
  const urlExceptions = [];
  const parameterExceptions = [];

  assert.equal(
    url.getRedirectTarget(
      `http://www.some.website.com/${"http://" + someTargetUrl}`,
      urlExceptions,
      parameterExceptions
    ),
    "http://" + someTargetUrl,
    "URL in query path with unencoded http URL"
  );

  assert.equal(
    url.getRedirectTarget(
      `http://www.some.website.com/${"http%3A%2F%2F" + someTargetUrlEncoded}`,
      urlExceptions,
      parameterExceptions
    ),
    "http://" + someTargetUrl,
    "URL in query path with url-encoded http URL"
  );

  assert.end();
});

// ... rest of the test cases

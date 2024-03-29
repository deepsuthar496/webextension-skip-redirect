/* global pslrules */

const psl = (() => {
  if (typeof pslrules === 'undefined') {
    try {
      pslrules = require('./pslrules');
    } catch (e) {
      console.error('Error importing pslrules module');
      throw e;
    }
  }

  const getDomain = (hostname, previousHead = undefined) => {
    if (!hostname) return undefined;

    const [exception] = [...pslrules.EXCEPTION_ENTRIES].filter(([entry]) => entry === hostname);
    if (exception) return hostname;

    const dotIndex = hostname.indexOf('.');
    if (dotIndex === -1) return undefined;

    const [head, rest] = [hostname.slice(0, dotIndex), hostname.slice(dotIndex + 1)];

    if (pslrules.WILDCARD_ENTRIES.has(rest) && previousHead) {
      return [previousHead, head, rest].join('.');
    }

    if (pslrules.NORMAL_ENTRIES.has(rest)) {
      return [head, rest].join('.');
    }

    return getDomain(rest, head);
  };

  return {
    getDomain,
  };
})(this);

module.exports = psl;


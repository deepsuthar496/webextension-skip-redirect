const util = (() => {
  'use strict';

  function mergeList(target, source) {
    if (target === undefined) {
      return source === undefined ? [] : source;
    }
    if (source === undefined) {
      return target;
    }
    return [
      ...target,
      ...source.filter((element) => !target.includes(element)),
    ];
  }

  // Module exports
  return {
    mergeList,
  };
})();

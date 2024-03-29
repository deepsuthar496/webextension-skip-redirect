'use strict';

// Detect free variables `exports`.
const freeExports = typeof exports === 'object' && exports && !exports.nodeType;

// Detect free variable `module`.
const freeModule = typeof module === 'object' && module && !module.nodeType && module.exports === freeExports;

// Detect free variable `global`, from Node.js or Browserified code, and use
// it as `root`.
const freeGlobal = typeof self === 'object' && self;
if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
	root = freeGlobal;
}

/*--------------------------------------------------------------------------*/

class InvalidCharacterError extends Error {
	constructor(message) {
		super(message);
		this.name = 'InvalidCharacterError';
	}
}

const error = message => {
	// Note: the error messages used throughout this file match those used by
	// the native `atob`/`btoa` implementation in Chromium.
	throw new InvalidCharacterError(message);
};

const TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// http://whatwg.org/html/common-microsyntaxes.html#space-character
const REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

// `decode` is designed to be fully compatible with `atob` as described in the
// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
// The optimized base64-decoding algorithm used is based on @atk’s excellent
// implementation. https://gist.github.com/atk/1020396
const decode = input => {
	input = `${input}`.replace(REGEX_SPACE_CHARACTERS, '');
	const length = input.length;
	if (length % 4 == 0) {
		input = input.replace(/==?$/, '');
	}
	if (
		length % 4 == 1 ||
		// http://whatwg.org/C#alphanumeric-ascii-characters
		/[^+a-zA-Z0-9/]/.test(input)
	) {
		error(
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
	}
	let bitCounter = 0;
	let bitStorage;
	let buffer;
	let output = '';
	let position = 0;
	while (position < length) {
		buffer = TABLE.indexOf(input.charAt(position));
		bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
		// Unless this is the first of a group of 4 characters…
		if (bitCounter % 4) {
			// …convert the first 8 bits to a single ASCII character.
			output += String.fromCodePoint(
				0xFF & bitStorage >> (-2 * bitCounter & 6)
			);
		}
		bitCounter++;
		position++;
	}
	return output;
};

// `encode` is designed to be fully compatible with `btoa` as described in the
// HTML Standard: http://whatwg.org

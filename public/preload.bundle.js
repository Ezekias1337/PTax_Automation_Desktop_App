(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
'use strict';

var possibleNames = [
	'BigInt64Array',
	'BigUint64Array',
	'Float32Array',
	'Float64Array',
	'Int16Array',
	'Int32Array',
	'Int8Array',
	'Uint16Array',
	'Uint32Array',
	'Uint8Array',
	'Uint8ClampedArray'
];

var g = typeof globalThis === 'undefined' ? global : globalThis;

module.exports = function availableTypedArrays() {
	var out = [];
	for (var i = 0; i < possibleNames.length; i++) {
		if (typeof g[possibleNames[i]] === 'function') {
			out[out.length] = possibleNames[i];
		}
	}
	return out;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":2,"buffer":4,"ieee754":48}],5:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],6:[function(require,module,exports){
// Currently in sync with Node.js lib/internal/util/types.js
// https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9

'use strict';

var isArgumentsObject = require('is-arguments');
var isGeneratorFunction = require('is-generator-function');
var whichTypedArray = require('which-typed-array');
var isTypedArray = require('is-typed-array');

function uncurryThis(f) {
  return f.call.bind(f);
}

var BigIntSupported = typeof BigInt !== 'undefined';
var SymbolSupported = typeof Symbol !== 'undefined';

var ObjectToString = uncurryThis(Object.prototype.toString);

var numberValue = uncurryThis(Number.prototype.valueOf);
var stringValue = uncurryThis(String.prototype.valueOf);
var booleanValue = uncurryThis(Boolean.prototype.valueOf);

if (BigIntSupported) {
  var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
}

if (SymbolSupported) {
  var symbolValue = uncurryThis(Symbol.prototype.valueOf);
}

function checkBoxedPrimitive(value, prototypeValueOf) {
  if (typeof value !== 'object') {
    return false;
  }
  try {
    prototypeValueOf(value);
    return true;
  } catch(e) {
    return false;
  }
}

exports.isArgumentsObject = isArgumentsObject;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isTypedArray = isTypedArray;

// Taken from here and modified for better browser support
// https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
function isPromise(input) {
	return (
		(
			typeof Promise !== 'undefined' &&
			input instanceof Promise
		) ||
		(
			input !== null &&
			typeof input === 'object' &&
			typeof input.then === 'function' &&
			typeof input.catch === 'function'
		)
	);
}
exports.isPromise = isPromise;

function isArrayBufferView(value) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    return ArrayBuffer.isView(value);
  }

  return (
    isTypedArray(value) ||
    isDataView(value)
  );
}
exports.isArrayBufferView = isArrayBufferView;


function isUint8Array(value) {
  return whichTypedArray(value) === 'Uint8Array';
}
exports.isUint8Array = isUint8Array;

function isUint8ClampedArray(value) {
  return whichTypedArray(value) === 'Uint8ClampedArray';
}
exports.isUint8ClampedArray = isUint8ClampedArray;

function isUint16Array(value) {
  return whichTypedArray(value) === 'Uint16Array';
}
exports.isUint16Array = isUint16Array;

function isUint32Array(value) {
  return whichTypedArray(value) === 'Uint32Array';
}
exports.isUint32Array = isUint32Array;

function isInt8Array(value) {
  return whichTypedArray(value) === 'Int8Array';
}
exports.isInt8Array = isInt8Array;

function isInt16Array(value) {
  return whichTypedArray(value) === 'Int16Array';
}
exports.isInt16Array = isInt16Array;

function isInt32Array(value) {
  return whichTypedArray(value) === 'Int32Array';
}
exports.isInt32Array = isInt32Array;

function isFloat32Array(value) {
  return whichTypedArray(value) === 'Float32Array';
}
exports.isFloat32Array = isFloat32Array;

function isFloat64Array(value) {
  return whichTypedArray(value) === 'Float64Array';
}
exports.isFloat64Array = isFloat64Array;

function isBigInt64Array(value) {
  return whichTypedArray(value) === 'BigInt64Array';
}
exports.isBigInt64Array = isBigInt64Array;

function isBigUint64Array(value) {
  return whichTypedArray(value) === 'BigUint64Array';
}
exports.isBigUint64Array = isBigUint64Array;

function isMapToString(value) {
  return ObjectToString(value) === '[object Map]';
}
isMapToString.working = (
  typeof Map !== 'undefined' &&
  isMapToString(new Map())
);

function isMap(value) {
  if (typeof Map === 'undefined') {
    return false;
  }

  return isMapToString.working
    ? isMapToString(value)
    : value instanceof Map;
}
exports.isMap = isMap;

function isSetToString(value) {
  return ObjectToString(value) === '[object Set]';
}
isSetToString.working = (
  typeof Set !== 'undefined' &&
  isSetToString(new Set())
);
function isSet(value) {
  if (typeof Set === 'undefined') {
    return false;
  }

  return isSetToString.working
    ? isSetToString(value)
    : value instanceof Set;
}
exports.isSet = isSet;

function isWeakMapToString(value) {
  return ObjectToString(value) === '[object WeakMap]';
}
isWeakMapToString.working = (
  typeof WeakMap !== 'undefined' &&
  isWeakMapToString(new WeakMap())
);
function isWeakMap(value) {
  if (typeof WeakMap === 'undefined') {
    return false;
  }

  return isWeakMapToString.working
    ? isWeakMapToString(value)
    : value instanceof WeakMap;
}
exports.isWeakMap = isWeakMap;

function isWeakSetToString(value) {
  return ObjectToString(value) === '[object WeakSet]';
}
isWeakSetToString.working = (
  typeof WeakSet !== 'undefined' &&
  isWeakSetToString(new WeakSet())
);
function isWeakSet(value) {
  return isWeakSetToString(value);
}
exports.isWeakSet = isWeakSet;

function isArrayBufferToString(value) {
  return ObjectToString(value) === '[object ArrayBuffer]';
}
isArrayBufferToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  isArrayBufferToString(new ArrayBuffer())
);
function isArrayBuffer(value) {
  if (typeof ArrayBuffer === 'undefined') {
    return false;
  }

  return isArrayBufferToString.working
    ? isArrayBufferToString(value)
    : value instanceof ArrayBuffer;
}
exports.isArrayBuffer = isArrayBuffer;

function isDataViewToString(value) {
  return ObjectToString(value) === '[object DataView]';
}
isDataViewToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  typeof DataView !== 'undefined' &&
  isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
);
function isDataView(value) {
  if (typeof DataView === 'undefined') {
    return false;
  }

  return isDataViewToString.working
    ? isDataViewToString(value)
    : value instanceof DataView;
}
exports.isDataView = isDataView;

// Store a copy of SharedArrayBuffer in case it's deleted elsewhere
var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;
function isSharedArrayBufferToString(value) {
  return ObjectToString(value) === '[object SharedArrayBuffer]';
}
function isSharedArrayBuffer(value) {
  if (typeof SharedArrayBufferCopy === 'undefined') {
    return false;
  }

  if (typeof isSharedArrayBufferToString.working === 'undefined') {
    isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
  }

  return isSharedArrayBufferToString.working
    ? isSharedArrayBufferToString(value)
    : value instanceof SharedArrayBufferCopy;
}
exports.isSharedArrayBuffer = isSharedArrayBuffer;

function isAsyncFunction(value) {
  return ObjectToString(value) === '[object AsyncFunction]';
}
exports.isAsyncFunction = isAsyncFunction;

function isMapIterator(value) {
  return ObjectToString(value) === '[object Map Iterator]';
}
exports.isMapIterator = isMapIterator;

function isSetIterator(value) {
  return ObjectToString(value) === '[object Set Iterator]';
}
exports.isSetIterator = isSetIterator;

function isGeneratorObject(value) {
  return ObjectToString(value) === '[object Generator]';
}
exports.isGeneratorObject = isGeneratorObject;

function isWebAssemblyCompiledModule(value) {
  return ObjectToString(value) === '[object WebAssembly.Module]';
}
exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

function isNumberObject(value) {
  return checkBoxedPrimitive(value, numberValue);
}
exports.isNumberObject = isNumberObject;

function isStringObject(value) {
  return checkBoxedPrimitive(value, stringValue);
}
exports.isStringObject = isStringObject;

function isBooleanObject(value) {
  return checkBoxedPrimitive(value, booleanValue);
}
exports.isBooleanObject = isBooleanObject;

function isBigIntObject(value) {
  return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
}
exports.isBigIntObject = isBigIntObject;

function isSymbolObject(value) {
  return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
}
exports.isSymbolObject = isSymbolObject;

function isBoxedPrimitive(value) {
  return (
    isNumberObject(value) ||
    isStringObject(value) ||
    isBooleanObject(value) ||
    isBigIntObject(value) ||
    isSymbolObject(value)
  );
}
exports.isBoxedPrimitive = isBoxedPrimitive;

function isAnyArrayBuffer(value) {
  return typeof Uint8Array !== 'undefined' && (
    isArrayBuffer(value) ||
    isSharedArrayBuffer(value)
  );
}
exports.isAnyArrayBuffer = isAnyArrayBuffer;

['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function(method) {
  Object.defineProperty(exports, method, {
    enumerable: false,
    value: function() {
      throw new Error(method + ' is not supported in userland');
    }
  });
});

},{"is-arguments":50,"is-generator-function":53,"is-typed-array":54,"which-typed-array":84}],7:[function(require,module,exports){
(function (process){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnvRegex = /^$/;

if (process.env.NODE_DEBUG) {
  var debugEnv = process.env.NODE_DEBUG;
  debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/,/g, '$|^')
    .toUpperCase();
  debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
}
exports.debuglog = function(set) {
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (debugEnvRegex.test(set)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').slice(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.slice(1, -1);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
exports.types = require('./support/types');

function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
exports.types.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;
exports.types.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;
exports.types.isNativeError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb.bind(null, null, ret)) },
            function(rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;

}).call(this)}).call(this,require('_process'))
},{"./support/isBuffer":5,"./support/types":6,"_process":64,"inherits":49}],8:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var callBind = require('./');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

},{"./":9,"get-intrinsic":43}],9:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var GetIntrinsic = require('get-intrinsic');

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}

},{"function-bind":42,"get-intrinsic":43}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsRefCount = exports.ChannelConnectionMap = exports.ChannelConnectionDataRef = void 0;
const IpcBusUtils_1 = require("./IpcBusUtils");
class ChannelConnectionDataRef {
    constructor(key, data, count) {
        this.key = key;
        this.data = data;
        this._refCount = (count == null) ? 1 : count;
    }
    get refCount() {
        return this._refCount;
    }
    addRef(count) {
        const refCount = (count == null) ? 1 : count;
        this._refCount += refCount;
        return refCount;
    }
    release() {
        return --this._refCount;
    }
    releaseAll() {
        this._refCount = 0;
    }
}
exports.ChannelConnectionDataRef = ChannelConnectionDataRef;
class ChannelConnectionMap {
    constructor(name, client) {
        this._name = name;
        this.client = client;
        this._channelsMap = new Map();
    }
    _info(str) {
        IpcBusUtils_1.Logger.enable && IpcBusUtils_1.Logger.info(`[${this._name}] ${str}`);
    }
    _warn(str) {
        IpcBusUtils_1.Logger.enable && IpcBusUtils_1.Logger.warn(`[${this._name}] ${str}`);
    }
    hasChannel(channel) {
        return this._channelsMap.has(channel);
    }
    getChannels() {
        const channels = Array.from(this._channelsMap.keys());
        return channels;
    }
    getChannelsCount() {
        return this._channelsMap.size;
    }
    clear() {
        this._channelsMap.clear();
    }
    addRefs(channels, key, data) {
        for (let i = 0, l = channels.length; i < l; ++i) {
            this.addRef(channels[i], key, data);
        }
    }
    releases(channels, key) {
        for (let i = 0, l = channels.length; i < l; ++i) {
            this.release(channels[i], key);
        }
    }
    _addChannel(client, channel, key, data, count) {
        IpcBusUtils_1.Logger.enable && this._info(`Create Channel: '${channel}', key =  ${key}`);
        const connsMap = new Map();
        this._channelsMap.set(channel, connsMap);
        const connData = new ChannelConnectionDataRef(key, data, count);
        connsMap.set(key, connData);
        if (client)
            client.channelAdded(channel, connData);
        return connsMap;
    }
    _removeChannel(client, channel, conn) {
        IpcBusUtils_1.Logger.enable && this._info(`Delete Channel: '${channel}'`);
        if (this._channelsMap.delete(channel)) {
            if (client)
                client.channelRemoved(channel, conn);
            return true;
        }
        return false;
    }
    addRef(channel, key, data, count = 1) {
        IpcBusUtils_1.Logger.enable && this._info(`AddRef: '${channel}': key = ${key}`);
        let connsMap = this._channelsMap.get(channel);
        if (connsMap == null) {
            connsMap = this._addChannel(this.client, channel, key, data, count);
        }
        else {
            let connData = connsMap.get(key);
            if (connData == null) {
                connData = new ChannelConnectionDataRef(key, data, count);
                connsMap.set(key, connData);
            }
            else {
                connData.addRef(count);
            }
        }
        return connsMap.size;
    }
    _releaseConnData(channel, connData, connsMap, releaseAll) {
        if (releaseAll) {
            connData.releaseAll();
        }
        else {
            connData.release();
        }
        if (connData.refCount === 0) {
            connsMap.delete(connData.key);
            if (connsMap.size === 0) {
                this._removeChannel(this.client, channel, connData);
            }
        }
        IpcBusUtils_1.Logger.enable && this._info(`Release '${channel}': count = ${connData.refCount}`);
        return connsMap.size;
    }
    _releaseChannel(channel, key, releaseAll) {
        IpcBusUtils_1.Logger.enable && this._info(`Release '${channel}' (${releaseAll}): key = ${key}`);
        const connsMap = this._channelsMap.get(channel);
        if (connsMap == null) {
            IpcBusUtils_1.Logger.enable && this._warn(`Release '${channel}': '${channel}' is unknown`);
            return 0;
        }
        else {
            const connData = connsMap.get(key);
            if (connData == null) {
                IpcBusUtils_1.Logger.enable && this._warn(`Release '${channel}': conn is unknown`);
                return 0;
            }
            return this._releaseConnData(channel, connData, connsMap, releaseAll);
        }
    }
    release(channel, key) {
        return this._releaseChannel(channel, key, false);
    }
    releaseAll(channel, key) {
        return this._releaseChannel(channel, key, true);
    }
    remove(key) {
        IpcBusUtils_1.Logger.enable && this._info(`remove key = ${key}`);
        this._channelsMap.forEach((connsMap, channel) => {
            const connData = connsMap.get(key);
            if (connData) {
                this._releaseConnData(channel, connData, connsMap, true);
            }
        });
    }
    getChannelConns(channel) {
        return this._channelsMap.get(channel);
    }
    getConns() {
        const conns = {};
        this._channelsMap.forEach((connsMap) => {
            connsMap.forEach((connData) => {
                conns[connData.key] = connData;
            });
        });
        return Object.values(conns);
    }
    forEachChannel(channel, callback) {
        IpcBusUtils_1.Logger.enable && this._info(`forEachChannel '${channel}'`);
        const connsMap = this._channelsMap.get(channel);
        if (connsMap == null) {
            IpcBusUtils_1.Logger.enable && this._warn(`forEachChannel: Unknown channel '${channel}' !`);
        }
        else {
            connsMap.forEach(callback);
        }
    }
    forEach(callback) {
        IpcBusUtils_1.Logger.enable && this._info('forEach');
        this._channelsMap.forEach((connsMap, channel) => {
            const cb = (0, IpcBusUtils_1.partialCall)(callback, channel);
            connsMap.forEach(cb);
        });
    }
}
exports.ChannelConnectionMap = ChannelConnectionMap;
(function (ChannelConnectionDataRef) {
    ;
    ;
})(ChannelConnectionDataRef = exports.ChannelConnectionDataRef || (exports.ChannelConnectionDataRef = {}));
;
class ChannelsRefCount {
    constructor() {
        this._channelsMap = new Map();
    }
    getChannels() {
        const channels = Array.from(this._channelsMap.keys());
        return channels;
    }
    push(channel) {
        this._channelsMap.set(channel, { channel, refCount: -1 });
    }
    pop(channel) {
        return this._channelsMap.delete(channel);
    }
    addRefs(channels) {
        for (let i = 0, l = channels.length; i < l; ++i) {
            this.addRef(channels[i]);
        }
    }
    addRef(channel) {
        let channelRefCount = this._channelsMap.get(channel);
        if (channelRefCount == null) {
            channelRefCount = { channel, refCount: 1 };
            this._channelsMap.set(channel, channelRefCount);
        }
        else {
            ++channelRefCount.refCount;
        }
        return channelRefCount.refCount;
    }
    release(channel) {
        const channelRefCount = this._channelsMap.get(channel);
        if (channelRefCount == null) {
            return 0;
        }
        else {
            if (--channelRefCount.refCount <= 0) {
                this._channelsMap.delete(channel);
            }
            return channelRefCount.refCount;
        }
    }
    has(channel) {
        return (this._channelsMap.get(channel) != null);
    }
    get(channel) {
        const channelRefCount = this._channelsMap.get(channel);
        return channelRefCount ? channelRefCount.refCount : 0;
    }
    clear() {
        this._channelsMap.clear();
    }
}
exports.ChannelsRefCount = ChannelsRefCount;

},{"./IpcBusUtils":18}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcBusClientImpl = void 0;
const events_1 = require("events");
const IpcBusUtils = require("./IpcBusUtils");
class IpcBusClientImpl extends events_1.EventEmitter {
    constructor(transport) {
        super();
        super.setMaxListeners(0);
        this._transport = transport;
        this._connectCloseState = new IpcBusUtils.ConnectCloseState();
    }
    get peer() {
        return this._peer;
    }
    createDirectChannel() {
        return this._transport.createDirectChannel(this);
    }
    createResponseChannel() {
        return this._transport.createDirectChannel(this);
    }
    connect(arg1, arg2, arg3) {
        return this._connectCloseState.connect(() => {
            const options = IpcBusUtils.CheckConnectOptions(arg1, arg2, arg3);
            return this._transport.connect(this, options)
                .then((peer) => {
                this._peer = peer;
                const eventNames = this.eventNames();
                for (let i = 0, l = eventNames.length; i < l; ++i) {
                    const eventName = eventNames[i];
                    this._transport.addChannel(this, eventName, this.listenerCount(eventName));
                }
            });
        });
    }
    close(options) {
        return this._connectCloseState.close(() => {
            return this._transport.close(this, options)
                .then(() => {
                this._peer = null;
            });
        });
    }
    send(channel, ...args) {
        channel = IpcBusUtils.CheckChannel(channel);
        this._transport.postMessage(this, undefined, channel, args);
        return this._connectCloseState.connected;
    }
    sendTo(target, channel, ...args) {
        channel = IpcBusUtils.CheckChannel(channel);
        this._transport.postMessage(this, target, channel, args);
        return this._connectCloseState.connected;
    }
    request(channel, timeoutDelay, ...args) {
        channel = IpcBusUtils.CheckChannel(channel);
        return this._transport.postRequestMessage(this, undefined, channel, timeoutDelay, args);
    }
    requestTo(target, channel, timeoutDelay, ...args) {
        channel = IpcBusUtils.CheckChannel(channel);
        return this._transport.postRequestMessage(this, target, channel, timeoutDelay, args);
    }
    postMessage(channel, message, messagePorts) {
        channel = IpcBusUtils.CheckChannel(channel);
        return this._transport.postMessage(this, undefined, channel, [message], messagePorts);
    }
    postMessageTo(target, channel, message, messagePorts) {
        channel = IpcBusUtils.CheckChannel(channel);
        return this._transport.postMessage(this, target, channel, [message], messagePorts);
    }
    emit(event, ...args) {
        event = IpcBusUtils.CheckChannel(event);
        this._transport.postMessage(this, undefined, event, args);
        return this._connectCloseState.connected;
    }
    on(channel, listener) {
        return this.addListener(channel, listener);
    }
    off(channel, listener) {
        return this.removeListener(channel, listener);
    }
    addListener(channel, listener) {
        channel = IpcBusUtils.CheckChannel(channel);
        this._transport.addChannel(this, channel);
        return super.addListener(channel, listener);
    }
    removeListener(channel, listener) {
        channel = IpcBusUtils.CheckChannel(channel);
        this._transport.removeChannel(this, channel);
        return super.removeListener(channel, listener);
    }
    once(channel, listener) {
        return super.once(channel, listener);
    }
    removeAllListeners(channel) {
        if (arguments.length === 1) {
            channel = IpcBusUtils.CheckChannel(channel);
        }
        this._transport.removeChannel(this, channel, true);
        return super.removeAllListeners(channel);
    }
    prependListener(channel, listener) {
        channel = IpcBusUtils.CheckChannel(channel);
        this._transport.addChannel(this, channel);
        return super.prependListener(channel, listener);
    }
    prependOnceListener(channel, listener) {
        channel = IpcBusUtils.CheckChannel(channel);
        this._transport.addChannel(this, channel);
        return super.prependOnceListener(channel, listener);
    }
}
exports.IpcBusClientImpl = IpcBusClientImpl;

},{"./IpcBusUtils":18,"events":39}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartMessageBag = exports.SerializeMessage = exports.CreateMessageTarget = exports.CreateTargetChannel = exports.CreateKeyForEndpoint = exports.GetTargetRenderer = exports.GetTargetProcess = exports.GetTargetMain = void 0;
const json_helpers_1 = require("json-helpers");
const socket_serializer_1 = require("socket-serializer");
const IpcBusUtils_1 = require("./IpcBusUtils");
const TargetSignature = `_target_`;
const TargetMainSignature = `${TargetSignature}main_`;
const TargetProcessSignature = `${TargetSignature}proc_`;
const TargetRendererSignature = `${TargetSignature}rend_`;
const TargetSignatureLength = TargetMainSignature.length;
const TargetSignatures = {
    'node': TargetProcessSignature,
    'native': TargetProcessSignature,
    'renderer': TargetRendererSignature,
    'main': TargetMainSignature
};
function _GetTargetFromChannel(targetTypeSignature, ipcMessage) {
    if (ipcMessage.channel && (ipcMessage.channel.lastIndexOf(TargetSignature, 0) === 0)) {
        if (ipcMessage.channel.lastIndexOf(targetTypeSignature, 0) !== 0) {
            return null;
        }
        const index = ipcMessage.channel.indexOf(TargetSignature, TargetSignatureLength);
        return JSON.parse(ipcMessage.channel.substr(TargetSignatureLength, index - TargetSignatureLength));
    }
    return null;
}
function GetTargetMain(ipcMessage, checkChannel = false) {
    if (ipcMessage.target) {
        return (ipcMessage.target.process.type === 'main') ? ipcMessage.target : null;
    }
    if (checkChannel) {
        return _GetTargetFromChannel(TargetMainSignature, ipcMessage);
    }
    return null;
}
exports.GetTargetMain = GetTargetMain;
function GetTargetProcess(ipcMessage, checkChannel = false) {
    if (ipcMessage.target) {
        return ((ipcMessage.target.process.type === 'node') || (ipcMessage.target.process.type === 'native')) ? ipcMessage.target : null;
    }
    if (checkChannel) {
        return _GetTargetFromChannel(TargetProcessSignature, ipcMessage);
    }
    return null;
}
exports.GetTargetProcess = GetTargetProcess;
function GetTargetRenderer(ipcMessage, checkChannel = false) {
    if (ipcMessage.target) {
        return (ipcMessage.target.process.type === 'renderer') ? ipcMessage.target : null;
    }
    if (checkChannel) {
        return _GetTargetFromChannel(TargetRendererSignature, ipcMessage);
    }
    return null;
}
exports.GetTargetRenderer = GetTargetRenderer;
function CreateKeyForEndpoint(endpoint) {
    if (endpoint.process.wcid && endpoint.process.frameid) {
        return (endpoint.process.wcid << 8) + endpoint.process.frameid;
    }
    else {
        return endpoint.process.pid;
    }
}
exports.CreateKeyForEndpoint = CreateKeyForEndpoint;
function CreateTargetChannel(peer) {
    const target = CreateMessageTarget(peer);
    const targetTypeSignature = TargetSignatures[peer.process.type] || `_no_target_`;
    return `${targetTypeSignature}${JSON.stringify(target)}${TargetSignature}${(0, IpcBusUtils_1.CreateUniqId)()}`;
}
exports.CreateTargetChannel = CreateTargetChannel;
function CreateMessageTarget(target) {
    if (target.id) {
        const peer = target;
        return { process: target.process, peerid: peer.id };
    }
    else {
        return { process: target.process };
    }
}
exports.CreateMessageTarget = CreateMessageTarget;
class SerializeMessage {
    constructor() {
        this._packetOut = new socket_serializer_1.IpcPacketBuffer();
        this._packetOut.JSON = json_helpers_1.JSONParserV1;
    }
    serialize(ipcMessage, args) {
        if (!ipcMessage.isRawData) {
            ipcMessage.isRawData = true;
            json_helpers_1.JSONParserV1.install();
            this._packetOut.serialize([ipcMessage, args]);
            json_helpers_1.JSONParserV1.uninstall();
            return this._packetOut;
        }
        return null;
    }
    writeMessage(writer, ipcMessage, args) {
        ipcMessage.isRawData = true;
        this._packetOut.write(writer, [ipcMessage, args]);
    }
    writeCommand(writer, ipcCommand) {
        this._packetOut.write(writer, [ipcCommand]);
    }
}
exports.SerializeMessage = SerializeMessage;
class SmartMessageBag {
    constructor() {
        this._packetOut = new socket_serializer_1.IpcPacketBuffer();
        this._packetOut.JSON = json_helpers_1.JSONParserV1;
    }
    set(ipcMessage, data) {
        this._ipcMessage = ipcMessage;
        this._supportStructureClone = undefined;
        if (this._ipcMessage.isRawData) {
            this._rawData = data;
            this._data = null;
        }
        else {
            this._data = data;
            this._rawData = null;
        }
    }
    serialize(ipcMessage, args) {
        if (!ipcMessage.isRawData) {
            ipcMessage.isRawData = true;
            json_helpers_1.JSONParserV1.install();
            this._packetOut.serialize([ipcMessage, args]);
            json_helpers_1.JSONParserV1.uninstall();
            return this._packetOut;
        }
        return null;
    }
    writeMessage(writer, ipcMessage, args) {
        if (this._rawData) {
            this._packetOut.write(writer, this._rawData);
        }
        else {
            ipcMessage.isRawData = true;
            this._packetOut.write(writer, [ipcMessage, args]);
            ipcMessage.isRawData = false;
        }
    }
    writeCommand(writer, ipcCommand) {
        this._packetOut.write(writer, [ipcCommand]);
    }
    sendIPCMessage(ipc, channel) {
        if (this._data) {
            if (this._supportStructureClone !== false) {
                try {
                    ipc.send(channel, this._ipcMessage, this._data);
                    this._supportStructureClone = true;
                    return;
                }
                catch (err) {
                    this._supportStructureClone = false;
                }
            }
        }
        this._ipcMessage.isRawData = true;
        if (this._rawData == null) {
            json_helpers_1.JSONParserV1.install();
            this._packetOut.serialize([this._ipcMessage, this._data]);
            json_helpers_1.JSONParserV1.uninstall();
            this._rawData = this._packetOut.getRawData();
        }
        ipc.send(channel, this._ipcMessage, this._rawData);
        this._ipcMessage.isRawData = false;
    }
    sendIPCMessageTo(ipc, wcid, channel) {
        if (this._data) {
            if (this._supportStructureClone !== false) {
                try {
                    ipc.sendTo(wcid, channel, this._ipcMessage, this._data);
                    this._supportStructureClone = true;
                    return;
                }
                catch (err) {
                    this._supportStructureClone = false;
                }
            }
        }
        this._ipcMessage.isRawData = true;
        if (this._rawData == null) {
            json_helpers_1.JSONParserV1.install();
            this._packetOut.serialize([this._ipcMessage, this._data]);
            json_helpers_1.JSONParserV1.uninstall();
            this._rawData = this._packetOut.getRawData();
        }
        ipc.sendTo(wcid, channel, this._ipcMessage, this._rawData);
        this._ipcMessage.isRawData = false;
    }
    sendPortMessage(port, messagePorts) {
        if (this._data) {
            if (this._supportStructureClone !== false) {
                try {
                    port.postMessage([this._ipcMessage, this._data], messagePorts);
                    this._supportStructureClone = true;
                    return;
                }
                catch (err) {
                    this._supportStructureClone = false;
                }
            }
        }
        this._ipcMessage.isRawData = true;
        if (this._rawData == null) {
            json_helpers_1.JSONParserV1.install();
            this._packetOut.serialize([this._ipcMessage, this._data]);
            json_helpers_1.JSONParserV1.uninstall();
            this._rawData = this._packetOut.getRawData();
        }
        port.postMessage([this._ipcMessage, this._rawData], messagePorts);
        this._ipcMessage.isRawData = false;
    }
}
exports.SmartMessageBag = SmartMessageBag;

},{"./IpcBusUtils":18,"json-helpers":62,"socket-serializer":82}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcBusCommand = void 0;
var IpcBusCommand;
(function (IpcBusCommand) {
    IpcBusCommand.KindBridgePrefix = 'BI';
    IpcBusCommand.KindBrokerPrefix = 'BO';
    let Kind;
    (function (Kind) {
        Kind["Handshake"] = "HAN";
        Kind["Shutdown"] = "SHT";
        Kind["AddChannelListener"] = "LICA";
        Kind["RemoveChannelListener"] = "LICR";
        Kind["RemoveChannelAllListeners"] = "LICRA";
        Kind["RemoveListeners"] = "LIR";
        Kind["LogRoundtrip"] = "LOGRT";
        Kind["BridgeConnect"] = "BICOO";
        Kind["BridgeClose"] = "BICOC";
        Kind["BridgeAddChannelListener"] = "BILICA";
        Kind["BridgeRemoveChannelListener"] = "BILICR";
        Kind["QueryState"] = "QUST";
        Kind["QueryStateResponse"] = "QUSTR";
        Kind["SendMessage"] = "MES";
        Kind["RequestResponse"] = "RQR";
    })(Kind = IpcBusCommand.Kind || (IpcBusCommand.Kind = {}));
    ;
})(IpcBusCommand = exports.IpcBusCommand || (exports.IpcBusCommand = {}));

},{}],14:[function(require,module,exports){
(function (process){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcBusConnectorImpl = void 0;
const IpcBusCommand_1 = require("./IpcBusCommand");
const IpcBusLog_factory_1 = require("./log/IpcBusLog-factory");
const IpcBusUtils_1 = require("./IpcBusUtils");
const IpcBusLog_1 = require("./log/IpcBusLog");
class IpcBusConnectorImpl {
    constructor(contextType) {
        this._peerProcess = {
            process: {
                type: contextType,
                pid: process ? process.pid : -1
            }
        };
        this._connectCloseState = new IpcBusUtils_1.ConnectCloseState();
        this._log = (0, IpcBusLog_factory_1.CreateIpcBusLog)();
        this._messageCount = 0;
    }
    get peer() {
        return this._peerProcess;
    }
    onConnectorBeforeShutdown() {
        this._client && this._client.onConnectorBeforeShutdown();
        const shutdownCommand = {
            kind: IpcBusCommand_1.IpcBusCommand.Kind.Shutdown,
            channel: ''
        };
        this.postCommand(shutdownCommand);
    }
    onConnectorHandshake() {
        const handshakeCommand = {
            kind: IpcBusCommand_1.IpcBusCommand.Kind.Handshake,
            channel: ''
        };
        this.postCommand(handshakeCommand);
    }
    onConnectorShutdown() {
        this._connectCloseState.shutdown();
        this._client && this._client.onConnectorShutdown();
        this.removeClient();
    }
    addClient(client) {
        this._client = client;
    }
    removeClient() {
        this._client = null;
    }
    stampMessage(ipcMessage, local_peer) {
        const peer = local_peer || ipcMessage.peer;
        const timestamp = this._log.now;
        const id = `${ipcMessage.peer.id}.m${this._messageCount++}`;
        ipcMessage.stamp = {
            local: false,
            id,
            kind: ipcMessage.request ? IpcBusLog_1.IpcBusLog.Kind.SEND_REQUEST : IpcBusLog_1.IpcBusLog.Kind.SEND_MESSAGE,
            timestamp,
            peer
        };
    }
    stampResponse(ipcMessage) {
        if (ipcMessage.stamp) {
            ipcMessage.stamp.timestamp_response = this._log.now;
            ipcMessage.stamp.kind = IpcBusLog_1.IpcBusLog.Kind.SEND_REQUEST_RESPONSE;
        }
    }
    ackMessage(ipcMessage, args, local, local_peer) {
        let timestamp = this._log.now;
        if (ipcMessage.stamp == null) {
            local = false;
            this.stampMessage(ipcMessage);
            ipcMessage.stamp.timestamp = timestamp;
        }
        ipcMessage.stamp.kind = ipcMessage.request ? IpcBusLog_1.IpcBusLog.Kind.GET_REQUEST : IpcBusLog_1.IpcBusLog.Kind.GET_MESSAGE,
            ipcMessage.stamp.timestamp_received = timestamp;
        ipcMessage.stamp.local = local;
        ipcMessage.stamp.peer_received = local_peer;
        const ipcMessageClone = Object.assign({}, ipcMessage, { kind: IpcBusCommand_1.IpcBusCommand.Kind.LogRoundtrip, isRawData: false });
        this.postLogRoundtrip(ipcMessageClone, args);
    }
    ackResponse(ipcMessage, args, local, local_peer) {
        let timestamp = this._log.now;
        if (ipcMessage.stamp == null) {
            local = false;
            this.stampMessage(ipcMessage, local_peer);
            timestamp = ipcMessage.stamp.timestamp;
            ipcMessage.stamp.timestamp_received = timestamp;
            ipcMessage.stamp.peer_received = ipcMessage.peer;
            this.stampResponse(ipcMessage);
            ipcMessage.stamp.timestamp_response = timestamp;
        }
        ipcMessage.stamp.kind = IpcBusLog_1.IpcBusLog.Kind.GET_REQUEST_RESPONSE;
        ipcMessage.stamp.timestamp_response_received = timestamp;
        ipcMessage.stamp.response_local = local;
        const ipcMessageClone = Object.assign({}, ipcMessage, { kind: IpcBusCommand_1.IpcBusCommand.Kind.LogRoundtrip, isRawData: false });
        this.postLogRoundtrip(ipcMessageClone, args);
    }
    onCommandReceived(ipcCommand) {
        this._client.onCommandReceived(ipcCommand);
    }
}
exports.IpcBusConnectorImpl = IpcBusConnectorImpl;

}).call(this)}).call(this,require('_process'))
},{"./IpcBusCommand":13,"./IpcBusUtils":18,"./log/IpcBusLog":23,"./log/IpcBusLog-factory":19,"_process":64}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeferredRequestPromise = exports.CastToMessagePort = void 0;
const IpcBusUtils = require("./IpcBusUtils");
function CastToMessagePort(port) {
    const unknownPort = port;
    if (unknownPort.addEventListener && !unknownPort.addListener) {
        unknownPort.on = unknownPort.addListener = unknownPort.addEventListener;
        unknownPort.off = unknownPort.removeListener = unknownPort.addRemoveListener;
        unknownPort.once = (event, listener) => {
            return unknownPort.addEventListener(event, listener, { once: true });
        };
    }
    else if (!unknownPort.addEventListener && unknownPort.addListener) {
        unknownPort.addEventListener = (event, listener, options) => {
            if (typeof options === 'object' && options.once) {
                return unknownPort.once(event, listener);
            }
            else {
                return unknownPort.addListener(event, listener);
            }
        };
        unknownPort.removeEventListener = unknownPort.addListener;
    }
    return unknownPort;
}
exports.CastToMessagePort = CastToMessagePort;
class DeferredRequestPromise {
    constructor(client, request) {
        this.client = client;
        this.request = request;
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
        this.promise.catch(() => { });
        this._settled = false;
    }
    isSettled() {
        return this._settled;
    }
    settled(ipcResponse, args) {
        if (this._settled === false) {
            const ipcBusEvent = { channel: ipcResponse.request.channel, sender: ipcResponse.peer };
            IpcBusUtils.Logger.enable && IpcBusUtils.Logger.info(`[IPCBusTransport] Peer #${ipcBusEvent.sender.name} replied to request on ${ipcResponse.request.id}`);
            try {
                if (ipcResponse.request.resolve === true) {
                    IpcBusUtils.Logger.enable && IpcBusUtils.Logger.info(`[IPCBusTransport] resolve`);
                    const response = { event: ipcBusEvent, payload: args[0] };
                    this.resolve(response);
                }
                else {
                    IpcBusUtils.Logger.enable && IpcBusUtils.Logger.info(`[IPCBusTransport] reject: ${args[0]}`);
                    const response = { event: ipcBusEvent, err: args[0] };
                    this.reject(response);
                }
            }
            catch (err) {
                IpcBusUtils.Logger.enable && IpcBusUtils.Logger.info(`[IPCBusTransport] reject: ${err}`);
                const response = { event: ipcBusEvent, err: JSON.stringify(err) };
                this.reject(response);
            }
            this._settled = true;
        }
    }
    timeout() {
        const response = {
            event: {
                channel: this.request.channel,
                sender: this.client.peer
            },
            err: 'timeout'
        };
        this.reject(response);
    }
}
exports.DeferredRequestPromise = DeferredRequestPromise;

},{"./IpcBusUtils":18}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcBusTransportImpl = void 0;
const socket_serializer_1 = require("socket-serializer");
const IpcBusUtils = require("./IpcBusUtils");
const IpcBusCommandHelpers = require("./IpcBusCommand-helpers");
const IpcBusCommand_1 = require("./IpcBusCommand");
const json_helpers_1 = require("json-helpers");
const IpcBusTransport_helpers_1 = require("./IpcBusTransport-helpers");
const g_clientNumber_symbol_name = 'IpcBusTransportID';
class IpcBusTransportImpl {
    constructor(connector) {
        this._connector = connector;
        this._requestFunctions = new Map();
        this._postMessage = this._postCommand = this._postRequestMessage = this._deadMessageHandler;
    }
    _deadMessageHandler(ipcCommand) {
        IpcBusUtils.Logger.enable && IpcBusUtils.Logger.error(`IPCBUS: not managed ${JSON.stringify(ipcCommand, null, 4)}`);
    }
    createPeer(process, name) {
        let clientNumber = IpcBusUtils.GetSingleton(g_clientNumber_symbol_name);
        if (clientNumber == null) {
            clientNumber = 1;
        }
        else {
            ++clientNumber;
        }
        let id = `${IpcBusUtils.CreateProcessID(process)}.${clientNumber}`;
        IpcBusUtils.RegisterSingleton(g_clientNumber_symbol_name, clientNumber);
        name = name || id;
        const peer = {
            id,
            process,
            name
        };
        return peer;
    }
    onLogReceived(ipcResponse, args, ipcPacketBufferCore) {
    }
    onCommandReceived(ipcCommand) {
        switch (ipcCommand.kind) {
            case IpcBusCommand_1.IpcBusCommand.Kind.QueryState: {
                const queryState = this.queryState();
                this._postCommand({
                    kind: IpcBusCommand_1.IpcBusCommand.Kind.QueryStateResponse,
                    data: {
                        id: ipcCommand.channel,
                        queryState
                    }
                });
                break;
            }
        }
    }
    _onClientMessageReceived(client, local, ipcMessage, args, messagePorts) {
        const listeners = client.listeners(ipcMessage.channel);
        if (listeners.length === 0) {
            return false;
        }
        if (this._logActivate) {
            this._connector.ackMessage(ipcMessage, args, local, client.peer);
        }
        let messageHandled = false;
        if (ipcMessage.target && ipcMessage.target.peerid) {
            if (ipcMessage.target.peerid !== client.peer.id) {
                return false;
            }
            messageHandled = true;
        }
        const ipcBusEvent = { channel: ipcMessage.channel, sender: ipcMessage.peer };
        if (ipcMessage.request) {
            const settled = (resolve, argsResponse) => {
                ipcBusEvent.request.resolve = () => { };
                ipcBusEvent.request.reject = () => { };
                const ipcResponse = {
                    kind: IpcBusCommand_1.IpcBusCommand.Kind.RequestResponse,
                    channel: ipcMessage.request.id,
                    peer: client.peer,
                    target: IpcBusCommandHelpers.CreateMessageTarget(ipcMessage.peer),
                    request: ipcMessage.request
                };
                ipcMessage.request.resolve = resolve;
                messageHandled = true;
                if (this._logActivate) {
                    ipcResponse.stamp = ipcMessage.stamp;
                    this._connector.stampResponse(ipcResponse);
                }
                if (local) {
                    this.onRequestResponseReceived(true, ipcResponse, argsResponse);
                }
                else {
                    this._postRequestMessage(ipcResponse, argsResponse);
                }
            };
            ipcBusEvent.request = {
                resolve: (payload) => {
                    IpcBusUtils.Logger.enable && IpcBusUtils.Logger.info(`[IPCBusTransport] Resolve request received on channel '${ipcMessage.channel}' from peer #${ipcMessage.peer.name} - payload: ${JSON.stringify(payload)}`);
                    settled(true, [payload]);
                },
                reject: (err) => {
                    let errResponse;
                    if (typeof err === 'string') {
                        errResponse = err;
                    }
                    else {
                        errResponse = JSON.stringify(err);
                    }
                    IpcBusUtils.Logger.enable && IpcBusUtils.Logger.info(`[IPCBusTransport] Reject request received on channel '${ipcMessage.channel}' from peer #${ipcMessage.peer.name} - err: ${errResponse}`);
                    settled(false, [err]);
                }
            };
        }
        else {
            if (messagePorts && messagePorts.length) {
                ipcBusEvent.ports = messagePorts.map(IpcBusTransport_helpers_1.CastToMessagePort);
            }
        }
        if (args) {
            for (let i = 0, l = listeners.length; i < l; ++i) {
                listeners[i].call(client, ipcBusEvent, ...args);
            }
        }
        else {
            for (let i = 0, l = listeners.length; i < l; ++i) {
                listeners[i].call(client, ipcBusEvent);
            }
        }
        return messageHandled;
    }
    onRequestResponseReceived(local, ipcResponse, args, ipcPacketBufferCore) {
        const deferredRequest = this._requestFunctions.get(ipcResponse.channel);
        if (deferredRequest) {
            this._requestFunctions.delete(ipcResponse.request.id);
            args = args || ipcPacketBufferCore.parseArrayAt(1);
            if (this._logActivate) {
                this._connector.ackResponse(ipcResponse, args, local, deferredRequest.client.peer);
            }
            deferredRequest.settled(ipcResponse, args);
            return true;
        }
        return false;
    }
    onConnectorArgsReceived(ipcMessage, args, messagePorts) {
        switch (ipcMessage.kind) {
            case IpcBusCommand_1.IpcBusCommand.Kind.SendMessage:
                return this.onMessageReceived(false, ipcMessage, args, undefined, messagePorts);
            case IpcBusCommand_1.IpcBusCommand.Kind.RequestResponse:
                return this.onRequestResponseReceived(false, ipcMessage, args, undefined);
        }
        return false;
    }
    onConnectorPacketReceived(ipcMessage, ipcPacketBufferCore, messagePorts) {
        switch (ipcMessage.kind) {
            case IpcBusCommand_1.IpcBusCommand.Kind.SendMessage:
                return this.onMessageReceived(false, ipcMessage, undefined, ipcPacketBufferCore, messagePorts);
            case IpcBusCommand_1.IpcBusCommand.Kind.RequestResponse:
                return this.onRequestResponseReceived(false, ipcMessage, undefined, ipcPacketBufferCore);
        }
        return false;
    }
    onConnectorRawDataReceived(ipcMessage, rawData, messagePorts) {
        const ipcPacketBufferCore = rawData.buffer ? new socket_serializer_1.IpcPacketBuffer(rawData) : new socket_serializer_1.IpcPacketBufferList(rawData);
        ipcPacketBufferCore.JSON = json_helpers_1.JSONParserV1;
        switch (ipcMessage.kind) {
            case IpcBusCommand_1.IpcBusCommand.Kind.SendMessage:
                return this.onMessageReceived(false, ipcMessage, undefined, ipcPacketBufferCore, messagePorts);
            case IpcBusCommand_1.IpcBusCommand.Kind.RequestResponse:
                return this.onRequestResponseReceived(false, ipcMessage, undefined, ipcPacketBufferCore);
        }
        return false;
    }
    onConnectorShutdown() {
        this._postMessage = this._postCommand = this._postRequestMessage = this._deadMessageHandler;
    }
    onConnectorBeforeShutdown() {
        this.cancelRequest();
    }
    postMessage(client, target, channel, args, messagePorts) {
        const ipcMessage = {
            kind: IpcBusCommand_1.IpcBusCommand.Kind.SendMessage,
            channel,
            peer: client.peer,
            target: target && IpcBusCommandHelpers.CreateMessageTarget(target)
        };
        if (this._logActivate) {
            this._connector.stampMessage(ipcMessage);
        }
        if (!this.onMessageReceived(true, ipcMessage, args, undefined, messagePorts)) {
            this._postMessage(ipcMessage, args, messagePorts);
        }
    }
    cancelRequest(client) {
        this._requestFunctions.forEach((request, key) => {
            if ((client == null) || (client === request.client)) {
                request.timeout();
                this._requestFunctions.delete(key);
            }
        });
    }
    postRequestMessage(client, target, channel, timeoutDelay, args) {
        timeoutDelay = IpcBusUtils.CheckTimeout(timeoutDelay);
        const ipcBusMessageRequest = {
            channel,
            id: IpcBusUtils.CreateUniqId()
        };
        const deferredRequest = new IpcBusTransport_helpers_1.DeferredRequestPromise(client, ipcBusMessageRequest);
        this._requestFunctions.set(ipcBusMessageRequest.id, deferredRequest);
        const ipcRequest = {
            kind: IpcBusCommand_1.IpcBusCommand.Kind.SendMessage,
            channel,
            peer: client.peer,
            target: target && IpcBusCommandHelpers.CreateMessageTarget(target),
            request: ipcBusMessageRequest
        };
        if (this._logActivate) {
            this._connector.stampMessage(ipcRequest);
        }
        if (!this.onMessageReceived(true, ipcRequest, args, undefined)) {
            if (timeoutDelay >= 0) {
                setTimeout(() => {
                    if (this._requestFunctions.delete(ipcBusMessageRequest.id)) {
                        deferredRequest.timeout();
                    }
                }, timeoutDelay);
            }
            this._postRequestMessage(ipcRequest, args);
        }
        return deferredRequest.promise;
    }
    connect(client, options) {
        return this._connector.handshake(this, options)
            .then((handshake) => {
            this._logActivate = handshake.logLevel > 0;
            this._postCommand = this._connector.postCommand.bind(this._connector);
            this._postMessage = this._connector.postMessage.bind(this._connector);
            this._postRequestMessage = this._connector.postMessage.bind(this._connector);
            return handshake;
        })
            .then((handshake) => {
            const peer = this.createPeer(handshake.process, options.peerName);
            return peer;
        });
    }
    close(client, options) {
        return this._connector.shutdown(options);
    }
    createDirectChannel(client) {
        return IpcBusCommandHelpers.CreateTargetChannel(client.peer);
    }
    isTarget(ipcMessage) {
        return this._connector.isTarget(ipcMessage);
    }
}
exports.IpcBusTransportImpl = IpcBusTransportImpl;

},{"./IpcBusCommand":13,"./IpcBusCommand-helpers":12,"./IpcBusTransport-helpers":15,"./IpcBusUtils":18,"json-helpers":62,"socket-serializer":82}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcBusTransportMultiImpl = void 0;
const IpcBusCommand_1 = require("./IpcBusCommand");
const IpcBusTransportImpl_1 = require("./IpcBusTransportImpl");
const IpcBusChannelMap_1 = require("./IpcBusChannelMap");
class IpcBusTransportMultiImpl extends IpcBusTransportImpl_1.IpcBusTransportImpl {
    constructor(connector) {
        super(connector);
    }
    isTarget(ipcMessage) {
        if (this._subscriptions && this._subscriptions.hasChannel(ipcMessage.channel)) {
            return true;
        }
        return super.isTarget(ipcMessage);
    }
    getChannels() {
        return this._subscriptions ? this._subscriptions.getChannels() : [];
    }
    onMessageReceived(local, ipcMessage, args, ipcPacketBufferCore, messagePorts) {
        const channelConns = this._subscriptions.getChannelConns(ipcMessage.channel);
        if (channelConns) {
            args = args || ipcPacketBufferCore.parseArrayAt(1);
            let bHandled = false;
            channelConns.forEach((entry) => {
                if (!bHandled && this._onClientMessageReceived(entry.data, local, ipcMessage, args, messagePorts)) {
                    bHandled = true;
                }
            });
            return bHandled;
        }
        return false;
    }
    onConnectorBeforeShutdown() {
        super.onConnectorBeforeShutdown();
        if (this._subscriptions) {
            this._subscriptions.client = null;
            this._subscriptions = null;
            this._postCommand({
                kind: IpcBusCommand_1.IpcBusCommand.Kind.RemoveListeners,
                channel: ''
            });
        }
    }
    connect(client, options) {
        return super.connect(client, options)
            .then((peer) => {
            if (this._subscriptions == null) {
                this._subscriptions = new IpcBusChannelMap_1.ChannelConnectionMap('');
                this._subscriptions.client = {
                    channelAdded: (channel) => {
                        this._postCommand({
                            kind: IpcBusCommand_1.IpcBusCommand.Kind.AddChannelListener,
                            channel
                        });
                    },
                    channelRemoved: (channel) => {
                        this._postCommand({
                            kind: IpcBusCommand_1.IpcBusCommand.Kind.RemoveChannelListener,
                            channel
                        });
                    }
                };
            }
            else {
            }
            return peer;
        });
    }
    close(client, options) {
        if (this._subscriptions) {
            this.cancelRequest(client);
            this.removeChannel(client);
            if (this._subscriptions.getChannelsCount() === 0) {
                this._subscriptions.client = null;
                this._subscriptions = null;
                return super.close(client, options);
            }
        }
        return Promise.resolve();
    }
    addChannel(client, channel, count) {
        if ((this._subscriptions == null) || (client.peer == null)) {
            return;
        }
        this._subscriptions.addRef(channel, client.peer.id, client, count);
    }
    removeChannel(client, channel, all) {
        if ((this._subscriptions == null) || (client.peer == null)) {
            return;
        }
        if (channel) {
            if (all) {
                this._subscriptions.releaseAll(channel, client.peer.id);
            }
            else {
                this._subscriptions.release(channel, client.peer.id);
            }
        }
        else {
            this._subscriptions.remove(client.peer.id);
        }
    }
    queryState() {
        const peersJSON = {};
        const processChannelsJSON = {};
        const channels = this._subscriptions.getChannels();
        for (let i = 0; i < channels.length; ++i) {
            const channel = channels[i];
            const processChannelJSON = processChannelsJSON[channel] = {
                name: channel,
                refCount: 0
            };
            const channelConns = this._subscriptions.getChannelConns(channel);
            channelConns.forEach((clientRef) => {
                processChannelJSON.refCount += clientRef.refCount;
                const peer = clientRef.data.peer;
                const peerJSON = peersJSON[peer.id] = peersJSON[peer.id] || {
                    peer,
                    channels: {}
                };
                const peerChannelJSON = peerJSON.channels[channel] = peerJSON.channels[channel] || {
                    name: channel,
                    refCount: 0
                };
                peerChannelJSON.refCount += clientRef.refCount;
            });
        }
        const results = {
            type: 'transport',
            process: this._connector.peer.process,
            channels: processChannelsJSON,
            peers: peersJSON
        };
        return results;
    }
}
exports.IpcBusTransportMultiImpl = IpcBusTransportMultiImpl;

},{"./IpcBusChannelMap":10,"./IpcBusCommand":13,"./IpcBusTransportImpl":16}],18:[function(require,module,exports){
(function (process){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectCloseState = exports.ActivateServiceTrace = exports.ActivateIpcBusTrace = exports.Logger = exports.RegisterSingleton = exports.GetSingleton = exports.BinarySearch = exports.CreateUniqId = exports.CheckConnectOptions = exports.CheckTimeout = exports.CheckChannel = exports.partialCall = exports.CreateProcessID = exports.IPC_BUS_TIMEOUT = void 0;
const nanoid = require("nanoid/non-secure");
exports.IPC_BUS_TIMEOUT = 2000;
const win32prefix1 = '\\\\.\\pipe';
const win32prefix2 = '\\\\?\\pipe';
function CreateProcessID(ipcProcess) {
    let name = `${ipcProcess.type}`;
    if (ipcProcess.wcid) {
        name += `-${ipcProcess.wcid}`;
    }
    if (ipcProcess.rid && (ipcProcess.rid !== ipcProcess.wcid)) {
        name += `-r${ipcProcess.rid}`;
    }
    if (ipcProcess.frameid) {
        name += `-f${ipcProcess.isMainFrame ? 'm' : 's'}${ipcProcess.frameid}`;
    }
    if (ipcProcess.pid) {
        name += `-p${ipcProcess.pid}`;
    }
    return name;
}
exports.CreateProcessID = CreateProcessID;
function partialCall(f, ...headArgs) {
    return (...tailArgs) => f(...headArgs, ...tailArgs);
}
exports.partialCall = partialCall;
function CleanPipeName(str) {
    if (process.platform === 'win32') {
        if ((str.lastIndexOf(win32prefix1, 0) === -1) && (str.lastIndexOf(win32prefix2, 0) === -1)) {
            str = str.replace(/^\//, '');
            str = str.replace(/\//g, '-');
            str = win32prefix1 + '\\' + str;
        }
    }
    return str;
}
function CheckChannel(channel) {
    switch (typeof channel) {
        case 'string':
            break;
        case 'undefined':
            channel = 'undefined';
            break;
        default:
            if (channel === null) {
                channel = 'null';
            }
            else {
                channel = channel.toString();
            }
            break;
    }
    return channel;
}
exports.CheckChannel = CheckChannel;
function CheckTimeout(val) {
    const parseVal = parseFloat(val);
    if (parseVal == val) {
        return parseVal;
    }
    else {
        return exports.IPC_BUS_TIMEOUT;
    }
}
exports.CheckTimeout = CheckTimeout;
function CheckConnectOptions(arg1, arg2, arg3) {
    const options = (typeof arg1 === 'object' ? arg1 : typeof arg2 === 'object' ? arg2 : typeof arg3 === 'object' ? arg3 : {});
    if (Number(arg1) >= 0) {
        options.port = Number(arg1);
        options.host = typeof arg2 === 'string' ? arg2 : undefined;
    }
    else if (typeof arg1 === 'string') {
        const parts = arg1.split(':');
        if ((parts.length === 2) && (Number(parts[1]) >= 0)) {
            options.port = Number(parts[1]);
            options.host = parts[0];
        }
        else {
            options.path = arg1;
        }
    }
    if (options.path) {
        options.path = CleanPipeName(options.path);
    }
    if (options.timeoutDelay == null) {
        options.timeoutDelay = exports.IPC_BUS_TIMEOUT;
    }
    return options;
}
exports.CheckConnectOptions = CheckConnectOptions;
const nanoidGenerator = nanoid.customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&(){}[]<>~', 10);
function CreateUniqId() {
    return nanoidGenerator();
}
exports.CreateUniqId = CreateUniqId;
function BinarySearch(array, target, compareFn) {
    let left = 0;
    let right = array.length;
    while (left < right) {
        let middle = (left + right) >> 1;
        const compareResult = compareFn(target, array[middle]);
        if (compareResult > 0) {
            left = middle + 1;
        }
        else if (compareResult < 0) {
            right = middle;
        }
        else {
            return middle;
        }
    }
    return -left - 1;
}
exports.BinarySearch = BinarySearch;
;
const PrefixSymbol = 'ecipc:';
function GetSingleton(symbolName) {
    const symbolRef = Symbol.for(`${PrefixSymbol}${symbolName}`);
    return globalThis[symbolRef];
}
exports.GetSingleton = GetSingleton;
function RegisterSingleton(symbolName, singleton) {
    const symbolRef = Symbol.for(`${PrefixSymbol}${symbolName}`);
    globalThis[symbolRef] = singleton;
}
exports.RegisterSingleton = RegisterSingleton;
class Logger {
    static info(msg) {
        console.log(msg);
    }
    static warn(msg) {
        console.warn(msg);
    }
    static error(msg) {
        console.error(msg);
    }
}
exports.Logger = Logger;
Logger.enable = false;
Logger.service = false;
;
function ActivateIpcBusTrace(enable) {
    Logger.enable = enable;
}
exports.ActivateIpcBusTrace = ActivateIpcBusTrace;
function ActivateServiceTrace(enable) {
    Logger.service = enable;
}
exports.ActivateServiceTrace = ActivateServiceTrace;
class ConnectCloseState {
    constructor() {
        this.shutdown();
    }
    get connected() {
        return this._connected;
    }
    connect(cb) {
        if (this._waitForConnected == null) {
            this._waitForConnected = this._waitForClosed
                .then(() => {
                return cb();
            })
                .then((t) => {
                this._connected = true;
                return t;
            })
                .catch((err) => {
                this.shutdown();
                throw err;
            });
        }
        return this._waitForConnected;
    }
    close(cb) {
        if (this._waitForConnected) {
            const waitForConnected = this._waitForConnected;
            this._waitForConnected = null;
            this._waitForClosed = waitForConnected
                .then(() => {
                return cb();
            })
                .finally(() => {
                this.shutdown();
            });
        }
        return this._waitForClosed;
    }
    shutdown() {
        this._waitForConnected = null;
        this._waitForClosed = Promise.resolve();
        this._connected = false;
    }
}
exports.ConnectCloseState = ConnectCloseState;

}).call(this)}).call(this,require('_process'))
},{"_process":64,"nanoid/non-secure":34}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIpcBusLog = void 0;
const v2_1 = require("electron-process-type/lib/v2");
const IpcBusUtils = require("../IpcBusUtils");
const g_log_symbol_name = 'IpcBusLogConfig';
const CreateIpcBusLog = () => {
    let g_log = IpcBusUtils.GetSingleton(g_log_symbol_name);
    if (g_log == null) {
        const electronProcessType = (0, v2_1.GetElectronProcessType)();
        IpcBusUtils.Logger.enable && IpcBusUtils.Logger.info(`CreateIpcBusLog process type = ${electronProcessType}`);
        switch (electronProcessType) {
            case 'main': {
                const newModule = require('./IpcBusLog-new-main');
                g_log = newModule.NewIpcBusLog();
                break;
            }
            case 'renderer': {
                const newModule = require('./IpcBusLog-new-renderer');
                g_log = newModule.NewIpcBusLog();
                break;
            }
            case 'node':
            default: {
                const newModule = require('./IpcBusLog-new-node');
                g_log = newModule.NewIpcBusLog();
                break;
            }
        }
        IpcBusUtils.RegisterSingleton(g_log_symbol_name, g_log);
    }
    return g_log;
};
exports.CreateIpcBusLog = CreateIpcBusLog;

},{"../IpcBusUtils":18,"./IpcBusLog-new-main":20,"./IpcBusLog-new-node":21,"./IpcBusLog-new-renderer":22,"electron-process-type/lib/v2":36}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewIpcBusLog = void 0;
const IpcBusLogConfigMain_1 = require("./IpcBusLogConfigMain");
function NewIpcBusLog() {
    return new IpcBusLogConfigMain_1.IpcBusLogConfigMain();
}
exports.NewIpcBusLog = NewIpcBusLog;
;

},{"./IpcBusLogConfigMain":26}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewIpcBusLog = void 0;
const IpcBusLogConfigImpl_1 = require("./IpcBusLogConfigImpl");
function NewIpcBusLog() {
    return new IpcBusLogConfigImpl_1.IpcBusLogConfigImpl();
}
exports.NewIpcBusLog = NewIpcBusLog;
;

},{"./IpcBusLogConfigImpl":25}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewIpcBusLog = void 0;
const IpcBusLogConfigImpl_1 = require("./IpcBusLogConfigImpl");
function NewIpcBusLog() {
    return new IpcBusLogConfigImpl_1.IpcBusLogConfigImpl();
}
exports.NewIpcBusLog = NewIpcBusLog;
;

},{"./IpcBusLogConfigImpl":25}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcBusLog = void 0;
var IpcBusLog;
(function (IpcBusLog) {
    let Kind;
    (function (Kind) {
        Kind[Kind["SEND_MESSAGE"] = 0] = "SEND_MESSAGE";
        Kind[Kind["GET_MESSAGE"] = 1] = "GET_MESSAGE";
        Kind[Kind["SEND_REQUEST"] = 2] = "SEND_REQUEST";
        Kind[Kind["GET_REQUEST"] = 3] = "GET_REQUEST";
        Kind[Kind["SEND_REQUEST_RESPONSE"] = 4] = "SEND_REQUEST_RESPONSE";
        Kind[Kind["GET_REQUEST_RESPONSE"] = 5] = "GET_REQUEST_RESPONSE";
        Kind[Kind["SEND_CLOSE_REQUEST"] = 6] = "SEND_CLOSE_REQUEST";
        Kind[Kind["GET_CLOSE_REQUEST"] = 7] = "GET_CLOSE_REQUEST";
    })(Kind = IpcBusLog.Kind || (IpcBusLog.Kind = {}));
    function KindToStr(kind) {
        switch (kind) {
            case Kind.SEND_MESSAGE:
                return 'SendMessage';
            case Kind.GET_MESSAGE:
                return 'GetMessage';
            case Kind.SEND_REQUEST:
                return 'SendRequest';
            case Kind.GET_REQUEST:
                return 'GetRequest';
            case Kind.SEND_REQUEST_RESPONSE:
                return 'SendRequestResponse';
            case Kind.GET_REQUEST_RESPONSE:
                return 'GetRequestResponse';
            case Kind.SEND_CLOSE_REQUEST:
                return 'SendCloseRequest';
            case Kind.GET_CLOSE_REQUEST:
                return 'GetCloseRequest';
        }
    }
    IpcBusLog.KindToStr = KindToStr;
})(IpcBusLog = exports.IpcBusLog || (exports.IpcBusLog = {}));

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcBusLogConfig = void 0;
var IpcBusLogConfig;
(function (IpcBusLogConfig) {
    let Level;
    (function (Level) {
        Level[Level["None"] = 0] = "None";
        Level[Level["Traffic"] = 1] = "Traffic";
        Level[Level["Args"] = 2] = "Args";
        Level[Level["Max"] = 3] = "Max";
    })(Level = IpcBusLogConfig.Level || (IpcBusLogConfig.Level = {}));
})(IpcBusLogConfig = exports.IpcBusLogConfig || (exports.IpcBusLogConfig = {}));

},{}],25:[function(require,module,exports){
(function (process){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcBusLogConfigImpl = void 0;
const IpcBusLogConfig_1 = require("./IpcBusLogConfig");
const LogLevelEnv = 'ELECTRON_IPC_LOG_LEVEL';
const LogBaseTimeEnv = 'ELECTRON_IPC_LOG_BASE_TIME';
const ArgMaxContentLenEnv = 'ELECTRON_IPC_LOG_ARG_MAX_CONTENT_LEN';
let performanceNode;
try {
    performanceNode = require('perf_hooks').performance;
}
catch (err) {
}
const performanceInterface = performanceNode || performance || {};
const performanceNow = performanceInterface.now ||
    performanceInterface.mozNow ||
    performanceInterface.msNow ||
    performanceInterface.oNow ||
    performanceInterface.webkitNow ||
    function () { return (new Date()).getTime(); };
class IpcBusLogConfigImpl {
    constructor() {
        const levelFromEnv = this.getLevelFromEnv();
        this._level = Math.max(IpcBusLogConfig_1.IpcBusLogConfig.Level.None, levelFromEnv);
        const baseTimeFromEnv = this.getBaseTimeFromEnv();
        this._baseTime = Math.max(this.now, baseTimeFromEnv);
        const argMaxLenFromEnv = this.getArgMaxContentLenFromEnv();
        this._argMaxContentLen = Math.max(-1, argMaxLenFromEnv);
    }
    getLevelFromEnv() {
        if (process && process.env) {
            const levelAny = process.env[LogLevelEnv];
            if (levelAny != null) {
                let level = Number(levelAny);
                level = Math.min(level, IpcBusLogConfig_1.IpcBusLogConfig.Level.Max);
                level = Math.max(level, IpcBusLogConfig_1.IpcBusLogConfig.Level.None);
                return level;
            }
        }
        return -1;
    }
    getBaseTimeFromEnv() {
        if (process && process.env) {
            const baseTimeAny = process.env[LogBaseTimeEnv];
            if (baseTimeAny != null) {
                const baseline = Number(baseTimeAny);
                return baseline;
            }
        }
        return -1;
    }
    getArgMaxContentLenFromEnv() {
        if (process && process.env) {
            const argMaxContentLenAny = process.env[ArgMaxContentLenEnv];
            if (argMaxContentLenAny != null) {
                const argMaxContentLen = Number(argMaxContentLenAny);
                return argMaxContentLen;
            }
        }
        return -1;
    }
    get level() {
        return this._level;
    }
    set level(level) {
        if (process && process.env) {
            process.env[LogLevelEnv] = level.toString();
        }
        this._level = level;
    }
    get baseTime() {
        return this._baseTime;
    }
    get now() {
        return Date.now();
    }
    get hrnow() {
        const clocktime = performanceNow.call(performanceInterface) * 1e-3;
        return clocktime;
    }
    set baseTime(baseTime) {
        if (process && process.env) {
            process.env[LogBaseTimeEnv] = baseTime.toString();
        }
        this._baseTime = baseTime;
    }
    set argMaxContentLen(argMaxContentLen) {
        argMaxContentLen = (argMaxContentLen == null) ? -1 : argMaxContentLen;
        if (process && process.env) {
            process.env[ArgMaxContentLenEnv] = argMaxContentLen.toString();
        }
        this._argMaxContentLen = argMaxContentLen;
    }
    get argMaxContentLen() {
        return this._argMaxContentLen;
    }
}
exports.IpcBusLogConfigImpl = IpcBusLogConfigImpl;

}).call(this)}).call(this,require('_process'))
},{"./IpcBusLogConfig":24,"_process":64,"perf_hooks":3}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcBusLogConfigMain = void 0;
const socket_serializer_1 = require("socket-serializer");
const IpcBusLog_1 = require("./IpcBusLog");
const IpcBusLogConfigImpl_1 = require("./IpcBusLogConfigImpl");
const IpcBusLogConfig_1 = require("./IpcBusLogConfig");
const IpcBusLog_factory_1 = require("./IpcBusLog-factory");
const IpcBusCommand_1 = require("../IpcBusCommand");
const json_helpers_1 = require("json-helpers");
const IpcBusLogUtils_1 = require("./IpcBusLogUtils");
class IpcBusLogConfigMain extends IpcBusLogConfigImpl_1.IpcBusLogConfigImpl {
    constructor() {
        super();
        this._order = 0;
    }
    getCallback() {
        return this._cb;
    }
    setCallback(cb) {
        this._cb = cb;
    }
    getArgs(args) {
        if (args == null) {
            return [];
        }
        if (this._argMaxContentLen <= 0) {
            return args;
        }
        else {
            const managed_args = [];
            for (let i = 0, l = args.length; i < l; ++i) {
                managed_args.push((0, IpcBusLogUtils_1.CutData)(args[i], this._argMaxContentLen));
            }
            return managed_args;
        }
    }
    buildMessage(ipcMessage, args, payload) {
        if (ipcMessage.stamp == null) {
            return null;
        }
        let kind;
        switch (ipcMessage.kind) {
            case IpcBusCommand_1.IpcBusCommand.Kind.SendMessage:
                kind = ipcMessage.request ? IpcBusLog_1.IpcBusLog.Kind.SEND_REQUEST : IpcBusLog_1.IpcBusLog.Kind.SEND_MESSAGE;
                break;
            case IpcBusCommand_1.IpcBusCommand.Kind.RequestResponse:
                kind = IpcBusLog_1.IpcBusLog.Kind.SEND_REQUEST_RESPONSE;
                break;
            case IpcBusCommand_1.IpcBusCommand.Kind.LogRoundtrip:
                kind = ipcMessage.stamp.kind;
                break;
            default:
                return null;
        }
        let needArgs = (this._level & IpcBusLogConfig_1.IpcBusLogConfig.Level.Args) === IpcBusLogConfig_1.IpcBusLogConfig.Level.Args;
        const local = ipcMessage.stamp.local || ipcMessage.stamp.response_local;
        const message = {
            kind,
            kindStr: IpcBusLog_1.IpcBusLog.KindToStr(kind),
            id: ipcMessage.stamp.id,
            peer: ipcMessage.stamp.peer,
            related_peer: ipcMessage.stamp.peer_received,
            local,
            payload,
            args: needArgs ? this.getArgs(args) : undefined
        };
        switch (message.kind) {
            case IpcBusLog_1.IpcBusLog.Kind.SEND_REQUEST:
            case IpcBusLog_1.IpcBusLog.Kind.SEND_MESSAGE: {
                message.order = 0;
                message.timestamp = ipcMessage.stamp.timestamp - this._baseTime;
                message.delay = 0,
                    message.channel = ipcMessage.channel;
                message.responseChannel = ipcMessage.request && ipcMessage.request.id;
                break;
            }
            case IpcBusLog_1.IpcBusLog.Kind.GET_REQUEST:
            case IpcBusLog_1.IpcBusLog.Kind.GET_MESSAGE: {
                message.order = 1;
                message.timestamp = ipcMessage.stamp.timestamp_received - this._baseTime;
                message.delay = ipcMessage.stamp.timestamp_received - ipcMessage.stamp.timestamp;
                message.channel = ipcMessage.channel;
                message.responseChannel = ipcMessage.request && ipcMessage.request.id;
                break;
            }
            case IpcBusLog_1.IpcBusLog.Kind.SEND_REQUEST_RESPONSE: {
                message.order = 2;
                message.timestamp = ipcMessage.stamp.timestamp_response - this._baseTime;
                message.delay = ipcMessage.stamp.timestamp_response - ipcMessage.stamp.timestamp_received;
                message.channel = ipcMessage.request.channel;
                message.responseChannel = ipcMessage.request.id;
                message.responseStatus = ipcMessage.request.resolve ? 'resolved' : 'rejected';
                break;
            }
            case IpcBusLog_1.IpcBusLog.Kind.GET_REQUEST_RESPONSE: {
                message.order = 3;
                message.timestamp = ipcMessage.stamp.timestamp_response_received - this._baseTime;
                message.delay = ipcMessage.stamp.timestamp_response_received - ipcMessage.stamp.timestamp_response;
                message.channel = ipcMessage.request.channel;
                message.responseChannel = ipcMessage.request.id;
                message.responseStatus = ipcMessage.request.resolve ? 'resolved' : 'rejected';
                break;
            }
        }
        this._cb(message);
        return message;
    }
    _addLog(ipcMessage, args, payload) {
        this.buildMessage(ipcMessage, args, payload);
        return (ipcMessage.kind !== IpcBusCommand_1.IpcBusCommand.Kind.LogRoundtrip);
    }
    addLog(ipcMessage, args) {
        const packet = new socket_serializer_1.IpcPacketBuffer();
        const packetSize = packet.bytelength(args);
        return this._addLog(ipcMessage, args, packetSize);
    }
    addLogRawContent(ipcMessage, rawData) {
        const ipcPacketBufferCore = rawData.buffer ? new socket_serializer_1.IpcPacketBuffer(rawData) : new socket_serializer_1.IpcPacketBufferList(rawData);
        ipcPacketBufferCore.JSON = json_helpers_1.JSONParserV1;
        return this._addLog(ipcMessage, ipcPacketBufferCore.parseArrayLength() > 1 ? ipcPacketBufferCore.parseArrayAt(1) : null, ipcPacketBufferCore.packetSize);
    }
    addLogPacket(ipcMessage, ipcPacketBuffer) {
        return this._addLog(ipcMessage, ipcPacketBuffer.parseArrayLength() > 1 ? ipcPacketBuffer.parseArrayAt(1) : null, ipcPacketBuffer.packetSize);
    }
}
exports.IpcBusLogConfigMain = IpcBusLogConfigMain;
IpcBusLog_1.IpcBusLog.SetLogLevel = (level, cb, argContentLen) => {
    const logger = (0, IpcBusLog_factory_1.CreateIpcBusLog)();
    logger.level = level;
    logger.setCallback(cb);
    logger.argMaxContentLen = argContentLen;
};

},{"../IpcBusCommand":13,"./IpcBusLog":23,"./IpcBusLog-factory":19,"./IpcBusLogConfig":24,"./IpcBusLogConfigImpl":25,"./IpcBusLogUtils":27,"json-helpers":62,"socket-serializer":82}],27:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CutData = exports.JSON_stringify = exports.JSON_stringify_string = exports.JSON_stringify_object = exports.JSON_stringify_array = void 0;
const util = require("util");
const CutMarker = '\'__cut__\'';
function JSON_stringify_array(data, maxLen, output) {
    output += '[';
    for (let i = 0, l = data.length; i < l; ++i) {
        if (output.length >= maxLen) {
            output += CutMarker;
            break;
        }
        output += JSON_stringify(data[i], maxLen - output.length);
        output += ',';
    }
    output += ']';
    return output;
}
exports.JSON_stringify_array = JSON_stringify_array;
function JSON_stringify_object(data, maxLen, output) {
    output += '{';
    if (data) {
        const keys = Object.keys(data);
        for (let i = 0, l = keys.length; i < l; ++i) {
            if (output.length >= maxLen) {
                output += CutMarker;
                break;
            }
            const key = keys[i];
            output += key + ': ';
            if (output.length >= maxLen) {
                output += CutMarker;
                break;
            }
            output += JSON_stringify(data[key], maxLen - output.length);
            output += ',';
        }
    }
    else {
        output += 'null';
    }
    output += '}';
    return output;
}
exports.JSON_stringify_object = JSON_stringify_object;
function JSON_stringify_string(data, maxLen) {
    if (data.length > maxLen) {
        return data.substr(0, maxLen) + CutMarker;
    }
    else {
        return data;
    }
}
exports.JSON_stringify_string = JSON_stringify_string;
function JSON_stringify(data, maxLen) {
    let output = '';
    switch (typeof data) {
        case 'object':
            if (Buffer.isBuffer(data)) {
                if (data.length > maxLen * 2) {
                    output = data.toString('utf8', 0, maxLen) + CutMarker;
                }
                else {
                    output = data.toString('utf8', 0, maxLen);
                }
            }
            else if (Array.isArray(data)) {
                output = JSON_stringify_array(data, maxLen, output);
            }
            else if (util.types.isDate(data)) {
                output = data.toISOString();
            }
            else {
                output = JSON_stringify_object(data, maxLen, output);
            }
            break;
        case 'string':
            output = JSON_stringify_string(data, maxLen);
            break;
        case 'number':
            output = data.toString();
            break;
        case 'boolean':
            output = data ? 'true' : 'false';
            break;
        case 'undefined':
            output = '__undefined__';
            break;
    }
    return output;
}
exports.JSON_stringify = JSON_stringify;
function CutData(data, maxLen) {
    switch (typeof data) {
        case 'object':
        case 'string':
            return JSON_stringify(data, maxLen);
        default:
            return data;
    }
}
exports.CutData = CutData;

}).call(this)}).call(this,{"isBuffer":require("../../../../is-buffer/index.js")})
},{"../../../../is-buffer/index.js":51,"util":7}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Create = void 0;
const IpcBusUtils_1 = require("../IpcBusUtils");
const IpcBusConnectorRenderer_1 = require("./IpcBusConnectorRenderer");
const IpcBusClientImpl_1 = require("../IpcBusClientImpl");
const IpcBusTransportMultiImpl_1 = require("../IpcBusTransportMultiImpl");
function CreateConnector(contextType, isMainFrame, ipcWindow) {
    const connector = new IpcBusConnectorRenderer_1.IpcBusConnectorRenderer(contextType, isMainFrame, ipcWindow);
    return connector;
}
const g_transport_symbol_name = 'IpcBusTransportRenderer';
function CreateTransport(contextType, isMainFrame, ipcWindow) {
    let g_transport = (0, IpcBusUtils_1.GetSingleton)(g_transport_symbol_name);
    if (g_transport == null) {
        const connector = CreateConnector(contextType, isMainFrame, ipcWindow);
        g_transport = new IpcBusTransportMultiImpl_1.IpcBusTransportMultiImpl(connector);
        (0, IpcBusUtils_1.RegisterSingleton)(g_transport_symbol_name, g_transport);
    }
    return g_transport;
}
function Create(contextType, isMainFrame, ipcWindow) {
    const transport = CreateTransport(contextType, isMainFrame, ipcWindow);
    const ipcClient = new IpcBusClientImpl_1.IpcBusClientImpl(transport);
    return ipcClient;
}
exports.Create = Create;

},{"../IpcBusClientImpl":11,"../IpcBusTransportMultiImpl":17,"../IpcBusUtils":18,"./IpcBusConnectorRenderer":29}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcBusConnectorRenderer = exports.IPCBUS_TRANSPORT_RENDERER_LOGROUNDTRIP = exports.IPCBUS_TRANSPORT_RENDERER_MESSAGE = exports.IPCBUS_TRANSPORT_RENDERER_COMMAND = exports.IPCBUS_TRANSPORT_RENDERER_HANDSHAKE = void 0;
const queueMicrotask = require('queue-microtask');
const IpcBusUtils = require("../IpcBusUtils");
const IpcBusCommandHelpers = require("../IpcBusCommand-helpers");
const IpcBusCommand_1 = require("../IpcBusCommand");
const IpcBusConnectorImpl_1 = require("../IpcBusConnectorImpl");
const IpcBusRendererContent_1 = require("./IpcBusRendererContent");
exports.IPCBUS_TRANSPORT_RENDERER_HANDSHAKE = 'ECIPC:IpcBusRenderer:Handshake';
exports.IPCBUS_TRANSPORT_RENDERER_COMMAND = 'ECIPC:IpcBusRenderer:RendererCommand';
exports.IPCBUS_TRANSPORT_RENDERER_MESSAGE = 'ECIPC:IpcBusRenderer:RendererMessage';
exports.IPCBUS_TRANSPORT_RENDERER_LOGROUNDTRIP = 'ECIPC:IpcBusRenderer:RendererLogRoundtrip';
class IpcBusConnectorRenderer extends IpcBusConnectorImpl_1.IpcBusConnectorImpl {
    constructor(contextType, isMainFrame, ipcWindow) {
        super(contextType);
        this._ipcWindow = ipcWindow;
        this._peerProcess.process.isMainFrame = isMainFrame;
        this._messageBag = new IpcBusCommandHelpers.SmartMessageBag();
        this.onPortMessageReceived = this.onPortMessageReceived.bind(this);
        this.onPortCommandReceived = this.onPortCommandReceived.bind(this);
        this.onIPCMessageReceived = this.onIPCMessageReceived.bind(this);
        this.onIPCCommandReceived = this.onIPCCommandReceived.bind(this);
    }
    isTarget(ipcMessage) {
        const target = IpcBusCommandHelpers.GetTargetRenderer(ipcMessage);
        return (target
            && (target.process.pid == this._peerProcess.process.pid)
            && (target.process.wcid == this._peerProcess.process.wcid)
            && (target.process.frameid == this._peerProcess.process.frameid));
    }
    onConnectorBeforeShutdown() {
        super.onConnectorBeforeShutdown();
        this._ipcWindow.removeListener(exports.IPCBUS_TRANSPORT_RENDERER_MESSAGE, this.onIPCMessageReceived);
        this._ipcWindow.removeListener(exports.IPCBUS_TRANSPORT_RENDERER_COMMAND, this.onIPCCommandReceived);
        if (this._messageChannel) {
            this._messageChannel.port1.removeEventListener('message', this.onPortMessageReceived);
            this._messageChannel.port1.close();
            this._messageChannel = null;
        }
        if (this._commandChannel) {
            this._commandChannel.port1.removeEventListener('message', this.onPortCommandReceived);
            this._commandChannel.port1.close();
            this._commandChannel = null;
        }
    }
    onIPCMessageReceived(event, ipcMessage, data) {
        queueMicrotask(() => {
            if (ipcMessage.isRawData) {
                IpcBusRendererContent_1.IpcBusRendererContent.FixRawContent(data);
                this._client.onConnectorRawDataReceived(ipcMessage, data);
            }
            else {
                this._client.onConnectorArgsReceived(ipcMessage, data);
            }
        });
    }
    onPortMessageReceived(event) {
        queueMicrotask(() => {
            const [ipcMessage, data] = event.data;
            if (ipcMessage.isRawData) {
                IpcBusRendererContent_1.IpcBusRendererContent.FixRawContent(data);
                this._client.onConnectorRawDataReceived(ipcMessage, data, event.ports);
            }
            else {
                this._client.onConnectorArgsReceived(ipcMessage, data, event.ports);
            }
        });
    }
    onIPCCommandReceived(event, ipcCommand) {
        this.onCommandReceived(ipcCommand);
    }
    onPortCommandReceived(event) {
        const ipcCommand = event.data;
        this.onCommandReceived(ipcCommand);
    }
    onCommandReceived(ipcCommand) {
        switch (ipcCommand.kind) {
            case IpcBusCommand_1.IpcBusCommand.Kind.QueryState: {
                const queryState = {
                    type: 'connector-renderer',
                    process: this._peerProcess.process,
                    peerProcess: this._peerProcess,
                };
                this.postCommand({
                    kind: IpcBusCommand_1.IpcBusCommand.Kind.QueryStateResponse,
                    data: {
                        id: ipcCommand.channel,
                        queryState
                    }
                });
                break;
            }
        }
        super.onCommandReceived(ipcCommand);
    }
    onIPCHandshake(client, options) {
        return new Promise((resolve, reject) => {
            let timer;
            const onHandshake = (event, handshake) => {
                clearTimeout(timer);
                this._ipcWindow.addListener(exports.IPCBUS_TRANSPORT_RENDERER_MESSAGE, this.onIPCMessageReceived);
                this._ipcWindow.addListener(exports.IPCBUS_TRANSPORT_RENDERER_COMMAND, this.onIPCCommandReceived);
                this.addClient(client);
                this._messageChannel.port1.addEventListener('message', this.onPortMessageReceived);
                this._messageChannel.port1.start();
                this._peerProcess.process = Object.assign(this._peerProcess.process, handshake.process);
                this._log.level = handshake.logLevel;
                this.onConnectorHandshake();
                resolve(handshake);
            };
            options = IpcBusUtils.CheckConnectOptions(options);
            if (options.timeoutDelay >= 0) {
                timer = setTimeout(() => {
                    timer = null;
                    this._ipcWindow.removeListener(exports.IPCBUS_TRANSPORT_RENDERER_HANDSHAKE, onHandshake);
                    reject('timeout');
                }, options.timeoutDelay);
            }
            const ipcCommand = {
                peer: this._peerProcess
            };
            this._messageChannel = new MessageChannel();
            this._ipcWindow.once(exports.IPCBUS_TRANSPORT_RENDERER_HANDSHAKE, onHandshake);
            this._ipcWindow.postMessage(exports.IPCBUS_TRANSPORT_RENDERER_HANDSHAKE, ipcCommand, [this._messageChannel.port2]);
        });
    }
    onPortHandshake(client, options) {
        return new Promise((resolve, reject) => {
            let timer;
            const onHandshake = (event) => {
                clearTimeout(timer);
                this._ipcWindow.addListener(exports.IPCBUS_TRANSPORT_RENDERER_MESSAGE, this.onIPCMessageReceived);
                this._commandChannel.port1.addEventListener('message', this.onPortCommandReceived);
                this._commandChannel.port1.removeEventListener('message', onHandshake);
                this._messageChannel.port1.addEventListener('message', this.onPortMessageReceived);
                this._messageChannel.port1.start();
                this.addClient(client);
                const handshake = event.data;
                this._peerProcess.process = Object.assign(this._peerProcess.process, handshake.process);
                this._log.level = handshake.logLevel;
                this.onConnectorHandshake();
                resolve(handshake);
            };
            options = IpcBusUtils.CheckConnectOptions(options);
            if (options.timeoutDelay >= 0) {
                timer = setTimeout(() => {
                    timer = null;
                    this._commandChannel.port1.removeEventListener('message', onHandshake);
                    reject('timeout');
                }, options.timeoutDelay);
            }
            this._messageChannel = new MessageChannel();
            this._commandChannel = new MessageChannel();
            this._commandChannel.port1.addEventListener('message', onHandshake);
            this._commandChannel.port1.start();
            const ipcCommand = {
                peer: this._peerProcess
            };
            this._ipcWindow.postMessage(exports.IPCBUS_TRANSPORT_RENDERER_HANDSHAKE, ipcCommand, [this._messageChannel.port2, this._commandChannel.port2]);
        });
    }
    handshake(client, options) {
        return this._connectCloseState.connect(() => {
            return this.onIPCHandshake(client, options);
        });
    }
    shutdown(options) {
        return this._connectCloseState.close(() => {
            this.onConnectorBeforeShutdown();
            this.onConnectorShutdown();
            return Promise.resolve();
        });
    }
    postMessage(ipcMessage, args, messagePorts) {
        this._messageBag.set(ipcMessage, args);
        if (messagePorts == null) {
            const target = IpcBusCommandHelpers.GetTargetRenderer(ipcMessage, true);
            if (target && target.process.isMainFrame) {
                this._messageBag.sendIPCMessageTo(this._ipcWindow, target.process.wcid, exports.IPCBUS_TRANSPORT_RENDERER_MESSAGE);
            }
            else {
                this._messageBag.sendIPCMessage(this._ipcWindow, exports.IPCBUS_TRANSPORT_RENDERER_MESSAGE);
            }
            return;
        }
        this._messageBag.sendPortMessage(this._messageChannel.port1, messagePorts);
    }
    postCommand(ipcCommand) {
        ipcCommand.peer = ipcCommand.peer || this._peerProcess;
        this._ipcWindow.send(exports.IPCBUS_TRANSPORT_RENDERER_COMMAND, ipcCommand);
    }
    postLogRoundtrip(ipcMessage, args) {
        this._messageBag.set(ipcMessage, args);
        this._messageBag.sendIPCMessage(this._ipcWindow, exports.IPCBUS_TRANSPORT_RENDERER_LOGROUNDTRIP);
    }
}
exports.IpcBusConnectorRenderer = IpcBusConnectorRenderer;

},{"../IpcBusCommand":13,"../IpcBusCommand-helpers":12,"../IpcBusConnectorImpl":14,"../IpcBusUtils":18,"./IpcBusRendererContent":30,"queue-microtask":65}],30:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcBusRendererContent = void 0;
const util = require("util");
var IpcBusRendererContent;
(function (IpcBusRendererContent) {
    function Uint8ArrayToBuffer(rawBuffer) {
        if (util.types.isUint8Array(rawBuffer)) {
            return Buffer.from(rawBuffer.buffer, rawBuffer.byteOffset, rawBuffer.byteLength);
        }
        return rawBuffer;
    }
    IpcBusRendererContent.Uint8ArrayToBuffer = Uint8ArrayToBuffer;
    function FixRawContent(rawData, forceSingleBuffer) {
        if (rawData.buffer) {
            rawData.buffer = Uint8ArrayToBuffer(rawData.buffer);
        }
        else if (Array.isArray(rawData.buffers)) {
            rawData.buffers = rawData.buffers.map(Uint8ArrayToBuffer);
            if (forceSingleBuffer) {
                rawData.buffer = Buffer.concat(rawData.buffers);
                rawData.buffers = undefined;
            }
        }
    }
    IpcBusRendererContent.FixRawContent = FixRawContent;
})(IpcBusRendererContent = exports.IpcBusRendererContent || (exports.IpcBusRendererContent = {}));

}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":4,"util":7}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreloadElectronCommonIpc = exports.PreloadElectronCommonIpcAutomatic = void 0;
const IpcBusUtils_1 = require("../IpcBusUtils");
const IpcBusClientRenderer_factory_1 = require("./IpcBusClientRenderer-factory");
const IpcBusWindowNamespace_1 = require("./IpcBusWindowNamespace");
let electron;
try {
    electron = require('electron');
}
catch (err) {
}
const trace = false;
function CreateGlobals(windowLocal, ipcWindow) {
    return {
        CreateIpcBusClient: () => {
            trace && console.log(`${IpcBusWindowNamespace_1.ElectronCommonIpcNamespace}.CreateIpcBusClient`);
            const ipcBusClient = (0, IpcBusClientRenderer_factory_1.Create)('renderer', (windowLocal.self === windowLocal.top), ipcWindow);
            return ipcBusClient;
        }
    };
}
function PreloadElectronCommonIpcAutomatic() {
    return _PreloadElectronCommonIpc();
}
exports.PreloadElectronCommonIpcAutomatic = PreloadElectronCommonIpcAutomatic;
function PreloadElectronCommonIpc(contextIsolation) {
    return _PreloadElectronCommonIpc(contextIsolation);
}
exports.PreloadElectronCommonIpc = PreloadElectronCommonIpc;
const ContextIsolationDefaultValue = false;
const g_preload_done_symbol_name = '_PreloadElectronCommonIpc';
function _PreloadElectronCommonIpc(contextIsolation) {
    if (contextIsolation == null) {
        contextIsolation = ContextIsolationDefaultValue;
    }
    const g_preloadDone = (0, IpcBusUtils_1.GetSingleton)(g_preload_done_symbol_name);
    if (!g_preloadDone) {
        (0, IpcBusUtils_1.RegisterSingleton)(g_preload_done_symbol_name, true);
        const ipcRenderer = electron && electron.ipcRenderer;
        if (ipcRenderer) {
            const windowLocal = window;
            if (contextIsolation) {
                try {
                    electron.contextBridge.exposeInMainWorld(IpcBusWindowNamespace_1.ElectronCommonIpcNamespace, CreateGlobals(windowLocal, ipcRenderer));
                }
                catch (error) {
                    console.error(error);
                    contextIsolation = false;
                }
            }
            if (!contextIsolation) {
                windowLocal[IpcBusWindowNamespace_1.ElectronCommonIpcNamespace] = CreateGlobals(windowLocal, ipcRenderer);
            }
        }
    }
    return (0, IpcBusWindowNamespace_1.IsElectronCommonIpcAvailable)();
}

},{"../IpcBusUtils":18,"./IpcBusClientRenderer-factory":28,"./IpcBusWindowNamespace":32,"electron":"electron"}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsElectronCommonIpcAvailable = exports.ElectronCommonIpcNamespace = void 0;
exports.ElectronCommonIpcNamespace = 'ElectronCommonIpc';
function IsElectronCommonIpcAvailable() {
    try {
        const windowLocal = window;
        const electronCommonIpcSpace = windowLocal[exports.ElectronCommonIpcNamespace];
        return (electronCommonIpcSpace != null);
    }
    catch (err) {
    }
    return false;
}
exports.IsElectronCommonIpcAvailable = IsElectronCommonIpcAvailable;

},{}],33:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./IpcBus/renderer/IpcBusRendererPreload"), exports);

},{"./IpcBus/renderer/IpcBusRendererPreload":31}],34:[function(require,module,exports){
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
let customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = ''
    let i = size
    while (i--) {
      id += alphabet[(Math.random() * alphabet.length) | 0]
    }
    return id
  }
}
let nanoid = (size = 21) => {
  let id = ''
  let i = size
  while (i--) {
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}
module.exports = { nanoid, customAlphabet }

},{}],35:[function(require,module,exports){
(function (process){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetElectronProcessType = exports.IsProcessElectron = exports.IsContextWorker = exports.IsContextBrowser = exports.IsContextNode = exports.ElectronProcessType = void 0;
const isBrowser = (typeof window === 'object') && (typeof window.document === 'object');
const isWebWorker = (typeof self === 'object') && self.constructor && (self.constructor.name === 'DedicatedWorkerGlobalScope');
const ProcessContextUndefined = 0x00000000;
const ProcessContextNode = 0x00000001;
const ProcessContextBrowser = 0x00000010;
const ProcessContextWorker = 0x00100000;
const ProcessElectron = 0x00010000;
const ProcessElectronMain = 0x00030000;
var ElectronProcessType;
(function (ElectronProcessType) {
    ElectronProcessType[ElectronProcessType["Undefined"] = ProcessContextUndefined] = "Undefined";
    ElectronProcessType[ElectronProcessType["Node"] = ProcessContextNode] = "Node";
    ElectronProcessType[ElectronProcessType["Browser"] = ProcessContextBrowser] = "Browser";
    ElectronProcessType[ElectronProcessType["Worker"] = ProcessContextWorker] = "Worker";
    ElectronProcessType[ElectronProcessType["ElectronNode"] = ProcessContextNode | ProcessElectron] = "ElectronNode";
    ElectronProcessType[ElectronProcessType["ElectronBrowser"] = ProcessContextBrowser | ProcessElectron] = "ElectronBrowser";
    ElectronProcessType[ElectronProcessType["ElectronMainNode"] = ProcessContextNode | ProcessElectronMain] = "ElectronMainNode";
})(ElectronProcessType = exports.ElectronProcessType || (exports.ElectronProcessType = {}));
function IsContextNode() {
    const processContext = GetElectronProcessType();
    return (processContext & ProcessContextNode) === ProcessContextNode;
}
exports.IsContextNode = IsContextNode;
function IsContextBrowser() {
    const processContext = GetElectronProcessType();
    return (processContext & ProcessContextBrowser) === ProcessContextBrowser;
}
exports.IsContextBrowser = IsContextBrowser;
function IsContextWorker() {
    const processContext = GetElectronProcessType();
    return (processContext & ProcessContextWorker) === ProcessContextWorker;
}
exports.IsContextWorker = IsContextWorker;
function IsProcessElectron() {
    const processContext = GetElectronProcessType();
    return (processContext & ProcessElectron) === ProcessElectron;
}
exports.IsProcessElectron = IsProcessElectron;
function GetElectronProcessType() {
    let processContext = ElectronProcessType.Undefined;
    if (isBrowser) {
        processContext = ElectronProcessType.Browser;
        if ((typeof process === 'object') && (process.type === 'renderer')) {
            processContext = ElectronProcessType.ElectronBrowser;
        }
        else if ((typeof navigator === 'object') && (typeof navigator.appVersion === 'string') && (navigator.appVersion.indexOf(' Electron/') >= 0)) {
            processContext = ElectronProcessType.ElectronBrowser;
            try {
                const electron = require('electron');
                if (electron.ipcRenderer) {
                    processContext = ElectronProcessType.ElectronBrowser;
                }
            }
            catch (err) {
            }
        }
    }
    else if (isWebWorker) {
        processContext = ElectronProcessType.Worker;
    }
    else if (typeof process === 'object') {
        processContext = ElectronProcessType.Node;
        if (process.type === 'browser') {
            processContext = ElectronProcessType.ElectronMainNode;
        }
        else {
            if ((typeof process.versions === 'object') && (typeof process.versions.electron === 'string')) {
                processContext = ElectronProcessType.ElectronNode;
            }
            else {
                processContext = process.env['ELECTRON_RUN_AS_NODE'] ? ElectronProcessType.ElectronNode : ElectronProcessType.Node;
            }
        }
    }
    return processContext;
}
exports.GetElectronProcessType = GetElectronProcessType;

}).call(this)}).call(this,require('_process'))
},{"_process":64,"electron":"electron"}],36:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./v2/electron-process-type"), exports);

},{"./v2/electron-process-type":37}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetElectronProcessType = void 0;
const util = require("../electron-process-type-util");
function GetElectronProcessType() {
    const electronProcessType = util.GetElectronProcessType();
    switch (electronProcessType) {
        case util.ElectronProcessType.ElectronMainNode:
            return 'main';
        case util.ElectronProcessType.Node:
        case util.ElectronProcessType.ElectronNode:
            return 'node';
        case util.ElectronProcessType.Browser:
        case util.ElectronProcessType.ElectronBrowser:
            return 'renderer';
        case util.ElectronProcessType.Worker:
            return 'worker';
        case util.ElectronProcessType.Undefined:
        default:
            return 'undefined';
    }
}
exports.GetElectronProcessType = GetElectronProcessType;

},{"../electron-process-type-util":35}],38:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;

},{"get-intrinsic":43}],39:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

},{}],40:[function(require,module,exports){
'use strict';

var isCallable = require('is-callable');

var toStr = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var forEachArray = function forEachArray(array, iterator, receiver) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
                iterator(array[i], i, array);
            } else {
                iterator.call(receiver, array[i], i, array);
            }
        }
    }
};

var forEachString = function forEachString(string, iterator, receiver) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        if (receiver == null) {
            iterator(string.charAt(i), i, string);
        } else {
            iterator.call(receiver, string.charAt(i), i, string);
        }
    }
};

var forEachObject = function forEachObject(object, iterator, receiver) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
                iterator(object[k], k, object);
            } else {
                iterator.call(receiver, object[k], k, object);
            }
        }
    }
};

var forEach = function forEach(list, iterator, thisArg) {
    if (!isCallable(iterator)) {
        throw new TypeError('iterator must be a function');
    }

    var receiver;
    if (arguments.length >= 3) {
        receiver = thisArg;
    }

    if (toStr.call(list) === '[object Array]') {
        forEachArray(list, iterator, receiver);
    } else if (typeof list === 'string') {
        forEachString(list, iterator, receiver);
    } else {
        forEachObject(list, iterator, receiver);
    }
};

module.exports = forEach;

},{"is-callable":52}],41:[function(require,module,exports){
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],42:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":41}],43:[function(require,module,exports){
'use strict';

var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = require('has-symbols')();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = require('function-bind');
var hasOwn = require('has');
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

},{"function-bind":42,"has":47,"has-symbols":44}],44:[function(require,module,exports){
'use strict';

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = require('./shams');

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

},{"./shams":45}],45:[function(require,module,exports){
'use strict';

/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{}],46:[function(require,module,exports){
'use strict';

var hasSymbols = require('has-symbols/shams');

module.exports = function hasToStringTagShams() {
	return hasSymbols() && !!Symbol.toStringTag;
};

},{"has-symbols/shams":45}],47:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":42}],48:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],49:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],50:[function(require,module,exports){
'use strict';

var hasToStringTag = require('has-tostringtag/shams')();
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		$toString(value) !== '[object Array]' &&
		$toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

},{"call-bind/callBound":8,"has-tostringtag/shams":46}],51:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],52:[function(require,module,exports){
'use strict';

var fnToStr = Function.prototype.toString;
var reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply;
var badArrayLike;
var isCallableMarker;
if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
	try {
		badArrayLike = Object.defineProperty({}, 'length', {
			get: function () {
				throw isCallableMarker;
			}
		});
		isCallableMarker = {};
		// eslint-disable-next-line no-throw-literal
		reflectApply(function () { throw 42; }, null, badArrayLike);
	} catch (_) {
		if (_ !== isCallableMarker) {
			reflectApply = null;
		}
	}
} else {
	reflectApply = null;
}

var constructorRegex = /^\s*class\b/;
var isES6ClassFn = function isES6ClassFunction(value) {
	try {
		var fnStr = fnToStr.call(value);
		return constructorRegex.test(fnStr);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionToStr(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var objectClass = '[object Object]';
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var ddaClass = '[object HTMLAllCollection]'; // IE 11
var ddaClass2 = '[object HTML document.all class]';
var ddaClass3 = '[object HTMLCollection]'; // IE 9-10
var hasToStringTag = typeof Symbol === 'function' && !!Symbol.toStringTag; // better: use `has-tostringtag`

var isIE68 = !(0 in [,]); // eslint-disable-line no-sparse-arrays, comma-spacing

var isDDA = function isDocumentDotAll() { return false; };
if (typeof document === 'object') {
	// Firefox 3 canonicalizes DDA to undefined when it's not accessed directly
	var all = document.all;
	if (toStr.call(all) === toStr.call(document.all)) {
		isDDA = function isDocumentDotAll(value) {
			/* globals document: false */
			// in IE 6-8, typeof document.all is "object" and it's truthy
			if ((isIE68 || !value) && (typeof value === 'undefined' || typeof value === 'object')) {
				try {
					var str = toStr.call(value);
					return (
						str === ddaClass
						|| str === ddaClass2
						|| str === ddaClass3 // opera 12.16
						|| str === objectClass // IE 6-8
					) && value('') == null; // eslint-disable-line eqeqeq
				} catch (e) { /**/ }
			}
			return false;
		};
	}
}

module.exports = reflectApply
	? function isCallable(value) {
		if (isDDA(value)) { return true; }
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		try {
			reflectApply(value, null, badArrayLike);
		} catch (e) {
			if (e !== isCallableMarker) { return false; }
		}
		return !isES6ClassFn(value) && tryFunctionObject(value);
	}
	: function isCallable(value) {
		if (isDDA(value)) { return true; }
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (hasToStringTag) { return tryFunctionObject(value); }
		if (isES6ClassFn(value)) { return false; }
		var strClass = toStr.call(value);
		if (strClass !== fnClass && strClass !== genClass && !(/^\[object HTML/).test(strClass)) { return false; }
		return tryFunctionObject(value);
	};

},{}],53:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = require('has-tostringtag/shams')();
var getProto = Object.getPrototypeOf;
var getGeneratorFunc = function () { // eslint-disable-line consistent-return
	if (!hasToStringTag) {
		return false;
	}
	try {
		return Function('return function*() {}')();
	} catch (e) {
	}
};
var GeneratorFunction;

module.exports = function isGeneratorFunction(fn) {
	if (typeof fn !== 'function') {
		return false;
	}
	if (isFnRegex.test(fnToStr.call(fn))) {
		return true;
	}
	if (!hasToStringTag) {
		var str = toStr.call(fn);
		return str === '[object GeneratorFunction]';
	}
	if (!getProto) {
		return false;
	}
	if (typeof GeneratorFunction === 'undefined') {
		var generatorFunc = getGeneratorFunc();
		GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
	}
	return getProto(fn) === GeneratorFunction;
};

},{"has-tostringtag/shams":46}],54:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('for-each');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i] === value) {
			return i;
		}
	}
	return -1;
};
var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		var arr = new g[typedArray]();
		if (Symbol.toStringTag in arr) {
			var proto = getPrototypeOf(arr);
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor) {
				var superProto = getPrototypeOf(proto);
				descriptor = gOPD(superProto, Symbol.toStringTag);
			}
			toStrTags[typedArray] = descriptor.get;
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var anyTrue = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!anyTrue) {
			try {
				anyTrue = getter.call(value) === typedArray;
			} catch (e) { /**/ }
		}
	});
	return anyTrue;
};

module.exports = function isTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) {
		var tag = $slice($toString(value), 8, -1);
		return $indexOf(typedArrays, tag) > -1;
	}
	if (!gOPD) { return false; }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":1,"call-bind/callBound":8,"es-abstract/helpers/getOwnPropertyDescriptor":38,"for-each":40,"has-tostringtag/shams":46}],55:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uint8ArrayJSONFormatter = exports.BufferBinaryJSONFormatter = exports.BufferJSONFormatter = exports.TypeErrorJSONFormatter = exports.ErrorJSONFormatter = exports.DateJSONFormatter = void 0;
exports.DateJSONFormatter = {
    objectType: 'Date',
    objectConstructor: globalThis.Date,
    serialize: (t) => t.valueOf(),
    unserialize: (data) => new Date(data)
};
exports.ErrorJSONFormatter = {
    objectType: 'Error',
    objectConstructor: globalThis.Error,
    serialize: (t) => t.message,
    unserialize: (data) => new Error(data)
};
exports.TypeErrorJSONFormatter = {
    objectType: 'TypeError',
    objectConstructor: globalThis.TypeError,
    serialize: (t) => t.message,
    unserialize: (data) => new TypeError(data)
};
exports.BufferJSONFormatter = {
    objectType: 'Buffer',
    objectConstructor: Buffer,
    serialize: null,
    unserialize: (data) => Buffer.from(data)
};
exports.BufferBinaryJSONFormatter = {
    objectType: 'Buffer',
    objectConstructor: Buffer,
    serialize: (t) => t.toString('binary'),
    unserialize: (data) => Buffer.from(data, 'binary')
};
exports.Uint8ArrayJSONFormatter = {
    objectType: 'Uint8Array',
    objectConstructor: Uint8Array,
    serialize: (t) => Buffer.from(t.buffer).toString('binary'),
    unserialize: (data) => {
        const buffer = Buffer.from(data, 'binary');
        return new Uint8Array(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.length));
    }
};

}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":4}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONParserImpl = void 0;
const json_replacer_tojson_impl_1 = require("./json-replacer-tojson-impl");
const json_reviver_impl_1 = require("./json-reviver-impl");
class JSONParserImpl {
    constructor() {
        this._jsonReplacerToJSON = new json_replacer_tojson_impl_1.JSONReplacerToJSONImpl();
        this._jsonReviver = new json_reviver_impl_1.JSONReviverImpl();
    }
    reviver(reviver) {
        this._jsonReviver.reviver(reviver);
    }
    replacer(replacer) {
        this._jsonReplacerToJSON.replacer(replacer);
    }
    formatter(jsonFormatter) {
        this._jsonReplacerToJSON.replacer(jsonFormatter);
        this._jsonReviver.reviver(jsonFormatter);
    }
    install() {
        this._jsonReplacerToJSON.install();
    }
    uninstall() {
        this._jsonReplacerToJSON.uninstall();
    }
    stringify(value, replacer, space) {
        return this._jsonReplacerToJSON.stringify(value, replacer, space);
    }
    parse(text, reviver) {
        return this._jsonReviver.parse(text, reviver);
    }
}
exports.JSONParserImpl = JSONParserImpl;

},{"./json-replacer-tojson-impl":60,"./json-reviver-impl":61}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONParser = exports.JSONParserV1 = void 0;
const json_formatter_default_1 = require("./json-formatter-default");
const json_parser_impl_1 = require("./json-parser-impl");
class JSONParserV1Impl extends json_parser_impl_1.JSONParserImpl {
    constructor() {
        super();
        this.formatter(json_formatter_default_1.DateJSONFormatter);
        this.formatter(json_formatter_default_1.ErrorJSONFormatter);
        this.formatter(json_formatter_default_1.TypeErrorJSONFormatter);
        this.formatter(json_formatter_default_1.BufferJSONFormatter);
        this.formatter(json_formatter_default_1.Uint8ArrayJSONFormatter);
    }
}
exports.JSONParserV1 = new JSONParserV1Impl();
exports.JSONParser = exports.JSONParserV1;

},{"./json-formatter-default":55,"./json-parser-impl":56}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONParserV2 = void 0;
const json_formatter_default_1 = require("./json-formatter-default");
const json_parser_impl_1 = require("./json-parser-impl");
class JSONParserV2Impl extends json_parser_impl_1.JSONParserImpl {
    constructor() {
        super();
        this.formatter(json_formatter_default_1.DateJSONFormatter);
        this.formatter(json_formatter_default_1.ErrorJSONFormatter);
        this.formatter(json_formatter_default_1.TypeErrorJSONFormatter);
        this.formatter(json_formatter_default_1.BufferBinaryJSONFormatter);
        this.formatter(json_formatter_default_1.Uint8ArrayJSONFormatter);
    }
}
exports.JSONParserV2 = new JSONParserV2Impl();

},{"./json-formatter-default":55,"./json-parser-impl":56}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsJSONLike = exports.ToJSONConstants = void 0;
var ToJSONConstants;
(function (ToJSONConstants) {
    ToJSONConstants.JSON_TOKEN_UNDEFINED = '_/undefined/_';
})(ToJSONConstants = exports.ToJSONConstants || (exports.ToJSONConstants = {}));
function IsJSONLike(obj) {
    return ((typeof obj === 'object') && obj.stringify && obj.parse);
}
exports.IsJSONLike = IsJSONLike;

},{}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONReplacerToJSONImpl = void 0;
const json_parser_1 = require("./json-parser");
function findFunctionPrototype(objectConstructor, name) {
    let proto = objectConstructor.prototype;
    let toJSONDescriptor = Object.getOwnPropertyDescriptor(proto, name);
    if (toJSONDescriptor) {
        return [proto, toJSONDescriptor];
    }
    else {
        proto = Object.getPrototypeOf(objectConstructor);
        while (proto) {
            toJSONDescriptor = Object.getOwnPropertyDescriptor(proto, name);
            if (toJSONDescriptor) {
                return [proto, toJSONDescriptor];
            }
            proto = Object.getPrototypeOf(proto);
        }
    }
    return null;
}
class JSONReplacerSetup {
    constructor(replacer) {
        this.objectType = replacer.objectType;
        this.objectConstructor = replacer.objectConstructor;
        this.serialize = replacer.serialize;
        const objectConstructor = this.objectConstructor;
        this._toOriginalDescriptor = findFunctionPrototype(objectConstructor, 'toJSON');
        if (this._toOriginalDescriptor == null) {
            this._toOriginalDescriptor = [
                objectConstructor.prototype,
                {
                    value: undefined,
                    configurable: true,
                    enumerable: false,
                    writable: true
                }
            ];
        }
        if (this.serialize) {
            const self = this;
            this._toJSONDescriptor = {
                value: function () {
                    return { type: self.objectType, data: self.serialize(this) };
                },
                configurable: true,
                enumerable: false,
                writable: true
            };
        }
    }
    install() {
        if (this.serialize) {
            try {
                Object.defineProperty(this._toOriginalDescriptor[0], 'toJSON', this._toJSONDescriptor);
            }
            catch (err) {
                console.error(`${err}`);
            }
        }
    }
    uninstall() {
        if (this.serialize) {
            try {
                Object.defineProperty(this._toOriginalDescriptor[0], 'toJSON', this._toOriginalDescriptor[1]);
            }
            catch (err) {
            }
        }
    }
}
class JSONReplacerToJSONImpl {
    constructor() {
        this._jsonReplacerSetupsMap = new Map();
        this._installed = 0;
        this._replacer = this._replacer.bind(this);
    }
    replacer(replacer) {
        const setup = new JSONReplacerSetup(replacer);
        if (replacer.serialize) {
            this._jsonReplacerSetupsMap.set(setup.objectConstructor, setup);
        }
        else {
            this._jsonReplacerSetupsMap.delete(setup.objectConstructor);
        }
    }
    _replacer(key, value) {
        if (typeof key === 'undefined') {
            return json_parser_1.ToJSONConstants.JSON_TOKEN_UNDEFINED;
        }
        return value;
    }
    _replacerChain(replacer, key, value) {
        if (typeof key === 'undefined') {
            return json_parser_1.ToJSONConstants.JSON_TOKEN_UNDEFINED;
        }
        return replacer(key, value);
    }
    install() {
        if (this._installed++ === 0) {
            this._jsonReplacerSetupsMap.forEach((item) => {
                item.install();
            });
        }
    }
    uninstall() {
        if (--this._installed === 0) {
            this._jsonReplacerSetupsMap.forEach((item) => {
                item.uninstall();
            });
        }
    }
    stringify(value, replacer, space) {
        try {
            this.install();
            const replacerCb = replacer ? this._replacerChain.bind(this, replacer) : this._replacer;
            const result = JSON.stringify(value, replacerCb, space);
            this.uninstall();
            return result;
        }
        catch (err) {
            this.uninstall();
            throw err;
        }
    }
}
exports.JSONReplacerToJSONImpl = JSONReplacerToJSONImpl;

},{"./json-parser":59}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONReviverImpl = void 0;
const json_parser_1 = require("./json-parser");
class JSONReviverImpl {
    constructor() {
        this._jsonReviversMap = new Map();
        this._reviver = this._reviver.bind(this);
    }
    reviver(reviver) {
        if (reviver.unserialize) {
            this._jsonReviversMap.set(reviver.objectType, reviver);
        }
        else {
            this._jsonReviversMap.delete(reviver.objectType);
        }
    }
    _reviver(key, value) {
        if (value) {
            if (value === json_parser_1.ToJSONConstants.JSON_TOKEN_UNDEFINED) {
                return undefined;
            }
            if ((typeof value.type === 'string') && ('data' in value)) {
                const format = this._jsonReviversMap.get(value.type);
                if (format) {
                    return format.unserialize(value.data);
                }
            }
        }
        return value;
    }
    _reviverChain(reviver, key, value) {
        if (value) {
            if (value === json_parser_1.ToJSONConstants.JSON_TOKEN_UNDEFINED) {
                return undefined;
            }
            if ((typeof value.type === 'string') && ('data' in value)) {
                const format = this._jsonReviversMap.get(value.type);
                if (format) {
                    return format.unserialize(value.data);
                }
            }
        }
        return reviver(key, value);
    }
    parse(text, reviver) {
        const reviverCb = reviver ? this._reviverChain.bind(this, reviver) : this._reviver;
        return JSON.parse(text, reviverCb);
    }
}
exports.JSONReviverImpl = JSONReviverImpl;

},{"./json-parser":59}],62:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./json-helpers-common"), exports);

},{"./json-helpers-common":63}],63:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./code/json-parser"), exports);
__exportStar(require("./code/json-parser-v1"), exports);
__exportStar(require("./code/json-parser-v2"), exports);

},{"./code/json-parser":59,"./code/json-parser-v1":57,"./code/json-parser-v2":58}],64:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],65:[function(require,module,exports){
(function (global){(function (){
/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
let promise

module.exports = typeof queueMicrotask === 'function'
  ? queueMicrotask.bind(typeof window !== 'undefined' ? window : global)
  // reuse resolved promise, and allocate it lazily
  : cb => (promise || (promise = Promise.resolve()))
    .then(cb)
    .catch(err => setTimeout(() => { throw err }, 0))

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferListReader = void 0;
const buffer_1 = require("buffer");
const reader_1 = require("./reader");
class BufferListReader extends reader_1.ReaderBase {
    constructor(buffers, offset) {
        super(0);
        this._contexts = [];
        this._timestamp = 0;
        this._buffers = buffers || [];
        this._length = this._buffers.reduce((sum, buffer) => sum + buffer.length, 0);
        this._curBufferOffset = 0;
        this._curBufferIndex = 0;
        this.seek(offset || 0);
    }
    reset() {
        super.reset();
        this._contexts = [];
        this._buffers = [];
        this._length = 0;
        this._curBufferOffset = 0;
        this._curBufferIndex = 0;
    }
    appendBuffer(buffer) {
        this._buffers.push(buffer);
        this._length += buffer.length;
    }
    get length() {
        return this._length;
    }
    getContext() {
        return {
            timestamp: this._timestamp,
            offset: this._offset,
            curOffset: this._curBufferOffset,
            curBufferIndex: this._curBufferIndex
        };
    }
    setContext(context) {
        if (context.timestamp === this._timestamp) {
            this._offset = context.offset;
            this._curBufferIndex = context.curBufferIndex;
            this._curBufferOffset = context.curOffset;
        }
        else {
            if (context.offset < (this._length >> 1)) {
                this._offset = 0;
                this._curBufferIndex = 0;
                this._curBufferOffset = 0;
            }
            else {
                this._offset = this._length - 1;
                this._curBufferIndex = this._buffers.length - 1;
                this._curBufferOffset = this._buffers[this._curBufferIndex].length - 1;
            }
            this.seek(context.offset);
        }
    }
    pushd() {
        return this._contexts.push(this.getContext());
    }
    popd() {
        const context = this._contexts.pop();
        this.setContext(context);
        return this._contexts.length;
    }
    seek(offset) {
        if (this._offset !== offset) {
            if ((offset < 0) || (offset >= this.length)) {
                if (!this._noAssert) {
                    throw new RangeError('Index out of range');
                }
                return false;
            }
            let curBuffer = this._buffers[this._curBufferIndex];
            this._curBufferOffset += (offset - this._offset);
            this._offset = offset;
            while (this._curBufferOffset >= curBuffer.length) {
                this._curBufferOffset -= curBuffer.length;
                ++this._curBufferIndex;
                curBuffer = this._buffers[this._curBufferIndex];
            }
            while (this._curBufferOffset < 0) {
                --this._curBufferIndex;
                curBuffer = this._buffers[this._curBufferIndex];
                this._curBufferOffset += curBuffer.length;
            }
        }
        return true;
    }
    reduce() {
        if (this.checkEOF(1)) {
            this.reset();
        }
        else {
            if (this._curBufferIndex > 0) {
                this._buffers.splice(0, this._curBufferIndex);
                this._length -= (this._offset - this._curBufferOffset);
                this._offset = this._curBufferOffset;
                this._curBufferIndex = 0;
            }
            if (this._buffers.length >= 0) {
                const curBuffer = this._buffers[0];
                if ((curBuffer.length > BufferListReader.ReduceThreshold) && (this._curBufferOffset > (curBuffer.length >> 1))) {
                    const newBuffer = buffer_1.Buffer.allocUnsafe(curBuffer.length - this._curBufferOffset);
                    curBuffer.copy(newBuffer, 0, this._curBufferOffset);
                    this._buffers[0] = newBuffer;
                    this._length -= this._curBufferOffset;
                    this._offset -= this._curBufferOffset;
                    this._curBufferOffset = 0;
                }
            }
        }
    }
    _consolidate(len) {
        let curBuffer = this._buffers[this._curBufferIndex];
        this._curBufferOffset += len;
        this._offset += len;
        if (this._curBufferOffset > curBuffer.length) {
            let bufferLength = 0;
            const buffers = [];
            for (let endBufferIndex = this._curBufferIndex, l = this._buffers.length; endBufferIndex < l; ++endBufferIndex) {
                const buffer = this._buffers[endBufferIndex];
                buffers.push(buffer);
                bufferLength += buffer.length;
                if (this._curBufferOffset <= bufferLength) {
                    break;
                }
            }
            curBuffer = buffer_1.Buffer.concat(buffers, bufferLength);
            this._buffers.splice(this._curBufferIndex, buffers.length, curBuffer);
            ++this._timestamp;
        }
        else if (this._curBufferOffset === curBuffer.length) {
            ++this._curBufferIndex;
            this._curBufferOffset = 0;
        }
        return curBuffer;
    }
    _readNumber(bufferFunction, byteSize) {
        const start = this._curBufferOffset;
        const currBuffer = this._consolidate(byteSize);
        return bufferFunction.call(currBuffer, start, this._noAssert);
    }
    readByte() {
        const start = this._curBufferOffset;
        const currBuffer = this._consolidate(1);
        return currBuffer[start];
    }
    readUInt16() {
        return this._readNumber(buffer_1.Buffer.prototype.readUInt16LE, 2);
    }
    readUInt32() {
        return this._readNumber(buffer_1.Buffer.prototype.readUInt32LE, 4);
    }
    readDouble() {
        return this._readNumber(buffer_1.Buffer.prototype.readDoubleLE, 8);
    }
    readString(encoding, len) {
        const end = reader_1.Reader.AdjustEnd(this._offset, this._length, len);
        if (this._offset === end) {
            return '';
        }
        else {
            const start = this._curBufferOffset;
            len = end - this._offset;
            const currBuffer = this._consolidate(len);
            return currBuffer.toString(encoding, start, start + len);
        }
    }
    readBuffer(len) {
        const end = reader_1.Reader.AdjustEnd(this._offset, this._length, len);
        if (this._offset === end) {
            return reader_1.ReaderBase.EmptyBuffer;
        }
        else {
            const start = this._curBufferOffset;
            len = end - this._offset;
            const currBuffer = this._consolidate(len);
            if ((start === 0) && (len === currBuffer.length)) {
                return currBuffer;
            }
            else {
                return currBuffer.subarray(start, start + len);
            }
        }
    }
    readBufferList(len) {
        const end = reader_1.Reader.AdjustEnd(this._offset, this._length, len);
        if (this._offset === end) {
            return [reader_1.ReaderBase.EmptyBuffer];
        }
        else {
            len = end - this._offset;
            this._offset += len;
            let curBuffer = this._buffers[this._curBufferIndex];
            const subBuffer = curBuffer.subarray(this._curBufferOffset, this._curBufferOffset + len);
            const buffers = [subBuffer];
            len -= subBuffer.length;
            this._curBufferOffset += subBuffer.length;
            while (len > 0) {
                ++this._curBufferIndex;
                curBuffer = this._buffers[this._curBufferIndex];
                const subBuffer = curBuffer.subarray(0, len);
                buffers.push(subBuffer);
                len -= subBuffer.length;
                this._curBufferOffset = subBuffer.length;
            }
            if (this._curBufferOffset === curBuffer.length) {
                this._curBufferOffset = 0;
                ++this._curBufferIndex;
            }
            return buffers;
        }
    }
    readArrayBuffer(len) {
        const buffer = this._consolidate(len);
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + len);
        return arrayBuffer;
    }
    slice(len) {
        const end = reader_1.Reader.AdjustEnd(this._offset, this._length, len);
        if (this._offset === end) {
            return reader_1.ReaderBase.EmptyBuffer;
        }
        else {
            const start = this._curBufferOffset;
            len = end - this._offset;
            const currBuffer = this._consolidate(len);
            if ((start === 0) && (len === currBuffer.length)) {
                return currBuffer;
            }
            else {
                return currBuffer.slice(start, start + len);
            }
        }
    }
}
exports.BufferListReader = BufferListReader;
BufferListReader.ReduceThreshold = 100000;

},{"./reader":71,"buffer":4}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferListWriter = exports.BufferListWriterBase = void 0;
const buffer_1 = require("buffer");
const writer_1 = require("./writer");
class BufferListWriterBase extends writer_1.WriterBase {
    constructor() {
        super();
        this._length = 0;
    }
    reset() {
        this._length = 0;
    }
    get length() {
        return this._length;
    }
    writeBytes(dataArray) {
        const uint8Array = new Uint8Array(dataArray);
        const buffer = buffer_1.Buffer.from(uint8Array.buffer);
        return this._appendBuffer(buffer, buffer.length);
    }
    writeByte(data) {
        const buffer = buffer_1.Buffer.allocUnsafe(1);
        buffer[0] = data;
        return this._appendBuffer(buffer, 1);
    }
    _writeNumber(bufferFunction, data, byteSize) {
        const buffer = buffer_1.Buffer.allocUnsafe(byteSize);
        bufferFunction.call(buffer, data, 0);
        return this._appendBuffer(buffer, byteSize);
    }
    writeUInt16(data) {
        return this._writeNumber(buffer_1.Buffer.prototype.writeUInt16LE, data, 2);
    }
    writeUInt32(data) {
        return this._writeNumber(buffer_1.Buffer.prototype.writeUInt32LE, data, 4);
    }
    writeDouble(data) {
        return this._writeNumber(buffer_1.Buffer.prototype.writeDoubleLE, data, 8);
    }
    writeString(data, encoding, len) {
        if (len != null) {
            data = data.substring(0, len);
        }
        const buffer = buffer_1.Buffer.from(data, encoding);
        return this._appendBuffer(buffer, buffer.length);
    }
    writeBuffer(buffer, sourceStart, sourceEnd) {
        if ((sourceStart != null) || (sourceEnd != null)) {
            buffer = buffer.slice(sourceStart, sourceEnd);
        }
        return this._appendBuffer(buffer, buffer.length);
    }
    writeBuffers(buffers, totalLength) {
        totalLength = (totalLength == null) ? buffers.reduce((sum, buffer) => sum + buffer.length, 0) : totalLength;
        return this._appendBuffers(buffers, totalLength);
    }
    writeArrayBuffer(data) {
        const buffer = buffer_1.Buffer.from(data);
        return this.writeBuffer(buffer);
    }
    write(writer) {
        return this._appendBuffers(writer.buffers, writer.length);
    }
    pushContext() {
    }
    popContext() {
    }
}
exports.BufferListWriterBase = BufferListWriterBase;
class BufferListWriter extends BufferListWriterBase {
    constructor() {
        super();
        this._buffers = [];
    }
    reset() {
        super.reset();
        this._buffers = [];
    }
    get buffer() {
        if (this._buffers.length === 0) {
            return writer_1.WriterBase.EmptyBuffer;
        }
        if (this._buffers.length > 1) {
            this._buffers = [buffer_1.Buffer.concat(this._buffers, this._length)];
        }
        return this._buffers[0];
    }
    get buffers() {
        return this._buffers;
    }
    _appendBuffer(buffer, length) {
        this._buffers.push(buffer);
        this._length += length;
        return this._length;
    }
    _appendBuffers(buffers, totalLength) {
        this._buffers = this._buffers.concat(buffers);
        this._length += totalLength;
        return this._length;
    }
}
exports.BufferListWriter = BufferListWriter;

},{"./writer":72,"buffer":4}],68:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferReader = void 0;
const reader_1 = require("./reader");
class BufferReader extends reader_1.ReaderBase {
    constructor(buffer, offset) {
        super(offset);
        this._buffer = buffer || reader_1.ReaderBase.EmptyBuffer;
        this._contexts = [];
    }
    reset() {
        super.reset();
        this._buffer = reader_1.ReaderBase.EmptyBuffer;
        this._contexts = [];
    }
    get length() {
        return this._buffer.length;
    }
    pushd() {
        return this._contexts.push(this._offset);
    }
    popd() {
        this._offset = this._contexts.pop();
        return this._contexts.length;
    }
    seek(offset) {
        if ((offset < 0) || (offset >= this._buffer.length)) {
            if (!this._noAssert) {
                throw new RangeError('Index out of range');
            }
            return false;
        }
        this._offset = offset;
        return true;
    }
    _readNumber(bufferFunction, byteSize) {
        const start = this._offset;
        this._offset += byteSize;
        return bufferFunction.call(this._buffer, start, this._noAssert);
    }
    readByte() {
        return this._buffer[this._offset++];
    }
    readUInt16() {
        return this._readNumber(Buffer.prototype.readUInt16LE, 2);
    }
    readUInt32() {
        return this._readNumber(Buffer.prototype.readUInt32LE, 4);
    }
    readDouble() {
        return this._readNumber(Buffer.prototype.readDoubleLE, 8);
    }
    readString(encoding, len) {
        const end = reader_1.Reader.AdjustEnd(this._offset, this._buffer.length, len);
        if (this._offset === end) {
            return '';
        }
        else {
            const start = this._offset;
            this._offset = end;
            return this._buffer.toString(encoding, start, end);
        }
    }
    slice(len) {
        const buffer = this._buffer.slice(this._offset, this._offset + len);
        this._offset += buffer.length;
        return buffer;
    }
    readBuffer(len) {
        const buffer = this._buffer.subarray(this._offset, this._offset + len);
        this._offset += buffer.length;
        return buffer;
    }
    readBufferList(len) {
        return [this.readBuffer(len)];
    }
    readArrayBuffer(len) {
        const buffer = this.readBuffer(len);
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + len);
        return arrayBuffer;
    }
    reduce() {
    }
}
exports.BufferReader = BufferReader;

}).call(this)}).call(this,require("buffer").Buffer)
},{"./reader":71,"buffer":4}],69:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferWriter = void 0;
const writer_1 = require("./writer");
class BufferWriter extends writer_1.WriterBase {
    constructor(buffer, offset) {
        super();
        this._buffer = buffer;
        this._offset = offset || 0;
    }
    reset() {
        this._buffer = writer_1.WriterBase.EmptyBuffer;
        this._offset = 0;
    }
    get buffer() {
        return this._buffer;
    }
    get buffers() {
        return [this._buffer];
    }
    get length() {
        return this._buffer.length;
    }
    get offset() {
        return this._offset;
    }
    writeBytes(dataArray) {
        const uint8Array = new Uint8Array(dataArray);
        this._offset += this._buffer.copy(uint8Array, this._offset, 0);
        return this._offset;
    }
    writeByte(data) {
        this._buffer[this._offset++] = data;
        return this._offset;
    }
    writeUInt16(data) {
        this._offset = this._buffer.writeUInt16LE(data, this._offset);
        return this._offset;
    }
    writeUInt32(data) {
        this._offset = this._buffer.writeUInt32LE(data, this._offset);
        return this._offset;
    }
    writeDouble(data) {
        this._offset = this._buffer.writeDoubleLE(data, this._offset);
        return this._offset;
    }
    writeString(data, encoding, len) {
        this._offset += this._buffer.write(data, this._offset, len, encoding);
        return this._offset;
    }
    writeBuffer(data, sourceStart, sourceEnd) {
        this._offset += data.copy(this._buffer, this._offset, sourceStart, sourceEnd);
        return this._offset;
    }
    writeBuffers(buffers, totalLength) {
        for (let i = 0, l = buffers.length; i < l; ++i) {
            this.writeBuffer(buffers[i]);
        }
        return this._offset;
    }
    writeArrayBuffer(data) {
        const buffer = Buffer.from(data);
        return this.writeBuffer(buffer);
    }
    write(writer) {
        return this.writeBuffers(writer.buffers);
    }
    pushContext() {
    }
    popContext() {
    }
}
exports.BufferWriter = BufferWriter;

}).call(this)}).call(this,require("buffer").Buffer)
},{"./writer":72,"buffer":4}],70:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferWriterSize = void 0;
const writer_1 = require("./writer");
const Num8bits = 1;
const Num16bits = 2;
const Num32bits = 4;
const NumDouble = 8;
class BufferWriterSize extends writer_1.WriterBase {
    constructor() {
        super();
        this._length = 0;
    }
    reset() {
        this._length = 0;
    }
    get buffer() {
        return writer_1.WriterBase.EmptyBuffer;
    }
    get buffers() {
        return [];
    }
    get length() {
        return this._length;
    }
    get offset() {
        return 0;
    }
    writeBytes(dataArray) {
        this._length += dataArray.length * Num8bits;
        return this._length;
    }
    writeByte(data) {
        this._length += Num8bits;
        return this._length;
    }
    writeUInt16(data) {
        this._length += Num16bits;
        return this._length;
    }
    writeUInt32(data) {
        this._length += Num32bits;
        return this._length;
    }
    writeDouble(data) {
        this._length += NumDouble;
        return this._length;
    }
    writeString(data, encoding, len) {
        if (len !== undefined) {
            data = data.substr(len);
        }
        this._length += Buffer.byteLength(data, encoding);
        return this._length;
    }
    writeBuffer(data, sourceStart, sourceEnd) {
        let len = data.length;
        if (sourceStart !== undefined) {
            len -= Math.max(sourceStart, len);
        }
        if (sourceEnd !== undefined) {
            len -= Math.max(sourceEnd, len);
        }
        this._length += len;
        return this._length;
    }
    writeBuffers(buffers, totalLength) {
        for (let i = 0, l = buffers.length; i < l; ++i) {
            this.writeBuffer(buffers[i]);
        }
        return this._length;
    }
    writeArrayBuffer(data) {
        this._length += data.byteLength;
        return this._length;
    }
    write(writer) {
        return this.writeBuffers(writer.buffers);
    }
    pushContext() {
    }
    popContext() {
    }
}
exports.BufferWriterSize = BufferWriterSize;

}).call(this)}).call(this,require("buffer").Buffer)
},{"./writer":72,"buffer":4}],71:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReaderBase = exports.Reader = void 0;
var Reader;
(function (Reader) {
    function AdjustEnd(offset, maxLen, len) {
        if (len == null) {
            return maxLen;
        }
        else if (len <= 0) {
            return offset;
        }
        else {
            offset += len;
            if (offset > maxLen) {
                return maxLen;
            }
            return offset;
        }
    }
    Reader.AdjustEnd = AdjustEnd;
})(Reader = exports.Reader || (exports.Reader = {}));
class ReaderBase {
    constructor(offset) {
        this._offset = offset || 0;
        this._noAssert = true;
    }
    getContext() {
        return { offset: this._offset };
    }
    setContext(context) {
        this._offset = context.offset;
    }
    get offset() {
        return this._offset;
    }
    get noAssert() {
        return this._noAssert;
    }
    set noAssert(noAssert) {
        this._noAssert = noAssert;
    }
    reset() {
        this._offset = 0;
    }
    checkEOF(offsetStep) {
        return (this._offset + (offsetStep || 0) > this.length);
    }
    skip(offsetStep) {
        return this.seek(this._offset + (offsetStep || 1));
    }
    subarray(len) {
        return this.readBuffer(len);
    }
    subarrayList(len) {
        return this.readBufferList(len);
    }
}
exports.ReaderBase = ReaderBase;
ReaderBase.EmptyBuffer = Buffer.allocUnsafe(0);

}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":4}],72:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriterBase = void 0;
class WriterBase {
    constructor() {
        this._noAssert = true;
    }
    get noAssert() {
        return this._noAssert;
    }
    set noAssert(noAssert) {
        this._noAssert = noAssert;
    }
}
exports.WriterBase = WriterBase;
WriterBase.EmptyBuffer = Buffer.allocUnsafe(0);

}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":4}],73:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcPacketBuffer = void 0;
const bufferReader_1 = require("../buffer/bufferReader");
const bufferListWriter_1 = require("../buffer/bufferListWriter");
const ipcPacketBufferCore_1 = require("./ipcPacketBufferCore");
const ipcPacketHeader_1 = require("./ipcPacketHeader");
class IpcPacketBuffer extends ipcPacketBufferCore_1.IpcPacketBufferCore {
    constructor(rawHeader) {
        super(rawHeader);
        if (rawHeader) {
            if (rawHeader.buffer) {
                this._buffer = rawHeader.buffer;
            }
            else if (rawHeader.buffers) {
                this._buffer = Buffer.concat(rawHeader.buffers);
            }
        }
        this._buffer = this._buffer || ipcPacketBufferCore_1.IpcPacketBufferCore.EmptyBuffer;
    }
    reset() {
        super.reset();
        this._buffer = ipcPacketBufferCore_1.IpcPacketBufferCore.EmptyBuffer;
    }
    get buffer() {
        return this._buffer;
    }
    get buffers() {
        return [this._buffer];
    }
    setRawData(rawHeader) {
        super.setRawData(rawHeader);
        if (rawHeader) {
            if (rawHeader.buffer) {
                this._buffer = rawHeader.buffer;
            }
            else if (rawHeader.buffers) {
                this._buffer = Buffer.concat(rawHeader.buffers);
            }
        }
        this._buffer = this._buffer || ipcPacketBufferCore_1.IpcPacketBufferCore.EmptyBuffer;
    }
    getRawData() {
        const rawHeader = Object.assign(Object.assign({}, this._rawHeader), { buffer: this._buffer });
        return rawHeader;
    }
    decodeFromReader(bufferReader) {
        const context = bufferReader.getContext();
        this._rawHeader = ipcPacketHeader_1.IpcPacketHeader.ReadHeader(bufferReader);
        bufferReader.setContext(context);
        if (this._rawHeader.contentSize >= 0) {
            this._buffer = bufferReader.readBuffer(this.packetSize);
            return true;
        }
        else {
            this._buffer = ipcPacketBufferCore_1.IpcPacketBufferCore.EmptyBuffer;
            return false;
        }
    }
    decodeFromBuffer(buffer) {
        this._rawHeader = ipcPacketHeader_1.IpcPacketHeader.ReadHeader(new bufferReader_1.BufferReader(buffer));
        if (this._rawHeader.contentSize >= 0) {
            this._buffer = buffer;
            return true;
        }
        else {
            this._buffer = ipcPacketBufferCore_1.IpcPacketBufferCore.EmptyBuffer;
            return false;
        }
    }
    _parseReader() {
        const bufferReader = new bufferReader_1.BufferReader(this._buffer, this._rawHeader.headerSize);
        return bufferReader;
    }
    serialize(data) {
        const writer = new bufferListWriter_1.BufferListWriter();
        this.write(writer, data);
        this._buffer = writer.buffer;
    }
}
exports.IpcPacketBuffer = IpcPacketBuffer;

}).call(this)}).call(this,require("buffer").Buffer)
},{"../buffer/bufferListWriter":67,"../buffer/bufferReader":68,"./ipcPacketBufferCore":74,"./ipcPacketHeader":77,"buffer":4}],74:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcPacketBufferCore = void 0;
const bufferWriterSize_1 = require("../buffer/bufferWriterSize");
const ipcPacketCore_1 = require("./ipcPacketCore");
const ipcPacketWriterSize_1 = require("./ipcPacketWriterSize");
class IpcPacketBufferCore extends ipcPacketCore_1.IpcPacketCore {
    constructor(rawHeader) {
        super(rawHeader);
    }
    bytelength(data) {
        const writer = new bufferWriterSize_1.BufferWriterSize();
        const packetBufferSize = new ipcPacketWriterSize_1.IpcPacketWriterSize();
        packetBufferSize.write(writer, data);
        return writer.length;
    }
    parse() {
        return this._reader.readContent(this._parseReader(), this._rawHeader.type, this._rawHeader.contentSize);
    }
    parseArrayLength() {
        const bufferReader = this._parseReader();
        return this._reader.readContentArrayLength(bufferReader);
    }
    parseArrayAt(index) {
        const bufferReader = this._parseReader();
        return this._reader.readContentArrayAt(bufferReader, index);
    }
    parseArraySlice(start, end) {
        const bufferReader = this._parseReader();
        return this._reader.readContentArraySlice(bufferReader, start, end);
    }
}
exports.IpcPacketBufferCore = IpcPacketBufferCore;
IpcPacketBufferCore.EmptyBuffer = Buffer.allocUnsafe(0);

}).call(this)}).call(this,require("buffer").Buffer)
},{"../buffer/bufferWriterSize":70,"./ipcPacketCore":76,"./ipcPacketWriterSize":81,"buffer":4}],75:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcPacketBufferList = void 0;
const bufferReader_1 = require("../buffer/bufferReader");
const bufferListReader_1 = require("../buffer/bufferListReader");
const bufferListWriter_1 = require("../buffer/bufferListWriter");
const ipcPacketBufferCore_1 = require("./ipcPacketBufferCore");
const ipcPacketHeader_1 = require("./ipcPacketHeader");
class IpcPacketBufferList extends ipcPacketBufferCore_1.IpcPacketBufferCore {
    constructor(rawHeader) {
        super(rawHeader);
        if (rawHeader) {
            if (rawHeader.buffer) {
                this._buffers = [rawHeader.buffer];
            }
            else if (rawHeader.buffers) {
                this._buffers = rawHeader.buffers;
            }
        }
        this._buffers = this._buffers || [];
    }
    reset() {
        super.reset();
        this._buffers = [];
    }
    get buffers() {
        return this._buffers;
    }
    get buffer() {
        const buffer = this._singleBufferAvailable();
        if (buffer) {
            return buffer;
        }
        this._buffers = [Buffer.concat(this._buffers)];
        return this._buffers[0];
    }
    _singleBufferAvailable() {
        if (this._buffers.length === 1) {
            return this._buffers[0];
        }
        if (this._buffers.length === 0) {
            return ipcPacketBufferCore_1.IpcPacketBufferCore.EmptyBuffer;
        }
        return null;
    }
    setRawData(rawHeader) {
        super.setRawData(rawHeader);
        if (rawHeader) {
            if (rawHeader.buffer) {
                this._buffers = [rawHeader.buffer];
            }
            else if (rawHeader.buffers) {
                this._buffers = rawHeader.buffers;
            }
        }
        this._buffers = this._buffers || [];
    }
    getRawData() {
        const rawHeader = Object.assign({}, this._rawHeader);
        const buffer = this._singleBufferAvailable();
        if (buffer) {
            rawHeader.buffer = buffer;
        }
        else {
            rawHeader.buffers = this._buffers;
        }
        return rawHeader;
    }
    decodeFromReader(bufferReader) {
        const context = bufferReader.getContext();
        this._rawHeader = ipcPacketHeader_1.IpcPacketHeader.ReadHeader(bufferReader);
        bufferReader.setContext(context);
        if (this._rawHeader.contentSize >= 0) {
            this._buffers = bufferReader.readBufferList(this.packetSize);
            return true;
        }
        else {
            this._buffers = [];
            return false;
        }
    }
    decodeFromBuffer(buffer) {
        this._rawHeader = ipcPacketHeader_1.IpcPacketHeader.ReadHeader(new bufferReader_1.BufferReader(buffer));
        if (this._rawHeader.contentSize >= 0) {
            this._buffers = [buffer];
            return true;
        }
        else {
            this._buffers = [];
            return false;
        }
    }
    _parseReader() {
        const buffer = this._singleBufferAvailable();
        const bufferReader = buffer ? new bufferReader_1.BufferReader(buffer, this._rawHeader.headerSize) : new bufferListReader_1.BufferListReader(this._buffers, this._rawHeader.headerSize);
        return bufferReader;
    }
    serialize(data) {
        const writer = new bufferListWriter_1.BufferListWriter();
        this.write(writer, data);
        this._buffers = writer.buffers;
    }
}
exports.IpcPacketBufferList = IpcPacketBufferList;

}).call(this)}).call(this,require("buffer").Buffer)
},{"../buffer/bufferListReader":66,"../buffer/bufferListWriter":67,"../buffer/bufferReader":68,"./ipcPacketBufferCore":74,"./ipcPacketHeader":77,"buffer":4}],76:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcPacketCore = void 0;
const ipcPacketReader_1 = require("./ipcPacketReader");
const ipcPacketWriter_1 = require("./ipcPacketWriter");
const ipcPacketHeader_1 = require("./ipcPacketHeader");
class IpcPacketCore extends ipcPacketHeader_1.IpcPacketHeader {
    constructor(rawHeader) {
        super(rawHeader);
        this._reader = new ipcPacketReader_1.IpcPacketReader();
        this._writer = new ipcPacketWriter_1.IpcPacketWriter();
    }
    get JSON() {
        return this._reader.JSON;
    }
    set JSON(json) {
        this._reader.JSON = json;
        this._writer.JSON = json;
    }
    read(bufferReader) {
        return this._reader.read(bufferReader, (rawHeader) => {
            this._rawHeader = rawHeader;
        });
    }
    write(bufferWriter, data) {
        this._writer.write(bufferWriter, data, (rawHeader) => {
            this._rawHeader = rawHeader;
        });
    }
}
exports.IpcPacketCore = IpcPacketCore;

},{"./ipcPacketHeader":77,"./ipcPacketReader":79,"./ipcPacketWriter":80}],77:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcPacketHeader = exports.MapShortCodeToArrayBuffer = exports.MapArrayBufferToShortCodes = exports.IpcPacketType = exports.ZeroContentSize = exports.IntegerContentSize = exports.DoubleContentSize = exports.DynamicHeaderSize = exports.ArrayFieldSize = exports.ContentFieldSize = exports.FixedHeaderSize = exports.FooterLength = exports.FooterSeparator = exports.HeaderSeparator = void 0;
exports.HeaderSeparator = '['.charCodeAt(0);
exports.FooterSeparator = ']'.charCodeAt(0);
exports.FooterLength = 1;
exports.FixedHeaderSize = 2;
exports.ContentFieldSize = 4;
exports.ArrayFieldSize = 4;
exports.DynamicHeaderSize = exports.FixedHeaderSize + exports.ContentFieldSize;
exports.DoubleContentSize = 8;
exports.IntegerContentSize = 4;
exports.ZeroContentSize = 0;
function BufferTypeHeader(type) {
    return (type.charCodeAt(0) << 8) + exports.HeaderSeparator;
}
var IpcPacketType;
(function (IpcPacketType) {
    IpcPacketType[IpcPacketType["NotValid"] = BufferTypeHeader('X')] = "NotValid";
    IpcPacketType[IpcPacketType["PartialHeader"] = BufferTypeHeader('p')] = "PartialHeader";
    IpcPacketType[IpcPacketType["PositiveInteger"] = BufferTypeHeader('+')] = "PositiveInteger";
    IpcPacketType[IpcPacketType["NegativeInteger"] = BufferTypeHeader('-')] = "NegativeInteger";
    IpcPacketType[IpcPacketType["ArrayWithSize"] = BufferTypeHeader('A')] = "ArrayWithSize";
    IpcPacketType[IpcPacketType["Buffer"] = BufferTypeHeader('B')] = "Buffer";
    IpcPacketType[IpcPacketType["ArrayBufferWithSize"] = BufferTypeHeader('C')] = "ArrayBufferWithSize";
    IpcPacketType[IpcPacketType["Date"] = BufferTypeHeader('D')] = "Date";
    IpcPacketType[IpcPacketType["BooleanFalse"] = BufferTypeHeader('F')] = "BooleanFalse";
    IpcPacketType[IpcPacketType["Null"] = BufferTypeHeader('N')] = "Null";
    IpcPacketType[IpcPacketType["Object"] = BufferTypeHeader('O')] = "Object";
    IpcPacketType[IpcPacketType["BooleanTrue"] = BufferTypeHeader('T')] = "BooleanTrue";
    IpcPacketType[IpcPacketType["Undefined"] = BufferTypeHeader('U')] = "Undefined";
    IpcPacketType[IpcPacketType["Double"] = BufferTypeHeader('d')] = "Double";
    IpcPacketType[IpcPacketType["ObjectSTRINGIFY"] = BufferTypeHeader('o')] = "ObjectSTRINGIFY";
    IpcPacketType[IpcPacketType["String"] = BufferTypeHeader('s')] = "String";
})(IpcPacketType = exports.IpcPacketType || (exports.IpcPacketType = {}));
;
;
exports.MapArrayBufferToShortCodes = {
    'Uint8Array': {
        ctor: Uint8Array,
        shortCode: 1
    },
    'Uint8ClampedArray': {
        ctor: Uint8ClampedArray,
        shortCode: 2
    },
    'Uint16Array': {
        ctor: Uint16Array,
        shortCode: 3
    },
    'Uint32Array': {
        ctor: Uint32Array,
        shortCode: 4
    },
    'Int8Array': {
        ctor: Int8Array,
        shortCode: 5
    },
    'Int16Array': {
        ctor: Int16Array,
        shortCode: 6
    },
    'Int32Array': {
        ctor: Int32Array,
        shortCode: 8
    },
    'BigInt64Array': {
        ctor: BigInt64Array,
        shortCode: 9
    },
    'BigUint64Array': {
        ctor: BigUint64Array,
        shortCode: 10
    },
    'BigUint64Float32ArrayArray': {
        ctor: Float32Array,
        shortCode: 11
    },
    'Float64Array': {
        ctor: Float64Array,
        shortCode: 12
    },
};
exports.MapShortCodeToArrayBuffer = (() => {
    const mapShortCodeToTypedArray = {};
    Object.entries(exports.MapArrayBufferToShortCodes).forEach(([key, value]) => {
        mapShortCodeToTypedArray[value.shortCode] = value;
    });
    return mapShortCodeToTypedArray;
})();
const InvalidRawHeader = {
    type: IpcPacketType.NotValid,
    headerSize: -1,
    contentSize: -1
};
class IpcPacketHeader {
    constructor(rawHeader) {
        if (rawHeader) {
            this._rawHeader = rawHeader;
        }
        else {
            this._rawHeader = Object.assign({}, InvalidRawHeader);
        }
    }
    reset() {
        Object.assign(this._rawHeader, InvalidRawHeader);
    }
    setRawData(rawHeader) {
        this._rawHeader = rawHeader;
    }
    getRawData() {
        return this._rawHeader;
    }
    get type() {
        return this._rawHeader.type;
    }
    get packetSize() {
        return this._rawHeader.contentSize + (this._rawHeader.headerSize + exports.FooterLength);
    }
    get contentSize() {
        return this._rawHeader.contentSize;
    }
    get footerSize() {
        return exports.FooterLength;
    }
    get headerSize() {
        return this._rawHeader.headerSize;
    }
    isNotValid() {
        return (this._rawHeader.type === IpcPacketType.NotValid);
    }
    isComplete() {
        return (this._rawHeader.type !== IpcPacketType.NotValid) && (this._rawHeader.type !== IpcPacketType.PartialHeader);
    }
    isNull() {
        return (this._rawHeader.type === IpcPacketType.Null);
    }
    isUndefined() {
        return (this._rawHeader.type === IpcPacketType.Undefined);
    }
    isArray() {
        return (this._rawHeader.type === IpcPacketType.ArrayWithSize);
    }
    isObject() {
        return (this._rawHeader.type === IpcPacketType.ObjectSTRINGIFY);
    }
    isString() {
        return (this._rawHeader.type === IpcPacketType.String);
    }
    isBuffer() {
        return (this._rawHeader.type === IpcPacketType.Buffer);
    }
    isDate() {
        return (this._rawHeader.type === IpcPacketType.Date);
    }
    isNumber() {
        switch (this._rawHeader.type) {
            case IpcPacketType.NegativeInteger:
            case IpcPacketType.PositiveInteger:
            case IpcPacketType.Double:
                return true;
            default:
                return false;
        }
    }
    isBoolean() {
        switch (this._rawHeader.type) {
            case IpcPacketType.BooleanTrue:
            case IpcPacketType.BooleanFalse:
                return true;
            default:
                return false;
        }
    }
    isFixedSize() {
        return (this._rawHeader.headerSize === exports.FixedHeaderSize);
    }
    static DeclareHeader(type, contentSize) {
        switch (type) {
            case IpcPacketType.Date:
            case IpcPacketType.Double:
                return {
                    type,
                    headerSize: exports.FixedHeaderSize,
                    contentSize: exports.DoubleContentSize
                };
            case IpcPacketType.NegativeInteger:
            case IpcPacketType.PositiveInteger:
                return {
                    type,
                    headerSize: exports.FixedHeaderSize,
                    contentSize: exports.IntegerContentSize
                };
            case IpcPacketType.BooleanTrue:
            case IpcPacketType.BooleanFalse:
            case IpcPacketType.Null:
            case IpcPacketType.Undefined:
                return {
                    type,
                    headerSize: exports.FixedHeaderSize,
                    contentSize: exports.ZeroContentSize
                };
            case IpcPacketType.ObjectSTRINGIFY:
            case IpcPacketType.String:
            case IpcPacketType.Buffer:
            case IpcPacketType.ArrayWithSize:
            case IpcPacketType.ArrayBufferWithSize:
                return {
                    type,
                    headerSize: exports.DynamicHeaderSize,
                    contentSize
                };
            case IpcPacketType.PartialHeader:
            case IpcPacketType.NotValid:
                return Object.assign({}, InvalidRawHeader);
            default:
                return Object.assign({}, InvalidRawHeader);
        }
    }
    static ReadHeader(bufferReader) {
        if (bufferReader.checkEOF(exports.FixedHeaderSize)) {
            return IpcPacketHeader.DeclareHeader(IpcPacketType.PartialHeader, -1);
        }
        const rawHeader = IpcPacketHeader.DeclareHeader(bufferReader.readUInt16(), -1);
        if (rawHeader.type === IpcPacketType.NotValid) {
            return rawHeader;
        }
        if (rawHeader.headerSize === exports.DynamicHeaderSize) {
            if (bufferReader.checkEOF(exports.ContentFieldSize)) {
                return IpcPacketHeader.DeclareHeader(IpcPacketType.PartialHeader, -1);
            }
            rawHeader.contentSize = bufferReader.readUInt32();
        }
        if (bufferReader.checkEOF(rawHeader.contentSize + exports.FooterLength)) {
            return IpcPacketHeader.DeclareHeader(IpcPacketType.PartialHeader, -1);
        }
        return rawHeader;
    }
}
exports.IpcPacketHeader = IpcPacketHeader;

},{}],78:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcPacketJSON = void 0;
const json_helpers_1 = require("json-helpers");
class IpcPacketJSON {
    constructor() {
        this._json = json_helpers_1.JSONParserV1;
    }
    get JSON() {
        return this._json;
    }
    set JSON(json) {
        this._json = (0, json_helpers_1.IsJSONLike)(json) ? json : json_helpers_1.JSONParserV1;
    }
}
exports.IpcPacketJSON = IpcPacketJSON;

},{"json-helpers":62}],79:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcPacketReader = void 0;
const ipcPacketHeader_1 = require("./ipcPacketHeader");
const ipcPacketJSON_1 = require("./ipcPacketJSON");
class IpcPacketReader extends ipcPacketJSON_1.IpcPacketJSON {
    constructor() {
        super();
    }
    read(bufferReader, cb) {
        const rawHeader = ipcPacketHeader_1.IpcPacketHeader.ReadHeader(bufferReader);
        if (rawHeader.contentSize >= 0) {
            const arg = this.readContent(bufferReader, rawHeader.type, rawHeader.contentSize);
            bufferReader.skip(ipcPacketHeader_1.FooterLength);
            if (cb)
                cb(rawHeader, arg);
            return arg;
        }
        if (cb)
            cb(rawHeader);
        return undefined;
    }
    _read(bufferReader) {
        const rawHeader = ipcPacketHeader_1.IpcPacketHeader.ReadHeader(bufferReader);
        if (rawHeader.contentSize >= 0) {
            const arg = this.readContent(bufferReader, rawHeader.type, rawHeader.contentSize);
            bufferReader.skip(ipcPacketHeader_1.FooterLength);
            return arg;
        }
        return undefined;
    }
    readContent(bufferReader, type, contentSize) {
        switch (type) {
            case ipcPacketHeader_1.IpcPacketType.String:
                return this._readContentString(bufferReader, contentSize);
            case ipcPacketHeader_1.IpcPacketType.Buffer:
                return bufferReader.readBuffer(contentSize);
            case ipcPacketHeader_1.IpcPacketType.Double:
                return bufferReader.readDouble();
            case ipcPacketHeader_1.IpcPacketType.NegativeInteger:
                return -bufferReader.readUInt32();
            case ipcPacketHeader_1.IpcPacketType.PositiveInteger:
                return +bufferReader.readUInt32();
            case ipcPacketHeader_1.IpcPacketType.BooleanTrue:
                return true;
            case ipcPacketHeader_1.IpcPacketType.BooleanFalse:
                return false;
            case ipcPacketHeader_1.IpcPacketType.Date:
                return new Date(bufferReader.readDouble());
            case ipcPacketHeader_1.IpcPacketType.ArrayWithSize:
                return this._readContentArray(bufferReader);
            case ipcPacketHeader_1.IpcPacketType.ArrayBufferWithSize:
                return this._readContentAnyArrayBuffer(bufferReader, contentSize);
            case ipcPacketHeader_1.IpcPacketType.ObjectSTRINGIFY:
                return this._readContentObject(bufferReader, contentSize);
            case ipcPacketHeader_1.IpcPacketType.Null:
                return null;
            case ipcPacketHeader_1.IpcPacketType.Undefined:
                return undefined;
            default:
                return undefined;
        }
    }
    _readContentString(bufferReader, contentSize) {
        return bufferReader.readString('utf8', contentSize);
    }
    _readContentObject(bufferReader, contentSize) {
        const data = bufferReader.readString('utf8', contentSize);
        return this._json.parse(data);
    }
    _readContentAnyArrayBuffer(bufferReader, contentSize) {
        const shortCode = bufferReader.readByte();
        const arrayBuffer = bufferReader.readArrayBuffer(contentSize - 1);
        if (shortCode === 0) {
            return arrayBuffer;
        }
        const typedArrayDef = ipcPacketHeader_1.MapShortCodeToArrayBuffer[shortCode];
        if (typedArrayDef == null) {
            return undefined;
        }
        return new typedArrayDef.ctor(arrayBuffer);
    }
    _readContentArray(bufferReader) {
        const argsLen = bufferReader.readUInt32();
        const args = new Array(argsLen);
        let argIndex = 0;
        while (argIndex < argsLen) {
            const arg = this._read(bufferReader);
            args[argIndex++] = arg;
        }
        return args;
    }
    readContentArrayLength(bufferReader) {
        return bufferReader.readUInt32();
    }
    _byPass(bufferReader) {
        const rawHeader = ipcPacketHeader_1.IpcPacketHeader.ReadHeader(bufferReader);
        if (rawHeader.contentSize >= 0) {
            bufferReader.skip(rawHeader.contentSize + ipcPacketHeader_1.FooterLength);
            return true;
        }
        return false;
    }
    readContentArrayAt(bufferReader, index) {
        const argsLen = bufferReader.readUInt32();
        if (index >= argsLen) {
            return undefined;
        }
        while (index > 0) {
            if (this._byPass(bufferReader) === false) {
                return undefined;
            }
            --index;
        }
        return this._read(bufferReader);
    }
    readContentArraySlice(bufferReader, start, end) {
        const argsLen = bufferReader.readUInt32();
        if (start == null) {
            start = 0;
        }
        else if (start < 0) {
            start = argsLen + start;
        }
        if (start >= argsLen) {
            return [];
        }
        if (end == null) {
            end = argsLen;
        }
        else if (end < 0) {
            end = argsLen + end;
        }
        else {
            end = Math.min(end, argsLen);
        }
        if (end <= start) {
            return [];
        }
        while (start > 0) {
            if (this._byPass(bufferReader) === false) {
                return undefined;
            }
            --start;
            --end;
        }
        const args = new Array(end);
        let argIndex = 0;
        while (argIndex < end) {
            const arg = this._read(bufferReader);
            args[argIndex++] = arg;
        }
        return args;
    }
}
exports.IpcPacketReader = IpcPacketReader;

},{"./ipcPacketHeader":77,"./ipcPacketJSON":78}],80:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcPacketWriter = exports.BufferNull = exports.BufferUndefined = exports.BufferBooleanFalse = exports.BufferBooleanTrue = exports.BufferFooter = void 0;
const util = require("util");
const whichTypedArray = require('which-typed-array');
const bufferListWriter_1 = require("../buffer/bufferListWriter");
const bufferWriter_1 = require("../buffer/bufferWriter");
const ipcPacketHeader_1 = require("./ipcPacketHeader");
const ipcPacketHeader_2 = require("./ipcPacketHeader");
const ipcPacketHeader_3 = require("./ipcPacketHeader");
const ipcPacketJSON_1 = require("./ipcPacketJSON");
function CreateZeroSizeBuffer(bufferType) {
    const packetSize = ipcPacketHeader_1.FixedHeaderSize + ipcPacketHeader_1.FooterLength;
    const bufferWriterAllInOne = new bufferWriter_1.BufferWriter(Buffer.allocUnsafe(packetSize));
    bufferWriterAllInOne.writeUInt16(bufferType);
    bufferWriterAllInOne.writeByte(ipcPacketHeader_2.FooterSeparator);
    return bufferWriterAllInOne.buffer;
}
exports.BufferFooter = Buffer.allocUnsafe(1).fill(ipcPacketHeader_2.FooterSeparator);
exports.BufferBooleanTrue = CreateZeroSizeBuffer(ipcPacketHeader_1.IpcPacketType.BooleanTrue);
exports.BufferBooleanFalse = CreateZeroSizeBuffer(ipcPacketHeader_1.IpcPacketType.BooleanFalse);
exports.BufferUndefined = CreateZeroSizeBuffer(ipcPacketHeader_1.IpcPacketType.Undefined);
exports.BufferNull = CreateZeroSizeBuffer(ipcPacketHeader_1.IpcPacketType.Null);
class IpcPacketWriter extends ipcPacketJSON_1.IpcPacketJSON {
    constructor() {
        super();
    }
    _writeDynamicBuffer(writer, type, buffer, cb) {
        const contentSize = buffer.length;
        writer.pushContext();
        writer.writeUInt16(type);
        writer.writeUInt32(contentSize);
        writer.writeBuffer(buffer);
        writer.writeBuffer(exports.BufferFooter);
        writer.popContext();
        if (cb) {
            cb({
                type,
                headerSize: ipcPacketHeader_1.DynamicHeaderSize,
                contentSize
            });
        }
    }
    _writeDynamicContent(writer, type, writerContent, cb) {
        const contentSize = writerContent.length;
        writer.pushContext();
        writer.writeUInt16(type);
        writer.writeUInt32(contentSize);
        writer.write(writerContent);
        writer.writeBuffer(exports.BufferFooter);
        writer.popContext();
        if (cb) {
            cb({
                type,
                headerSize: ipcPacketHeader_1.DynamicHeaderSize,
                contentSize
            });
        }
    }
    _writeFixedContent(writer, type, num, cb) {
        let packetBuffer;
        switch (type) {
            case ipcPacketHeader_1.IpcPacketType.NegativeInteger:
            case ipcPacketHeader_1.IpcPacketType.PositiveInteger: {
                const packetSize = ipcPacketHeader_1.FixedHeaderSize + ipcPacketHeader_3.IntegerContentSize + ipcPacketHeader_1.FooterLength;
                const bufferWriterAllInOne = new bufferWriter_1.BufferWriter(Buffer.allocUnsafe(packetSize));
                bufferWriterAllInOne.writeUInt16(type);
                bufferWriterAllInOne.writeUInt32(num);
                bufferWriterAllInOne.writeByte(ipcPacketHeader_2.FooterSeparator);
                packetBuffer = bufferWriterAllInOne.buffer;
                break;
            }
            case ipcPacketHeader_1.IpcPacketType.Double:
            case ipcPacketHeader_1.IpcPacketType.Date: {
                const packetSize = ipcPacketHeader_1.FixedHeaderSize + ipcPacketHeader_3.DoubleContentSize + ipcPacketHeader_1.FooterLength;
                const bufferWriterAllInOne = new bufferWriter_1.BufferWriter(Buffer.allocUnsafe(packetSize));
                bufferWriterAllInOne.writeUInt16(type);
                bufferWriterAllInOne.writeDouble(num);
                bufferWriterAllInOne.writeByte(ipcPacketHeader_2.FooterSeparator);
                packetBuffer = bufferWriterAllInOne.buffer;
                break;
            }
            case ipcPacketHeader_1.IpcPacketType.Null:
                packetBuffer = exports.BufferNull;
                break;
            case ipcPacketHeader_1.IpcPacketType.Undefined:
                packetBuffer = exports.BufferUndefined;
                break;
            case ipcPacketHeader_1.IpcPacketType.BooleanFalse:
                packetBuffer = exports.BufferBooleanFalse;
                break;
            case ipcPacketHeader_1.IpcPacketType.BooleanTrue:
                packetBuffer = exports.BufferBooleanTrue;
                break;
        }
        writer.pushContext();
        writer.writeBuffer(packetBuffer);
        writer.popContext();
        if (cb) {
            cb({
                type,
                headerSize: ipcPacketHeader_1.FixedHeaderSize,
                contentSize: packetBuffer.length - ipcPacketHeader_1.FixedHeaderSize - ipcPacketHeader_1.FooterLength
            });
        }
    }
    write(bufferWriter, data, cb) {
        switch (typeof data) {
            case 'object':
                if (data === null) {
                    this._writeFixedContent(bufferWriter, ipcPacketHeader_1.IpcPacketType.Null, undefined, cb);
                }
                else if (Buffer.isBuffer(data)) {
                    this._writeDynamicBuffer(bufferWriter, ipcPacketHeader_1.IpcPacketType.Buffer, data, cb);
                }
                else if (Array.isArray(data)) {
                    this._writeArray(bufferWriter, data, cb);
                }
                else if (util.types.isDate(data)) {
                    this._writeDate(bufferWriter, data, cb);
                }
                else if (util.types.isArrayBuffer(data)) {
                    this._writeArrayBuffer(bufferWriter, data, cb);
                }
                else if (util.types.isTypedArray(data)) {
                    this._writeTypedArray(bufferWriter, data, cb);
                }
                else {
                    this._writeObject(bufferWriter, data, cb);
                }
                break;
            case 'string':
                this._writeString(bufferWriter, data, cb);
                break;
            case 'number':
                this._writeNumber(bufferWriter, data, cb);
                break;
            case 'boolean':
                this._writeFixedContent(bufferWriter, data ? ipcPacketHeader_1.IpcPacketType.BooleanTrue : ipcPacketHeader_1.IpcPacketType.BooleanFalse, undefined, cb);
                break;
            case 'undefined':
                this._writeFixedContent(bufferWriter, ipcPacketHeader_1.IpcPacketType.Undefined, undefined, cb);
                break;
            case 'symbol':
            default:
                break;
        }
    }
    _writeNumber(bufferWriter, dataNumber, cb) {
        if (Number.isInteger(dataNumber)) {
            const absDataNumber = Math.abs(dataNumber);
            if (absDataNumber <= 0xFFFFFFFF) {
                if (dataNumber < 0) {
                    this._writeFixedContent(bufferWriter, ipcPacketHeader_1.IpcPacketType.NegativeInteger, absDataNumber, cb);
                }
                else {
                    this._writeFixedContent(bufferWriter, ipcPacketHeader_1.IpcPacketType.PositiveInteger, absDataNumber, cb);
                }
                return;
            }
        }
        this._writeFixedContent(bufferWriter, ipcPacketHeader_1.IpcPacketType.Double, dataNumber, cb);
    }
    _writeDate(bufferWriter, data, cb) {
        this._writeFixedContent(bufferWriter, ipcPacketHeader_1.IpcPacketType.Date, data.getTime(), cb);
    }
    _writeString(bufferWriter, data, cb) {
        const buffer = Buffer.from(data, 'utf8');
        this._writeDynamicBuffer(bufferWriter, ipcPacketHeader_1.IpcPacketType.String, buffer, cb);
    }
    _writeObject(bufferWriter, dataObject, cb) {
        const stringifycation = this._json.stringify(dataObject);
        const buffer = Buffer.from(stringifycation, 'utf8');
        this._writeDynamicBuffer(bufferWriter, ipcPacketHeader_1.IpcPacketType.ObjectSTRINGIFY, buffer, cb);
    }
    _writeArray(bufferWriter, args, cb) {
        const contentWriter = new bufferListWriter_1.BufferListWriter();
        contentWriter.writeUInt32(args.length);
        for (let i = 0, l = args.length; i < l; ++i) {
            this.write(contentWriter, args[i]);
        }
        this._writeDynamicContent(bufferWriter, ipcPacketHeader_1.IpcPacketType.ArrayWithSize, contentWriter, cb);
    }
    _writeArrayBuffer(bufferWriter, data, cb) {
        const contentWriter = new bufferListWriter_1.BufferListWriter();
        contentWriter.writeByte(0);
        contentWriter.writeArrayBuffer(data);
        this._writeDynamicContent(bufferWriter, ipcPacketHeader_1.IpcPacketType.ArrayBufferWithSize, contentWriter, cb);
    }
    _writeTypedArray(bufferWriter, data, cb) {
        const shortCodeDef = ipcPacketHeader_1.MapArrayBufferToShortCodes[whichTypedArray(data)];
        if (shortCodeDef) {
            const contentWriter = new bufferListWriter_1.BufferListWriter();
            contentWriter.writeByte(shortCodeDef.shortCode);
            const arrayBuffer = data.buffer;
            contentWriter.writeArrayBuffer(arrayBuffer);
            this._writeDynamicContent(bufferWriter, ipcPacketHeader_1.IpcPacketType.ArrayBufferWithSize, contentWriter, cb);
        }
    }
}
exports.IpcPacketWriter = IpcPacketWriter;

}).call(this)}).call(this,require("buffer").Buffer)
},{"../buffer/bufferListWriter":67,"../buffer/bufferWriter":69,"./ipcPacketHeader":77,"./ipcPacketJSON":78,"buffer":4,"util":7,"which-typed-array":84}],81:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcPacketWriterSize = void 0;
const whichTypedArray = require('which-typed-array');
const ipcPacketHeader_1 = require("./ipcPacketHeader");
const ipcPacketHeader_2 = require("./ipcPacketHeader");
const ipcPacketWriter_1 = require("./ipcPacketWriter");
class IpcPacketWriterSize extends ipcPacketWriter_1.IpcPacketWriter {
    constructor() {
        super();
    }
    _writeDynamicContent(writer, type, writerContent, cb) {
        throw 'not supported';
    }
    _writeFixedContent(writer, type, num, cb) {
        const len = writer.length;
        switch (type) {
            case ipcPacketHeader_1.IpcPacketType.NegativeInteger:
            case ipcPacketHeader_1.IpcPacketType.PositiveInteger: {
                writer.writeUInt16(type);
                writer.writeUInt32(num);
                writer.writeByte(ipcPacketHeader_2.FooterSeparator);
                break;
            }
            case ipcPacketHeader_1.IpcPacketType.Double:
            case ipcPacketHeader_1.IpcPacketType.Date: {
                writer.writeUInt16(type);
                writer.writeDouble(num);
                writer.writeByte(ipcPacketHeader_2.FooterSeparator);
                break;
            }
            case ipcPacketHeader_1.IpcPacketType.Null:
                writer.writeBuffer(ipcPacketWriter_1.BufferNull);
                break;
            case ipcPacketHeader_1.IpcPacketType.Undefined:
                writer.writeBuffer(ipcPacketWriter_1.BufferUndefined);
                break;
            case ipcPacketHeader_1.IpcPacketType.BooleanFalse:
                writer.writeBuffer(ipcPacketWriter_1.BufferBooleanFalse);
                break;
            case ipcPacketHeader_1.IpcPacketType.BooleanTrue:
                writer.writeBuffer(ipcPacketWriter_1.BufferBooleanTrue);
                break;
        }
        if (cb) {
            cb({
                type,
                headerSize: ipcPacketHeader_1.FixedHeaderSize,
                contentSize: (writer.length - len) - ipcPacketHeader_1.FixedHeaderSize - ipcPacketHeader_1.FooterLength
            });
        }
    }
    _writeString(bufferWriter, data, cb) {
        const len = bufferWriter.length;
        bufferWriter.writeUInt16(ipcPacketHeader_1.IpcPacketType.String);
        bufferWriter.writeUInt32(0);
        bufferWriter.writeString(data);
        bufferWriter.writeByte(ipcPacketHeader_2.FooterSeparator);
        if (cb) {
            cb({
                type: ipcPacketHeader_1.IpcPacketType.String,
                headerSize: ipcPacketHeader_1.FixedHeaderSize,
                contentSize: (bufferWriter.length - len) - ipcPacketHeader_1.DynamicHeaderSize - ipcPacketHeader_1.FooterLength
            });
        }
    }
    _writeObject(bufferWriter, dataObject, cb) {
        const stringifycation = this._json.stringify(dataObject);
        const len = bufferWriter.length;
        bufferWriter.writeUInt16(ipcPacketHeader_1.IpcPacketType.ObjectSTRINGIFY);
        bufferWriter.writeUInt32(0);
        bufferWriter.writeString(stringifycation);
        bufferWriter.writeByte(ipcPacketHeader_2.FooterSeparator);
        if (cb) {
            cb({
                type: ipcPacketHeader_1.IpcPacketType.ObjectSTRINGIFY,
                headerSize: ipcPacketHeader_1.DynamicHeaderSize,
                contentSize: (bufferWriter.length - len) - ipcPacketHeader_1.DynamicHeaderSize - ipcPacketHeader_1.FooterLength
            });
        }
    }
    _writeArray(bufferWriter, args, cb) {
        const len = bufferWriter.length;
        bufferWriter.writeUInt16(ipcPacketHeader_1.IpcPacketType.ArrayWithSize);
        bufferWriter.writeUInt32(0);
        bufferWriter.writeUInt32(args.length);
        for (let i = 0, l = args.length; i < l; ++i) {
            this.write(bufferWriter, args[i]);
        }
        bufferWriter.writeByte(ipcPacketHeader_2.FooterSeparator);
        if (cb) {
            cb({
                type: ipcPacketHeader_1.IpcPacketType.ArrayWithSize,
                headerSize: ipcPacketHeader_1.DynamicHeaderSize,
                contentSize: (bufferWriter.length - len) - ipcPacketHeader_1.DynamicHeaderSize - ipcPacketHeader_1.FooterLength
            });
        }
    }
    _writeArrayBuffer(bufferWriter, data, cb) {
        const len = bufferWriter.length;
        bufferWriter.writeUInt16(ipcPacketHeader_1.IpcPacketType.ArrayBufferWithSize);
        bufferWriter.writeUInt32(0);
        bufferWriter.writeByte(0);
        bufferWriter.writeArrayBuffer(data);
        bufferWriter.writeByte(ipcPacketHeader_2.FooterSeparator);
        if (cb) {
            cb({
                type: ipcPacketHeader_1.IpcPacketType.ArrayBufferWithSize,
                headerSize: ipcPacketHeader_1.DynamicHeaderSize,
                contentSize: (bufferWriter.length - len) - ipcPacketHeader_1.DynamicHeaderSize - ipcPacketHeader_1.FooterLength
            });
        }
    }
    _writeTypedArray(bufferWriter, data, cb) {
        const shortCodeDef = ipcPacketHeader_1.MapArrayBufferToShortCodes[whichTypedArray(data)];
        if (shortCodeDef) {
            const len = bufferWriter.length;
            bufferWriter.writeUInt16(ipcPacketHeader_1.IpcPacketType.ArrayBufferWithSize);
            bufferWriter.writeUInt32(0);
            bufferWriter.writeByte(shortCodeDef.shortCode);
            const arrayBuffer = data.buffer;
            bufferWriter.writeArrayBuffer(arrayBuffer);
            bufferWriter.writeByte(ipcPacketHeader_2.FooterSeparator);
            if (cb) {
                cb({
                    type: ipcPacketHeader_1.IpcPacketType.ArrayBufferWithSize,
                    headerSize: ipcPacketHeader_1.DynamicHeaderSize,
                    contentSize: (bufferWriter.length - len) - ipcPacketHeader_1.DynamicHeaderSize - ipcPacketHeader_1.FooterLength
                });
            }
        }
    }
}
exports.IpcPacketWriterSize = IpcPacketWriterSize;

},{"./ipcPacketHeader":77,"./ipcPacketWriter":80,"which-typed-array":84}],82:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./socket-serializer-common"), exports);

},{"./socket-serializer-common":83}],83:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferListReader = exports.BufferReader = exports.Reader = exports.BufferListWriter = exports.BufferWriter = void 0;
__exportStar(require("./packet/ipcPacketBuffer"), exports);
__exportStar(require("./packet/ipcPacketBufferList"), exports);
__exportStar(require("./packet/ipcPacketBufferCore"), exports);
__exportStar(require("./packet/ipcPacketCore"), exports);
__exportStar(require("./packet/ipcPacketReader"), exports);
__exportStar(require("./packet/ipcPacketWriter"), exports);
__exportStar(require("./packet/ipcPacketWriterSize"), exports);
__exportStar(require("./packet/ipcPacketHeader"), exports);
var bufferWriter_1 = require("./buffer/bufferWriter");
Object.defineProperty(exports, "BufferWriter", { enumerable: true, get: function () { return bufferWriter_1.BufferWriter; } });
var bufferListWriter_1 = require("./buffer/bufferListWriter");
Object.defineProperty(exports, "BufferListWriter", { enumerable: true, get: function () { return bufferListWriter_1.BufferListWriter; } });
var reader_1 = require("./buffer/reader");
Object.defineProperty(exports, "Reader", { enumerable: true, get: function () { return reader_1.Reader; } });
var bufferReader_1 = require("./buffer/bufferReader");
Object.defineProperty(exports, "BufferReader", { enumerable: true, get: function () { return bufferReader_1.BufferReader; } });
var bufferListReader_1 = require("./buffer/bufferListReader");
Object.defineProperty(exports, "BufferListReader", { enumerable: true, get: function () { return bufferListReader_1.BufferListReader; } });

},{"./buffer/bufferListReader":66,"./buffer/bufferListWriter":67,"./buffer/bufferReader":68,"./buffer/bufferWriter":69,"./buffer/reader":71,"./packet/ipcPacketBuffer":73,"./packet/ipcPacketBufferCore":74,"./packet/ipcPacketBufferList":75,"./packet/ipcPacketCore":76,"./packet/ipcPacketHeader":77,"./packet/ipcPacketReader":79,"./packet/ipcPacketWriter":80,"./packet/ipcPacketWriterSize":81}],84:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('for-each');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		if (typeof g[typedArray] === 'function') {
			var arr = new g[typedArray]();
			if (Symbol.toStringTag in arr) {
				var proto = getPrototypeOf(arr);
				var descriptor = gOPD(proto, Symbol.toStringTag);
				if (!descriptor) {
					var superProto = getPrototypeOf(proto);
					descriptor = gOPD(superProto, Symbol.toStringTag);
				}
				toStrTags[typedArray] = descriptor.get;
			}
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var foundName = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!foundName) {
			try {
				var name = getter.call(value);
				if (name === typedArray) {
					foundName = name;
				}
			} catch (e) {}
		}
	});
	return foundName;
};

var isTypedArray = require('is-typed-array');

module.exports = function whichTypedArray(value) {
	if (!isTypedArray(value)) { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) { return $slice($toString(value), 8, -1); }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":1,"call-bind/callBound":8,"es-abstract/helpers/getOwnPropertyDescriptor":38,"for-each":40,"has-tostringtag/shams":46,"is-typed-array":54}],85:[function(require,module,exports){
const electronCommonIPC = require("electron-common-ipc/lib/electron-common-ipc-preload");
electronCommonIPC.PreloadElectronCommonIpc();

window.electronCommonIPC = electronCommonIPC;
window.require = require;

},{"electron-common-ipc/lib/electron-common-ipc-preload":33}]},{},[85]);

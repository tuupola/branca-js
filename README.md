#  Branca

[![Latest Version](https://img.shields.io/npm/v/branca.svg?style=flat-square)](https://www.npmjs.com/package/branca)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Build Status](https://img.shields.io/travis/tuupola/branca-js/master.svg?style=flat-square)](https://travis-ci.org/tuupola/branca-js)
[![Coverage](http://img.shields.io/codecov/c/github/tuupola/branca-js.svg?style=flat-square)](https://codecov.io/github/tuupola/branca-js)

## What?

Branca allows you to generate and verify encrypted API tokens.
This specification defines the external format and encryption scheme of the
token to help interoperability between userland implementations. Branca is closely
based on [Fernet specification](https://github.com/fernet/spec/blob/master/Spec.md).

Payload in Branca token is an arbitrary sequence of bytes. This means payload can
be for example a JSON object, plain text string or even binary data serialized
by [MessagePack](http://msgpack.org/) or [Protocol Buffers](https://developers.google.com/protocol-buffers/).

## Install

Install the library using [Yarn](https://yarnpkg.com/en/) or [npm](https://www.npmjs.com/).

``` bash
$ yarn add branca
$ npm install branca
```

## Usage

Token payload can be any arbitrary data such as string containing an email
address.

```javascript
const key = "supersecretkeyyoushouldnotcommit";
const branca = require("branca")(key);

const token = branca.encode("tuupola@appelsiini.net");
console.log(token);

/*
TYfc6x7g8HiQf9HMkPwXC33UKwESCiBHrnVbb6AjDTaRR5oDxt3bK8kyiEyyc8HDqfnukQlMHT
*/

const payload = branca.decode(token);
console.log(payload.toString());

/* tuupola@appelsiini.net */

```

Sometimes you might prefer JSON.

```javascript
const key = "supersecretkeyyoushouldnotcommit";
const branca = require("branca")(key);
const json = JSON.stringify({"scope": ["read", "write", "delete"]});
const token = branca.encode(json);
console.log(token);

/*
3Gq57osRXk7UsZsqzLuLOoHYj2VgrGvhkETjZ4J1ftW7zhALYFUol2jDyxYtmrqJfi5DbKx7BqIptfeaoN2yadmJxSIx
*/

const payload = JSON.parse(branca.decode(token));
console.log(payload);

/* { scope: [ 'read', 'write', 'delete' ] } */
```

You can keep the token size small by using a space efficient serialization method such as [MessagePack](http://msgpack.org/) or [Protocol Buffers](https://developers.google.com/protocol-buffers/).

```javascript
const key = "supersecretkeyyoushouldnotcommit";
const branca = require("branca")(key);
const msgpack = require("msgpack5")();

const packed = msgpack.encode({"scope": ["read", "write", "delete"]});
const token = branca.encode(packed);
console.log(token);

/*
2EZpow8Nwk6Z9UxMel3kzFUe5boHV480zwkZDp6hNgaatnOCt4YbqgCRICKnm7IfJgxzQpT9eYdrTzyb
*/

const binary = branca.decode(token);
const payload = msgpack.decode(Buffer.from(binary));
console.log(payload);

/* { scope: [ 'read', 'write', 'delete' ] } */
```

## Testing

You can run tests manually with the following command.

``` bash
$ node test.js
```

## Token Format

Branca token consists of header, ciphertext and an authentication tag. Header
consists of version, timestamp and nonce. Putting them all together we get
following structure.

```
Version (1B) || Timestamp (4B) || Nonce (24B) || Ciphertext (*B) || Tag (16B)
```

String representation of the above binary token must use base62 encoding with
the following character set.

```
0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy
```

### Version

Version is 8 bits ie. one byte. Currently the only version is `0xBA`. This is a
magic byte which you can use to quickly identify a given token. Version number
guarantees the token format and encryption algorithm.

### Timestamp

Timestamp is 32 bits ie. unsigned big endian 4 byte UNIX timestamp. By having a
timestamp instead of expiration time enables the consuming side to decide how
long tokens are valid. You cannot accidentaly create tokens which are valid for
the next 10 years.

Storing timestamp as unsigned integer allows us to avoid 2038 problem. Unsigned
integer overflow will happen in year 2106.

### Nonce

Nonce is 192 bits ie. 24 bytes. These should be cryptographically secure random
bytes and never reused between tokens.

### Ciphertext

Payload is encrypted and authenticated using [IETF XChaCha20-Poly1305](https://download.libsodium.org/doc/secret-key_cryptography/xchacha20-poly1305_construction.html).
Note that this is [Authenticated Encryption with Additional Data (AEAD)](https://tools.ietf.org/html/rfc7539#section-2.8) where the
he header part of the token is the additional data. This means the data in the
header (version, timestamp and nonce) is not encrypted, it is only
authenticated. In laymans terms, header can be seen but it cannot be tampered.

### Tag

The authentication tag is 128 bits ie. 16 bytes. This is the
[Poly1305](https://en.wikipedia.org/wiki/Poly1305) message authentication
code. It is used to make sure that the payload, as well as the
non-encrypted header has not been tampered with.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

If you discover any security related issues, please email tuupola@appelsiini.net instead of using the issue tracker.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

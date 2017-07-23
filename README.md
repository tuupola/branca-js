#  Branca

[![Latest Version](https://img.shields.io/npm/v/branca.svg?style=flat-square)](https://www.npmjs.com/package/branca)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Build Status](https://img.shields.io/travis/tuupola/branca-js/master.svg?style=flat-square)](https://travis-ci.org/tuupola/branca-js)[![Coverage](http://img.shields.io/codecov/c/github/tuupola/branca-js.svg?style=flat-square)](https://codecov.io/github/tuupola/branca-js)

## What?

Branca allows you to generate and verify encrypted authentication tokens. It
defines the external format and encryption scheme of the token. Branca is based on
[Fernet specification](https://github.com/fernet/spec/blob/master/Spec.md). Payload in Branca token is an arbitrary sequence of bytes. Payload can be for example
a JSON object, plain text string or even binary data serialized by [MessagePack](http://msgpack.org/) or [Protocol Buffers](https://developers.google.com/protocol-buffers/).

## Install

Install the library using [Yarn](https://yarnpkg.com/en/) or [npm](https://www.npmjs.com/).

``` bash
$ yarn add branca
$ npm install branca
```

## Token Format

A Branca token is a base62 encoded concatenation of a header, ciphertext and
authentication tag (MAC). Header consists of version, timestamp and nonce.
Putting them all together we get the structure below.

```
Version || Timestamp || Nonce || Ciphertext || MAC
```

### Version

Version is 8 bits ie. one byte. Currently the only version is `0xBA`. This is a
magic byte which you can use to quickly identify a given token. Version number
guarantees the token format and encryption algorithm.

### Timestamp

Timestamp is 32 bits ie. standard 4 byte UNIX timestamp.

### Nonce

Nonce is 96 bits ie. 12 bytes. These should be cryptographically secure random bytes
and never reused between tokens.

### Ciphertext

Payload is encrypted and authenticated using [IETF ChaCha20-Poly1305](https://download.libsodium.org/doc/secret-key_cryptography/chacha20-poly1305.html).
Note that this is Authenticated Encryption with Additional Data (AEAD) where the
he header part of the token is the additional data. This means the data in the
header (`version`, `timestamp` and `nonce`) is not encrypted, it is only
authenticated. In laymans terms, header can be seen but it cannot be tampered.

### MAC

The authentication tag is 128 bits ie. 16 bytes. This is the
[Poly1305](https://en.wikipedia.org/wiki/Poly1305) message authentication
code (MAC). It is used to make sure that the message, as well as the
non-encrypted header has not been tampered with.

## Usage

Token payload can be any arbitrary data such as string containing an email
address.

```javascript
const key = "supersecretkeyyoushouldnotcommit";
const branca = require("branca")(key);

const token = branca.encode("tuupola@appelsiini.net");
/* 87x2GqCUw7fho4DVETyEPrv8s79gbfRIZB3ql5nliJ42xNNA88VQm7MZZzZs07O8zMC9vke0XuMxb */

const payload = branca.decode(token);
/* tuupola@appelsiini.net */
```

Sometimes you might prefer JSON.

```javascript
const key = "supersecretkeyyoushouldnotcommit";
const branca = require("branca")(key);
const json = JSON.stringify({"scope": ["read", "write", "delete"]});
const token = branca.encode(json);

/*
3Gq55EruBIu2KtWGtzjjkMV45e1froWhTDF8nNNTbnwHvOeGHNHNEuBuyrGqFtEn4faf26LAuVUzijMNaO1Fk72aZ3B5
*/

const payload = JSON.parse(branca.decode(token));
/* { scope: [ 'read', 'write', 'delete' ] } */
```

You can keep the token size small by using a space efficient serialization method such as [MessagePack](http://msgpack.org/) or [Protocol Buffers](https://developers.google.com/protocol-buffers/).

```javascript
const key = "supersecretkeyyoushouldnotcommit";
const branca = require("branca")(key);
const msgpack = require("msgpack5")();

const packed = msgpack.encode({"scope": ["read", "write", "delete"]});
const token = branca.encode(packed);
/* 2EZpnHNCn1qwjqalGcpnZ2tlpXtIqNYNqeZuQvKzz6TY8nIh1Pukl8R7ZNIFvH28ZICIi9gkikjsHaPg */

const binary = branca.decode(token);
const payload = msgpack.decode(Buffer.from(binary));
/* { scope: [ 'read', 'write', 'delete' ] } */
```

## Testing

You can run tests manually with the following command.

``` bash
$ node test.js
```

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

If you discover any security related issues, please email tuupola@appelsiini.net instead of using the issue tracker.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

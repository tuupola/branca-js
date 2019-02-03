#  Branca

[![Latest Version](https://img.shields.io/npm/v/branca.svg?style=flat-square)](https://www.npmjs.com/package/branca)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Build Status](https://img.shields.io/travis/tuupola/branca-js/master.svg?style=flat-square)](https://travis-ci.org/tuupola/branca-js)
[![Coverage](https://img.shields.io/codecov/c/github/tuupola/branca-js.svg?style=flat-square)](https://codecov.io/github/tuupola/branca-js)

## What?

[Branca](https://github.com/tuupola/branca-spec) is a secure easy to use token format which makes it hard to shoot yourself in the foot. It uses IETF XChaCha20-Poly1305 AEAD symmetric encryption to create encrypted and tamperproof tokens. Payload itself is an arbitrary sequence of bytes. You can use for example a JSON object, plain text string or even binary data serialized by [MessagePack](http://msgpack.org/) or [Protocol Buffers](https://developers.google.com/protocol-buffers/). It is possible to use [Branca as an alternative to JWT](https://appelsiini.net/2017/branca-alternative-to-jwt/).

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

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

If you discover any security related issues, please email tuupola@appelsiini.net instead of using the issue tracker.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

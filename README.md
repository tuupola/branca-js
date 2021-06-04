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

## Secret key

The token is encrypted using a 32 byte secret key. You can pass the secret key either as an instance of `Buffer` or a hex encoded string.

```javascript
const key = crypto.randomBytes(32);
const branca = require("branca")(key);
```

```javascript
const key = "7ed049e344f73f399ba1f7868cf9494f4b13347ecce02a8e463feb32507b73a5";
const branca = require("branca")(key);
```

While technically possible, you should not use human readable strings as the secret key. Instead always generate the key using cryptographically secure random bytes. You can do this, for example, from commandline with Node.js itself or openssl.

```
$ node
Welcome to Node.js v16.2.0.
Type ".help" for more information.
> crypto.randomBytes(32).toString("hex")
'46cad3699da5766c45e80edfbf19dd2debc311e0c9046a80e791597442b2daf0'
```

```
$ openssl rand -hex 32

29f7d3a263bd6fcfe716865cbdb00b7a317d1993b8b7a3a5bae6192fbe0ace65
```

## Payload

Token payload can be any arbitrary data such as string containing an email
address.

```javascript
/* 32 byte secret key */
const crypto = require("crypto");
const key = crypto.randomBytes(32);
const branca = require("branca")(key);

const token = branca.encode("tuupola@appelsiini.net");
console.log(token);

/*
n8EWZ6msHPjbUPLfezL7g00RBNDvHZ37Or4aGeIWqPjUj0Sht41dasPgQgmEl3UsV4JKS4kZtEiZ6V54JYtYJRhtH8
*/

const payload = branca.decode(token);
console.log(payload.toString());

/* tuupola@appelsiini.net */
```

Sometimes you might prefer JSON.

```javascript
/* 32 byte secret key */
const crypto = require("crypto");
const key = crypto.randomBytes(32);
const branca = require("branca")(key);

const json = JSON.stringify({"scope": ["read", "write", "delete"]});
const token = branca.encode(json);
console.log(token);

/*
5R9kHEyH57WbQhy0Ba3NwPYu0pFlAv45jOIsmUdvHs0HAVX3CzNw90DtXs60UwjwfYopZ1NvO11GkEQTjumMIZYuCcawnoztFsexGlHoFKGX
*/

const payload = JSON.parse(branca.decode(token));
console.log(payload);

/* { scope: [ 'read', 'write', 'delete' ] } */
```

You can keep the token size small by using a space efficient serialization method such as [MessagePack](http://msgpack.org/) or [Protocol Buffers](https://developers.google.com/protocol-buffers/).

```javascript
/* 32 byte secret key */
const crypto = require("crypto");
const key = crypto.randomBytes(32);
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

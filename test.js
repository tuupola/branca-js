"use strict";

const branca = require("./branca")("supersecretkeyyoushouldnotcommit");

let nonce = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c]);
let timestamp = 123206400;

let token = branca.encode("Hello world!", timestamp, nonce);
console.log(token);

let payload = branca.decode(token);
console.log(payload);
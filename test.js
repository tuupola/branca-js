"use strict";

const test = require("tape");
const branca = require("./branca")("supersecretkeyyoushouldnotcommit");
const nonce = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c]);

test("test vector 1", function (tape) {
    tape.plan(2);

    let token = branca.encode("Hello world!", 123206400, nonce);
    tape.equal(token, "4si6Rr26CjfyVydzEiKBwuwkQwvjQhmBHTKSXAyHGcaFYA5kEp45XR1Amgblh");

    let message = branca.decode(token);
    tape.equal(message, "Hello world!");
});

"use strict";

const test = require("tape");
const branca = require("./branca")("supersecretkeyyoushouldnotcommit");
const nonce = Buffer.from([
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c,
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c
]);

test("test vector 1", function (tape) {
    tape.plan(2);

    let token = branca.encode("Hello world!", 123206400, nonce);
    tape.equal(
        token,
        "875GH233T7IYrxtgXxlQBYiFobZMQdHAT51vChKsAIYCFxZtL1evV54vYqLyZtQ0ekPHt8kJHQp0a"
    );

    let message = branca.decode(token);
    tape.equal(message.toString(), "Hello world!");
});

test("test vector 2", function (tape) {
    tape.plan(2);

    let token = branca.encode("Hello world!", 123206400, nonce);
    tape.equal(
        token,
        "875GH233T7IYrxtgXxlQBYiFobZMQdHAT51vChKsAIYCFxZtL1evV54vYqLyZtQ0ekPHt8kJHQp0a"
    );

    tape.throws(function () {
        let message = branca.decode(token, 3600);
    }, Error)
});

test("test defaults", function (tape) {
    tape.plan(1);

    let token = branca.encode("Hello world!");
    let message = branca.decode(token);
    tape.equal(message.toString(), "Hello world!");
});
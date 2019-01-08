"use strict";

const test = require("tape");
const branca = require("./branca")("supersecretkeyyoushouldnotcommit");
const nonce = Buffer.from([
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c,
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c
]);

test("test token with timestamp", function (tape) {
    tape.plan(2);

    let token = branca.encode("Hello world!", 123206400, nonce);
    tape.equal(
        token,
        "875GH233T7IYrxtgXxlQBYiFobZMQdHAT51vChKsAIYCFxZtL1evV54vYqLyZtQ0ekPHt8kJHQp0a"
    );

    let message = branca.decode(token);
    tape.equal(message.toString(), "Hello world!");
});

test("test token with zero timestamp", function (tape) {
    tape.plan(2);

    let token = branca.encode("Hello world!", 0, nonce);
    tape.equal(
        token,
        "870S4BYX9BNSPU3Zy4DPI4MLAK67vYRwLkocJV3DlQdwxBA0ex3fwVt5lTY3viltGFdyMA1E6E3Co"
    );

    let message = branca.decode(token);
    tape.equal(message.toString(), "Hello world!");
});

test("test token with wrong version", function (tape) {
    tape.plan(1);

    /* This is same token as above but with invalid version 0xBB. */
    let token = "89mvl3RZe7RwH2x4azVg5V2B7X2NtG4V2YLxHAB3oFc6gyeICmCKAOCQ7Y0n08klY33eQWACd7cSZ";

    tape.throws(function () {
        let message = branca.decode(token);
    }, Error)
});

test("test expired token", function (tape) {
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
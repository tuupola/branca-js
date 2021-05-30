"use strict";

const test = require("tape");

// 32 character string key
const branca = require("./branca")("supersecretkeyyoushouldnotcommit");

// 32 byte hex key
const branca32 = require("./branca")("deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef");

// 32 byte hex key with '0x' prefix
const branca32x = require("./branca")("0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef");

/* 32 Byte Hex Key Tests */

test("32 byte hex key with no 0x prefix", function (tape) {
    tape.plan(2);
    let token = "BsGNi1RfikO69QizziIfhT4DxChwxjB4TkLPOW4Gx67lds705gFcwdyeVWqkyXKc2Zg1Wc0IRSpBKlJCzZHz6QjVa";
    let message = branca32.decode(token);
    let timestamp = branca32.timestamp(token);
    tape.equal(message.toString(), "Hello 32 Byte Hex Key");
    tape.equal(timestamp, 0);
});

test("32 byte hex key with 0x prefix ignored", function (tape) {
    tape.plan(2);
    let token = "BsGNi1RfikO69QizziIfhT4DxChwxjB4TkLPOW4Gx67lds705gFcwdyeVWqkyXKc2Zg1Wc0IRSpBKlJCzZHz6QjVa";
    let message = branca32x.decode(token);
    let timestamp = branca32x.timestamp(token);
    tape.equal(message.toString(), "Hello 32 Byte Hex Key");
    tape.equal(timestamp, 0);
});

/* Decoding tests */

test("Hello world with zero timestamp", function (tape) {
    tape.plan(2);
    let token = "870S4BYxgHw0KnP3W9fgVUHEhT5g86vJ17etaC5Kh5uIraWHCI1psNQGv298ZmjPwoYbjDQ9chy2z";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString(), "Hello world!");
    tape.equal(timestamp, 0);
});

test("Hello world with max timestamp", function (tape) {
    tape.plan(2);
    let token = "89i7YCwu5tWAJNHUDdmIqhzOi5hVHOd4afjZcGMcVmM4enl4yeLiDyYv41eMkNmTX6IwYEFErCSqr";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString(), "Hello world!");
    tape.equal(timestamp, 4294967295);
});

test("Hello world with November 27 timestamp", function (tape) {
    tape.plan(2);
    let token = "875GH23U0Dr6nHFA63DhOyd9LkYudBkX8RsCTOMz5xoYAMw9sMd5QwcEqLDRnTDHPenOX7nP2trlT";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString(), "Hello world!");
    tape.equal(timestamp, 123206400);
});

test("Eight null bytes with zero timestamp", function (tape) {
    tape.plan(2);
    let token = "1jIBheHbDdkCDFQmtgw4RUZeQoOJgGwTFJSpwOAk3XYpJJr52DEpILLmmwYl4tjdSbbNqcF1";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString("hex"), "0000000000000000");
    tape.equal(timestamp, 0);
});

test("Eight null bytes with max timestamp", function (tape) {
    tape.plan(2);
    let token = "1jrx6DUu5q06oxykef2e2ZMyTcDRTQot9ZnwgifUtzAphGtjsxfbxXNhQyBEOGtpbkBgvIQx";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString("hex"), "0000000000000000");
    tape.equal(timestamp, 4294967295);
});

test("Eight null bytes with November 27th timestamp", function (tape) {
    tape.plan(2);
    let token = "1jJDJOEjuwVb9Csz1Ypw1KBWSkr0YDpeBeJN6NzJWx1VgPLmcBhu2SbkpQ9JjZ3nfUf7Aytp";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString("hex"), "0000000000000000");
    tape.equal(timestamp, 123206400);
});

test("Empty payload", function (tape) {
    tape.plan(2);
    let token = "4sfD0vPFhIif8cy4nB3BQkHeJqkOkDvinI4zIhMjYX4YXZU5WIq9ycCVjGzB5";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString(), "");
    tape.equal(timestamp, 0);
});

test("Non-UTF8 payload", function (tape) {
    tape.plan(2);
    let token = "K9u6d0zjXp8RXNUGDyXAsB9AtPo60CD3xxQ2ulL8aQoTzXbvockRff0y1eXoHm";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString("hex"), "80");
    tape.equal(timestamp, 123206400);
});

test("Wrong version 0xBB", function (tape) {
    tape.plan(1);

    let token = "89mvl3RkwXjpEj5WMxK7GUDEHEeeeZtwjMIOogTthvr44qBfYtQSIZH5MHOTC0GzoutDIeoPVZk3w";

    tape.throws(function () {
        let message = branca.decode(token);
    }, Error)
});

test("Invalid base62 characters", function (tape) {
    tape.plan(1);

    let token = "875GH23U0Dr6nHFA63DhOyd9LkYudBkX8RsCTOMz5xoYAMw9sMd5QwcEqLDRnTDHPenOX7nP2trlT_";

    tape.throws(function () {
        let message = branca.decode(token);
    }, Error)
});

test("Modified version", function (tape) {
    tape.plan(1);

    let token = "89mvl3S0BE0UCMIY94xxIux4eg1w5oXrhvCEXrDAjusSbO0Yk7AU6FjjTnbTWTqogLfNPJLzecHVb";

    tape.throws(function () {
        let message = branca.decode(token);
    }, Error)
});

test("Modified first byte of the nonce", function (tape) {
    tape.plan(1);

    let token = "875GH233SUysT7fQ711EWd9BXpwOjB72ng3ZLnjWFrmOqVy49Bv93b78JU5331LbcY0EEzhLfpmSx";

    tape.throws(function () {
        let message = branca.decode(token);
    }, Error)
});

test("Modified timestamp", function (tape) {
    tape.plan(1);

    let token = "870g1RCk4lW1YInhaU3TP8u2hGtfol16ettLcTOSoA0JIpjCaQRW7tQeP6dQmTvFIB2s6wL5deMXr";

    tape.throws(function () {
        let message = branca.decode(token);
    }, Error)
});

test("Modified last byte of the ciphertext", function (tape) {
    tape.plan(1);

    let token = "875GH23U0Dr6nHFA63DhOyd9LkYudBkX8RsCTOMz5xoYAMw9sMd5Qw6Jpo96myliI3hHD7VbKZBYh";

    tape.throws(function () {
        let message = branca.decode(token);
    }, Error)
});

test("Modified last byte of the Poly1305 tag", function (tape) {
    tape.plan(1);

    let token = "875GH23U0Dr6nHFA63DhOyd9LkYudBkX8RsCTOMz5xoYAMw9sMd5QwcEqLDRnTDHPenOX7nP2trk0";

    tape.throws(function () {
        let message = branca.decode(token);
    }, Error)
});

test("Wrong key", function (tape) {
    tape.plan(1);

    let branca2 = require("./branca")("wrongsecretkeyyoushouldnotcommit");
    let token = "870S4BYxgHw0KnP3W9fgVUHEhT5g86vJ17etaC5Kh5uIraWHCI1psNQGv298ZmjPwoYbjDQ9chy2z";

    tape.throws(function () {
        let message = branca2.decode(token);
    }, Error)
});

test("Invalid key (too short)", function (tape) {
    tape.plan(1);

    tape.throws(function () {
        // fails on initialization
        let branca = require("./branca")("tooshortkey");
    }, Error)
});

test("Invalid hex key (too short)", function (tape) {
    tape.plan(1);

    tape.throws(function () {
        // fails on initialization
        let branca = require("./branca")("deadbeef");
    }, Error)
});

/* Encoding tests */

test("Hello world with zero timestamp", function (tape) {
    tape.plan(1);
    let token = "870S4BYxgHw0KnP3W9fgVUHEhT5g86vJ17etaC5Kh5uIraWHCI1psNQGv298ZmjPwoYbjDQ9chy2z";
    let nonce = Buffer.from("beefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef", "hex");
    let message = "Hello world!";
    let timestamp = 0;

    branca._nonce = nonce;

    tape.equal(branca.encode(message, timestamp), token);
});

test("Hello world with max timestamp", function (tape) {
    tape.plan(1);
    let token = "89i7YCwu5tWAJNHUDdmIqhzOi5hVHOd4afjZcGMcVmM4enl4yeLiDyYv41eMkNmTX6IwYEFErCSqr";
    let nonce = Buffer.from("beefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef", "hex");
    let message = "Hello world!";
    let timestamp = 4294967295;

    branca._nonce = nonce;

    tape.equal(branca.encode(message, timestamp), token);
});

test("Hello world with November 27 timestamp", function (tape) {
    tape.plan(1);
    let token = "875GH23U0Dr6nHFA63DhOyd9LkYudBkX8RsCTOMz5xoYAMw9sMd5QwcEqLDRnTDHPenOX7nP2trlT";
    let nonce = Buffer.from("beefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef", "hex");
    let message = "Hello world!";
    let timestamp = 123206400;

    branca._nonce = nonce;

    tape.equal(branca.encode(message, timestamp), token);
});

test("Eight null bytes with zero timestamp", function (tape) {
    tape.plan(1);
    let token = "1jIBheHbDdkCDFQmtgw4RUZeQoOJgGwTFJSpwOAk3XYpJJr52DEpILLmmwYl4tjdSbbNqcF1";
    let nonce = Buffer.from("beefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef", "hex");
    let message = Buffer.from("0000000000000000", "hex");
    let timestamp = 0;

    branca._nonce = nonce;

    tape.equal(branca.encode(message, timestamp), token);
});

test("Eight null bytes with max timestamp", function (tape) {
    tape.plan(1);
    let token = "1jrx6DUu5q06oxykef2e2ZMyTcDRTQot9ZnwgifUtzAphGtjsxfbxXNhQyBEOGtpbkBgvIQx";
    let nonce = Buffer.from("beefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef", "hex");
    let message = Buffer.from("0000000000000000", "hex");
    let timestamp = 4294967295;

    branca._nonce = nonce;

    tape.equal(branca.encode(message, timestamp), token);
});

test("Eight null bytes with with November 27th timestamp", function (tape) {
    tape.plan(1);
    let token = "1jJDJOEjuwVb9Csz1Ypw1KBWSkr0YDpeBeJN6NzJWx1VgPLmcBhu2SbkpQ9JjZ3nfUf7Aytp";
    let nonce = Buffer.from("beefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef", "hex");
    let message = Buffer.from("0000000000000000", "hex");
    let timestamp = 123206400;

    branca._nonce = nonce;

    tape.equal(branca.encode(message, timestamp), token);
});

test("Empty payload", function (tape) {
    tape.plan(1);
    let token = "4sfD0vPFhIif8cy4nB3BQkHeJqkOkDvinI4zIhMjYX4YXZU5WIq9ycCVjGzB5";
    let nonce = Buffer.from("beefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef", "hex");
    let message = Buffer.from("");
    let timestamp = 0;

    branca._nonce = nonce;

    tape.equal(branca.encode(message, timestamp), token);
});

test("Non-UTF8 payload", function (tape) {
    tape.plan(1);
    let token = "K9u6d0zjXp8RXNUGDyXAsB9AtPo60CD3xxQ2ulL8aQoTzXbvockRff0y1eXoHm";
    let nonce = Buffer.from("beefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef", "hex");
    let message = Buffer.from("80", "hex");
    let timestamp = 123206400;

    branca._nonce = nonce;

    tape.equal(branca.encode(message, timestamp), token);
});

/* Implementation specific tests */

test("test expired token", function (tape) {
    tape.plan(1);

    let token = "875GH234UdXU6PkYq8g7tIM80XapDQOH72bU48YJ7SK1iHiLkrqT8Mly7P59TebOxCyQeqpMJ0a7a";

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

test("test should create token with empty payload", function (tape) {
    tape.plan(1);

    let token = branca.encode("");
    let message = branca.decode(token);
    tape.equal(message.toString(), "");
});

/* Examples Tests */

test("test email example", function (tape) {
    tape.plan(2);

    const msg = "tuupola@appelsiini.net"

    // Generate a token on the fly
    const token = branca.encode(msg);
    console.log("example email token", token);
    
    const payload = branca.decode(token);
    tape.equal(payload.toString(), msg);

    // test token from README
    const payload2 = branca.decode('n8EQdroaT1Kr6pJQ6vWDIUlzY6A1pIWMqUk6NJ1WfYzmhWehep70ZQxaDiKFdQuUmH5DoRX9EkfdEvdllfwVsVm48L');
    tape.equal(payload2.toString(), msg);
});

test("test json example", function (tape) {
    tape.plan(2);

    const msg = {"scope": ["read", "write", "delete"]}
    const json = JSON.stringify(msg);

    // Generate a token on the fly
    const token = branca.encode(json);
    console.log("example json token", token);
    
    const payload = JSON.parse(branca.decode(token));
    tape.equal(JSON.stringify(payload), json);

    // test token from README
    const payload2 = JSON.parse(branca.decode('5R9jcYzm4xmeAkjbWE7yCER2Y0PIFvXyS3bqkzMfFgPi9FNiw8MaFStIqPDu22yCXalFnYyuiweOmHQ8Y903fAX9cCYYAPiIcBpOLR6aAc7b'));
    tape.equal(JSON.stringify(payload2), json);
});

test("test mesgpack example", function (tape) {
    tape.plan(2);

    const msg = {"scope": ["read", "write", "delete"]}

    // Generate a token on the fly
    const msgpack = require("msgpack5")();
    const packed = msgpack.encode(msg);
    const token = branca.encode(packed);
    console.log("example msgpack token", token);
    
    const binary = branca.decode(token);
    const payload = msgpack.decode(Buffer.from(binary));
    tape.equal(JSON.stringify(payload), JSON.stringify(msg));

    // test token from README
    const binary2 = branca.decode('3iLBybBOHSPyOpoOYado2s4BE5VswdiPOgSPMfx8FVgam9yYXUEQOvMFGDGAEIh9zoeS9eT1K4fjVicjlGVkJdZzkCX5CroY');
    const payload2 = msgpack.decode(Buffer.from(binary2));
    tape.equal(JSON.stringify(payload2), JSON.stringify(msg));
});

"use strict";

const test = require("tape");
const branca = require("./branca")("supersecretkeyyoushouldnotcommit");

/* These are the tests each implementation should have. */
test("test token with hello world and zero timestamp", function (tape) {
    tape.plan(2);
    let token = "870S4BYjk7NvyViEjUNsTEmGXbARAX9PamXZg0b3JyeIdGyZkFJhNsOQW6m0K9KnXt3ZUBqDB6hF4";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString(), "Hello world!");
    tape.equal(timestamp, 0);
});

test("test token with hello world and max timestamp", function (tape) {
    tape.plan(2);
    let token = "89i7YCwtsSiYfXvOKlgkCyElnGCOEYG7zLCjUp4MuDIZGbkKJgt79Sts9RdW2Yo4imonXsILmqtNb";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString(), "Hello world!");
    tape.equal(timestamp, 4294967295);
});

test("test token with hello world and november 27 timestamp", function (tape) {
    tape.plan(2);
    let token = "875GH234UdXU6PkYq8g7tIM80XapDQOH72bU48YJ7SK1iHiLkrqT8Mly7P59TebOxCyQeqpMJ0a7a";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString(), "Hello world!");
    tape.equal(timestamp, 123206400);
});

test("test token with eight null bytes and zero timestamp", function (tape) {
    tape.plan(2);
    let token = "1jIBheHWEwYIP59Wpm4QkjkIKuhc12NcYdp9Y60B6av7sZc3vJ5wBwmKJyQzGfJCrvuBgGnf";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString(), "\x00\x00\x00\x00\x00\x00\x00\x00");
    tape.equal(timestamp, 0);
});

test("test token with eight null bytes and max timestamp", function (tape) {
    tape.plan(2);
    let token = "1jrx6DUq9HmXvYdmhWMhXzx3klRzhlAjsc3tUFxDPCvZZLm16GYOzsBG4KwF1djjW1yTeZ2B";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString(), "\x00\x00\x00\x00\x00\x00\x00\x00");
    tape.equal(timestamp, 4294967295);
});

test("test token with eight null bytes and november 27 timestamp", function (tape) {
    tape.plan(2);
    let token = "1jJDJOEfuc4uBJh5ivaadjo6UaBZJDZ1NsWixVCz2mXw3824JRDQZIgflRqCNKz6yC7a0JKC";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString(), "\x00\x00\x00\x00\x00\x00\x00\x00");
    tape.equal(timestamp, 123206400);
});

test("test token with wrong version", function (tape) {
    tape.plan(1);

    /* This is same token as above but with invalid version 0xBB. */
    let token = "89mvl3RkwXjpEj5WMxK7GUDEHEeeeZtwjMIOogTthvr44qBfYtQSIZH5MHOTC0GzoutDIeoPVZk3w";

    tape.throws(function () {
        let message = branca.decode(token);
    }, Error)
});

test("test token with empty payload and november 27 timestamp", function (tape) {
    tape.plan(2);
    let token = "4si6Rr2Bi1uSz6MaqF37YZVVK9VccCSWL7RkNY9gczMmYZnEXVDbzgSJLvgzs";
    let message = branca.decode(token);
    let timestamp = branca.timestamp(token);
    tape.equal(message.toString(), "");
    tape.equal(timestamp, 123206400);
});

/* These are the JavaScript implementation specific tests. */

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
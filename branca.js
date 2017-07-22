"use strict";

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const base62 = require("base-x")(BASE62)
const bufferpack = require("bufferpack");
const chacha = require("chacha");
const crypto = require("crypto");

let Branca = function (key) {
    this.version = 0xBA;
    this.key = Buffer.from(key);
};

Branca.prototype.encode = function (message, timestamp = null, nonce = null) {

    /* Pass nonce only when testing or if you do not trust crypto. */
    if (null === nonce) {
        nonce = crypto.randomBytes(12);
    }

    if (null === timestamp) {
        timestamp = Math.floor(new Date() / 1000);
    }

    let format = ">B(version)L(timestamp)BBBBBBBBBBBB(nonce)";
    let header = bufferpack.pack(format, [this.version, timestamp, ...nonce]);
    let cipher = chacha.createCipher(this.key, nonce);

    cipher.setAAD(header);
    let ciphertext = cipher.update(message);
    cipher.final();
    let tag = cipher.getAuthTag();
    let binary = Buffer.concat([header, ciphertext, tag]);

    return base62.encode(binary);
};

Branca.prototype.decode = function (token, ttl = null) {
    let binary = base62.decode(token);
    let header = binary.slice(0, 17);
    let ciphertext = binary.slice(17, binary.length - 16);
    let tag = binary.slice(binary.length - 16);
    let format = ">B(version)L(timestamp)BBBBBBBBBBBB(nonce)";
    let unpacked = bufferpack.unpack(format, header);
    let version = unpacked.shift();
    let timestamp = unpacked.shift();
    let nonce = Buffer.from(unpacked);

    let decipher = chacha.createDecipher(this.key, nonce);
    decipher.setAAD(header);
    decipher.setAuthTag(tag);

    let payload = decipher.update(ciphertext);
    decipher.final();

    if (null !== ttl) {
        let future = timestamp + ttl;
        let unixtime = Math.round(Date.now() / 1000);
        if (future < unixtime) {
            throw new Error("Token is expired.");
        }
    }

    return payload.toString();
};

module.exports = function(key) {
    return new Branca(key);
}
"use strict";

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const NONCE_BYTES = 12;
const TAG_BYTES = 16;
const HEADER_BYTES = 17;
const HEADER_FORMAT = ">B(version)L(timestamp)BBBBBBBBBBBB(nonce)";

const base62 = require("base-x")(BASE62)
const bufferpack = require("bufferpack");
const chacha = require("chacha");
const crypto = require("crypto");

let Branca = function (key) {
    this.version = 0xBA;
    this.key = Buffer.from(key);
};

Branca.prototype.encode = function (message, timestamp, nonce) {

    /* Pass nonce only when testing or if you do not trust crypto. */
    if (undefined === nonce) {
        nonce = crypto.randomBytes(NONCE_BYTES);
    }

    /* Create timestamp since nothing was passed. */
    if (undefined === timestamp) {
        timestamp = Math.floor(new Date() / 1000);
    }

    /* Header is the AD part of AEAD. It is authenticated but not encrypted. */
    let header = bufferpack.pack(HEADER_FORMAT, [this.version, timestamp, ...nonce]);
    let cipher = chacha.createCipher(this.key, nonce);
    cipher.setAAD(header);

    /* The final() should not return anything but include it just in case. */
    let ciphertext = Buffer.concat([
        cipher.update(message),
        cipher.final()
    ]);

    let tag = cipher.getAuthTag();
    let binary = Buffer.concat([header, ciphertext, tag]);

    return base62.encode(binary);
};

Branca.prototype.decode = function (token, ttl) {
    let binary = base62.decode(token);
    let header = binary.slice(0, HEADER_BYTES);
    let ciphertext = binary.slice(HEADER_BYTES, binary.length - TAG_BYTES);
    let tag = binary.slice(binary.length - TAG_BYTES);
    let unpacked = bufferpack.unpack(HEADER_FORMAT, header);
    let version = unpacked.shift();
    let timestamp = unpacked.shift();
    let nonce = Buffer.from(unpacked);

    /* Header and tag were extracted from the binary token. */
    let decipher = chacha.createDecipher(this.key, nonce);
    decipher.setAAD(header);
    decipher.setAuthTag(tag);

    let payload = decipher.update(ciphertext);
    decipher.final();

    /* Check for expiration only when requestested by passing in a TTL. */
    if (undefined !== ttl) {
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
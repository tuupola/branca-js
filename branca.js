"use strict";

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const NONCE_BYTES = 24;
const HEADER_BYTES = 29;
const HEADER_FORMAT = ">B(version)L(timestamp)BBBBBBBBBBBBBBBBBBBBBBBB(nonce)";

const base62 = require("base-x")(BASE62)
const bufferpack = require("bufferpack");
const sodium = require("libsodium-wrappers");

let Branca = function (key) {
    this.version = 0xBA;
    this.key = Buffer.from(key);
};

Branca.prototype.encode = function (message, timestamp) {

    /* Libsodium random is guaranteed to be random. */
    let nonce = sodium.randombytes_buf(NONCE_BYTES);

    /* Create timestamp if nothing was passed. */
    if (undefined === timestamp) {
        timestamp = Math.floor(new Date() / 1000);
    }

    /* Header is the AD part of AEAD. It is authenticated but not encrypted. */
    let header = bufferpack.pack(HEADER_FORMAT, [this.version, timestamp, ...nonce]);
    let ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        message,
        header,
        nonce,
        nonce,
        this.key
    );

    let binary = Buffer.concat([header, Buffer.from(ciphertext)]);

    return base62.encode(binary);
};

Branca.prototype.decode = function (token, ttl) {
    let binary = base62.decode(token);
    let header = binary.slice(0, HEADER_BYTES);
    let ciphertext = binary.slice(HEADER_BYTES, binary.length);
    let unpacked = bufferpack.unpack(HEADER_FORMAT, header);
    let version = unpacked.shift();
    let timestamp = unpacked.shift();
    let nonce = Buffer.from(unpacked);

    /* Implementation should accept only one current version. */
    if (version !== this.version) {
        throw new Error("Invalid token version.");
    }

    /* Header was extracted from the binary token. */
    let payload = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        nonce,
        ciphertext,
        header,
        nonce,
        this.key
    );

    /* Check for expiration only when requested by passing in a TTL. */
    if (undefined !== ttl) {
        let future = timestamp + ttl;
        let unixtime = Math.round(Date.now() / 1000);
        if (future < unixtime) {
            throw new Error("Token is expired.");
        };
    };

    return Buffer.from(payload);
};

Branca.prototype.timestamp = function (token) {
    let binary = base62.decode(token);
    let header = binary.slice(0, HEADER_BYTES);
    let unpacked = bufferpack.unpack(HEADER_FORMAT, header);
    let version = unpacked.shift();
    let timestamp = unpacked.shift();

    return timestamp;
};

module.exports = function(key) {
    return new Branca(key);
}

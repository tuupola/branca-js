# Changelog

All notable changes to this project will be documented in this file, in reverse chronological order by release.


## [0.5.0](https://github.com/tuupola/branca-js/compare/v0.4.0...v0.5.0) - 2022-04-27
### Changed
- Replaced Travis with GitHub actions ([#20](https://github.com/tuupola/branca-js/pull/20)).
- Upgraded base-x and tape ([#22](https://github.com/tuupola/branca-js/pull/22)).


## [0.4.0](https://github.com/tuupola/branca-js/compare/v0.3.0...v0.4.0) - 2020-06-21
### Added
- New test vectors from the spec ([#11](https://github.com/tuupola/branca-js/pull/11)).

### Removed
- Support for ASCII secret keys ([#16](https://github.com/tuupola/branca-js/pull/16)) (fixes [#12](https://github.com/tuupola/branca-js/issues/12)).

## [0.3.0](https://github.com/tuupola/branca-js/compare/v0.2.0...v0.3.0) - 2019-02-03
### Added
- Helper function to extract timestamp from the token ([#4](https://github.com/tuupola/branca-js/pull/4)).
- Compatibility tests from the spec ([#5](https://github.com/tuupola/branca-js/pull/5)).

### Removed
- Possibility to use an user defined nonce ([#6](https://github.com/tuupola/branca-js/pull/6)).

## [0.2.0](https://github.com/tuupola/branca-js/compare/v0.1.0...v0.2.0) - 2017-07-24
### Changed
- Use more secure IETF XChaCha20-Poly1305 AEAD encryption.

## 0.1.0 - 2017-07-23

Initial realease using IETF ChaCha20-Poly1305 AEAD.

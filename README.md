# `rust-wasm-gol`

## Contents

- [`rust-wasm-gol`](#rust-wasm-gol)
  - [Contents](#contents)
  - [About](#about)
  - [Usage](#usage)
    - [Development Build](#development-build)
    - [Release Build](#release-build)

## About

This codebase represents my journey through 
[https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm](https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm) 
and [https://rustwasm.github.io/docs/book/game-of-life/introduction.html](https://rustwasm.github.io/docs/book/game-of-life/introduction.html).

I aim to learn how to write Rust code that efficiently interoperates with 
JavaScript via WebAssemply, and how to compile and distribute this code using Nix.

## Usage

### Development Build

```
$ nix-shell --run "./scripts/build_and_serve"
```

### Release Build

```
$ nix-shell -p python3 --run "./scripts/serve `nix-build --no-out-link` <PORT>"
```
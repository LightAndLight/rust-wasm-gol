{ pkgs ? import ./nix/pkgs {} }:
pkgs.mkShell {
  buildInputs = with pkgs; [
    wasm-pack
    wabt
  ];
}
{ pkgs }:
pkgs.stdenv.mkDerivation {
  name = "rust-wasm-gol-html";
  src = ./.;
  installPhase = ''
    mkdir -p $out
    cp *.html $out/
  '';
}
{ pkgs ? import ./nix/pkgs {} }:
let
  nodeDeps = (import ./nix/node { inherit pkgs; }).nodeDependencies;
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    binaryen
    chromium
    chromedriver
    wasm-bindgen-cli
    wasm-pack
    wabt
    nodePackages.npm
    nodePackages.node2nix
    nodejs
    python3
    (pkgs.latest.rustChannels.stable.rust.override {
      targets = ["wasm32-unknown-unknown"];
    })
  ];
  shellHook = ''
    ln -sT ${nodeDeps}/lib/node_modules $PWD/node_modules
    export PATH="${nodeDeps}/bin:$PATH"
  '';
}

{ pkgs ? import ./nix/pkgs {} }:
pkgs.mkShell {
  NODE_PATH="${pkgs.nodePackages.webpack}/lib/node_modules:${pkgs.nodePackages.copy-webpack-plugin}/lib/node_modules";
  buildInputs = with pkgs; [
    binaryen
    chromium
    chromedriver
    wasm-pack
    wabt
    nodePackages.npm
    nodePackages.webpack-cli
    python3
    (pkgs.latest.rustChannels.stable.rust.override {
      targets = ["wasm32-unknown-unknown"];
    })
  ];
}

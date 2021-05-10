{ pkgs ? import ./nix/pkgs {} }:
pkgs.mkShell {
  NODE_PATH="${pkgs.nodePackages.webpack}/lib/node_modules:${pkgs.nodePackages.copy-webpack-plugin}/lib/node_modules";
  buildInputs = with pkgs; [
    chromium
    chromedriver
    wasm-pack
    wabt
    nodePackages.npm
    nodePackages.webpack-cli
    python3
  ];
}

{ pkgs ? import ./nix/pkgs {} }:
let          
  html = import ./html { inherit pkgs; };
  rust = import ./rust { inherit pkgs; };
in pkgs.stdenv.mkDerivation {
  name = "game-of-life-site";
  src = pkgs.nix-gitignore.gitignoreSource ["scripts/" "nix/" "html/" "rust/" "README.md" "default.nix" "shell.nix"] ./.;
  unpackPhase = ''
    unpackPhase
    cp -R ${html} rust-wasm-gol/html
    cp -R ${rust} rust-wasm-gol/rust
  '';
  
  buildInputs = with pkgs; [
    binaryen
    nodePackages.npm
    nodePackages.webpack-cli
    
    (import ./scripts { inherit pkgs; })
  ];
  NODE_PATH="${pkgs.nodePackages.webpack}/lib/node_modules:${pkgs.nodePackages.copy-webpack-plugin}/lib/node_modules";
  buildPhase = ''
    webpack_build
  '';
  
  installPhase = ''
    cp -R dist $out
  '';
}

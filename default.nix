{ pkgs ? import ./nix/pkgs {}, release ? true }:
let          
  html = import ./html { inherit pkgs; };
  rust = import ./rust { inherit pkgs release; };
  nodeDeps = (import ./nix/node { inherit pkgs; }).nodeDependencies;
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
    
    (import ./scripts { inherit pkgs; })
  ];
  buildPhase = ''
    ln -s ${nodeDeps}/lib/node_modules ./node_modules
    export PATH="${nodeDeps}/bin:$PATH"
    
    webpack_build ${if release then "" else "--env development"}
  '';
  
  installPhase = ''
    cp -R dist $out
  '';
}

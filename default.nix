{ pkgs ? import ./nix/pkgs {} }:
let          
  html = import ./html { inherit pkgs; };
  rust = import ./rust { inherit pkgs; };
in pkgs.stdenv.mkDerivation {
  name = "game-of-life-site";
  unpackPhase = "true";
  buildPhase = "true";
  installPhase = ''
    mkdir -p $out
    cp -R ${html}/*.html ${rust}/pkg $out/
  '';
}

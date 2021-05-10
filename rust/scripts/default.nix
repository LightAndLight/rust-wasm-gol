{ pkgs }:
pkgs.stdenv.mkDerivation {
  name = "scripts";
  src = pkgs.nix-gitignore.gitignoreSourcePure ["default.nix"] ./.;
  buildPhase = "true";
  installPhase = ''
    mkdir -p $out/bin
    cp * $out/bin/
  '';
}
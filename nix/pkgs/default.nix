args:
let
  nixpkgs =
    let
      # git ls-remote https://github.com/NixOS/nixpkgs nixpkgs-unstable
      rev = "1c16013bd6e94da748b41cc123c6b509a23eb440"; # 2021-04-08
    in
      builtins.fetchTarball "https://github.com/NixOS/nixpkgs/archive/${rev}.tar.gz";
  
  mozilla-overlay = 
    let
      # git ls-remote https://github.com/mozilla/nixpkgs-mozilla master
      rev = "8c007b60731c07dd7a052cce508de3bb1ae849b4"; # 2021-04-08
    in
      import (builtins.fetchTarball "https://github.com/mozilla/nixpkgs-mozilla/archive/${rev}.tar.gz");
in
  import nixpkgs (args // { overlays = (args.overlays or []) ++ [ mozilla-overlay ]; })
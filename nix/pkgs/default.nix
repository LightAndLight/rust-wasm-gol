args:
let
  nixpkgs =
    let
      # git ls-remote https://github.com/NixOS/nixpkgs nixpkgs-unstable
      rev = "1c16013bd6e94da748b41cc123c6b509a23eb440"; # 2021-04-08
    in
      builtins.fetchTarball {
        url = "https://github.com/NixOS/nixpkgs/archive/${rev}.tar.gz";
	sha256 = "1m2wif0qnci0q14plbqlb95vx214pxqgw5li86lyw6hsiy7y3zfn";
      };
  
  mozilla-overlay-src = 
    let
      # git ls-remote https://github.com/mozilla/nixpkgs-mozilla master
      rev = "8c007b60731c07dd7a052cce508de3bb1ae849b4"; # 2021-04-08
    in
      builtins.fetchTarball {
        url = "https://github.com/mozilla/nixpkgs-mozilla/archive/${rev}.tar.gz";
        sha256 = "1zybp62zz0h077zm2zmqs2wcg3whg6jqaah9hcl1gv4x8af4zhs6";
      };
  
  mozilla-overlay = import mozilla-overlay-src;
   
  rust-src-overlay = import "${mozilla-overlay-src}/rust-src-overlay.nix";
in
  import nixpkgs (args // { overlays = (args.overlays or []) ++ [ mozilla-overlay rust-src-overlay ]; })

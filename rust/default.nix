{ pkgs }:
let
  rustChannel = pkgs.latest.rustChannels.stable.rust.override {
    targets = ["wasm32-unknown-unknown"];
  };
  dependencies =
    pkgs.stdenv.mkDerivation {
      name = "rust-wasm-gol-dependencies";
      CARGO_HOME = "/build/cargo";
      src = pkgs.nix-gitignore.gitignoreSource ["default.nix"] ./.;
      buildInputs = with pkgs; [
        cacert
        rustChannel
      ];
      buildPhase = ''
        cargo fetch
      '';
      installPhase = ''
        cp -R $CARGO_HOME $out
      '';
      outputHashMode = "recursive";
      outputHashAlgo = "sha256";
      outputHash = "1ql1xnndsw4kj0yvyg03gv5g1n5bg59w6asfa0nxhvcs56s0zfnl";
    };
in pkgs.stdenv.mkDerivation {
  name = "rust-wasm-gol";
  CARGO_HOME = "/build/cargo";
  # RUST_LOG = "debug";
  src = pkgs.nix-gitignore.gitignoreSource ["default.nix"] ./.;
  unpackPhase = ''
    unpackPhase
    cp -R ${dependencies} /build/cargo
  '';
  buildInputs = with pkgs; [
    rustChannel
    
    which

    # v0.9.1
    wasm-pack
    
    # must be v0.2.73 or wasm-pack will fail
    wasm-bindgen-cli
  ];
  buildPhase = ''
    wasm-pack build --mode no-install --target web
  '';
  installPhase = ''
    mkdir -p $out
    cp -R pkg $out/
  '';
}
{ pkgs, dev ? false, profiling ? false, release ? true }:
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
        mkdir -p $out
        cp -R $CARGO_HOME $out/cargo
        cp Cargo.lock $out
      '';
      outputHashMode = "recursive";
      outputHashAlgo = "sha256";
      outputHash = "0d0apxw5q5cxrgmr4jxw6nc215qph22v2lqh3xfxjw4lfjxn53vd";
    };
in pkgs.stdenv.mkDerivation {
  name = "rust-wasm-gol";
  CARGO_HOME = "/build/cargo";
  # RUST_LOG = "debug";
  src = pkgs.nix-gitignore.gitignoreSource ["default.nix"] ./.;
  unpackPhase = ''
    unpackPhase
    cp -R ${dependencies}/cargo /build/cargo
  '';
  configurePhase = ''
    if cmp -s ${dependencies}/Cargo.lock Cargo.lock; then
      true
    else
      echo -e "\nerror: Cargo.lock does not match ${dependencies}/Cargo.lock"
      diff -u --color=always ${dependencies}/Cargo.lock Cargo.lock || true
      echo -e "\nnote: you can use \`cargoSha256 = pkgs.lib.fakeSha256;\` to rebuild the derivation with your current Cargo.lock.\n"
      exit 1
    fi
  '';
  buildInputs = with pkgs; [
    rustChannel
    
    which

    # v0.9.1
    wasm-pack
    
    # must be v0.2.73 or wasm-pack will fail
    wasm-bindgen-cli

    binaryen
      
    (import ./scripts { inherit pkgs; })
  ];
  buildPhase = ''
    wasm_pack_build \
      ${if dev then "--dev" else ""} \
      ${if profiling then "--profiling" else ""} \
      ${if release then "--release" else ""} \
      -- \
      --offline \
      --frozen
  '';
  doCheck = true;
  checkPhase = ''
    cargo test
  '';
  installPhase = ''
    mkdir -p $out
    cp -R pkg $out/
  '';
}
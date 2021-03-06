{ pkgs, dev ? false, profiling ? false, release ? true }:
let
  rustChannel = pkgs.latest.rustChannels.stable.rust.override {
    targets = ["wasm32-unknown-unknown"];
  };
  dependencies =
    pkgs.stdenv.mkDerivation {
      name = "rust-wasm-gol-dependencies";
      CARGO_HOME = "/build/cargo";
      src = pkgs.nix-gitignore.gitignoreSource ["scripts" "default.nix"] ./.;
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
      outputHash = "0l0fj576rkbiza5bgwf09f9ndiww7bwjrbjn2pvbd7z279dlkwpw";
    };
in pkgs.stdenv.mkDerivation {
  name = "rust-wasm-gol";
  CARGO_HOME = "/build/cargo";
  # RUST_LOG = "debug";
  src = pkgs.nix-gitignore.gitignoreSource ["scripts" "default.nix"] ./.;
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

    ${if release 
      then ''
        mkdir unoptimised
        mv pkg/*.wasm unoptimised
        for file in $(find unoptimised/ -type f -name "*.wasm")
        do
          wasm-opt -Oz $file -o "pkg/$(basename $file)"
        done
      ''
      else ""
    }
  '';
  doCheck = true;
  checkInputs = with pkgs; [
    chromium
    chromedriver
  ];
  checkPhase = ''
    cargo test

    # I haven't been able to get browser tests going in Firefox. If you know how
    # then please let me know
    FONTCONFIG_PATH=${pkgs.fontconfig.out}/etc/fonts wasm_pack_test
  '';
  installPhase = ''
    mkdir -p $out
    cp -R pkg $out/
  '';
}
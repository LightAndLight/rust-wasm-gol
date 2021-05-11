#![feature(test)]

extern crate rust_wasm_gol;
extern crate test;

#[bench]
fn universe_ticks(b: &mut test::Bencher) {
    let mut world = rust_wasm_gol::World::new();

    b.iter(|| {
        world.tick();
    });
}

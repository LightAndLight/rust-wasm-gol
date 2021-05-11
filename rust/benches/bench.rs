use criterion::{criterion_group, criterion_main, Criterion};

extern crate rust_wasm_gol;

fn world(c: &mut Criterion) {
    let mut world = rust_wasm_gol::World::new();

    c.bench_function("World::tick", |b| {
        b.iter(|| {
            world.tick();
        })
    });
}

criterion_group!(benches, world);
criterion_main!(benches);

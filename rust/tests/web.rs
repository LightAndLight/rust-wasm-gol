extern crate rust_wasm_gol;
use rust_wasm_gol::World;
use wasm_bindgen_test::{wasm_bindgen_test, wasm_bindgen_test_configure};

wasm_bindgen_test_configure!(run_in_browser);

pub fn input_spaceship() -> World {
    let mut world = World::new();
    world.set_width(6);
    world.set_height(6);
    world.set_cells(&[(1, 2), (2, 3), (3, 1), (3, 2), (3, 3)]);
    world
}

pub fn expected_spaceship() -> World {
    let mut world = World::new();
    world.set_width(6);
    world.set_height(6);
    world.set_cells(&[(2, 1), (2, 3), (3, 2), (3, 3), (4, 2)]);
    world
}

#[wasm_bindgen_test]
pub fn test_tick() {
    let mut actual_world = input_spaceship();

    let expected_world = expected_spaceship();
    let expected_cells = expected_world.get_cells();
    let actual_cells = {
        actual_world.tick();
        actual_world.get_cells()
    };

    assert_eq!(expected_cells, actual_cells);
}

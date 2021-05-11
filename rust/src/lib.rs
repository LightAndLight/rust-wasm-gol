use std::fmt;

use wasm_bindgen::prelude::*;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
pub struct World {
    width: u32,
    height: u32,
    data: Vec<Cell>,
}

#[wasm_bindgen]
pub fn start(panic_hook: bool) {
    log!("panic hook: {}", panic_hook);
    if panic_hook {
        console_error_panic_hook::set_once();
    }
}

impl World {
    fn clear(&mut self) {
        self.data = (0..self.width * self.height).map(|_| Cell::Dead).collect();
    }

    fn get_index(&self, x: u32, y: u32) -> usize {
        (y * self.width + x) as usize
    }

    fn live_neighbour_count(&self, x: u32, y: u32) -> u8 {
        let mut count = 0;
        for y_offset in [self.height - 1, 0, 1].iter() {
            for x_offset in [self.width - 1, 0, 1].iter() {
                if *x_offset == 0 && *y_offset == 0 {
                    continue;
                } else {
                    let neighbour_x = (x + x_offset) % self.width;
                    let neighbour_y = (y + y_offset) % self.height;
                    let index = self.get_index(neighbour_x, neighbour_y);
                    count += self.data[index] as u8;
                }
            }
        }
        count
    }

    #[cfg(test)]
    fn from(input: &Vec<Vec<Cell>>) -> Self {
        let height = input.len() as u32;
        let width = if height > 0 { input[0].len() } else { 0 } as u32;
        let data = Vec::with_capacity((width * height) as usize);
        let mut world = World {
            width,
            height,
            data,
        };
        for y in 0..height {
            for x in 0..width {
                world.data.push(input[y as usize][x as usize]);
            }
        }
        world
    }

    pub fn get_cells(&self) -> &[Cell] {
        &self.data
    }

    pub fn set_cells(&mut self, cells: &[(u32, u32)]) {
        for (x, y) in cells.iter() {
            let idx = self.get_index(*x, *y);
            self.data[idx] = Cell::Alive;
        }
    }
}

#[wasm_bindgen]
impl World {
    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn set_width(&mut self, width: u32) {
        self.width = width;
        self.clear();
    }

    pub fn set_height(&mut self, height: u32) {
        self.height = height;
        self.clear();
    }

    pub fn data(&self) -> *const Cell {
        self.data.as_ptr()
    }

    pub fn tick(&mut self) {
        let mut next_data = self.data.clone();

        for y in 0..self.height {
            for x in 0..self.width {
                let index = self.get_index(x, y);
                let count = self.live_neighbour_count(x, y);
                let next_cell = match self.data[index] {
                    Cell::Alive if count < 2 => Cell::Dead,
                    Cell::Alive if count > 3 => Cell::Dead,
                    Cell::Dead if count == 3 => Cell::Alive,
                    cell => cell,
                };
                next_data[index] = next_cell;
            }
        }

        self.data = next_data;
    }

    pub fn new() -> World {
        let width = 64;
        let height = 64;

        let data = (0..width * height)
            .map(|i| {
                if i % 2 == 0 || i % 7 == 0 {
                    Cell::Alive
                } else {
                    Cell::Dead
                }
            })
            .collect();

        World {
            width,
            height,
            data,
        }
    }

    pub fn render(&self) -> String {
        self.to_string()
    }
}

impl fmt::Display for World {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        for line in self.data.as_slice().chunks(self.width as usize) {
            for cell in line {
                let c = if *cell == Cell::Dead { '◻' } else { '◼' };
                write!(f, "{}", c)?;
            }
            writeln!(f, "")?;
        }

        Ok(())
    }
}

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("hello, {}", name))
}

mod tests {
    #[test]
    fn live_neighbour_count_1() {
        use super::{Cell::*, World};
        let world = World::from(&vec![
            vec![Dead, Dead, Dead],
            vec![Dead, Alive, Dead],
            vec![Dead, Dead, Dead],
        ]);
        assert_eq!(world.data.len(), 9);
        assert_eq!(world.data[world.get_index(1, 1)], Alive);
        assert_eq!(world.live_neighbour_count(1, 1), 0);
    }
}

use std::fmt;

use timer::Timer;
use wasm_bindgen::prelude::*;

mod timer;

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

impl Cell {
    fn toggle(&mut self) {
        *self = match self {
            Cell::Dead => Cell::Alive,
            Cell::Alive => Cell::Dead,
        }
    }
}

#[wasm_bindgen]
pub struct World {
    width: u32,
    height: u32,
    data: Vec<Cell>,
    next_data: Vec<Cell>,
}

#[wasm_bindgen]
pub fn start(panic_hook: bool) {
    log!("panic hook: {}", panic_hook);
    if panic_hook {
        console_error_panic_hook::set_once();
    }
}

impl World {
    fn get_index(&self, x: u32, y: u32) -> usize {
        (y * self.width + x) as usize
    }

    fn live_neighbour_count(
        &self,
        left: u32,
        x: u32,
        right: u32,
        top: u32,
        y: u32,
        bottom: u32,
    ) -> u8 {
        let mut count = 0;

        count += self.data[self.get_index(left, top)] as u8;
        count += self.data[self.get_index(x, top)] as u8;
        count += self.data[self.get_index(right, top)] as u8;

        count += self.data[self.get_index(left, y)] as u8;
        count += self.data[self.get_index(right, y)] as u8;

        count += self.data[self.get_index(left, bottom)] as u8;
        count += self.data[self.get_index(x, bottom)] as u8;
        count += self.data[self.get_index(right, bottom)] as u8;

        count
    }

    #[cfg(test)]
    fn from(input: &Vec<Vec<Cell>>) -> Self {
        let height = input.len() as u32;
        let width = if height > 0 { input[0].len() } else { 0 } as u32;
        let data = Vec::with_capacity((width * height) as usize);
        let next_data = (0..width * height).map(|_| Cell::Dead).collect();
        let mut world = World {
            width,
            height,
            data,
            next_data,
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

    fn swap_buffers(&mut self) {
        std::mem::swap(&mut self.data, &mut self.next_data);
    }

    pub fn tick(&mut self) {
        // let _timer = Timer::new("World::tick");

        {
            fn modulo(a: u32, max: u32) -> u32 {
                if a >= max {
                    a - max
                } else {
                    a
                }
            }

            // let _timer = Timer::new("update next_data");

            for y in 0..self.height {
                let top = if y >= 1 { y - 1 } else { y + self.height - 1 };
                let bottom = modulo(y + 1, self.height);

                for x in 0..self.width {
                    let index = self.get_index(x, y);

                    /*
                    modulo(x + self.width - 1, self.width)
                    if (x + self.width - 1) >= self.width { (x + self.width - 1) - self.width } else { (x + self.width - 1) }
                    if (x + self.width - 1) >= self.width { x - 1 } else { x + self.width - 1 }
                    if (x - 1) >= 0 { x - 1 } else { x + self.width - 1 }
                    if x >= 1 { x - 1 } else { x + self.width - 1 }
                    */
                    let left = if x >= 1 { x - 1 } else { x + self.width - 1 };
                    let right = modulo(x + 1, self.width);

                    let count = self.live_neighbour_count(left, x, right, top, y, bottom);
                    let next_cell = match self.data[index] {
                        Cell::Alive if count < 2 => Cell::Dead,
                        Cell::Alive if count > 3 => Cell::Dead,
                        Cell::Dead if count == 3 => Cell::Alive,
                        cell => cell,
                    };
                    self.next_data[index] = next_cell;
                }
            }
        }

        {
            // let _timer = Timer::new("free old cells");
            self.swap_buffers();
        }
    }
}

#[wasm_bindgen]
impl World {
    pub fn clear(&mut self) {
        for cell in self.data.iter_mut() {
            *cell = Cell::Dead;
        }
    }

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

    pub fn set_cell(&mut self, x: u32, y: u32, state: Cell) {
        let ix = self.get_index(x, y);
        self.data[ix] = state;
    }

    pub fn data(&self) -> *const Cell {
        self.data.as_ptr()
    }

    pub fn tick_js(&mut self) {
        self.tick();
    }

    pub fn new() -> World {
        let width = 128;
        let height = 128;

        let data = (0..width * height)
            .map(|i| {
                if i % 2 == 0 || i % 7 == 0 {
                    Cell::Alive
                } else {
                    Cell::Dead
                }
            })
            .collect();
        let next_data = (0..width * height).map(|_| Cell::Dead).collect();

        World {
            width,
            height,
            data,
            next_data,
        }
    }

    pub fn render(&self) -> String {
        self.to_string()
    }

    pub fn toggle_cell(&mut self, x: u32, y: u32) {
        let ix = self.get_index(x, y);
        self.data[ix].toggle()
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
        assert_eq!(world.live_neighbour_count(0, 1, 2, 0, 1, 2), 0);
    }
}

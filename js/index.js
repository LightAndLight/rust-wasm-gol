import { memory } from "../rust/pkg/rust_wasm_gol_bg.wasm";
import("../rust/pkg/rust_wasm_gol.js").then(
  module => {
    const { Cell, World } = module;

    const CELL_SIZE = 5;
    const GRID_COLOR = "#CCCCCC";
    const DEAD_COLOR = "#FFFFFF";
    const ALIVE_COLOR = "#000000";

    const world = World.new();
    const width = world.width();
    const height = world.height();

    const canvas = document.getElementById("gol-canvas");
    canvas.width = (CELL_SIZE + 1) * width + 1;
    canvas.height = (CELL_SIZE + 1) * height + 1;

    const ctx = canvas.getContext("2d");

    const bottom = (CELL_SIZE + 1) * height + 1;
    const right = (CELL_SIZE + 1) * width + 1;

    const drawGrid = () => {
      ctx.beginPath();
      ctx.strokeStyle = GRID_COLOR;

      // vertical lines
      for (let i = 0; i <= width; i++) {
        const x = i * (CELL_SIZE + 1) + 1;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, bottom);
      }

      // horizontal lines
      for (let j = 0; j <= height; j++) {
        const y = j * (CELL_SIZE + 1) + 1
        ctx.moveTo(0, y);
        ctx.lineTo(right, y);
      }

      ctx.stroke();
    };

    const getIndex = (x, y) => {
      return y * width + x;
    };

    const drawCells = () => {
      const dataPtr = world.data();
      const cells = new Uint8Array(memory.buffer, dataPtr, width * height);

      ctx.beginPath();

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = getIndex(x, y);

          ctx.fillStyle = cells[idx] === Cell.Dead
            ? DEAD_COLOR
            : ALIVE_COLOR;

          ctx.fillRect(
            x * (CELL_SIZE + 1) + 1,
            y * (CELL_SIZE + 1) + 1,
            CELL_SIZE,
            CELL_SIZE
          );
        }
      }

      ctx.stroke();
    };

    const loop = () => {
      world.tick();

      drawGrid();
      drawCells();

      requestAnimationFrame(loop)
    };

    requestAnimationFrame(loop);
  }
)
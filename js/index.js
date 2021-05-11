import { memory } from "../rust/pkg/rust_wasm_gol_bg.wasm";
import("../rust/pkg/rust_wasm_gol.js").then(
  module => {
    const { start, Cell, World } = module;

    start(process.env.DEBUG);

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
    canvas.addEventListener("click", event => {
      const boundingRect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / boundingRect.width;
      const scaleY = canvas.height / boundingRect.height;

      const xPx = (event.clientX - boundingRect.left) * scaleX;
      const yPx = (event.clientY - boundingRect.top) * scaleY;

      const xCell = Math.min(Math.floor(xPx / (CELL_SIZE + 1)), width - 1);
      const yCell = Math.min(Math.floor(yPx / (CELL_SIZE + 1)), height - 1);

      world.toggle_cell(xCell, yCell);
      drawGrid();
      drawCells();
    })

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

    let animationId = null;

    const loop = () => {
      world.tick();

      drawGrid();
      drawCells();

      animationId = requestAnimationFrame(loop)
    };

    const isPaused = () => {
      return animationId === null;
    };

    const playPauseButton = document.getElementById("play-pause");

    const play = () => {
      playPauseButton.textContent = "⏸";
      animationId = loop();
    };

    const pause = () => {
      playPauseButton.textContent = "▶";
      cancelAnimationFrame(animationId);
      animationId = null;
    };

    playPauseButton.addEventListener("click", _ => {
      if (isPaused()) {
        play();
      } else {
        pause();
      }
    });

    const resetButton = document.getElementById("reset");

    const reset = () => {
      world.clear();
    };

    resetButton.addEventListener("click", _ => {
      reset();
    });

    play();
  }
)
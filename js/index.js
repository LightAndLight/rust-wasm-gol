import { memory } from "../rust/pkg/rust_wasm_gol_bg.wasm";

const fps = new class {
  constructor() {
    this.fps = document.getElementById("fps");
    this.frames = [];
    this.lastFrameTimeStamp = performance.now();
  }

  render() {
    const now = performance.now();
    const delta = now - this.lastFrameTimeStamp;
    this.lastFrameTimeStamp = now;
    const fps =
      // delta: milliseconds
      // 1 / (delta / 1000)
      // =
      1 / delta * 1000;

    this.frames.push(fps);
    if (this.frames.length > 100) {
      this.frames.shift();
    }

    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    for (let i = 0; i < this.frames.length; i++) {
      sum += this.frames[i];
      min = Math.min(this.frames[i], min);
      max = Math.max(this.frames[i], max);
    }
    let mean = sum / this.frames.length;

    this.fps.textContent = `
Frames per Second:
         latest = ${Math.round(fps)}
avg of last 100 = ${Math.round(mean)}
min of last 100 = ${Math.round(min)}
max of last 100 = ${Math.round(max)}
`.trim();
  }
};

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

    const canvas2grid = (clientX, clientY) => {

      const boundingRect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / boundingRect.width;
      const scaleY = canvas.height / boundingRect.height;

      const xPx = (event.clientX - boundingRect.left) * scaleX;
      const yPx = (event.clientY - boundingRect.top) * scaleY;

      return {
        x: Math.min(Math.floor(xPx / (CELL_SIZE + 1)), width - 1),
        y: Math.min(Math.floor(yPx / (CELL_SIZE + 1)), height - 1)
      }
    }

    const canvas = document.getElementById("gol-canvas");
    canvas.width = (CELL_SIZE + 1) * width + 1;
    canvas.height = (CELL_SIZE + 1) * height + 1;
    canvas.addEventListener("click", event => {
      const { x, y } = canvas2grid(event.clientX, event.clientY);
      world.toggle_cell(x, y);
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

      ctx.fillStyle = ALIVE_COLOR;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = getIndex(x, y);

          if (cells[idx] === Cell.Alive) {
            ctx.fillRect(
              x * (CELL_SIZE + 1) + 1,
              y * (CELL_SIZE + 1) + 1,
              CELL_SIZE,
              CELL_SIZE
            );

          }
        }
      }

      ctx.fillStyle = DEAD_COLOR;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = getIndex(x, y);

          if (cells[idx] === Cell.Dead) {
            ctx.fillRect(
              x * (CELL_SIZE + 1) + 1,
              y * (CELL_SIZE + 1) + 1,
              CELL_SIZE,
              CELL_SIZE
            );

          }
        }
      }

      ctx.stroke();
    };

    var paused = false;

    const loop = () => {
      fps.render();
      if (!paused) {
        world.tick_js();
      }
      drawGrid();
      drawCells();

      requestAnimationFrame(loop)
    };

    const playPauseButton = document.getElementById("play-pause");

    const play = () => {
      playPauseButton.textContent = "⏸";
      paused = false;
    };

    const pause = () => {
      playPauseButton.textContent = "▶";
      paused = true;
    };

    playPauseButton.addEventListener("click", _ => {
      if (paused) {
        play();
      } else {
        pause();
      }
    });

    var drawing = false;
    var lastDrawn = null;
    const draw = (clientX, clientY) => {
      const { x, y } = canvas2grid(clientX, clientY);
      if (lastDrawn == null || lastDrawn.x !== x || lastDrawn.y !== y) {
        world.set_cell(x, y, Cell.Alive);
        lastDrawn = { x, y };
      }
    };
    canvas.addEventListener("mousedown", event => {
      drawing = true;
      draw(event.clientX, event.clientY);
    });
    canvas.addEventListener("mousemove", event => {
      if (drawing) {
        draw(event.clientX, event.clientY);
      }
    });

    const stopDrawing = () => {
      drawing = false;
      lastDrawn = null;
    };
    canvas.addEventListener("mouseup", _ => {
      stopDrawing();
    });
    canvas.addEventListener("mouseout", _ => {
      stopDrawing();
    });


    const resetButton = document.getElementById("reset");

    const reset = () => {
      world.clear();
    };

    resetButton.addEventListener("click", _ => {
      reset();
    });

    play();
    loop();
  }
)
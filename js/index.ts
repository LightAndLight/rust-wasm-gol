import { Fps } from "./fps";
import { ShaderProgram, cellVertex, cellFragment, gridVertex, gridFragment } from "./shaders";
import { Program, Buffer, VertexArrayObject, clear, drawArrays, FragmentShader, VertexShader, drawArraysInstanced } from "./bettergl";

const fps = new Fps();

(async function () {
  const { start, Cell, World } = await import("../rust/pkg/rust_wasm_gol.js");
  const { memory } = await import("../rust/pkg/rust_wasm_gol_bg.wasm");

  start(process.env.DEBUG === "true");

  const GRID_COLOR = { r: 204 / 255, g: 204 / 255, b: 204 / 255 };
  const ALIVE_COLOR = { r: 0, g: 0, b: 0 };
  const DEAD_COLOR = { r: 1, g: 1, b: 1 };

  const world = World.new();
  const width = world.width();
  const height = world.height();

  const canvas = <HTMLCanvasElement>document.getElementById("gol-canvas")!;

  const devicePixelRatio = window.devicePixelRatio || 1;
  const CELL_SIZE = 5;
  const CANVAS_PIXELS = devicePixelRatio;
  // width + 1 accounts for the 1px gridlines
  // const CANVAS_WIDTH = (width * CELL_SIZE + width + 1) * CANVAS_PIXELS;
  const CANVAS_WIDTH = (width * (CELL_SIZE + 1) + 1) * CANVAS_PIXELS;
  // similarly for height
  const CANVAS_HEIGHT = (height * (CELL_SIZE + 1) + 1) * CANVAS_PIXELS;

  const gl: WebGL2RenderingContext = canvas.getContext("webgl2")!;
  if (!gl) {
    console.log("failed to get webgl2 context");
  }

  canvas.style.width = `${CANVAS_WIDTH / CANVAS_PIXELS}px`;
  canvas.style.height = `${CANVAS_HEIGHT / CANVAS_PIXELS}px`;
  gl.canvas.width = CANVAS_WIDTH;
  gl.canvas.height = CANVAS_HEIGHT;

  gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const gridProgram =
    Program.new(
      gl,
      VertexShader.new(gl, (new ShaderProgram([gridVertex])).generate()),
      FragmentShader.new(gl, (new ShaderProgram([gridFragment])).generate())
    );

  const posLocation = gridProgram.getAttribLocation("pos");
  const offsetLocation = gridProgram.getAttribLocation("offset");
  const resolutionLocation = gridProgram.getUniformLocation("resolution");
  const colorLocation = gridProgram.getUniformLocation("color");

  const horizontalVao = new VertexArrayObject(gl);
  horizontalVao.bind((boundVao) => {
    boundVao.enableVertexAttribArray(posLocation);
    boundVao.enableVertexAttribArray(offsetLocation);

    const horizontalVertexBuffer = new Buffer(gl);
    horizontalVertexBuffer.bindArrayBuffer((boundArrayBuffer) => {
      boundArrayBuffer.setData(
        new Float32Array([
          0, 0,
          0, 1 * CANVAS_PIXELS,
          CANVAS_WIDTH, 0,
          CANVAS_WIDTH, 1 * CANVAS_PIXELS
        ]),
        gl.STATIC_DRAW
      );
      boundVao.vertexAttribPointer(boundArrayBuffer, posLocation, {
        size: 2,
        type: gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      });
    });

    const horizontalOffsetsBuffer = new Buffer(gl);
    horizontalOffsetsBuffer.bindArrayBuffer((boundArrayBuffer) => {
      var offsets = [];
      for (var y = 0; y < CANVAS_HEIGHT; y += (CELL_SIZE + 1) * CANVAS_PIXELS) {
        offsets.push(0, y);
      }
      console.assert(offsets.length / 2 === height + 1, offsets.length / 2);
      boundArrayBuffer.setData(
        new Float32Array(offsets),
        gl.STATIC_DRAW
      );
      boundVao.vertexAttribPointer(boundArrayBuffer, offsetLocation, {
        size: 2,
        type: gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      });
      boundVao.vertexAttribDivisor(offsetLocation, 1);
    });
  });

  const verticalVao = new VertexArrayObject(gl);
  verticalVao.bind((boundVao) => {
    boundVao.enableVertexAttribArray(posLocation);
    boundVao.enableVertexAttribArray(offsetLocation);

    const verticalVertexBuffer = new Buffer(gl);
    verticalVertexBuffer.bindArrayBuffer((boundArrayBuffer) => {
      boundArrayBuffer.setData(
        new Float32Array([
          0, 0,
          1 * CANVAS_PIXELS, 0,
          0, CANVAS_HEIGHT,
          1 * CANVAS_PIXELS, CANVAS_HEIGHT
        ]),
        gl.STATIC_DRAW
      );
      boundVao.vertexAttribPointer(boundArrayBuffer, posLocation, {
        size: 2,
        type: gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      });
    });

    const verticalOffsetsBuffer = new Buffer(gl);
    verticalOffsetsBuffer.bindArrayBuffer((boundArrayBuffer) => {
      var offsets = [];
      for (var x = 0; x < CANVAS_WIDTH; x += (CELL_SIZE + 1) * CANVAS_PIXELS) {
        offsets.push(x, 0);
      }
      console.assert(offsets.length / 2 === width + 1, offsets.length / 2);
      boundArrayBuffer.setData(
        new Float32Array(offsets),
        gl.STATIC_DRAW
      );
      boundVao.vertexAttribPointer(boundArrayBuffer, offsetLocation, {
        size: 2,
        type: gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      });
      boundVao.vertexAttribDivisor(offsetLocation, 1);
    });
  });

  const cellProgram =
    Program.new(
      gl,
      VertexShader.new(gl, (new ShaderProgram([cellVertex])).generate()),
      FragmentShader.new(gl, (new ShaderProgram([cellFragment])).generate())
    );

  const cellResolutionLocation = cellProgram.getUniformLocation("resolution");

  const cellsVao = new VertexArrayObject(gl);
  const cellColorsBuffer = new Buffer(gl);

  cellsVao.bind((boundVao) => {
    const cellPosLocation = cellProgram.getAttribLocation("pos");
    boundVao.enableVertexAttribArray(cellPosLocation);

    const cellVertexBuffer = new Buffer(gl);
    cellVertexBuffer.bindArrayBuffer((boundArrayBuffer) => {
      boundArrayBuffer.setData(
        new Float32Array([
          0, 0,
          0, CELL_SIZE * CANVAS_PIXELS,
          CELL_SIZE * CANVAS_PIXELS, 0,
          CELL_SIZE * CANVAS_PIXELS, CELL_SIZE * CANVAS_PIXELS
        ]),
        gl.STATIC_DRAW
      )
      boundVao.vertexAttribPointer(boundArrayBuffer, cellPosLocation, {
        size: 2,
        type: gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      });
    })

    const cellOffsetLocation = cellProgram.getAttribLocation("offset");
    boundVao.enableVertexAttribArray(cellOffsetLocation);
    boundVao.vertexAttribDivisor(cellOffsetLocation, 1);

    const cellOffsetBuffer = new Buffer(gl);
    cellOffsetBuffer.bindArrayBuffer((boundArrayBuffer) => {
      var offsets = [];
      // the squares begin at (1, 1) because we don't want to draw them on top
      // of the grid lines
      // also, after adding CELL_SIZE, the offset would intersect
      // with a 1px-width line. so we add `CELL_SIZE + 1` to jump
      // over the gridline
      for (var y = 1 * CANVAS_PIXELS; y < CANVAS_HEIGHT; y += (CELL_SIZE + 1) * CANVAS_PIXELS) {
        for (var x = 1 * CANVAS_PIXELS; x < CANVAS_WIDTH; x += (CELL_SIZE + 1) * CANVAS_PIXELS) {
          offsets.push(x, y);
        }
      }
      console.assert(offsets.length / 2 === width * height, offsets.length / 2);

      boundArrayBuffer.setData(
        new Float32Array(offsets),
        gl.STATIC_DRAW
      )
      boundVao.vertexAttribPointer(boundArrayBuffer, cellOffsetLocation, {
        size: 2,
        type: gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      });
    })

    const cellColorLocation = cellProgram.getAttribLocation("color");
    boundVao.enableVertexAttribArray(cellColorLocation);
    boundVao.vertexAttribDivisor(cellColorLocation, 1);

    cellColorsBuffer.bindArrayBuffer((boundArrayBuffer) => {
      boundArrayBuffer.setData(
        new Float32Array(width * height * 3),
        gl.DYNAMIC_DRAW
      );
      boundVao.vertexAttribPointer(boundArrayBuffer, cellColorLocation, {
        size: 3,
        type: gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      })
    })
  });

  let animationId: number | null = null;
  var cellColors: Float32Array = new Float32Array(width * height * 3);

  const loop = () => {
    fps.render();

    const cells = new Uint8Array(memory.buffer, world.data(), width * height);

    console.time("calculate colours");
    for (var ix = 0; ix < cells.length; ix++) {
      const colorsIx = ix * 3;
      if (cells[ix] === Cell.Alive) {
        cellColors[colorsIx] = ALIVE_COLOR.r;
        cellColors[colorsIx + 1] = ALIVE_COLOR.g;
        cellColors[colorsIx + 2] = ALIVE_COLOR.b;
      } else {
        cellColors[colorsIx] = DEAD_COLOR.r;
        cellColors[colorsIx + 1] = DEAD_COLOR.g;
        cellColors[colorsIx + 2] = DEAD_COLOR.b;
      }
    }
    console.timeEnd("calculate colours");

    console.time("upload colours");
    cellColorsBuffer.bindArrayBuffer((boundArrayBuffer) => {
      boundArrayBuffer.bufferSubData({
        dstByteOffset: 0,
        srcData: cellColors,
        srcOffset: 0,
        length: cellColors.length
      });
    });
    console.timeEnd("upload colours");

    console.time("clear");
    clear(gl, 0, 0, 0, 0);
    console.timeEnd("clear");

    console.time("draw grid");
    gridProgram.use((currentProgram) => {
      currentProgram.uniform2f(resolutionLocation, CANVAS_WIDTH, CANVAS_HEIGHT);
      currentProgram.uniform4f(colorLocation, GRID_COLOR.r, GRID_COLOR.g, GRID_COLOR.b, 1);

      horizontalVao.bind((boundVao) => {
        drawArraysInstanced(gl, currentProgram, boundVao, {
          primitive: gl.TRIANGLE_STRIP,
          offset: 0,
          count: 4,
          instanceCount: height + 1
        });
      });

      verticalVao.bind((boundVao) => {
        drawArraysInstanced(gl, currentProgram, boundVao, {
          primitive: gl.TRIANGLE_STRIP,
          offset: 0,
          count: 4,
          instanceCount: width + 1
        });
      });
    });
    console.timeEnd("draw grid");

    console.time("draw cells");
    cellProgram.use((currentProgram) => {
      currentProgram.uniform2f(cellResolutionLocation, CANVAS_WIDTH, CANVAS_HEIGHT);

      cellsVao.bind((boundVao) => {
        drawArraysInstanced(gl, currentProgram, boundVao, {
          primitive: gl.TRIANGLE_STRIP,
          offset: 0,
          count: 4,
          instanceCount: width * height
        });
      })
    });
    console.timeEnd("draw cells");

    console.time("tick");
    world.tick_js();
    console.timeEnd("tick");

    animationId = requestAnimationFrame(loop)
  };

  const isPaused = () => {
    return animationId === null;
  };

  const playPauseButton = document.getElementById("play-pause")!;

  const play = () => {
    playPauseButton.textContent = "⏸";
    loop();
  };

  const pause = () => {
    playPauseButton.textContent = "▶";
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  playPauseButton.addEventListener("click", _ => {
    if (isPaused()) {
      play();
    } else {
      pause();
    }
  });

  play();

  /*
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
  
  
  
  
  const resetButton = document.getElementById("reset");
  
  const reset = () => {
    world.clear();
  };
  
  resetButton.addEventListener("click", _ => {
    reset();
  });
  */

})();

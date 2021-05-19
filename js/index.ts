import { Fps } from "./fps.js";
import { ShaderProgram, cellVertex, cellFragment, gridVertex, gridFragment } from "./shaders";
import { Program, Buffer, VertexArrayObject, clear, drawArrays, FragmentShader, VertexShader, drawArraysInstanced } from "./bettergl";

const fps = new Fps();

(async function () {
  const { start, Cell, World } = await import("../rust/pkg/rust_wasm_gol.js");
  const { memory } = await import("../rust/pkg/rust_wasm_gol_bg.wasm");

  start(process.env.DEBUG === "true");

  const GRID_COLOR = "#CCCCCC";
  const DEAD_COLOR = "#FFFFFF";

  const world = World.new();
  const width = world.width();
  const height = world.height();

  const canvas = <HTMLCanvasElement>document.getElementById("gol-canvas")!;

  const devicePixelRatio = window.devicePixelRatio || 1;
  const CELL_SIZE = 5;
  const CANVAS_PIXELS = devicePixelRatio;
  // width + 1 accounts for the 1px gridlines
  // canvas.style.width = `${width * CELL_SIZE + width + 1}px`;
  canvas.style.width = `${width * (CELL_SIZE + 1) + 1}px`;
  // similarly for height
  canvas.style.height = `${height * (CELL_SIZE + 1) + 1}px`;

  const gl: WebGL2RenderingContext = canvas.getContext("webgl2")!;
  if (!gl) {
    console.log("failed to get webgl2 context");
  }

  gl.canvas.width = canvas.clientWidth * CANVAS_PIXELS;
  gl.canvas.height = canvas.clientHeight * CANVAS_PIXELS;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

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
          gl.canvas.width, 0,
          gl.canvas.width, 1 * CANVAS_PIXELS
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
      for (var y = 0; y < gl.canvas.height; y += (CELL_SIZE + 1) * CANVAS_PIXELS) {
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
          0, gl.canvas.height,
          1 * CANVAS_PIXELS, gl.canvas.height
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
      for (var x = 0; x < gl.canvas.width; x += (CELL_SIZE + 1) * CANVAS_PIXELS) {
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
  const cellColoursBuffer = new Buffer(gl);

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
      for (var y = 1 * CANVAS_PIXELS; y < gl.canvas.height; y += (CELL_SIZE + 1) * CANVAS_PIXELS) {
        for (var x = 1 * CANVAS_PIXELS; x < gl.canvas.width; x += (CELL_SIZE + 1) * CANVAS_PIXELS) {
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

    const cellColourLocation = cellProgram.getAttribLocation("colour");
    boundVao.enableVertexAttribArray(cellColourLocation);
    boundVao.vertexAttribDivisor(cellColourLocation, 1);

    cellColoursBuffer.bindArrayBuffer((boundArrayBuffer) => {
      boundArrayBuffer.setData(
        new Float32Array(width * height * 3),
        gl.DYNAMIC_DRAW
      );
      boundVao.vertexAttribPointer(boundArrayBuffer, cellColourLocation, {
        size: 3,
        type: gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      })
    })
  });

  clear(gl, 0, 0, 0, 0);

  const getIndex = (x: number, y: number) => {
    return y * width + x;
  };

  const cells = new Uint8Array(memory.buffer, world.data(), width * height);

  var cellColours: number[] = [];
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      if (cells[getIndex(x, y)] == Cell.Alive) {
        cellColours.push(1, 1, 1);
      } else {
        cellColours.push(0, 0, 0);
      }
    }
  }

  cellColoursBuffer.bindArrayBuffer((boundArrayBuffer) => {
    boundArrayBuffer.bufferSubData({
      dstByteOffset: 0,
      srcData: new Float32Array(cellColours),
      srcOffset: 0,
      length: cellColours.length
    });
  });

  gridProgram.use((currentProgram) => {
    currentProgram.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    currentProgram.uniform4f(colorLocation, 204 / 255, 204 / 255, 204 / 255, 1);

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

  cellProgram.use((currentProgram) => {
    currentProgram.uniform2f(cellResolutionLocation, gl.canvas.width, gl.canvas.height);

    cellsVao.bind((boundVao) => {
      drawArraysInstanced(gl, currentProgram, boundVao, {
        primitive: gl.TRIANGLE_STRIP,
        offset: 0,
        count: 4,
        instanceCount: width * height
      });
    })
  });

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
  
  let animationId = null;
  
  const loop = () => {
    fps.render();
    world.tick_js();
  
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
  */

})();

import { Slicer } from "./slicer.mjs";
import { OutputRenderer } from "./output_renderer.mjs";

const inputCanvas = document.querySelector("#input-canvas");
const outputCanvas = document.querySelector("#output-canvas");
const fileInput = document.querySelector("#file-selector");
const sampleSizeInput = document.querySelector("#sample-size");
const inputSizeOutput = document.querySelector("#input-size");
const aspectRatioOutput = document.querySelector("#aspect-ratio");
const hexagonTotalOutput = document.querySelector("#hexagon-total");

fileInput.addEventListener("change", () => {
  const firstFile = fileInput.files[0];
  loadImageFromFile(firstFile);
});

sampleSizeInput.addEventListener("change", () => {
  if (fileInput.files[0] == null) {
    null;
  }
  process();
});

function loadImageFromFile(file) {
  createImageBitmap(file).then((bitmap) => {
    inputCanvas.width = bitmap.width;
    inputCanvas.height = bitmap.height;
    const context = inputCanvas.getContext("2d");
    context.drawImage(bitmap, 0, 0);
    inputSizeOutput.textContent = `${bitmap.width}x${bitmap.height}`;
    aspectRatioOutput.textContent = Math.abs(
      Math.round((bitmap.width / bitmap.height) * 100) / 100
    );
    process();
  });
}

function process() {
  const sampleSize = Number(sampleSizeInput.value);
  const slicer = new Slicer(sampleSize, 12);

  const outputContext = outputCanvas.getContext("2d");
  outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

  slicer.setCanvas(inputCanvas);
  const hexagons = slicer.process();

  hexagonTotalOutput.textContent = slicer.columns * slicer.rows;

  const renderer = new OutputRenderer(outputCanvas, 20, [
    slicer.columns,
    slicer.rows,
  ]);

  renderer.render(hexagons);
}

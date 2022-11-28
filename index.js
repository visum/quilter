import { Slicer } from "./slicer.mjs";
import { OutputRenderer } from "./output_renderer.mjs";

const inputCanvas = document.querySelector("#input");
const outputCanvas = document.querySelector("#output");
const fileInput = document.querySelector("#file-selector");

fileInput.addEventListener("change", () => {
  const firstFile = fileInput.files[0];
  loadImageFromFile(firstFile);
});

function loadImageFromFile(file) {
  createImageBitmap(file).then((bitmap) => {
    inputCanvas.width = bitmap.width;
    inputCanvas.height = bitmap.height;
    const context = inputCanvas.getContext("2d");
    context.drawImage(bitmap, 0, 0);

    const slicer = new Slicer(50, 12);
    slicer.setCanvas(inputCanvas);
    const hexagons = slicer.process();

    const renderer = new OutputRenderer(outputCanvas, 20, [
      slicer.columns,
      slicer.rows,
    ]);

    renderer.render(hexagons);
  });
}

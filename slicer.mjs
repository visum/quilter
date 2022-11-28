import { HexagonGrid } from "./hexagon_grid.mjs";

export class Slicer {
  constructor(vertexLength, numberOfColors) {
    this.canvas = null;
    this.vertexLength = vertexLength;
    this.numberOfColors = numberOfColors;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  setNumberOfColors(newValue) {
    this.numberOfColors = newValue;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get columns() {
    return this.hexGrid.numColumns;
  }

  get rows() {
    return this.hexGrid.numRows;
  }

  process() {
    if (this.canvas == null) {
      throw new Error("Canvas has not been set");
    }

    const context = this.canvas.getContext("2d", { willReadFrequently: true });

    const imageWidth = this.canvas.width;
    const imageHeight = this.canvas.height;

    const hexGrid = new HexagonGrid(this.vertexLength);

    hexGrid.setGridDimensions(imageWidth, imageHeight);

    this.hexGrid = hexGrid;

    const result = []; // a 2d array of hexagon colors
    this.result = result;

    for (let rowIndex = 0; rowIndex < hexGrid.numRows; rowIndex++) {
      for (let colIndex = 0; colIndex < hexGrid.numColumns; colIndex++) {
        const hexagon = hexGrid.getHexagonForPosition(colIndex, rowIndex);
        const top = hexagon[1][1];
        const left = hexagon[0][0];

        const data = context.getImageData(
          left,
          top,
          hexGrid.hexagonWidth,
          hexGrid.hexagonHeight
        );

        const trimmedData = this._filterHexagonPixels(hexagon, data, [
          left,
          top,
        ]);
        const averageColor = this._getAverageColor(trimmedData);

        result[rowIndex] = result[rowIndex] || [];
        result[rowIndex][colIndex] = averageColor;
        this._handleResultUpdate();
      }
    }

    return result;
  }

  _filterHexagonPixels(hexagon, pixels, [offsetX, offsetY]) {
    const output = [];

    for (let rowIndex = 0; rowIndex < this.hexGrid.hexagonHeight; rowIndex++) {
      const rowStartIndex =
        rowIndex * Math.floor(this.hexGrid.hexagonWidth) * 4;
      const rowEndIndex =
        (rowIndex + 1) * Math.floor(this.hexGrid.hexagonWidth) * 4;

      const rowData = pixels.data.slice(rowStartIndex, rowEndIndex);
      for (
        let columnIndex = 0;
        columnIndex < this.hexGrid.hexagonWidth;
        columnIndex++
      ) {
        if (
          this.hexGrid.isPointInHexagon(
            [columnIndex + offsetX, rowIndex + offsetY],
            hexagon
          )
        ) {
          const columnStartIndex = columnIndex * 4;

          const pixel = [
            rowData[columnStartIndex], // r
            rowData[columnStartIndex + 1], // g
            rowData[columnStartIndex + 2], // b
            rowData[columnStartIndex + 3], // a
          ];

          output.push(...pixel);
        }
      }
    }
    return output;
  }

  _getAverageColor(pixelsData) {
    const r = [];
    const g = [];
    const b = [];
    const a = [];
    let index = 0;
    while (index < pixelsData.length) {
      if (pixelsData[index] != null) {
        r.push(pixelsData[index]);
        g.push(pixelsData[index + 1]);
        b.push(pixelsData[index + 2]);
        a.push(pixelsData[index + 3]);
      }
      index += 4;
    }

    const rAverage = r.reduce((a, b) => a + b, 0) / r.length;
    const gAverage = g.reduce((a, b) => a + b, 0) / g.length;
    const bAverage = b.reduce((a, b) => a + b, 0) / b.length;
    const aAverage = a.reduce((a, b) => a + b, 0) / a.length;

    return [
      Math.floor(rAverage),
      Math.floor(gAverage),
      Math.floor(bAverage),
      Math.floor(aAverage),
    ];
  }

  _handleResultUpdate() {
    if (typeof this.onResultUpdate === "function") {
      this.onResultUpdate();
    }
  }
}

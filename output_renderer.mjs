import { HexagonGrid } from "./hexagon_grid.mjs";

export class OutputRenderer {
  constructor(canvas, vertexSize, [numColumns, numRows]) {
    this.canvas = canvas;
    this.vertexSize = vertexSize;
    this.context = canvas.getContext("2d");
    this.numColumns = numColumns;
    this.numRows = numRows;
  }

  render(data) {
    // 2d array of hexagon colors
    const hexGrid = new HexagonGrid(this.vertexSize);
    const { numRows, numColumns } = this;

    hexGrid.setGridColumnsAndRows(numColumns, numRows);

    this.canvas.width = hexGrid.width;
    this.canvas.height = hexGrid.height;

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      for (let colIndex = 0; colIndex < numColumns; colIndex++) {
        if (data[rowIndex] == null || data[rowIndex][colIndex] == null) {
          continue;
        }
        const hexagon = hexGrid.getHexagonForPosition(colIndex, rowIndex);
        const color = [
          data[rowIndex][colIndex][0],
          data[rowIndex][colIndex][1],
          data[rowIndex][colIndex][2],
          data[rowIndex][colIndex][3],
        ];

        this.context.beginPath();
        this.context.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
        this.context.moveTo(hexagon[0][0], hexagon[0][1]);
        this.context.lineTo(hexagon[1][0], hexagon[1][1]);
        this.context.lineTo(hexagon[2][0], hexagon[2][1]);
        this.context.lineTo(hexagon[3][0], hexagon[3][1]);
        this.context.lineTo(hexagon[4][0], hexagon[4][1]);
        this.context.lineTo(hexagon[5][0], hexagon[5][1]);
        this.context.lineTo(hexagon[0][0], hexagon[0][1]);

        this.context.fill();
      }
    }
  }
}

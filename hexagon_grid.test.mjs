import assert from "assert";
import { HexagonGrid } from "./hexagon_grid.mjs";

const tests = [
  [
    "Constructs",
    () => {
      const grid = new HexagonGrid(5);
      assert(grid);
    },
  ],
  [
    "Get hexagon width",
    () => {
      const grid = new HexagonGrid(5);
      const extension = Math.cos(Math.PI * (1 / 3)) * 5;
      const width = 2 * extension + 5;
      assert(grid.hexagonWidth === width);
    },
  ],
  [
    "Get hexagon height",
    () => {
      const grid = new HexagonGrid(5);
      const halfHeight = Math.sin((Math.PI * 1) / 3) * 5;
      const height = 2 * halfHeight;
      assert(grid.hexagonHeight === height);
    },
  ],
  [
    "set grid by pixel width",
    () => {
      const grid = new HexagonGrid(5);
      grid.setGridDimensions(30, 18);
      assert(grid.numColumns === 2);
      assert(grid.numRows === 3);
    },
  ],
  [
    "set grid by cols, rows",
    () => {
      const grid = new HexagonGrid(5);
      grid.setGridColumnsAndRows(2, 3);
      assert(grid.width === 30);
      assert(grid.height > 12 && grid.height < 13);
    },
  ],
];

tests.forEach((test) => {
  console.log(test[0]);
  test[1]();
});

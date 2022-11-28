/*
  Hexagon points

    b-----c 
   /       \
  a         d
   \       /
    f-----e

  */

export class HexagonGrid {
  constructor(vertexLength) {
    this.vertexLength = vertexLength;
    this.numRows = 0;
    this.numColumns = 0;
    this.width = 0;
    this.height = 0;
  }

  get hexagonWidth() {
    return (
      2 * (Math.cos((1 / 3) * Math.PI) * this.vertexLength) + this.vertexLength
    );
  }

  get hexagonHeight() {
    return 2 * (Math.sin((1 / 3) * Math.PI) * this.vertexLength);
  }

  setGridColumnsAndRows(numColumns, numRows) {
    this.numColumns = numColumns;
    this.numRows = numRows;
    const extension = Math.cos(Math.PI * (1 / 3)) * this.vertexLength;

    this.height = (numRows * this.hexagonHeight) / 2 + this.hexagonHeight / 2;
    this.width =
      this.numColumns * (this.hexagonWidth + this.vertexLength) + extension;
  }

  setGridDimensions(width, height) {
    const columnHexagonWidth = this.hexagonWidth + this.vertexLength;
    const numRows = Math.ceil(height / (this.hexagonHeight / 2));
    const numColumns = Math.ceil(width / columnHexagonWidth);

    this.numRows = numRows;
    this.numColumns = numColumns;

    this.height = height;
    this.width = width;
  }

  getHexagonForPosition(column, row) {
    // the small side of a right triangle with line a -> b as hypotonuse
    const extension = Math.cos(Math.PI * (1 / 3)) * this.vertexLength;

    const hexagonHeight = this.hexagonHeight;
    const aX = column * (this.hexagonWidth + this.vertexLength);
    const aY = row * (hexagonHeight / 2) + hexagonHeight / 2;

    const bX = aX + extension;
    const bY = row * (hexagonHeight / 2);

    const cX = bX + this.vertexLength;
    const cY = bY;

    const dX = cX + extension;
    const dY = aY;

    const eX = cX;
    const eY = bY + hexagonHeight;

    const fX = bX;
    const fY = eY;

    let points = [
      [aX, aY],
      [bX, bY],
      [cX, cY],
      [dX, dY],
      [eX, eY],
      [fX, fY],
    ];

    if (row % 2 === 1) {
      points = points.map(([x, y]) => [x + this.vertexLength + extension, y]);
    }

    return points;
  }

  isPointInHexagon([x, y], hexagon) {
    const xMin = hexagon[0][0]; // aX
    const xMax = hexagon[3][0]; // dX
    const yMin = hexagon[1][1]; // bY
    const yMax = hexagon[4][1]; // eY

    // "broad" phase - bounding box
    const inXBounds = x >= xMin && x <= xMax;
    if (!inXBounds) {
      return false;
    }
    const inYBounds = y >= yMin && y <= yMax;
    if (!inYBounds) {
      return false;
    }

    // "narrow" phase
    // find x offset given deltaY from point b
    const subExtension = Math.tan(Math.PI * (1 / 6)) * y;
    if (y <= hexagon[0][1]) {
      // top half of the hexagon
      const xBoundMin = hexagon[1][0] - subExtension;
      const xBoundMax = hexagon[2][0] + subExtension;
      return x >= xBoundMin && x <= xBoundMax;
    } else {
      // bottom half of the hexagon
      const xBoundMin = hexagon[5][0] - subExtension;
      const xBoundMax = hexagon[4][0] + subExtension;
      return x >= xBoundMin && x <= xBoundMax;
    }
  }
}

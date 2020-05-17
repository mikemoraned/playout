export function positionFor(x, y) {
  return `${x}_${y}`;
}

export function expandToNextToArea(position, dimensions) {
  const { width, height } = dimensions;
  const match = /(\d+)_(\d+)/.exec(position);
  const x = parseInt(match[1]);
  const y = parseInt(match[2]);
  const areaPositions = [];
  for (let xArea = x - 1; xArea <= x + 1; xArea++) {
    for (let yArea = y - 1; yArea <= y + 1; yArea++) {
      if (0 <= xArea && xArea < width && 0 <= yArea && yArea < height) {
        const areaPosition = positionFor(xArea, yArea);
        if (areaPosition !== position) {
          areaPositions.push(areaPosition);
        }
      }
    }
  }
  return areaPositions;
}

export function gridFor(width, height) {
  return {
    width,
    height,
    seats: [],
    occupied: [],
  };
}

export function addRandomSeats(grid) {
  for (let x = 0; x < grid.width; x++) {
    for (let y = 0; y < grid.height; y++) {
      if (Math.random() < 0.5) {
        grid.seats.push(positionFor(x, y));
      }
    }
  }
}

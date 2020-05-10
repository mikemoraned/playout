export function positionFor(x, y) {
  return `${x}_${y}`;
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

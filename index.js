const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 4; //rows/columns we're using a square maze for now so it doesn't matter
const width = 600;
const height = 600;
const unitLength = width / cells;
const engine = Engine.create();
const { world } = engine;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width,
    height,
    wireframes: false,
  },
});
Render.run(render);
Runner.run(Runner.create(), engine);

//Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];

World.add(world, walls);

// Maze Generation
const shuffle = (arr) => {
  let counter = arr.length;

  while (counter != 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};

const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));

const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startCol = Math.floor(Math.random() * cells);

const stepThroughCell = (row, col) => {
  //If I have visited the cell at [row, col], then return
  if (grid[row][col]) {
    return;
  }

  //Mark this cell as being visited
  grid[row][col] = true;

  //Assemble randomly-ordered list of neighbors
  const neighbors = shuffle([
    [row - 1, col, "up"],
    [row, col + 1, "right"],
    [row + 1, col, "down"],
    [row, col - 1, "left"],
  ]);

  //For Each neighbor...
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;

    //See if that neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
    ) {
      continue;
    }

    //If we have visted that neighbor, continue to the next neighbor
    if (grid[nextRow][nextColumn]) {
      // remember "true" state in grid means it's unavailable bc we already visted it
      continue;
    }

    //Remove the wall from  either horizontals or verticals arrays
    //(important to remember that all verticals and horizontals are false by default
    //, and are only set to true when they've been broken through)
    if (direction === "left") {
      verticals[row][col - 1] = true;
    } else if (direction === "right") {
      verticals[row][col] = true;
    } else if (direction === "up") {
      horizontals[row - 1][col] = true;
    } else if (direction === "down") {
      horizontals[row][col] = true;
    }

    //Visit that next cell
    stepThroughCell(nextRow, nextColumn);
  }
};

stepThroughCell(startRow, startCol);

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return; // no need to draw a rectangle if there are no walls there
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength / 2,
      rowIndex * unitLength + unitLength,
      unitLength,
      10,
      { isStatic: true }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength,
      rowIndex * unitLength + unitLength / 2,
      10,
      unitLength,
      { isStatic: true }
    );
    World.add(world, wall);
  });
});

const goal = Bodies.rectangle(
  width - unitLength / 2,
  height - unitLength / 2,
  unitLength * 0.7,
  unitLength * 0.7,
  { isStatic: true }
);
World.add(world, goal);

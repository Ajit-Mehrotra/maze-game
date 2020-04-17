const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 3; //rows/columns we're using a square maze for now so it doesn't matter
const width = 1200;
const height = 500;

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
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }),
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
// const grid = [];

// for (let i = 0; i < 3; i++) {
//   grid.push([]);
//   for (let j = 0; j < 3; j++) {
//     grid.push(false);
//   }
// }

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
  const neighbor = shuffle([
    [row - 1, col],
    [row, col + 1],
    [row + 1, col],
    [row, col - 1],
  ]);
  console.log(neighbor);
  //For Each neighbor...

  //See if that neighbor is out of bounds

  //If we have visted that neighbor, continue to the next neighbor

  //Remove the wall from  either horizontals or verticals arrays

  //Visit that next cell
};

stepThroughCell(1, 1);

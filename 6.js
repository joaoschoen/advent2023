const fs = require("fs");
const readline = require("readline");

const windRose = [
  { x: -1, y: -1 },
  { x: +0, y: -1 },
  { x: +1, y: -1 },
  { x: -1, y: +0 },
  { x: +1, y: +0 },
  { x: -1, y: +1 },
  { x: +0, y: +1 },
  { x: +1, y: +1 },
];
let computed = {};
let sum = 0;

async function processLineByLine() {
  const fileStream = fs.createReadStream("input_for_5_6.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let matrix = [];
  rl.on("line", (word) => {
    matrix.push(word.split(""));
  });

  rl.on("close", () => {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        // if cell is symbol, start searching
        let cell = "" + matrix[y][x];
        if (cell.match(/\*/) !== null) {
          // for()
          check(matrix, y, x);
        }
      }
    }
    console.log(sum)
  });
}

function check(matrix, Y, X) {
  let nums = []
  for (let i = 0; i < windRose.length; i++) {
    // coordinates for the cell that's being scanned
    scan = { x: X + windRose[i].x, y: Y + windRose[i].y };
    // out of bounds check
    if (outOfBounds(matrix, scan.y, scan.x)) {
      continue;
    }

    cell = matrix[scan.y][scan.x];
    let number = "";
    // number left and right borders
    let lb;
    // check if digit
    if (cell.match(/[\d]/) === null) {
      continue;
    }
    // check if number is already counted
    if (computed[scan.y] !== undefined) {
      if (computed[scan.y][scan.x] !== undefined) {
        continue;
      }
    }
    // walk left
    for (let i = 0; i < 10; i++) {
      let scanCell = matrix[scan.y][scan.x - i];
      if (scanCell === undefined) {
        lb = scan.x - i + 1;
        break;
      }
      if (scanCell.match(/\d/) === null) {
        lb = scan.x - i + 1;
        break;
      }
    }
    // walk right from number start and create number
    for (let i = lb; i < matrix[scan.y].length; i++) {
      let scanCell = matrix[scan.y][i];
      // out of bounds
      if (outOfBounds(matrix, scan.y, i)) {
        break;
      }
      // has to be a digit
      if (scanCell.match(/\d/) === null) {
        break;
      }
      // add to computed
      addComputed(scan.y, i);
      number = "" + number + scanCell;
    }
    nums.push(number)
  }
  if(nums.length === 2){
    sum += nums[0] * nums[1]
  }
}

function addComputed(y, x) {
  if (computed[y] === undefined) {
    computed[y] = {};
    computed[y][x] = true;
  } else {
    computed[y][x] = true;
  }
}

function outOfBounds(matrix, y, x) {
  if (y >= matrix.length || y < 0) {
    return true;
  }
  if (x >= matrix[y].length || x < 0) {
    return true;
  }
  return false;
}

processLineByLine();

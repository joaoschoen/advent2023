const fs = require("fs");
const readline = require("readline");

let input = [];

async function processLineByLine() {
  const fileStream = fs.createReadStream("input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let sum = 0;
  rl.on("line", (word) => {
    let first;
    let last;
    for (let x = 0; x < word.length; x++) {
      if (Number.isInteger(Number.parseInt(word[x]))) {
        first = word[x];
        break;
      }
    }
    for (let x = word.length; x >= 0; x--) {
      if (Number.isInteger(Number.parseInt(word[x]))) {
        last = word[x];
        break;
      }
    }
    sum += parseInt("" + first + last);
  });

  rl.on("close", () => {
    console.log(sum);
  });
}

processLineByLine();

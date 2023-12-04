const fs = require("fs");
const readline = require("readline");

let sum = 0;
let cards = {};

async function processLineByLine() {
  for (let i = 1; i <= 213; i++) {
    cards[i] = 1
  }
  const fileStream = fs.createReadStream("input_for_7_8.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (word) => {
    let card = Number.parseInt(word.substring(4, 8).replace(" ", ""));
    let winning = word
      .substring(10, 39)
      .trimEnd()
      .trimStart()
      .replace(/[\D]{1,2}/gm, " ")
      .split(" ");
    let numbers = word
      .substring(42, word.length)
      .trimEnd()
      .trimStart()
      .replace(/[\D]{1,2}/gm, " ")
      .split(" ");
    let wins = 0;
    for (let i = 0; i < winning.length; i++) {
      for (let j = 0; j < numbers.length; j++) {
        if (Number.parseInt(winning[i]) === Number.parseInt(numbers[j])) {
          wins++;
        }
      }
    }
    let mult = cards[card];
    if (wins > 0) {
      for (let i = card + 1; i <= card + wins; i++) {
        if (i > 213) {
          break;
        }
        cards[i] += 1 * mult;
      }
    }
  });

  rl.on("close", () => {
    let cardNums = Object.values(cards);
    let sum = 0;
    for (let i = 0; i < cardNums.length; i++) {
      sum += cardNums[i];
    }
    console.log(sum);
  });
}

processLineByLine();

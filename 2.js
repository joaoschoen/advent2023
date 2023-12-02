const fs = require("fs");
const readline = require("readline");

async function processLineByLine() {
  const fileStream = fs.createReadStream("input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let sum = 0;
  rl.on("line", (word) => {
    let regex =
      /(oneight|twone|threeight|fiveight|sevenine|nineight|eightwo|eighthree|one|two|three|four|five|six|seven|eight|nine|1|2|3|4|5|6|7|8|9)/gm;
    let search = [...word.matchAll(regex)];
    let first = search[0][0];
    let last = search[search.length - 1][0];
    let normalMal = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
    };
    let conflictMap = {
      oneight: [1, 8],
      twone: [2, 1],
      threeight: [3, 8],
      fiveight: [5, 8],
      sevenine: [7, 9],
      nineight: [9, 8],
      eightwo: [8, 2],
      eighthree: [8, 3],
    };
    if (!Number.isInteger(Number.parseInt(first))) {
      if (conflictMap[first] !== undefined) {
        first = conflictMap[first][0];
      } else {
        first = normalMal[first];
      }
    }
    if (!Number.isInteger(Number.parseInt(last))) {
      if (conflictMap[last] !== undefined) {
        last = conflictMap[last][1];
      } else {
        last = normalMal[last];
      }
    }
    let value = parseInt("" + first + last);

    sum += value;
  });

  rl.on("close", () => {
    console.log(sum);
  });
}

processLineByLine();

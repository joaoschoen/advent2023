const fs = require("fs");
const readline = require("readline");

let values = [];
let errorMargin = 1

async function processLineByLine() {
  const fileStream = fs.createReadStream("input_for_11_12.txt");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (word) => {
    values.push(
      word
        .substring(10)
        .trim()
        .replace(/\s+/gm, " ")
        .split(" ")
        .map((e) => parseInt(e))
    );
  });

  rl.on("close", () => {
    for (let i = 0; i < values[0].length; i++) {
      let maxTime = values[0][i];
      let distanceGoal = values[1][i];
      let possibleWins = []
      for (
        let held = 0;
        held < maxTime;
        held++
      ) {
        let win = calcRace(held,distanceGoal,maxTime)
        if(win){
          possibleWins.push(held)
        }
      }
      console.log("possibleWins",possibleWins)
      errorMargin *= possibleWins.length
      // console.log("distanceGoal",distanceGoal)
    }

    console.log(errorMargin)
  });
}
processLineByLine();

function calcRace(held, distanceGoal, timeLimit) {
  let time = 0;
  let distance = 0;
  // console.log("held", held);
  // console.log("time", time);
  // console.log("distanceGoal", distanceGoal);
  // console.log("distance", distance);
  while (distance <= distanceGoal && time < timeLimit) {
    time++;
    if (held < time) {
      distance += held;
    }
    if (distance > distanceGoal) {
      return true;
    }
    // console.log(time, "ms elapsed", distance, "mm moved");
  }
  return false
}

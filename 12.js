const fs = require("fs");
const readline = require("readline");

let values = [];
let errorMargin = 1;

async function processLineByLine() {
  const fileStream = fs.createReadStream("input_for_11_12.txt");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (word) => {
    values.push(parseInt(word.substring(10).trim().replace(/\s+/gm, "")));
  });

  rl.on("close", () => {
    let maxTime = values[0];
    let distanceGoal = values[1];
    console.log("maxTime",maxTime)
    console.log("distanceGoal",distanceGoal)
    let possibleWins = [];
    let leftBound = Math.floor(Math.sqrt(maxTime));
    let rightBound = Math.floor(maxTime / 2);
    let firstWin = 0
    while (leftBound <= rightBound) {
      let leftRace = calcRace(leftBound, distanceGoal, maxTime);
      if (!leftRace) {
        if(rightBound === leftBound + 1){
          firstWin = rightBound
          break
        }
        let nextLeftBound = Math.floor((leftBound + rightBound) / 2)
        let nextLeftRace = calcRace(nextLeftBound, distanceGoal, maxTime);
        if(nextLeftRace){
          rightBound = nextLeftBound
        } else {
          leftBound = nextLeftBound
        }
      }
    }
    let lastWin = 0
    leftBound = Math.floor(maxTime / 2);
    rightBound = maxTime
    console.log("")
    let i = 0
    while (rightBound >=  leftBound ) {
      let rightRace = calcRace(rightBound, distanceGoal, maxTime);
      if (!rightRace) {
        if(rightBound === leftBound + 1  ){
          lastWin = leftBound
          break
        }
        let nextRightBound = Math.floor((leftBound + rightBound) / 2)
        let nextRightRace = calcRace(nextRightBound, distanceGoal, maxTime);
        if(nextRightRace){
          leftBound = nextRightBound
        } else {
          rightBound = nextRightBound
        }
      }
      i++
    }
    console.log("firstWin",firstWin)
    console.log("lastWin",lastWin)
    errorMargin = lastWin - firstWin;
    console.log(errorMargin);
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
  return false;
}

const fs = require("fs");
const readline = require("readline");

async function processLineByLine() {
  const fileStream = fs.createReadStream("input_for_3_4.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let sum = 0;
  rl.on("line", (word) => {
    // regex for finding the results of each color per game
    let redRegex = /\d* red/gm;
    let blueRegex = /\d* blue/gm;
    let greenRegex = /\d* green/gm;
    // separate game into rounds
    let rounds = word.split(";");
    let results = [];
    let powers = [0,0,0]
    for (let round of rounds) {
      // extract number of dice of each color per round
      let roundResult = [
        round.match(redRegex),
        round.match(blueRegex),
        round.match(greenRegex),
      ].map((res)=>{
        if(res === null){
          return 0
        } else {
          return Number.parseInt(res[0].split(" ")[0])
        }
      })
      results.push(roundResult);
    }
    // in each round, check if the number of dice is the lowest
    for(let r = 0; r< results.length;r++){
      for(let c = 0; c < 3; c++){
        // if we're at zero, set the color minimum value
        if(results[r][c] > powers[c]){
          powers[c] = results[r][c]
        } 
      }
    }
    // sum powers
    let setPower = 1
    for(let i = 0; i < 3; i++){
      setPower *= powers[i]
    }
    sum += setPower
  });

  rl.on("close", () => {
    console.log(sum);
  });
}

processLineByLine();

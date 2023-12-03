const fs = require("fs");
const readline = require("readline");

async function processLineByLine() {
  const fileStream = fs.createReadStream("input_for_3_4.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let rules = {
    red: 12,
    green: 13,
    blue: 14,
  };
  let sum = 0;
  rl.on("line", (word) => {
    let gameRegex = /Game \d*:/gm
    let redRegex = /\d* red/gm
    let blueRegex = /\d* blue/gm
    let greenRegex = /\d* green/gm
    let game = Number.parseInt(word.match(gameRegex)[0].split(" ")[1].replace(":",""))
    let rounds = word.split(";")
    let possible = true
    for(let round of rounds){
        let results = {
            red: round.match(redRegex),
            blue: round.match(blueRegex),
            green: round.match(greenRegex)
        }
        if(results.red !== null){
            if(Number.parseInt(results.red) > rules.red){
                possible = false
                break
            }
        }
        if(results.green !== null){
            if(Number.parseInt(results.green) > rules.green){
                possible = false
                break
            }
        }
        if(results.blue !== null){
            if(Number.parseInt(results.blue) > rules.blue){
                possible = false
                break
            }
        }
    }
    if(possible){
        sum += game;
    }
  });

  rl.on("close", () => {
    console.log(sum);
  });
}

processLineByLine();

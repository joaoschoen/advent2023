const fs = require("fs");
const readline = require("readline");

let sum = BigInt(0);

async function processLineByLine() {
  const fileStream = fs.createReadStream("input_for_7_8.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (word) => {    
    let winning = word.substring(10,39).trimEnd().trimStart().replace(/[\D]{1,2}/gm," ").split(" ")
    let numbers = word.substring(42,word.length).trimEnd().trimStart().replace(/[\D]{1,2}/gm," ").split(" ")
    let power = BigInt(0)
    for(let i = 0; i < winning.length; i++){
      for(let j = 0; j < numbers.length; j++){
        if(Number.parseInt(winning[i]) === Number.parseInt(numbers[j])){
          if(power === BigInt(0)){
            power++
          } else {
            power = BigInt(2) * BigInt(power)
          }
        }
      }
    }
    if(power > 0){
      sum += power
    }
  });

  rl.on("close", () => {
    console.log(sum.toString())
  });
}

processLineByLine();

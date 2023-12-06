const fs = require("fs");
const readline = require("readline");
let maps = {
  se: [],
  se_so: [],
  so_fe: [],
  fe_wa: [],
  wa_li: [],
  li_te: [],
  te_hu: [],
  hu_lo: [],
};
let seRegex = /seeds: /gm;
let se_soRegex = /seed-to-soil map:/gm;
let so_feRegex = /soil-to-fertilizer map:/gm;
let fe_waRegex = /fertilizer-to-water map:/gm;
let wa_liRegex = /water-to-light map:/gm;
let li_teRegex = /light-to-temperature map:/gm;
let te_huRegex = /temperature-to-humidity map:/gm;
let hu_loRegex = /humidity-to-location map:/gm;
let selector = "";

let lowestDest = -1

async function processLineByLine() {
  const fileStream = fs.createReadStream("input_for_9_10.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (word) => {
    if (word.length !== 0) {
      let isSel = findSelector(word);
      if (!isSel || selector === "se") {
        let map;
        if (selector === "se") {
          map = map_se(word);
        } else {
          map = map_other(word);
        }
        maps[selector].push(map);
      }
    }
  });

  rl.on("close", () => {
    console.log(maps);
    // mapping keys
    let keys = Object.keys(maps);
    keys.shift();
    // for each seed
    for (let i = 0; i < maps["se"][0].length; i++) {
      let seed = maps["se"][0][i];
      // console.log("seed", seed);
      // map it in each of the steps
      let destination = seed;
      let source = seed;
      // step
      for (let j = 0; j < keys.length; j++) {
        let step = keys[j]
        // console.log("STEP:",step);
        // console.log("SOURCE:",source);
        let ranges = maps[keys[j]];
        // range
        for (let k = 0; k < ranges.length; k++) {
          // dest_range_start
          // sour_range_start
          // range_length
          let range = ranges[k];
          let l_sour = range[1];
          let r_sour = range[1] + range[2] - 1;
          // console.log("Min:",l_sour,"Max:",r_sour)
          // console.log(range);
          if (source >= l_sour && source <= r_sour) {
            let diff = source - l_sour
            destination = range[0] + diff
            // console.log("In range, dest:",destination)
            break
          }
        }
        source = destination
        // console.log("\n")
        if(step === "hu_lo"){
          console.log("Final destination:",source)
          if(lowestDest === -1){
            lowestDest = source
          } else 
          if(source < lowestDest){
            lowestDest = source
          }
        }
      }
      
    }
    console.log("LowestDest:",lowestDest)
  });
}

processLineByLine();

function findSelector(word) {
  if (word.match(seRegex) !== null) {
    selector = "se";
    return true;
  } else if (word.match(se_soRegex) !== null) {
    selector = "se_so";
    return true;
  } else if (word.match(so_feRegex) !== null) {
    selector = "so_fe";
    return true;
  } else if (word.match(fe_waRegex) !== null) {
    selector = "fe_wa";
    return true;
  } else if (word.match(wa_liRegex) !== null) {
    selector = "wa_li";
    return true;
  } else if (word.match(li_teRegex) !== null) {
    selector = "li_te";
    return true;
  } else if (word.match(te_huRegex) !== null) {
    selector = "te_hu";
    return true;
  } else if (word.match(hu_loRegex) !== null) {
    selector = "hu_lo";
    return true;
  }
  return false;
}

function map_se(word) {
  return word
    .substring(6, word.length)
    .trim()
    .replace(/\s+/gm, " ")
    .split(" ")
    .map((e) => parseInt(e));
}
function map_other(word) {
  return word
    .trim()
    .replace(/\s+/gm, " ")
    .split(" ")
    .map((e) => parseInt(e));
}

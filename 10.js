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
let layers = {
  se_so: "so_fe",
  so_fe: "fe_wa",
  fe_wa: "wa_li",
  wa_li: "li_te",
  li_te: "te_hu",
  te_hu: "hu_lo",
  hu_lo: "end",
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

let lowestDest = -1;

async function processLineByLine() {
  const fileStream = fs.createReadStream("input_for_9_10.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (word) => {
    if (word.length !== 0) {
      let isSel = findSelector(word);
      if (!isSel) {
        let map;
        if (selector === "se") {
          map = map_se(word);
          maps[selector] = map;
        } else {
          map = map_other(word);
          maps[selector].push(map);
        }
      }
    }
  });

  rl.on("close", () => {
    // array that will contain all the
    let ranges = [];
    // mapping entry points for seeds
    let seeds = maps["se"];
    seeds = seeds.map((e) => {
      return genRange(e[0], e[1]);
    });
    seeds.sort((a, b) => {
      return a[1] > b[1] ? 1 : -1;
    });
    ranges = seeds;
    ranges = processLayer(ranges, "se_so");
    console.log(lowestDest)
  })
}

// dest/source/length
function processLayer(ranges, layer) {
  let nextLayer = [];
  console.log(ranges)
  let filters = maps[layer].map(e=>[genRange(e[1],e[2]),genRange(e[0],e[2])])
  console.log(filters)
  // For each range
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    console.log("range",range)
    // Check if each filter intersects with it
    let filtersPassed = 0
    for (let j = 0; j < filters.length; j++) {
      const filter = filters[j];
      console.log("filter",filter)
      // If filter intersects with range
      let intersect = findIntersect(range,filter[0])
      console.log(intersect)
      if(intersect.length > 0){
        for (let k  = 0; k < intersect.length; k++) {
          if(intersect[k][0] < 0){
            nextLayer.push(intersect[k][0].map(e=>e*-1))
            console.log("nextLayer",nextLayer)
          } else {
            nextLayer.push(mapRangeToNewSet(range,filter))
            console.log("nextLayer",nextLayer)
          }
        }
      }
    }
    if(filtersPassed === 0){
      nextLayer.push(range)
    }
  }
  console.log("nextLayer",nextLayer)
}

function mapRangeToNewSet(nextRange, map) {
  nextRange = [...nextRange];
  // dest_range_start
  // sour_range_start
  // length
  map = [...map];
  nextRange = nextRange.map((source) => {
    diff = source - map[0][0]
    return map[1][0] + diff;
  });
  //console.log(nextRange + "?")
  return nextRange;
}

function genFilter(ranges) {
  //[0] dest_range_start
  //[1] sour_range_start
  //[2] length
  ranges = ranges.map((e) => {
    return [genRange(e[1], e[2]), genRange(e[0], e[2])];
  });
  ranges.sort((a, b) => {
    return a[0][1] > b[0][1] ? 1 : -1;
  });
  return ranges;
}

processLineByLine();

function genRange(A, B) {
  return [A, A + B - 1];
}
function findIntersect(S, M) {
  // S = source range
  // M = map

  S = [...S];
  M = [...M];
  //S ___
  //M    ___


  if (M[0] > S[1] && M[1] > S[1]) {
    return [];
  }

  //S    ___
  //M ___

  if (M[0] < S[0] & M[1] < S[0]) {
    return [];
  }

  //S   __
  //M ______

  if (M[0] <= S[0] && M[1] >= S[1]) {
    return [S];
  }

  //S _____
  //M   _____

  if (S[0] < M[0] && S[1] < M[1]) {
    return [
      [-S[0], -(M[0] - 1)],
      [M[0], S[1]],
    ];
  }

  //S   _____
  //M _____

  if (S[0] > M[0] && S[1] > M[1]) {
    return [
      [S[0], M[1]],
      [-(M[1] + 1), -S[1]],
    ];
  }

  //S _______
  //M   ___

  let r = [
    [-S[0], -(M[0] - 1)],
    [M[0], M[1]],
    [-(M[1] + 1), -S[1]],
  ];
  return r;
}

function findJoin(S, M) {
  // S = source range
  // M = map
  S = [...S];
  M = [...M];
  //S ___/
  //M ___

  if (S[0] === M[0] && S[1] >= M[1]) {
    return S;
  } else

  //S ___
  //M ___/

  if (S[0] === M[0] && M[1] >= S[1]) {
    return M;
  } else

  //S  ___
  //M /___

  if (M[0] <= S[0]  && S[1] === M[1]) {
    return M;
  } else

  //S /___
  //M  ___

  if (S[0] <= M[0] && S[1] === M[1]) {
    return S;
  } else

  //S ___
  //M    ___

  if (M[0] > S[0] && M[0] > S[1]) {
    return [];
  } else

  //S   __
  //M ______

  if (S[0] >= M[0] && S[1] <= M[1]) {
    return M;
  } else

  //S _____
  //M   _____

  if (S[0] <= M[0] && M[1] >= S[1]) {
    return [S[0], M[1]];
  } else

  //S   _____
  //M _____

  if (S[0] >= M[0] && M[1] <= S[1]) {
    return [M[0], S[1]];
  } else 

  //S _______
  //M   ___
  return S;
}

function map_se(word) {
  let ranges = word.substring(6, word.length).trim().replace(/\s+/gm, " ");
  ranges = [...ranges.matchAll(/\d+ \d+/gm)];
  return ranges.map((e) => {
    return e[0].split(" ").map((i) => {
      return parseInt(i);
    });
  });
}

function map_other(word) {
  return word
    .trim()
    .replace(/\s+/gm, " ")
    .split(" ")
    .map((e) => parseInt(e));
}

function findSelector(word) {
  if (word.match(seRegex) !== null) {
    selector = "se";
    return false;
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

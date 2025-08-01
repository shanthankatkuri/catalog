const fs = require("fs");

function parseBigInt(str, base) {
  return [...str.toLowerCase()].reduce((acc, char) => {
    const digit = parseInt(char, base);
    if (isNaN(digit) || digit >= base) throw new Error(`Invalid digit '${char}' for base ${base}`);
    return acc * BigInt(base) + BigInt(digit);
  }, 0n);
}

function findConst(points) {
  const k = points.length;
  let result = 0n;
  for (let i = 0; i < k; i++) {
    let numerator = points[i].y;
    let denominator = 1n;
    for (let j = 0; j < k; j++) {
      if (i !== j) {
        // term *= -points[j].x;
        // term /= points[i].x - points[j].x; old code
        numerator *= -points[j].x;
        denominator *= points[i].x - points[j].x
      }
    }
    result += numerator / denominator;
  }
  return result;
}
const file = process.argv[2];
const raw = fs.readFileSync(file);
const data = JSON.parse(raw);
const { n, k } = data.keys;

const points = [];
for (const key in data) {
  if (key === "keys") continue;
  const x = BigInt(key);
  const base = parseInt(data[key].base);
  const yStr = data[key].value;
  const y = parseBigInt(yStr, base);
  points.push({ x, y });
  if (points.length === k) break;
}
console.log(points)
const constant = findConst(points);
console.log("c = ", constant.toString());

import { SightingParser } from "./src/index.js";

const parser = new SightingParser();
async function run() {
  await parser.init();
  const cases = [
    "U1 Reumannplatz mobil",
    "U4 Karlsplatz nach Heiligenstadt",
    "43er Alser Straße 2 stationär",
    "bla bla irrelevant"
  ];
  for (const c of cases) {
    console.log(`"${c}"`, "=>", parser.parse(c));
  }
}
run();

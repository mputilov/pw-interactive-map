import fs from "fs";

// Read the two JSON files
const regularResources = JSON.parse(
  fs.readFileSync("src/prev_data/resource.json", "utf8")
);
const tier5Resources = JSON.parse(
  fs.readFileSync("src/prev_data/tier5/resource_tier5.json", "utf8")
);

// Merge the arrays
const mergedResources = [...regularResources, ...tier5Resources];

// Write the merged file
fs.writeFileSync(
  "src/data/resource_merge.json",
  JSON.stringify(mergedResources, null, 2)
);

console.log("Merged resources saved to src/data/resource_merge.json");
console.log(`Total resources: ${mergedResources.length}`);
console.log(`Regular resources: ${regularResources.length}`);
console.log(`Tier 5 resources: ${tier5Resources.length}`);

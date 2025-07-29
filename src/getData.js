/* eslint-disable no-unused-vars */
/* eslint-env node */
// Ensure your package.json has: "type": "module"
import fetch from "node-fetch";
import fs from "fs";
import * as cheerio from "cheerio";
import process from "process";

const resources = [
  {
    name: "Древесина",
    url: "https://www.pwdatabase.com/ru/mine_type/2861",
  },
  {
    name: "Металл",
    url: "https://www.pwdatabase.com/ru/mine_type/2862",
  },
  {
    name: "Камень",
    url: "https://www.pwdatabase.com/ru/mine_type/2863",
  },
  {
    name: "Источники энергии",
    url: "https://www.pwdatabase.com/ru/mine_type/2864",
  },
  {
    name: "Травы",
    url: "https://www.pwdatabase.com/ru/mine_type/2865",
  },
];

// Remove 'z', 'el', and 't' keys and filter duplicates
function cleanAndDedup(arr) {
  const seen = new Set();
  return arr
    .map((item) => {
      // Only keep x and z (rename z to y)
      const x = item.x;
      const y = item.z !== undefined ? item.z : undefined;
      const rest = { x };
      if (y !== undefined) rest.y = y;
      return rest;
    })
    .filter((item) => {
      const key = JSON.stringify(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

async function fetchCoordinates(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    const html = await res.text();
    const match = html.match(/var\s+MapCoordinats\s*=\s*([\s\S]*?);/);
    if (!match) {
      return null;
    }
    let dataStr = match[1];
    let data;
    try {
      data = JSON.parse(dataStr);
    } catch {
      try {
        data = eval("(" + dataStr + ")");
      } catch {
        return null;
      }
    }
    if (Array.isArray(data)) {
      return cleanAndDedup(data);
    } else if (typeof data === "object" && data !== null) {
      for (const k in data) {
        if (Array.isArray(data[k])) {
          data[k] = cleanAndDedup(data[k]);
        }
      }
      return data;
    }
    return data;
  } catch {
    return null;
  }
}

async function parseResource(resource) {
  const BASE_URL = "https://www.pwdatabase.com";
  const result = [];
  try {
    const res = await fetch(resource.url);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const tbody = $("#content tbody").first();
    const rows = tbody.find("tr").toArray().slice(1); // skip header row
    for (const row of rows) {
      const cells = $(row).find("td");
      const source_name = $(cells[0]).text().trim();
      let href = $(cells[0]).find("a").attr("href") || null;
      const tier = $(cells[1]).text().trim();
      const name = $(cells[3]).text().trim();
      let image = $(cells[3]).find("img").attr("src") || null;
      if (href && !href.startsWith("http")) {
        if (href.startsWith("/")) {
          href = BASE_URL + href;
        } else {
          href = BASE_URL + "/" + href;
        }
      }
      if (image && !image.startsWith("http")) image = BASE_URL + image;
      let id = null;
      if (href) {
        const match = href.match(/mine\/(\d+)/);
        if (match) id = match[1];
      }
      const coordinates = href ? await fetchCoordinates(href) : null;
      result.push({
        id,
        resource: resource.name,
        source_name,
        href,
        tier,
        name,
        image,
        coordinates,
      });
      console.log(`Processed: ${href}`);
    }
  } catch (err) {
    console.error(`Error processing resource ${resource.name}:`, err.message);
  }
  return result;
}

function ensureDataDir() {
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data", { recursive: true });
  }
}

function groupByTier(items) {
  const grouped = {};
  for (const item of items) {
    if (!item.tier) continue;
    if (!grouped[item.tier]) grouped[item.tier] = [];
    grouped[item.tier].push(item);
  }
  return grouped;
}

async function main() {
  try {
    ensureDataDir();
    let allResults = [];
    for (let i = 0; i < resources.length; i++) {
      let resourceResults = await parseResource(resources[i]);
      // Filter out items with name '-' or missing image, but keep tier 5
      resourceResults = resourceResults.filter(
        (item) => item.name !== "-" && item.image
      );
      allResults = allResults.concat(resourceResults);
    }

    // Separate tier 5 and non-tier 5 items
    const tier5Items = allResults.filter((item) => item.tier === "5");
    const nonTier5Items = allResults.filter((item) => item.tier !== "5");

    // Group and write resource_by_tier.json (omit 'Травы' and tier 5, use only IDs)
    const nonWeeds = nonTier5Items.filter((item) => item.resource !== "Травы");
    const resourceByTier = groupByTier(
      nonWeeds.map((item) => ({ tier: item.tier, id: item.id }))
    );
    // Convert to { [tier]: string[] }
    const resourceByTierIds = {};
    for (const [tier, items] of Object.entries(resourceByTier)) {
      resourceByTierIds[tier] = items.map((item) => item.id);
    }
    fs.writeFileSync(
      "data/resource_by_tier.json",
      JSON.stringify(resourceByTierIds, null, 2)
    );

    // Group and write weeds_by_tier.json (only 'Травы' excluding tier 5, use only IDs)
    const weeds = nonTier5Items.filter((item) => item.resource === "Травы");
    const weedsByTier = groupByTier(
      weeds.map((item) => ({ tier: item.tier, id: item.id }))
    );
    // Convert to { [tier]: string[] }
    const weedsByTierIds = {};
    for (const [tier, items] of Object.entries(weedsByTier)) {
      weedsByTierIds[tier] = items.map((item) => item.id);
    }
    fs.writeFileSync(
      "data/weeds_by_tier.json",
      JSON.stringify(weedsByTierIds, null, 2)
    );

    // Write resource_tier5.json (all tier 5 items, omit coordinates property)
    const tier5ResourceJson = tier5Items.map(
      ({ coordinates: _, ...rest }) => rest
    );
    fs.writeFileSync(
      "data/resource_tier5.json",
      JSON.stringify(tier5ResourceJson, null, 2)
    );

    // Write resources_tier5.json (only tier 5 resources, use only IDs)
    const tier5Resources = tier5Items.filter(
      (item) => item.resource !== "Травы"
    );
    const tier5ResourcesIds = tier5Resources.map((item) => item.id);
    fs.writeFileSync(
      "data/resources_tier5.json",
      JSON.stringify(tier5ResourcesIds, null, 2)
    );

    // Write weeds_tier5.json (only tier 5 weeds, use only IDs)
    const tier5Weeds = tier5Items.filter((item) => item.resource === "Травы");
    const tier5WeedsIds = tier5Weeds.map((item) => item.id);
    fs.writeFileSync(
      "data/weeds_tier5.json",
      JSON.stringify(tier5WeedsIds, null, 2)
    );

    // Write coordinates_tier5.json (separate a21 and a22 objects with coordinates)
    const a21Coordinates = {};
    const a22Coordinates = {};

    tier5Items.forEach((item) => {
      if (item.coordinates?.a21) {
        a21Coordinates[item.id] = item.coordinates.a21;
      }
      if (item.coordinates?.a22) {
        a22Coordinates[item.id] = item.coordinates.a22;
      }
    });

    const tier5CoordinatesOutput = {
      a21: a21Coordinates,
      a22: a22Coordinates,
    };

    fs.writeFileSync(
      "data/coordinates_tier5.json",
      JSON.stringify(tier5CoordinatesOutput, null, 2)
    );

    // Write resource.json (non-tier 5 items, omit coordinates property)
    const resourceJson = nonTier5Items.map(
      ({ coordinates: _, ...rest }) => rest
    );
    fs.writeFileSync(
      "data/resource.json",
      JSON.stringify(resourceJson, null, 2)
    );

    // Write coordinates.json (id: coordinates.world for non-tier 5 items)
    const coordinatesJson = Object.fromEntries(
      nonTier5Items.map((item) => [item.id, item.coordinates?.world ?? []])
    );
    fs.writeFileSync(
      "data/coordinates.json",
      JSON.stringify(coordinatesJson, null, 2)
    );

    console.log("Output saved to:");
    console.log("- data/resource_by_tier.json (tiers 1-4 resources)");
    console.log("- data/weeds_by_tier.json (tiers 1-4 weeds)");
    console.log("- data/resource.json (tiers 1-4 all items)");
    console.log("- data/coordinates.json (tiers 1-4 coordinates)");
    console.log("- data/resources_tier5.json (tier 5 all items)");
    console.log("- data/resources_tier5.json (tier 5 resources IDs)");
    console.log("- data/weeds_tier5.json (tier 5 weeds IDs)");
    console.log("- data/coordinates_tier5.json (tier 5 coordinates)");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();

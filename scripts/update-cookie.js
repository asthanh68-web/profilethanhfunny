/*
  Usage:
    node scripts/update-cookie.js --uuid=1.MY_NEW_UUID

  This script updates the cookie entry with name starting with "twk_uuid_"
  inside tesst.json by setting its `value` to an URL-encoded JSON string:
    { uuid, version: 3, domain: "thegioiso360.vn", ts: Date.now() }
*/

const fs = require("fs");
const path = require("path");

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (const arg of args) {
    const [key, value] = arg.split("=");
    if (key && value && key.startsWith("--")) {
      result[key.slice(2)] = value;
    }
  }
  return result;
}

function main() {
  const { uuid } = parseArgs();
  const filePath = path.resolve(process.cwd(), "tesst.json");

  if (!fs.existsSync(filePath)) {
    console.error("tesst.json not found at project root");
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error("Invalid JSON in tesst.json");
    process.exit(1);
  }

  if (!Array.isArray(data)) {
    console.error("tesst.json is expected to be an array of cookie objects");
    process.exit(1);
  }

  const idx = data.findIndex((c) => typeof c?.name === "string" && c.name.startsWith("twk_uuid_"));
  if (idx === -1) {
    console.error("No cookie with name starting 'twk_uuid_' found in tesst.json");
    process.exit(1);
  }

  const cookie = data[idx];

  // If uuid not provided, keep existing decoded uuid if possible; otherwise require it
  let newUuid = uuid;
  if (!newUuid && typeof cookie.value === "string" && cookie.value.trim()) {
    try {
      const decoded = decodeURIComponent(cookie.value);
      const obj = JSON.parse(decoded);
      if (obj && typeof obj.uuid === "string") {
        newUuid = obj.uuid; // preserve old uuid, just refresh ts
      }
    } catch (_) {
      // ignore decode errors; will require uuid
    }
  }

  if (!newUuid) {
    console.error("Please provide --uuid=1.YOUR_UUID to set the value");
    process.exit(1);
  }

  const payload = {
    uuid: newUuid,
    version: 3,
    domain: "thegioiso360.vn",
    ts: Date.now(),
  };

  const encoded = encodeURIComponent(JSON.stringify(payload));
  data[idx] = { ...cookie, value: encoded };

  // Preserve formatting: 4 spaces indentation to match existing file
  const output = JSON.stringify(data, null, 4) + (raw.endsWith("\n") ? "\n" : "");
  fs.writeFileSync(filePath, output, "utf8");
  console.log("Updated 'value' for", cookie.name);
}

main();



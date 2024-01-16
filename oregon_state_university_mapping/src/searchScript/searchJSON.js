const fs = require("fs");

function readFileSync(path) {
  return fs.readFileSync(path, "utf8");
}

// Example usage
const filePath =
  "C:\\Users\\galav\\Documents\\Github Projects\\Oregon_State_University_Mapping\\oregon_state_university_mapping\\src\\conversionScript\\roomsUpdated.json";
const data = JSON.parse(readFileSync(filePath));

function findMatchingBuildingIDs(data, roomName, optionalTag) {
  const results = [];

  for (const building of data) {
    for (const room of building.ROOMS) {
      const display = room.display;
      if (
        display &&
        display.roomName === roomName &&
        display.optionalTag === optionalTag
      ) {
        results.push(building.building_id);
      }
    }
  }

  return results;
}

// Example query
const queryRoomName = "Building grounds";
const queryOptionalTag = null;

const results = findMatchingBuildingIDs(data, queryRoomName, queryOptionalTag);

if (results.length > 0) {
  console.log(
    `Matching building IDs for ${queryRoomName} with optional tag ${queryOptionalTag}: ${results.join(
      ", "
    )}`
  );
} else {
  console.log(
    `No matching buildings found for ${queryRoomName} with optional tag ${queryOptionalTag}`
  );
}

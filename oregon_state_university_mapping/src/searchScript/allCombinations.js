const fs = require("fs");

function readFileSync(path) {
  return fs.readFileSync(path, "utf8");
}

// Example usage
const filePath =
  "C:\\Users\\galav\\Documents\\Github Projects\\Oregon_State_University_Mapping\\oregon_state_university_mapping\\src\\conversionScript\\roomsUpdated.json";
const data = JSON.parse(readFileSync(filePath));

function getAllUniqueRoomNameAndOptionalTagCombinations(data) {
  const uniqueCombinations = new Map();

  for (const building of data) {
    for (const room of building.ROOMS) {
      const display = room.display;
      if (display) {
        const roomName = display.roomName;
        const optionalTag = display.optionalTag;
        const roomNumber = display.roomNumber;

        // Check if there is a matching roomName and optionalTag combination
        // and also ensure roomName is not equal to roomNumber
        if (roomName && optionalTag !== undefined && roomName !== roomNumber) {
          if (!uniqueCombinations.has(roomName)) {
            uniqueCombinations.set(roomName, {
              roomName,
              optionalTags: new Set(),
            });
          }

          // Add optionalTag to the unique combination only if it's not already present
          const combination = uniqueCombinations.get(roomName);
          combination.optionalTags.add(optionalTag);
        }
      }
    }
  }

  // Convert Set to Array before returning
  return Array.from(uniqueCombinations.values()).map((combination) => {
    combination.optionalTags = Array.from(combination.optionalTags);
    return combination;
  });
}

// Get all unique room name and optional tag combinations
const uniqueCombinations = getAllUniqueRoomNameAndOptionalTagCombinations(data);

// Output the result
console.log(JSON.stringify(uniqueCombinations, null, 2));

// Save the result to a file
const outputFile =
  "C:\\Users\\galav\\Documents\\Github Projects\\Oregon_State_University_Mapping\\oregon_state_university_mapping\\src\\conversionScript\\uniqueCombinations.json";
fs.writeFileSync(outputFile, JSON.stringify(uniqueCombinations, null, 2));

console.log(`Result saved to ${outputFile}`);

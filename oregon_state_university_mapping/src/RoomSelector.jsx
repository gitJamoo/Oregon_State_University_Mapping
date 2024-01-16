import React, { useState, useEffect } from "react";

const RoomSelector = () => {
  const [roomData, setRoomData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedOptionalTag, setSelectedOptionalTag] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          process.env.PUBLIC_URL + "/uniqueCombinations.json"
        );
        const data = await response.json();
        setRoomData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleRoomChange = (roomName) => {
    const selectedRoomData = roomData.find(
      (room) => room.roomName === roomName
    );
    setSelectedRoom(selectedRoomData);
    setSelectedOptionalTag(null);
  };

  const findMatchingBuildingIDs = async (roomName, optionalTag) => {
    if (!selectedRoom || selectedRoom.roomName !== roomName) {
      // Check if selectedRoom is set and matches the current roomName
      return {};
    }

    const filePath = process.env.PUBLIC_URL + "/roomsUpdated.json";
    try {
      const response = await fetch(filePath);
      const buildingData = await response.json();
      const results = {};

      for (const building of buildingData) {
        for (const room of building.ROOMS) {
          const display = room.display;
          if (
            display &&
            display.roomName === roomName &&
            display.optionalTag === optionalTag
          ) {
            const buildingID = building.building_id;
            results[buildingID] = results[buildingID] || [];
            results[buildingID].push(room.display.roomNumber); // Ensure roomNumber is the correct property
          }
        }
      }
      console.log(results);
      return results;
    } catch (error) {
      console.error("Error fetching data:", error);
      return {};
    }
  };

  const handleOptionalTagChange = (optionalTag) => {
    setSelectedOptionalTag(optionalTag);
    setResults(findMatchingBuildingIDs(selectedRoom.roomName, optionalTag));
  };

  return (
    <div>
      <label>Select Room:</label>
      <select onChange={(e) => handleRoomChange(e.target.value)}>
        <option value="">-- Select Room --</option>
        {roomData.map((room) => (
          <option key={room.roomName} value={room.roomName}>
            {room.roomName}
          </option>
        ))}
      </select>

      {selectedRoom &&
        selectedRoom.optionalTags &&
        selectedRoom.optionalTags.length > 0 && (
          <div>
            <label>Select Optional Tag:</label>
            <select onChange={(e) => handleOptionalTagChange(e.target.value)}>
              <option value="">-- Select Optional Tag --</option>
              {selectedRoom.optionalTags.map((optionalTag) => (
                <option key={optionalTag} value={optionalTag}>
                  {optionalTag || "None"}
                </option>
              ))}
            </select>
          </div>
        )}

      {selectedRoom && selectedOptionalTag && (
        <div>
          <p>Selected Room: {selectedRoom.roomName}</p>
          <p>Selected Optional Tag: {selectedOptionalTag}</p>
        </div>
      )}

      {results && results.length > 0 && (
        <div>
          <p>Matching Building IDs: {results.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default RoomSelector;

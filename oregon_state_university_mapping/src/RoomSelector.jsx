import React, { useState, useEffect } from "react";

const RoomSelector = () => {
  const [roomData, setRoomData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedOptionalTag, setSelectedOptionalTag] = useState(null);
  const [results, setResults] = useState(null);
  const [visibleBuilding, setVisibleBuilding] = useState(null);

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

  useEffect(() => {
    // Use this effect to update results when selectedRoom or selectedOptionalTag changes
    const updateResults = async () => {
      if (selectedRoom) {
        const newResults = await findMatchingBuildingIDs(
          selectedRoom.roomName,
          selectedOptionalTag
        );
        setResults(newResults);
      }
    };

    updateResults();
  }, [selectedRoom, selectedOptionalTag]);

  const handleRoomChange = (roomName) => {
    const selectedRoomData = roomData.find(
      (room) => room.roomName === roomName
    );
    setSelectedRoom(selectedRoomData);
    setSelectedOptionalTag(null);
  };

  const findMatchingBuildingIDs = async (roomName, optionalTag) => {
    if (!selectedRoom || selectedRoom.roomName !== roomName) {
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
            (optionalTag === null ||
              display.optionalTag === optionalTag ||
              !display.optionalTag)
          ) {
            const buildingID = building.building_id;
            results[buildingID] = results[buildingID] || [];
            results[buildingID].push(display.roomNumber);
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
  };

  const handleShowRoomNumbers = (buildingID) => {
    setVisibleBuilding(buildingID);
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

      {/* Display Results */}
      {results && (
        <div>
          <h2>Results:</h2>
          {Object.entries(results).map(([buildingID, roomNumbers]) => (
            <div key={buildingID}>
              <h3>Building ID: {buildingID}</h3>
              {roomNumbers.length > 0 && (
                <div>
                  <button onClick={() => handleShowRoomNumbers(buildingID)}>
                    {visibleBuilding === buildingID
                      ? "Hide Room Numbers"
                      : "Show Room Numbers"}
                  </button>
                  {visibleBuilding === buildingID && (
                    <div>
                      <p>All Room Numbers: {roomNumbers.join(", ")}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomSelector;

import React, { useState, useEffect } from "react";

const RoomSelector = () => {
  const [roomData, setRoomData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedOptionalTag, setSelectedOptionalTag] = useState(null);

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

  const handleOptionalTagChange = (optionalTag) => {
    setSelectedOptionalTag(optionalTag);
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
    </div>
  );
};

export default RoomSelector;

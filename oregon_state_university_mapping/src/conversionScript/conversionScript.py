import json

print("running")

def transform_rooms(data):
    for building in data:
        for room in building.get("ROOMS", []):
            display_value = room.get("display")
            if display_value and isinstance(display_value, str):
                room_number, _, room_name_optional_tag = display_value.partition(" - ")
                room_number = room_number.strip()
                room_name, _, optional_tag = room_name_optional_tag.partition(" - ")
                room_name = room_name.strip()
                optional_tag = optional_tag.strip() if optional_tag else None

                room["display"] = {
                    "roomNumber": room_number,
                    "roomName": room_name,
                    "optionalTag": optional_tag
                }

    return data

# Read input from rooms.json
with open(r"C:\Users\galav\Documents\Github Projects\Oregon_State_University_Mapping\oregon_state_university_mapping\src\conversionScript\rooms.json", "r") as file:
    input_data = json.load(file)

# Transform data
output_data = transform_rooms(input_data)

# Save output as roomsUpdated.json
with open("roomsUpdated.json", "w") as file:
    json.dump(output_data, file, indent=2)

print("Transformation complete. Output saved as roomsUpdated.json")
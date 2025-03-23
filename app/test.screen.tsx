import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import tw from "twrnc";
import { extractHeightByDay } from "@/utils/extractHeightByDay";
import HeightGraph from "@/components/graph/Graph.component";

// Sample API response
const apiResponse = [
    {
        "_id": "67d4dc188e1db52e49ab04ac",
        "MonthYear": "2024-04",
        "RecordId": "67c3e147401c29858df96623",
        "Trackings": {
            "2024-04-30": {
                "Height": 122,
                "Weight": 28,
                "BMI": 18.81,
                "BMIResult": "Unknown"
            }
        },
        "__v": 0
    },
    {
        "_id": "67d4dcb88e1db52e49ab04ad",
        "MonthYear": "2024-05",
        "RecordId": "67c3e147401c29858df96623",
        "Trackings": {
            "2024-05-30": {
                "Height": 122,
                "Weight": 28,
                "BMI": 18.81,
                "BMIResult": "Unknown"
            }
        },
        "__v": 0
    },
    {
        "_id": "67d4dcd18e1db52e49ab04ae",
        "MonthYear": "2024-06",
        "RecordId": "67c3e147401c29858df96623",
        "Trackings": {
            "2024-06-30": {
                "Height": 122,
                "Weight": 28,
                "BMI": 18.81,
                "BMIResult": "Unknown"
            }
        },
        "__v": 0
    },
    {
        "_id": "67d4dd668e1db52e49ab04af",
        "RecordId": "67c3e147401c29858df96623",
        "MonthYear": "2024-07",
        "Trackings": {
            "2024-07-30": {
                "Height": 122,
                "Weight": 28,
                "BMI": 18.81,
                "BMIResult": "Unknown"
            }
        },
        "__v": 0
    },
    {
        "_id": "67d4dd738e1db52e49ab04b0",
        "MonthYear": "2024-08",
        "RecordId": "67c3e147401c29858df96623",
        "Trackings": {
            "2024-08-30": {
                "Height": 122,
                "Weight": 28,
                "BMI": 18.81,
                "BMIResult": "Unknown"
            }
        },
        "__v": 0
    },
    {
        "_id": "67dec6cb8c62662ac1425895",
        "MonthYear": "2025-03",
        "RecordId": "67c3e147401c29858df96623",
        "Trackings": {
            "2025-03-22": {
                "Height": 200,
                "Weight": 133,
                "BMI": 33.25,
                "BMIZScore": 6.75,
                "BMIResult": "Obesity",
                "HeadCircumference": 12,
                "WaistCircumference": 33
            }
        },
        "__v": 0
    }
];

export default function TestScreen() {
  const [heightData, setHeightData] = useState([]);

  useEffect(() => {
    const data = extractHeightByDay(apiResponse);
    setHeightData(data);
  }, []);

  return (
    <View style={tw`p-4`}>
      <Text style={tw`text-center text-lg font-bold`}>Test Screen</Text>
      <HeightGraph data={heightData} />
      <FlatList
        data={heightData}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={tw`p-2 border-b border-gray-200`}>
            <Text>Date: {item.date}</Text>
            <Text>Height: {item.height}</Text>
          </View>
        )}
      />
    </View>
  );
}
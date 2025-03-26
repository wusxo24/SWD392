import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import HeightGraph from "@/components/graph/Graph.component";

export default function TestScreen() {
  const [heightData, setHeightData] = useState([]);

  useEffect(() => {
    fetchHeightData();
  }, []);

  const fetchHeightData = async () => {
    try {
      const existingStats = await AsyncStorage.getItem("statistics");
      const statsData = existingStats ? JSON.parse(existingStats) : {};
      const childId = "67e32d42bc059d46968e026d";
      const heightData = [];

      if (statsData[childId]) {
        for (const date in statsData[childId]) {
          heightData.push({
            date: date.split('-').reverse().join('-'), // Convert to dd-mm-yyyy format
            height: statsData[childId][date].height,
          });
        }
      }

      setHeightData(heightData);
    } catch (error) {
      console.error("Failed to fetch height data", error);
    }
  };

  const handleButtonPress = () => {
    alert("Button Pressed!");
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      alert("AsyncStorage cleared successfully!");
    } catch (error) {
      console.error("Failed to clear AsyncStorage", error);
    }
  };

  const generateRandomData = async () => {
    const statsData = {};
    const childId = "67e32d42bc059d46968e026d";
    statsData[childId] = {};

    for (let i = 0; i < 60; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0].split('-').reverse().join('-'); // Convert to dd-mm-yyyy format

      const randomHeight = (Math.random() * (150 - 100) + 100).toFixed(2);
      const randomWeight = (Math.random() * (50 - 20) + 20).toFixed(2);
      const bmi = (randomWeight / ((randomHeight / 100) ** 2)).toFixed(2);
      const bmiCategory = getBMICategory(bmi);

      statsData[childId][formattedDate] = {
        height: randomHeight,
        weight: randomWeight,
        bmi: bmi,
        bmiCategory: bmiCategory,
        updatedDate: new Date().toISOString(),
      };
    }

    try {
      await AsyncStorage.setItem("statistics", JSON.stringify(statsData));
      alert("Random data generated and saved successfully!");
      fetchHeightData(); // Refresh the height data after generating new data
    } catch (error) {
      console.error("Failed to save statistics", error);
    }
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 25) return "Normal";
    if (bmi >= 25 && bmi < 30) return "Overweight";
    if (bmi >= 30 && bmi < 40) return "Obese";
    if (bmi >= 40) return "Severely Obese";
    return "Unknown";
  };

  return (
    <View style={tw`p-4`}>
      <Text style={tw`text-center text-lg font-bold`}>Test Screen</Text>
      <HeightGraph primaryData={heightData} />
      <Button title="Press Me" onPress={handleButtonPress} />
      <Button title="Clear Storage" onPress={clearAsyncStorage} />
      <Button title="Generate Random Data" onPress={generateRandomData} />
    </View>
  );
}
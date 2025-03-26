import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import ArrowDownIcon from "@/assets/icons/ArrowDown.icon";
import { Header } from "@/components/Header.component";
import childService from "@/service/child.service";
import { router, useLocalSearchParams } from "expo-router";
import { Child } from "@/models/Child.model";
import Graph from "@/components/graph/Graph.component";
import EditStatistics from "@/components/statistics/EditStatistics.component";

const ChildSelector = ({
  selectedChildName,
  onPress,
}: {
  selectedChildName: string;
  onPress: () => void;
}) => {
  return (
    <View style={tw`flex-row items-center justify-between px-4`}>
      <Text style={tw`font-normal text-xl`}>Child: </Text>
      <TouchableOpacity onPress={onPress}>
        <View
          style={tw`rounded-full flex flex-row px-4 py-2 w-52 items-center justify-between bg-white `}
        >
          <Text style={tw`w-full text-lg font-semibold text-center`}>
            {selectedChildName}
          </Text>
          <ArrowDownIcon />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ChildSelectionModal = ({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (child: any) => void;
}) => {
  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const children = await childService.getChildren();
        setChildren(children);
      } catch (error) {
        console.error("Failed to fetch children", error);
      }
    };

    if (visible) {
      fetchChildren();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View
        style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
      >
        <View style={tw`bg-white p-4 rounded-lg w-3/4`}>
          <Text style={tw`text-xl font-bold mb-4`}>Select a Child</Text>
          <FlatList
            data={children}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={tw`p-2 border-b border-gray-200`}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={tw`text-xl`}>{`${item.fname} ${item.lname}`}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={tw`p-2 mt-4 bg-red-500 rounded-lg`}
            onPress={onClose}
          >
            <Text style={tw`text-white text-center`}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const ChildCenter = ({ child }: { child: Child }) => {
  const calculateAge = (birthdate: string) => {
    const birthDate = new Date(birthdate);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <View style={tw`flex-row items-center px-4 my-4`}>
      <Image
        source={{ uri: child.picture || "https://picsum.photos/150" }}
        style={tw`w-16 h-16 rounded-full`}
      />
      <View style={tw`ml-4`}>
        <View style={tw`flex flex-row items-baseline gap-1`}>
          <Text
            style={tw`text-xl font-bold`}
          >{`${child.fname} ${child.lname}`}</Text>
          <Text style={tw`text-sm`}>
            {"(" + calculateAge(child.birthdate) + "yo)"}
          </Text>
        </View>
        <Text>Current status: </Text>
        <Text>Last updated: </Text>
      </View>
    </View>
  );
};

const ViewStatisticsGraph = ({ primaryData, secondaryData }) => (
  <View style={tw`p-4`}>
    <Text style={tw`font-bold text-lg`}>Stats Index</Text>
    <Graph primaryData={primaryData} secondaryData={secondaryData} />
  </View>
);

export default function StatisticScreen() {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [primaryData, setPrimaryData] = useState([]);
  const [secondaryData, setSecondaryData] = useState([]);
  const { mode } = useLocalSearchParams();

  const fetchSelectedChild = async () => {
    try {
      const selectedChildString = await AsyncStorage.getItem("selectedChild");
      if (selectedChildString) {
        const selectedChild = JSON.parse(selectedChildString);
        setSelectedChild(selectedChild);
      }
    } catch (error) {
      console.error("Failed to fetch selected child from AsyncStorage", error);
    }
  };

  const fetchStatisticsData = async () => {
    try {
      const existingStats = await AsyncStorage.getItem("statistics");
      const statsData = existingStats ? JSON.parse(existingStats) : {};
      const childId = selectedChild?._id;
      const primaryData = [];
      const secondaryData = [];

      if (statsData[childId]) {
        for (const date in statsData[childId]) {
          primaryData.push({
            date: date.split('-').reverse().join('-'), // Convert to dd-mm-yyyy format
            height: statsData[childId][date].height,
            weight: statsData[childId][date].weight,
            bmi: statsData[childId][date].bmi,
          });
          secondaryData.push({
            date: date.split('-').reverse().join('-'), // Convert to dd-mm-yyyy format
            height: statsData[childId][date].height,
            weight: statsData[childId][date].weight,
            bmi: statsData[childId][date].bmi,
          });
        }
      }

      setPrimaryData(primaryData);
      setSecondaryData(secondaryData);
    } catch (error) {
      console.error("Failed to fetch statistics data", error);
    }
  };

  useEffect(() => {
    fetchSelectedChild();
    if (mode === "VIEW") {
      fetchStatisticsData();
    }
  }, [mode]);

  const handleSelectChild = async (child: Child) => {
    try {
      await AsyncStorage.setItem("selectedChild", JSON.stringify(child));
      setSelectedChild(child);
    } catch (error) {
      console.error("Failed to save selected child to AsyncStorage", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        screenTitle="Child Statistic Tracking"
        onBackPress={() => {
          router.push("/home.screen");
        }}
      />
      <ChildSelector
        selectedChildName={
          selectedChild
            ? `${selectedChild.fname} ${selectedChild.lname}`
            : "Select a child"
        }
        onPress={() => setIsModalVisible(true)}
      />
      <ChildSelectionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelect={handleSelectChild}
      />
      {selectedChild && <ChildCenter child={selectedChild} />}
      {mode === "EDIT" && selectedChild ? (
        <EditStatistics selectedChild={selectedChild} />
      ) : (
        <ViewStatisticsGraph primaryData={primaryData} secondaryData={secondaryData} />
      )}
    </View>
  );
}
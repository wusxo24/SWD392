import React, { useState, useEffect } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "@/components/Header.component";

enum Mode {
  View = "VIEW",
  Create = "CREATE",
  Update = "UPDATE",
}

const ChildInformationScreen = () => {
  const router = useRouter();
  const { mode, id } = useLocalSearchParams();
  const [currentMode, setCurrentMode] = useState<Mode>(Mode.View);
  const [childData, setChildData] = useState({
    fname: "",
    lname: "",
    birthDate: "",
    gender: "",
    picture: "",
    bloodType: "",
    allergies: "",
    notes: "",
  });

  useEffect(() => {
    if (mode) {
      setCurrentMode(mode as Mode);
    }
    if (mode === Mode.Update && id) {
      fetchChildData(id as string);
    }
  }, [mode, id]);

  const fetchChildData = async (childId: string) => {
    try {
      const childrenString = await AsyncStorage.getItem("children");
      if (childrenString) {
        const children = JSON.parse(childrenString);
        const child = children.find((c: any) => c.id === childId);
        if (child) {
          setChildData(child);
        }
      }
    } catch (error) {
      console.error("Failed to fetch child data from AsyncStorage", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setChildData({ ...childData, [field]: value });
  };

  const handleSave = async () => {
    try {
      const childrenString = await AsyncStorage.getItem("children");
      let children = childrenString ? JSON.parse(childrenString) : [];
      if (currentMode === Mode.Create) {
        // Add new child
        const newChild = { ...childData, id: Date.now().toString() };
        children.push(newChild);
      } else if (currentMode === Mode.Update) {
        // Update existing child
        children = children.map((child: any) =>
          child.id === id ? { ...child, ...childData } : child
        );
      }
      await AsyncStorage.setItem("children", JSON.stringify(children));
      setCurrentMode(Mode.View);
      router.push("/home.screen");
    } catch (error) {
      console.error("Failed to save child data", error);
    }
  };

  const renderViewMode = () => (
    <View>
      <Text>First Name: {childData.fname}</Text>
      <Text>Last Name: {childData.lname}</Text>
      <Text>Birth Date: {childData.birthDate}</Text>
      <Text>Gender: {childData.gender}</Text>
      <Text>Blood Type: {childData.bloodType}</Text>
      <Text>Allergies: {childData.allergies}</Text>
      <Text>Notes: {childData.notes}</Text>
      <Button title="Edit" onPress={() => setCurrentMode(Mode.Update)} />
    </View>
  );

  const renderForm = () => (
    <View>
      <Text style={tw`text-center text-lg font-bold`}>Information</Text>

      <View style={tw`mx-4 p-4 bg-white rounded-lg`}>
        <Text style={tw`font-normal text-slate-500`}>Full name</Text>
        <TextInput
          style={tw`border-b py-2 text-xl`}
          value={childData.fname}
          onChangeText={(value) => handleInputChange("fname", value)}
        />
        <View style={tw`flex flex-row mt-4`}>
            <View style={tw`w-2/3`}><Text>Gender identity</Text></View>
            <View style={tw`w-1/3`}><Text>Date of birth</Text></View>
        </View>
        <Button
          title={currentMode === Mode.Create ? "Create" : "Update"}
          onPress={handleSave}
        />
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1`}>
      <Header
        screenTitle="Child Information"
        onBackPress={() => {
          router.push("/child-selector.screen");
        }}
      />
      {currentMode === Mode.View && renderViewMode()}
      {(currentMode === Mode.Create || currentMode === Mode.Update) &&
        renderForm()}
      {currentMode === Mode.View && (
        <TouchableOpacity
          style={tw`bg-blue-500 p-2 rounded mt-4`}
          onPress={() => setCurrentMode(Mode.Create)}
        >
          <Text style={tw`text-white text-center`}>Add New Child</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChildInformationScreen;

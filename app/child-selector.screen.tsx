import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import tw from "twrnc";
import { Child } from "@/models/Child.model";
import { Header } from "@/components/Header.component";
import { router } from "expo-router";

const ItemsList = ({
  items,
  selectedChild,
  onSelectChild,
}: {
  items: Child[];
  selectedChild: Child | null;
  onSelectChild: (child: Child) => void;
}) => {
  return (
    <View style={tw`flex flex-col gap-4`}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            tw`flex flex-col p-4 rounded-lg bg-white justify-between`,
            selectedChild?.id === item.id
              ? tw`border border-sky-600`
              : tw`border border-white`,
          ]}
          onPress={() => onSelectChild(item)}
        >
          <View style={tw`flex flex-row items-center justify-between w-full`}>
            <View style={tw`flex flex-row items-center gap-2`}>
              <Text style={tw`font-semibold text-lg`}>{item.id}</Text>
              <View style={tw`w-[2px] bg-slate-600 h-5`} />
              <Text style={tw`text-lg`}>
                {item.fname.toUpperCase() + " " + item.lname.toUpperCase()}
              </Text>
            </View>
            <View
              style={tw`h-5 w-5 rounded-full border border-sky-600 items-center justify-center`}
            >
              {selectedChild?.id === item.id && (
                <View style={tw`h-3 w-3 rounded-full bg-sky-600`} />
              )}
            </View>
          </View>
          <Text style={tw`text-sm text-slate-600 pt-2`}>{item.notes}</Text>
          <View style={tw`flex flex-row items-center justify-start gap-2`}>
            <Text
              style={tw`text-xs font-semibold text-green-600 bg-green-200 rounded px-2 py-1 mt-2 self-start`}
            >
              {item.birthDate &&
                Math.floor(
                  (new Date().getTime() - new Date(item.birthDate).getTime()) /
                    (1000 * 60 * 60 * 24 * 365.25)
                )}{" "}
              years old
            </Text>
            <Text style={tw`text-xs font-semibold text-red-600 bg-red-200 rounded px-2 py-1 mt-2 self-start`}>Medical Status (TDL)</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function ChildSelectorScreen() {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const handleSelectChild = (child: Child) => {
    setSelectedChild(child);
  };

  return (
    <View style={tw`flex-1`}>
      <Header
        screenTitle="Child Selector"
        onBackPress={() => {
          router.push("/home.screen");
        }}
      />
      <View style={tw`px-4`}>
        <ItemsList
          items={[
            {
              id: 1,
              fname: "Tom",
              lname: "Jerry",
              memberID: 0,
              birthDate: new Date(2010, 5, 15),
              gender: "male",
              picture: "",
              bloodType: "A",
              allergies: [],
              notes: "Sample note for Tom Jerry",
            },
            {
              id: 2,
              fname: "Jerry",
              lname: "Tom",
              memberID: 0,
              birthDate: new Date(2011, 6, 16),
              gender: "male",
              picture: "",
              bloodType: "A",
              allergies: [],
              notes: "Sample note for Jerry Tom",
            },
          ]}
          selectedChild={selectedChild}
          onSelectChild={handleSelectChild}
        />
      </View>
    </View>
  );
}

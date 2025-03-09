import React, { useState } from "react";
import tw from "twrnc";

import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

import { UserCenter } from "@/components/index/UserCenter.component";
import ArrowDownIcon from "@/assets/icons/ArrowDown.icon";

const ChildSelector = () => {
  const [visible, setVisible] = useState(false);
  const [selectedChild, setSelectedChild] = useState("Select a child");

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelectChild = (child: string) => {
    setSelectedChild(child);
    closeMenu();
  };

  return (
    <View style={tw`flex-row items-center justify-between px-4 my-4`}>
      <Text style={tw`font-normal text-xl`}>Child: </Text>
      <TouchableOpacity
        style={tw`rounded-full flex flex-row px-4 py-2 w-52 items-center justify-center bg-white `}
        onPress={openMenu}
      >
        <Text style={tw`w-full text-center`}>{selectedChild}</Text>
        <ArrowDownIcon />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={closeMenu}
        >
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleSelectChild("Child 1 (ID: 1)")}
            >
              <Text style={tw`text-black`}>Child 1 (ID: 1)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleSelectChild("Child 2 (ID: 2)")}
            >
              <Text style={tw`text-black`}>Child 2 (ID: 2)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleSelectChild("Child 3 (ID: 3)")}
            >
              <Text style={tw`text-black`}>Child 3 (ID: 3)</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    width: 160,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menu: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    width: 200,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default function HomeScreen() {
  return (
    <View style={tw`p-4`}>
      <UserCenter
        avatar="https://picsum.photos/150"
        name="John Doe"
        subscriptionId={4}
        subscriptionPlan="Gold"
      />
      <ChildSelector />
    </View>
  );
}

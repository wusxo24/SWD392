import React, { useEffect, useRef, useState } from "react";
import tw from "twrnc";

import { View, Text, TouchableOpacity, Modal, StyleSheet, Linking } from "react-native";

import { UserCenter } from "@/components/index/UserCenter.component";
import ArrowDownIcon from "@/assets/icons/ArrowDown.icon";
import { Link, router } from "expo-router";
import IndexStat from "@/components/index/IndexStat.component";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChildSelector = () => {
  return (
    <View style={tw`flex-row items-center justify-between px-4 my-4`}>
      <Text style={tw`font-normal text-xl`}>Child: </Text>
      <Link href="/child-selector.screen">
        <View
          style={tw`rounded-full flex flex-row px-4 py-2 w-52 items-center justify-between bg-white `}
        >
          <Text style={tw`w-full text-lg font-semibold text-center`}>
            Tom and Jerry
          </Text>
          <ArrowDownIcon />
        </View>
      </Link>
    </View>
  );
};

export default function HomeScreen() {
  const [userData, setUserData] = useState({
    avatar: "https://picsum.photos/150",
    name: "John Doe",
    subscriptionId: 4,
    subscriptionPlan: "Gold",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const avatar = await AsyncStorage.getItem("avatar");
        const name = await AsyncStorage.getItem("name");
        const subscriptionId = await AsyncStorage.getItem("subscriptionId");
        const subscriptionPlan = await AsyncStorage.getItem("subscriptionPlan");

        setUserData({
          avatar: avatar || "https://picsum.photos/150",
          name: name || "John Doe",
          subscriptionId: subscriptionId ? parseInt(subscriptionId) : 4,
          subscriptionPlan: subscriptionPlan || "Gold",
        });
      } catch (error) {
        console.error("Failed to fetch user data from AsyncStorage", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={tw`p-4`}>
      <UserCenter
        avatar="{userData.avatar}"
        name="{userData.name}"
        subscriptionId={4}
        subscriptionPlan="Gold"
      />
      <ChildSelector />
      <IndexStat />
    </View>
  );
}

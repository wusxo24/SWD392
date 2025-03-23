import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { View, Text } from "react-native";
import { UserCenter } from "@/components/index/UserCenter.component";
import ArrowDownIcon from "@/assets/icons/ArrowDown.icon";
import { Link } from "expo-router";
import IndexStat from "@/components/index/IndexStat.component";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserData {
  id: string;
  email: string;
  role: string;
  userName: string;
  subscription: string;
  avatar: string;
}

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
  const [userData, setUserData] = useState<UserData>({
    id: "",
    email: "",
    role: "",
    userName: "",
    subscription: "No subscriptions",
    avatar: "https://picsum.photos/150",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setUserData({
            ...user,
            avatar: user.avatar || "https://picsum.photos/150",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data from AsyncStorage", error);
      }
    };

    fetchUserData();

    const logAsyncStorage = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
        console.log("Current AsyncStorage contents:", JSON.stringify(result, null, 2));
      } catch (error) {
        console.error("Failed to log AsyncStorage contents", error);
      }
    };

    logAsyncStorage();
  }, []);

  return (
    <View style={tw`p-4`}>
      <UserCenter
        avatar={userData.avatar}
        name={userData.userName}
        subscriptionPlan={userData.subscription}
      />
      <ChildSelector />
      <IndexStat />
    </View>
  );
}
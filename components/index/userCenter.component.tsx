import React from "react";
import tw from "twrnc";

import SilverIcon from "@/assets/icons/subscription/Silver.icon";
import GoldIcon from "@/assets/icons/subscription/Gold.icon";
import PlatinumIcon from "@/assets/icons/subscription/Platinum.icon";
import DiamondIcon from "@/assets/icons/subscription/Diamond.icon";

import NotificationIcon from "@/assets/icons/Notification.icon";

import { Image, Text, Touchable, View } from "react-native";
import { Link } from "expo-router";

type Props = {
  avatar: string;
  name: string;
  subscriptionId: number;
  subscriptionPlan: string;
};

const subscriptionColors: { [key: number]: string } = {
  1: "bg-gray-400", // Silver
  2: "bg-orange-400", // Gold
  3: "bg-sky-500", // Platinum
  4: "bg-violet-600", // Diamond
};

export const UserCenter = ({
  avatar,
  name,
  subscriptionId,
  subscriptionPlan,
}: Props) => {
  const bgColor = subscriptionColors[subscriptionId] || "bg-white";

  const renderIcon = () => {
    switch (subscriptionId) {
      case 1:
        return (
          <View
            style={tw`flex items-center justify-center rounded-full h-4 w-4 bg-white`}
          >
            <SilverIcon />
          </View>
        );
      case 2:
        return (
          <View
            style={tw`flex items-center justify-center rounded-full h-4 w-4 bg-white`}
          >
            <GoldIcon />
          </View>
        );
      case 3:
        return (
          <View
            style={tw`flex items-center justify-center rounded-full h-4 w-4 bg-white`}
          >
            <PlatinumIcon />
          </View>
        );
      case 4:
        return (
          <View
            style={tw`flex items-center justify-center rounded-full h-4 w-4 bg-white`}
          >
            <DiamondIcon />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={tw`flex flex-row items-center justify-between px-4 py-2 mt-6`}>
      <View style={tw`flex flex-row items-center`}>
        <Image source={{ uri: avatar }} style={tw`w-16 h-16 rounded-full`} />
        <View style={tw`ml-4`}>
          <Text style={tw`text-sm text-slate-600`}>Welcome,</Text>
          <Text style={tw`font-bold`}>{name}</Text>
          <View
            style={tw`flex flex-row items-center ${bgColor} px-1 rounded-full mt-1 gap-1 h-6`}
          >
            {renderIcon()}
            <Text style={tw`font-semibold text-white pr-1`}>
              {subscriptionPlan} Plan
            </Text>
          </View>
        </View>
      </View>
      <Link href="/notification.screen">
        <NotificationIcon />
      </Link>
    </View>
  );
};

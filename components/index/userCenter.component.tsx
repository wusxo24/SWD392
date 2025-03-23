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
  subscriptionPlan: string;
};

const subscriptionColors: { [key: string]: string } = {
  "Free": "bg-slate-300",
  "1": "bg-gray-400", // Silver
  "2": "bg-orange-400", // Gold
  "3": "bg-sky-500", // Platinum
  "4": "bg-violet-600", // Diamond
};

const subscriptionName: { [key: string]: string } = {
  "Free": "Free",
  "1": "Sprout",
  "2": "Bloom",
  "3": "Thrive",
  "4": "Peak",
};

export const UserCenter = ({ avatar, name, subscriptionPlan }: Props) => {
  const bgColor = subscriptionColors[subscriptionPlan] || "bg-white";
  const planName = subscriptionName[subscriptionPlan] || "Free";
  const renderIcon = () => {
    switch (subscriptionPlan) {
      case "Free":
        return (
          <View
            style={tw`flex items-center justify-center rounded-full h-4 w-4 bg-white`}
          >
            <Text style={tw`text-xs text-slate-600`}>-</Text>
          </View>
        );
      case "1":
        return (
          <View
            style={tw`flex items-center justify-center rounded-full h-4 w-4 bg-white`}
          >
            <SilverIcon />
          </View>
        );
      case "2":
        return (
          <View
            style={tw`flex items-center justify-center rounded-full h-4 w-4 bg-white`}
          >
            <GoldIcon />
          </View>
        );
      case "3":
        return (
          <View
            style={tw`flex items-center justify-center rounded-full h-4 w-4 bg-white`}
          >
            <PlatinumIcon />
          </View>
        );
      case "4":
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
              {planName} Plan
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

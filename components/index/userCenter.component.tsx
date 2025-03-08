import React from "react";
import tw from "twrnc";

import SilverIcon from "@/assets/icons/silver.icon";
import { Image, Text, View } from "react-native";

type Props = {
  avatar: string;
  name: string;
  subscriptionPlan: string;
};

export const UserCenter = ({ avatar, name, subscriptionPlan }: Props) => {
  return (
    <Text>
      This is User Center
    </Text>
  );
};

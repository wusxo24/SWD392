import React from "react";
import tw from "twrnc";
import { UserCenter } from "@/components/index/UserCenter.component";
import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View style={tw``}>
      <UserCenter
        avatar="https://picsum.photos/150"
        name="John Doe"
        subscriptionId={4}
        subscriptionPlan="Gold"
      />
      <Text>This is index screen</Text>
    </View>
  );
}
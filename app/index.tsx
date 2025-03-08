import React from "react";
import tw from "twrnc";
import { useNavigation, useRoute } from "@react-navigation/native";
import { UserCenter } from "@/components/index/UserCenter.component";
import { View, Text, Button } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  console.log(route.name);
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

import React from "react";
import tw from "twrnc";
import { useRoute, useNavigation } from "@react-navigation/native";
import { UserCenter } from "@/components/index/userCenter.component";
import { View, Text } from "react-native";

export default function HomeScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  console.log(route.name);
  return (
    <View style={tw``}>
      <View style={tw``}/>
      <UserCenter
        avatar="https://picsum.photos/150"
        name="John Doe"
        subscriptionPlan="Silver"
      />
      <Text>This is index screen</Text>
    </View>
  );
}

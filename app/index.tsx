import React from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { UserCenter } from "@/components/index/userCenter.component";

export default function HomeScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  console.log(route.name);
  return (
    <div>
      <UserCenter
        avatar="https://picsum.photos/150"
        name="John Doe"
        subscriptionPlan="Silver"
      />
    </div>
  );
}

import { Link } from "expo-router";
import { View, Text } from "react-native";
import tw from "twrnc";

const UserCenter = () => {
  return (
    <View style={tw`flex-row items-center justify-between px-4 my-4`}>
      <Text style={tw`font-normal text-xl`}>User Center</Text>
    </View>
  );
};

const SubscriptionPlanButton = () => {
  return (
    <Link href="/subscription-plan.screen">
      <View
        style={tw`w-full flex items-center justify-center h-16 rounded-lg shadow-md bg-sky-500 border-4 border-white`}
      >
        <Text style={tw`text-center text-xl font-bold text-white`}>
          Subscription Plan
        </Text>
      </View>
    </Link>
  );
};

export default function ProfileScreen() {
  return (
    <View style={tw`p-4`}>
      <UserCenter />
      <SubscriptionPlanButton />
    </View>
  );
}

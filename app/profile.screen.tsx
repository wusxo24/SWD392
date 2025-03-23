import { Link } from "expo-router";
import { View, Text } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
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
      <LinearGradient
        colors={["#50FF5699", "#058BBB99"]}
        style={tw`p-4 rounded-lg shadow-md`}
      >
        <Text style={tw`text-center text-lg font-semibold text-white`}>
          Subscription Plan
        </Text>
      </LinearGradient>
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

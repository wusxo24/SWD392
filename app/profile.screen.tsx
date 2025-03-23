import LogoutIcon from "@/assets/icons/Logout.icon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
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

const LogOutButton = () => {
  return (
    <TouchableOpacity
      style={tw`w-full h-12 flex flex-row gap-2 items-center justify-center bg-white rounded-xl`}
      onPress={() => {
        AsyncStorage.clear();
        router.push("/login.screen");
      }}
    >
      <LogoutIcon />
      <Text style={tw`text-center text-xl font-normal text-cyan-600`}>
        Log Out
      </Text>
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  return (
    <View style={tw`p-4`}>
      <UserCenter />
      <SubscriptionPlanButton />
      <Text style={tw`text-xl font-bold pt-8`}>Children Management</Text>
      <LogOutButton />
    </View>
  );
}

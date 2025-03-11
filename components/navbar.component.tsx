import React from "react";
import tw from "twrnc";
import HomeIcon from "@/assets/icons/Home.icon";
import AccountIcon from "@/assets/icons/Account.icon";
import SupportIcon from "@/assets/icons/Support.icon";
import { View, TouchableOpacity, Text } from "react-native";

const NavBar = () => {
  return (
    <View style={tw`absolute bottom-0 w-full px-4 pb-6 z-10`}>
      <View
        style={tw`flex flex-row justify-between w-full bg-white rounded-full px-11 pt-3 pb-2`}
      >
        <TouchableOpacity style={tw`flex flex-col items-center`}>
          <HomeIcon />
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex flex-col items-center`}>
          <View style={tw`absolute bottom-4 p-3 bg-white rounded-full`}>
            <View style={tw`rounded-full p-2 z-5 bg-[#239AC6]`}>
              <SupportIcon />
            </View>
          </View>
          <Text style={tw`pt-6 z-10`}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex flex-col items-center`}>
          <AccountIcon />
          <Text>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavBar;

import React, { useRef, useState } from "react";
import tw from "twrnc";

import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

import { UserCenter } from "@/components/index/UserCenter.component";
import ArrowDownIcon from "@/assets/icons/ArrowDown.icon";
import { Link } from "expo-router";
import IndexStat from "@/components/index/IndexStat.component";

const ChildSelector = () => {
  return (
    <View style={tw`flex-row items-center justify-between px-4 my-4`}>
      <Text style={tw`font-normal text-xl`}>Child: </Text>
      <Link href="/child-selector.screen">
        <View
          style={tw`rounded-full flex flex-row px-4 py-2 w-52 items-center justify-between bg-white `}
        >
          <Text style={tw`w-full text-lg font-semibold text-center`}>
            Tom and Jerry
          </Text>
          <ArrowDownIcon />
        </View>
      </Link>
    </View>
  );
};

export default function HomeScreen() {
  return (
    <View style={tw`p-4`}>
      <UserCenter
        avatar="https://picsum.photos/150"
        name="John Doe"
        subscriptionId={4}
        subscriptionPlan="Gold"
      />
      <ChildSelector />
      <IndexStat />
    </View>
  );
}

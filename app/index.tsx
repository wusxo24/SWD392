import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import { useRouter } from "expo-router";

// Import the images
const Ellipse1 = require("../assets/images/Ellipse-1.png");
const Ellipse2 = require("../assets/images/Ellipse-2.png");
const Logo = require("../assets/images/Logo.png");
const LogoText = require("../assets/images/LogoText.png");

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setTimeout(() => {
        if (token) {
          router.push("/home.screen");
        } else {
          router.push("/login.screen");
        }
      }, 2000); 
    };

    checkToken();
  }, []);

  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Image
        source={Ellipse1}
        style={tw`absolute w-[400px] h-[400px] top-[-32px] left-0`}
      />
      <Image
        source={Ellipse2}
        style={tw`absolute w-[400px] h-[400px] bottom-0 right-0`}
      />
      <Image source={Logo} style={tw`w-40 h-40`} />
      <Image source={LogoText} style={tw`w-[324px] h-[66px]`} />
    </View>
  );
};

export default SplashScreen;

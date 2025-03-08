import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Stack } from "expo-router";
import tw from "twrnc";

import NavBar from "@/components/Navbar.component";
import { usePathname } from "expo-router";
import "../styles/global.css";

export default function RootLayout() {
  const currentRoute = usePathname();
  const routesWithNavBar = [
    "/index.screen",
    "/support.screen",
    "/profile.screen",
  ];

  const showNavBar = routesWithNavBar.includes(currentRoute);

  return (
    <View style={tw`flex-1 bg-sky-100 pt-4`}>
      <StatusBar style="dark" />
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: tw.color("bg-sky-100") },
        }}
      />
      {showNavBar && <NavBar />}
    </View>
  );
}

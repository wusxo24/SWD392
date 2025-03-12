import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Stack } from "expo-router";
import tw from "twrnc";

import NavBar from "@/components/Navbar.component";
import { usePathname } from "expo-router";
import "../styles/global.css";

import {
  useFonts,
  NotoSans_400Regular,
  NotoSans_700Bold,
} from "@expo-google-fonts/noto-sans";
import AppLoading from "expo-app-loading";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NotoSans_400Regular,
    NotoSans_700Bold,
  });

  const currentRoute = usePathname();
  const routesWithNavBar = [
    "/home.screen",
    "/support.screen",
    "/profile.screen",
  ];

  const showNavBar = routesWithNavBar.includes(currentRoute);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={tw`flex-1 bg-sky-50 pt-4`}>
      <StatusBar style="dark" />
      {showNavBar && <NavBar />}
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: tw.color("bg-sky-50"),
          },
        }}
      />
    </View>
  );
}

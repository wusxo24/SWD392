import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../styles/global.css";
import NavBar from "@/components/navbar.component";
import { usePathname } from "expo-router";
import { View } from "react-native";
import tw from "twrnc";

export default function RootLayout() {
  const currentRoute = usePathname();
  const routesWithNavBar = ["/", "/support", "/profile"]; // Add your routes here

  const showNavBar = routesWithNavBar.includes(currentRoute);

  return (
    <View style={tw`flex-1 bg-sky-100 pt-4`}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: tw.color("bg-sky-100") },
        }}
      />
      {showNavBar && <NavBar />}
    </View>
  );
}

import { View, Text} from "react-native";

const StartupScreen = () => {
  return (
    <View className="bg-sky-100 h-screen w-screen flex justify-center items-center overflow-hidden">
      <View className="absolute w-[357px] h-[361px] left-[-151px] top-[-96px] bg-[rgba(13,191,255,0.6)] blur-[135px]" />
      <View className="absolute w-[357px] h-[361px] right-[0px] bottom-[-200px] bg-[rgba(13,191,255,0.6)] blur-[135px]" />
      <Text className="text-lg font-bold">Hello FCare</Text>
    </View>
  );
};

export default StartupScreen;

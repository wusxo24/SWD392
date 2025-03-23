import { Link, useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import tw from "twrnc";
import * as SplashScreen from "expo-splash-screen";
import authService from "../service/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import orderService from "@/service/order.service";
import childService from "@/service/child.service";

const Logo = require("../assets/images/Logo.png");
const GoogleLogo = require("../assets/images/GoogleLogo.png");

const LogoSection = () => (
  <View style={tw`flex items-center`}>
    <Image source={Logo} style={tw`w-40 h-40`} />
    <Text style={tw`text-2xl font-semibold mt-4`}>Welcome Back</Text>
    <Text style={tw`text-lg font-light text-center mt-3 px-8`}>
      Let's continue the journey of tracking your child's growth and well-being
      together.
    </Text>
  </View>
);

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
  returnKeyType: "done" | "next" | "go" | "search" | "send";
  onSubmitEditing: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  onFocus,
  onBlur,
  isFocused,
  returnKeyType,
  onSubmitEditing,
}) => (
  <View style={tw`w-full px-8 mt-4`}>
    <Text style={tw`px-4 my-2 font-semibold`}>{label}</Text>
    <TextInput
      style={[
        tw`border rounded-full bg-white px-4 py-3`,
        isFocused ? tw`border-2 border-sky-500` : tw`border-sky-300`,
      ]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      onFocus={onFocus}
      onBlur={onBlur}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      autoCapitalize="none"
    />
  </View>
);

const LoginButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <View style={tw`w-full px-8 mt-6`}>
    <TouchableOpacity
      style={tw`bg-sky-500 rounded-full py-3`}
      onPress={onPress}
    >
      <Text style={tw`text-white text-center font-semibold`}>Sign In</Text>
    </TouchableOpacity>
  </View>
);

const ForgotPasswordLink = () => (
  <View style={tw`w-full px-8`}>
    <Link style={tw`px-4 pt-1`} href="/forgot-password.screen">
      <Text style={tw`text-sky-500 underline text-left font-semibold`}>
        Forgot password?
      </Text>
    </Link>
  </View>
);

const Divider = () => (
  <View style={tw`flex mt-6 w-full px-8`}>
    <Text style={tw`font-light text-center z-1`}>or sign in using</Text>
    <View style={tw`relative flex items-center top-[-2] h-[1px] bg-slate-600`}>
      <View style={tw`bg-sky-100 h-[1px] w-30`} />
    </View>
  </View>
);

const GoogleLoginButton = () => (
  <View style={tw`w-full px-8 mt-6`}>
    <TouchableOpacity
      style={tw`flex flex-row gap-3 items-center justify-center border border-sky-500 bg-white rounded-full py-3`}
      onPress={() => {}}
    >
      <Image source={GoogleLogo} style={tw`w-6 h-6`} />
      <Text style={tw`text-sky-500 text-center font-semibold`}>
        Connect with Google
      </Text>
    </TouchableOpacity>
  </View>
);

const SignUpLink = () => (
  <View style={tw`w-full px-8 mt-6`}>
    <Link style={tw`px-4 pt-1`} href="/signup.screen">
      <Text style={tw` text-center font-semibold`}>
        Don't have an account?{" "}
        <Text style={tw`text-sky-500 underline`}>Sign Up</Text>
      </Text>
    </Link>
  </View>
);

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);
  const router = useRouter();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    return () => {
      SplashScreen.hideAsync();
    };
  }, []);

  const handleLogin = async () => {
    const response = await authService.login(email, password);
    if (response) {
      try {
        // Fetch orders and update user data
        const orders = await orderService.getMemberOrders();
        const user = { ...response.user, subscription: orders };
        await AsyncStorage.setItem("user", JSON.stringify(user));

        // Fetch child data
        const children = await childService.getChildren();
        await AsyncStorage.setItem("children", JSON.stringify(children));

        // Set the first child as the default selected child if children are not null
        if (children.length > 0) {
          await AsyncStorage.setItem("selectedChild", JSON.stringify(children[0]));
        }
      } catch (error) {
        console.warn("No orders found");
      }
      router.replace("/home.screen");
    } else {
      console.log("Login failed");
    }
  };

  return (
    <View style={tw`flex flex-col items-center h-full`}>
      <LogoSection />
      <InputField
        label="Your email"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        onFocus={() => setIsEmailFocused(true)}
        onBlur={() => setIsEmailFocused(false)}
        isFocused={isEmailFocused}
        returnKeyType="next"
        onSubmitEditing={() =>
          passwordInputRef.current && passwordInputRef.current.focus()
        }
      />
      <InputField
        label="Your password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        onFocus={() => setIsPasswordFocused(true)}
        onBlur={() => setIsPasswordFocused(false)}
        isFocused={isPasswordFocused}
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />
      <ForgotPasswordLink />
      <LoginButton onPress={handleLogin} />
      <Divider />
      <GoogleLoginButton />
      <SignUpLink />
    </View>
  );
}

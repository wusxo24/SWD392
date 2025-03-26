import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "twrnc";
import { Header } from "@/components/Header.component";
import { router } from "expo-router";
import orderService from "@/service/order.service";

interface Plan {
  _id: string;
  name: string;
  description: string;
  features: string[];
  image: string;
  price: number;
  duration: number;
  plan_code: string;
}

const subscriptionColors: { [key: string]: string } = {
  "1": "bg-gray-400", // Silver
  "2": "bg-orange-400", // Gold
  "3": "bg-sky-500", // Platinum
  "4": "bg-violet-600", // Diamond
};

const plans: Plan[] = [
  {
    _id: "67b80c3cab3ae0219cebe25b",
    name: "Sprout Package 🌱",
    description: "Basic Tracking",
    features: [
      "Track height & weight over time.",
      "View detailed, beautiful growth charts.",
      "Monitor your children real-time.",
      "Receive basic growth alerts when reach limits.",
    ],
    image: "",
    price: 30000,
    duration: 6,
    plan_code: "1",
  },
  {
    _id: "67b80f1c611dc0ee536ab72f",
    name: "Bloom Package 🌸",
    description: "Enhanced Monitoring",
    features: [
      "Everything in Sprout Package.",
      "Detect growth abnormalities.",
      "Share growth data with doctors.",
      "Access expert health tips and tricks.",
    ],
    image: "",
    price: 50000,
    duration: 12,
    plan_code: "2",
  },
  {
    _id: "67b80f4b611dc0ee536ab732",
    name: "Thrive Package 🌟",
    description: "Personalized Insights",
    features: [
      "Everything in Bloom Package.",
      "Doctor feedback & recommendations.",
      "Detailed growth trend analysis.",
      "Personalized nutrition suggestions.",
    ],
    image: "",
    price: 2000,
    duration: 24,
    plan_code: "3",
  },
  {
    _id: "67b80f75611dc0ee536ab735",
    name: "Peak Package 🏆",
    description: "Advanced Care",
    features: [
      "Everything in Thrive Package.",
      "Interactive dashboards & reports.",
      "Priority access to expert consultations.",
    ],
    image: "",
    price: 90000,
    duration: 32,
    plan_code: "4",
  },
];

const PlanCard = ({ plan, style, onGetStarted }: { plan: Plan; style?: any; onGetStarted: (planId: string) => void }) => {
  const bgColor = subscriptionColors[plan.plan_code] || "#000000";

  return (
    <View style={[tw`w-3/4 h-96 m-2 rounded-lg shadow-md bg-white`, style]}>
      <View style={tw`items-center justify-center ${bgColor} rounded-t-lg p-4`}>
        <Text style={tw`text-white font-bold text-xl`}>{plan.name}</Text>
        <Text style={tw`text-white font-bold text-2xl`}>
          {plan.price}VND/{plan.duration} months
        </Text>
      </View>
      <View style={tw`flex-1 p-4`}>
        <Text style={tw`text-lg text-center font-semibold text-gray-600`}>{plan.description}</Text>
        <View style={tw`mt-2`}>
          {plan.features.map((feature, index) => (
            <Text key={index} style={tw`text-sm text-gray-600`}>
              {feature}
            </Text>
          ))}
        </View>
      </View>
      <TouchableOpacity onPress={() => onGetStarted(plan._id)}>
        <Text style={tw`text-center ${bgColor} text-white p-2 rounded-full text-lg font-semibold mx-8 mb-4`}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function SubscriptionPlanScreen() {
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);

  const handleNextPlan = () => {
    setCurrentPlanIndex((prevIndex) => (prevIndex + 1) % plans.length);
  };

  const handlePreviousPlan = () => {
    setCurrentPlanIndex(
      (prevIndex) => (prevIndex - 1 + plans.length) % plans.length
    );
  };

  const handleGetStarted = async (planId: string) => {
    try {
      await orderService.createOrder({ serviceId: planId });
      Alert.alert("Success", "Order created successfully!");
    } catch (error) {
      console.error("Failed to create order", error);
      Alert.alert("Error", "Failed to create order. Please try again.");
    }
  };

  return (
    <View style={tw`flex-1`}>
      <Header
        screenTitle="Subscription Plan"
        onBackPress={() => {
          router.push("/profile.screen");
        }}
      />
      <View>
        <Text style={tw`text-center font-bold text-2xl pt-4`}>CHOOSE YOUR PLAN</Text>
        <Text style={tw`text-center text-gray-600`}>Select the best plan that suits your needs</Text>
      </View>
      <View style={tw`py-60 justify-center items-center`}>
        {plans.map((plan, index) => {
          const scale = 1 - 0.05 * Math.abs(index - currentPlanIndex);
          return (
            <PlanCard
              key={plan._id}
              plan={plan}
              style={{
                position: "absolute",
                opacity: index === currentPlanIndex ? 1 : 0.8,
                zIndex: index === currentPlanIndex ? 1 : 0,
                transform: [
                  { scale },
                  { translateY: index === currentPlanIndex ? 0 : 1 },
                  {
                    translateX:
                      index === currentPlanIndex
                        ? 0
                        : (index - currentPlanIndex) * 20,
                  },
                ],
              }}
              onGetStarted={handleGetStarted}
            />
          );
        })}
        <TouchableOpacity
          style={[tw`w-10 h-10 flex items-center justify-center z-10 absolute left-4 p-2 rounded-full bg-sky-400`]}
          onPress={handlePreviousPlan}
        >
          <Icon name="chevron-left" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[tw`w-10 h-10 flex items-center justify-center z-10 absolute right-4 p-2 rounded-full bg-sky-400`]}
          onPress={handleNextPlan}
        >
          <Icon name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={tw`px-4`}>
        <Text style={tw`text-center font-bold text-lg px-4`}>Payment method</Text>
        <Text>TBU</Text>
      </View>
    </View>
  );
}
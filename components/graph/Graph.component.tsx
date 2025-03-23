import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, View } from "react-native";
import tw from "twrnc";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

const HeightGraph = ({ data }) => {
  const labels = data.map(item => item.date);
  const heights = data.map(item => item.height);

  const graphData = {
    labels,
    datasets: [
      {
        data: heights,
        strokeWidth: 2, // optional
      },
    ],
  };

  return (
    <View style={tw`p-4`}>
      <LineChart
        data={graphData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
      />
    </View>
  );
};

export default HeightGraph;
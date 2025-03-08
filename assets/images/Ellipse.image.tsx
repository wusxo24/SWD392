import React from "react";
import {
  Svg,
  G,
  Defs,
  Ellipse,
  Filter,
  FeFlood,
  FeBlend,
  FeGaussianBlur,
} from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";

type EllipseImageProps = {
  style?: StyleProp<ViewStyle>;
};

const EllipseImage = ({ style }: EllipseImageProps) => {
  return (
    <Svg
      style={style}
      width="412"
      height="534"
      viewBox="0 0 412 534"
      fill="none"
    >
      <G filter="url(#filter0_f_26_1360)">
        <Ellipse
          cx="27.5"
          cy="84.5"
          rx="178.5"
          ry="180.5"
          fill="#0DBFFF"
          fill-opacity="0.6"
        />
      </G>
      <Defs>
        <Filter
          id="filter0_f_26_1360"
          x="-420"
          y="-365"
          width="895"
          height="899"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <FeFlood flood-opacity="0" result="BackgroundImageFix" />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <FeGaussianBlur
            stdDeviation="134.5"
            result="effect1_foregroundBlur_26_1360"
          />
        </Filter>
      </Defs>
    </Svg>
  );
};

export default EllipseImage;

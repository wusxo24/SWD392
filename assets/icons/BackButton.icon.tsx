import React from "react";
import { Path, Svg } from "react-native-svg";

interface Props {
  isActive?: boolean;
}

const BackButtonIcon: React.FC<Props> = ({ isActive }) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M11.4 12L16 16.6L14.6 18L8.6 12L14.6 6L16 7.4L11.4 12Z"
        fill="#1D1B20"
      />
    </Svg>
  );
};

export default BackButtonIcon;

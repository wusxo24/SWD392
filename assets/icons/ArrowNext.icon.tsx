import React from "react";
import { Path, Svg } from "react-native-svg";

interface Props {
  isActive?: boolean;
}

const ArrowNext: React.FC<Props> = ({ isActive }) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M12.6 12L8 7.4L9.4 6L15.4 12L9.4 18L8 16.6L12.6 12Z"
        fill="#1D1B20"
      />
    </Svg>
  );
};

export default ArrowNext;

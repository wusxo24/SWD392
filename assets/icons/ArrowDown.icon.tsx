import React from "react";
import { Path, Svg } from "react-native-svg";

interface Props {
  isActive?: boolean;
}

const ArrowDownIcon: React.FC<Props> = ({ isActive }) => {
  return (
    <Svg
      width="13"
      height="9"
      viewBox="0 0 13 9"
      fill="none"
    >
      <Path
        d="M7.24615 8.16375C6.84853 8.60939 6.15147 8.60939 5.75384 8.16375L0.625099 2.41577C0.0500447 1.77129 0.507514 0.750001 1.37125 0.750001L11.6287 0.750002C12.4925 0.750002 12.95 1.77129 12.3749 2.41577L7.24615 8.16375Z"
        fill="#010101"
      />
    </Svg>
  );
};

export default ArrowDownIcon;

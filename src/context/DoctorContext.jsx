import { createContext } from "react";
import PropTypes from "prop-types";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const value = {};

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

DoctorContextProvider.propTypes = {
  children: PropTypes.node.isRequired, // Khai báo `children`
};

export default DoctorContextProvider;

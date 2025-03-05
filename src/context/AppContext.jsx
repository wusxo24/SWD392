import { createContext } from "react";
import PropTypes from "prop-types";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const value = {};

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired, // Khai báo `children`
};

export default AppContextProvider;

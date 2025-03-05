import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const ManageContext = createContext();

const ManageContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(null);

  return (
    <ManageContext.Provider value={{ aToken, setAToken }}>
      {children}
    </ManageContext.Provider>
  );
};

ManageContextProvider.propTypes = {
  children: PropTypes.node.isRequired, // Khai báo `children`
};

export default ManageContextProvider;

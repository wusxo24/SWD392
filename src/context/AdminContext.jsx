import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(null);

  return (
    <AdminContext.Provider value={{ aToken, setAToken }}>
      {children}
    </AdminContext.Provider>
  );
};

AdminContextProvider.propTypes = {
  children: PropTypes.node.isRequired, // Khai báo `children`
};

export default AdminContextProvider;

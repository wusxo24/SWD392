import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import AdminContextProvider from "./context/AdminContext.jsx";
import DoctorContextProvider from "./context/DoctorContext.jsx";
import AppContextProvider from "./context/AppContext.jsx";
import ManageContextProvider from "./context/ManageContext.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <ManageContextProvider>
        <DoctorContextProvider>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </DoctorContextProvider>
      </ManageContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);

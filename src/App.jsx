import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Manage/Dashboard";
import AllApointments from "./pages/Manage/AllApointments";
import DoctorList from "./pages/Manage/DoctorList";
import ManagerAccount from "./pages/Admin/ManagerAccount";
import AddInfo from "./pages/Doctor/AddInfo";
// import { useContext } from "react";
// import { AdminContext } from "./context/AdminContext";
const App = () => {
  // const {aToken} = useContext(AdminContext)
  return (
    <div className="bg-[#F8F9FD]">
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/manage-dashboard" element={<Dashboard />} />
          <Route path="/manager-account" element={<ManagerAccount />} />
          <Route path="/all-appointments" element={<AllApointments />} />
          <Route path="/add-info" element={<AddInfo />} />
          <Route path="/doctor-list" element={<DoctorList />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

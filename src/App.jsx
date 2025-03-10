//import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./pages/guest/login";
import Register from "./pages/guest/register";
import { Hero } from "./pages/guest/hero";
import { AboutUs } from "./pages/guest/aboutUs";
import { Pricing } from "./pages/guest/pricing";
import ScrollToTop from "./components/ScrollToTop";
import { OurBest } from "./pages/guest/ourBest";
import { Footer } from "./components/footer";
import { OurTeam } from "./pages/guest/ourTeam";
import axios from "axios";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/guest/forgotpassword";
import ResetPassword from "./pages/guest/resetpassword";
import VerifiedEmail from "./pages/guest/verifiedemail";
import NewsPage from "./pages/guest/NewsPage";
import NewsDetailPage from "./pages/guest/NewsDetailPage";
import { UserProfile } from "./pages/member/userProfile";
import { ChildrenProfile } from "./pages/member/childrenProfile";
import "react-toastify/dist/ReactToastify.css";
import { ChildrenDetails } from "./pages/member/childrenDetails";
import Dashboard from "./pages/manager/Dashboard";
import AllApointments from "./pages/manager/AllApointments";
import DoctorList from "./pages/manager/DoctorList";
import ManagerAccount from "./pages/admin/ManagerAccount";
import AddInfo from "./pages/doctor/AddInfo";
import { ServicesHistory } from "./pages/member/servicesHistory";
import { SuccessPaid } from "./pages/member/successPaid";
import { FaildedPaid } from "./pages/member/failedPaid";
import { UserRecord } from "./pages/member/userRecord";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = false;

function App() {
  const location = useLocation();
  const hideNavFooter =
    location.pathname === "/login" || location.pathname === "/register";
  const userRole = localStorage.getItem("roleName") || sessionStorage.getItem("roleName"); // Get user role

  // Define default pages for each role
  const roleRoutes = {
    Guest: "/home",
    Member: "/home",
    Manager: "/dashboard",
    Admin: "/manager-account",
    Doctor: "/view-medical-request",
  };

  // Default page based on role
  const defaultPage = roleRoutes[userRole] || "/home";

  return (
    <div className="App">
      {!hideNavFooter && <Navbar />}
      <ScrollToTop />
      <Routes>
        {/* Root path redirects based on role */}
        <Route path="/" element={<Navigate to={defaultPage} replace />} />

        {/* Public Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify" element={<VerifiedEmail />} />

        {/* Guest & MemberMember Shared Pages */}
        <Route
          element={<ProtectedRoute allowedRoles={["Guest", "Member"]} />}>
             <Route path="/home" element={<><Hero /> <OurBest /> <AboutUs /> <OurTeam /> <Pricing /></>}/>
             <Route path="/news" element={<NewsPage />} />
             <Route path="/news/:id" element={<NewsDetailPage />} />
        </Route>

        {/* Member Pages */}
        <Route element={<ProtectedRoute allowedRoles={["Member"]} />}>
          <Route path="/userProfile/:id" element={<UserProfile />} />
          <Route path="/childrenProfile" element={<ChildrenProfile />} />
          <Route path="/childrenDetails/:id" element={<ChildrenDetails />} />
          <Route path="/servicesHistory/:id" element={<ServicesHistory />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/successPaid/" element={<SuccessPaid />} />
          <Route path="/failedPaid/" element={<FaildedPaid />} />
          <Route path="/userRecord/:id" element={<UserRecord/>} />
        </Route>

        {/* Manager Pages */}
        <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
          <Route path="/manage-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllApointments />} />
          <Route path="/doctor-list" element={<DoctorList />} />
        </Route>

        {/* Admin Pages */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/manager-account" element={<ManagerAccount />} />
        </Route>

        {/* Doctor Pages */}
        <Route element={<ProtectedRoute allowedRoles={["Doctor"]} />}>
          <Route path="/add-info" element={<AddInfo />} />
        </Route>

        {/* Company Shared Pages */}
        <Route
          element={<ProtectedRoute allowedRoles={["Manager", "Admin", "Doctor"]} />}>

        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to={defaultPage} replace />} />
      </Routes>
      {!hideNavFooter && <Footer />}
    </div>
  );
}

export default App;

import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./login/login";
import Register from "./login/register";
import { Hero } from "./page/hero";
import { AboutUs } from "./page/aboutUs";
import { Pricing } from "./page/pricing";
import ScrollToTop from "./components/ScrollToTop";
import { OurBest } from "./page/ourBest";
import { Footer } from "./components/footer";
import {OurTeam} from "./page/ourTeam";
import axios from "axios";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./page/profile";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = false;

function App() {
  const location = useLocation();  
  const hideNavFooter = location.pathname === "/login" || location.pathname === "/register";
  const userRole = localStorage.getItem("roleName"); // Get user role

  // Define default pages for each role
  const roleRoutes = {
    Guest: "/",
    Member: "/Home",
    Manager: "/dashboard",
    Admin: "/Doctor-management",
    Doctor: "/view-medical-request",
  };

  // Default page based on role
  const defaultPage = roleRoutes[userRole] || "/home";

  return (
    <div className="App">
      {!hideNavFooter && <Navbar />}  
      <ScrollToTop/>
      <Routes>
        {/* Root path redirects based on role */}
        <Route path="/" element={<Navigate to={defaultPage} replace />} />
        {/* Public Pages */}
        <Route
          path="/home"
          element={
            <>
              <Hero /> <OurBest /> <AboutUs /> <OurTeam /> <Pricing />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Guest & MemberMember Shared Pages */}
        <Route
          element={<ProtectedRoute allowedRoles={["Guest", "Member"]} />}
        ></Route>

        {/* Member Pages */}
        <Route element={<ProtectedRoute allowedRoles={["Member"]} />}>
        <Route path="/profile/:id"element={<Profile/>}/>
        </Route>
        
        {/* Manager Pages */}
        <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}></Route>

        {/* Admin Pages */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}></Route>

        {/* Doctor Pages */}
        <Route element={<ProtectedRoute allowedRoles={["Doctor"]} />}></Route>

        {/* Company Shared Pages */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Manager", "Admin", "Doctor"]} />
          }
        ></Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to={defaultPage} replace />} />
      </Routes>
      {!hideNavFooter && <Footer />}
    </div>
  );
}

export default App;

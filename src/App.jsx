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
import Subscription from "./pages/manager/Subscription";
import DoctorList from "./pages/manager/DoctorList";
import MemberRequest from "./pages/manager/MemberRequest";
import RatingFeedback from "./pages/manager/RatingFeedback";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import MedicalRequestManagement from "./pages/doctor/MedicalRequestManagement";
import RatingandFeedback from "./pages/doctor/RatingandFeedback";
import { ServicesHistory } from "./pages/member/servicesHistory";
import { SuccessPaid } from "./pages/member/successPaid";
import { FaildedPaid } from "./pages/member/failedPaid";
import { UserRecord } from "./pages/member/userRecord";
import GrowthChartContainer from "./pages/member/growthChartContainer";
import PlanDetails from "./pages/guest/PlanDetails";
import GrowthChartContainerBaby from "./pages/member/growthChartContainerBaby";
import DoctorManagement from "./pages/admin/DoctorManagement";
import MemberManagement from "./pages/admin/MemberManagement";
import ManagerManagement from "./pages/admin/ManagerManagement";
import GrowthChartContainerDoctor from "./pages/doctor/GrowthChartContrainerDoctor";
import GrowthChartContainerBabyDoctor from "./pages/doctor/GrowthChartContainerBabyDoctor";
import NewsManagement from "./pages/manager/NewsManagement";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

function App() {
  const location = useLocation();

  const userRole =
    localStorage.getItem("roleName") || sessionStorage.getItem("roleName"); // Get user role

  // Define default pages for each role
  const roleRoutes = {
    Guest: "/home",
    Member: "/home",
    Manager: "/dashboard",
    Admin: "/member-management",
    Doctor: "/medical-request-management",
  };
  const hideNavFooter =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    ["Manager", "Doctor", "Admin"].includes(userRole);
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
        <Route element={<ProtectedRoute allowedRoles={["Guest", "Member"]} />}>
          <Route
            path="/home"
            element={
              <>
                <Hero /> <OurBest /> <AboutUs /> <OurTeam /> <Pricing />
              </>
            }
          />
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
          <Route path="/userRecord/:id" element={<UserRecord />} />
          <Route path="/plan/:id" element={<PlanDetails />} />
          <Route
            path="/childGrowth/:recordId"
            element={<GrowthChartContainer />}
          />
          <Route
            path="/childGrowthBaby/:recordId"
            element={<GrowthChartContainerBaby />}
          />
        </Route>

        {/* Manager Pages */}
        <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
          <Route path="/news-management" element={<NewsManagement />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/doctor-list" element={<DoctorList />} />
          <Route path="/member-request" element={<MemberRequest />} />
          <Route path="/rating-feedback" element={<RatingFeedback />} />
        </Route>

        {/* Admin Pages */}

        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/doctor-management" element={<DoctorManagement />} />
          <Route path="/member-management" element={<MemberManagement />} />
          <Route path="/manager-management" element={<ManagerManagement />} />
        </Route>

        {/* Doctor Pages */}
        <Route element={<ProtectedRoute allowedRoles={["Doctor"]} />}>
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route
            path="/medical-request-management"
            element={<MedicalRequestManagement />}
          />
          <Route path="/view-rating" element={<RatingandFeedback />} />
          <Route
            path="/childGrowthDoctor/:recordId"
            element={<GrowthChartContainerDoctor />}
          />
          <Route
            path="/childGrowthBabyDoctor/:recordId"
            element={<GrowthChartContainerBabyDoctor />}
          />
        </Route>

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

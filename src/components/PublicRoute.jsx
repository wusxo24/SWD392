import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ user }) => {
  if (!user) {
    return <Outlet />; // Allow guests to access public pages
  }

  // Redirect users based on their role
  const roleRedirects = {
    Member: "/home",
    Manager: "/dashboard",
    Admin: "/Doctor-management",
    Doctor: "/view-medical-request",// Optional: Redirect customers to their main page
  };

  return <Navigate to={roleRedirects[user.role] || "/"} replace />;
};

export default PublicRoute;

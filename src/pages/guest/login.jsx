import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import login from "@/assets/Login_image.png";
import { FaArrowLeft } from "react-icons/fa";
import { EyeIcon } from "lucide-react";
import { EyeOffIcon } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in and redirect
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const role =
      localStorage.getItem("roleName") || sessionStorage.getItem("roleName");

    if (token) {
      let redirectUrl = "/";
      if (role === "Manager") redirectUrl = "/manage-dashboard";
      else if (role === "Doctor") redirectUrl = "/add-info";
      else if (role === "Admin") redirectUrl = "/manager-account";
      else if (role === "Member") redirectUrl = "/home";

      navigate(redirectUrl);
    }
  }, [navigate]);

  // Load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, message, user } = response.data;
      const { role } = user;
      const { userName } = user;
      const { id } = user;

      setSuccess(message || "Login successful!");

      // Store token based on Remember Me option
      if (rememberMe) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("roleName", role);
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("userName", userName);
        localStorage.setItem("userId", id);
      } else {
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("roleName", role);
        sessionStorage.setItem("userName", userName);
        sessionStorage.setItem("userId", id);
        localStorage.removeItem("rememberedEmail");
      }

      // Redirect based on user roleName
      let redirectUrl = "/";
      if (role === "Manager") redirectUrl = "/dashboard";
      else if (role === "Doctor") redirectUrl = "/view-booking";
      else if (role === "Admin") redirectUrl = "/staff-management";
      else if (role === "Member") redirectUrl = "/home";

      navigate(redirectUrl);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 flex items-center text-gray-700 hover:text-blue-500 transition cursor-pointer"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      <div className="w-1/2 flex flex-col justify-center items-center p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-700">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="mb-6">
            <label className="block text-gray-600 mb-2 font-bold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:border-blue-400 outline-none py-2"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-8 relative">
            <label className="block text-gray-600 mb-2 font-bold">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full border-b-2 border-gray-300 focus:border-blue-400 outline-none py-2"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 top-9 flex items-center text-gray-500"
            >
              {showPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              Remember Me
            </label>
            <a
              href="/forgot-password"
              className="text-[#0DBFFF] hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <br></br>
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-full shadow transition duration-300
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0DBFFF] hover:bg-[#10a7de]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <br></br>
        <div className="mb-6">
          {" "}
          Don't have an account? {" "}
          <a href="/register" className="text-blue-400">
            Register
          </a>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <img
          src={login}
          alt="Login Illustration"
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
}

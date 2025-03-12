import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft} from 'react-icons/fa';
import { EyeIcon } from "lucide-react";
import { EyeOffIcon } from "lucide-react";
import register from '@/assets/Login_image.png';
import { registerUser } from '@/services/authService'; // Import the service

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation function
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});
    const validationErrors = {};

    if (!formData.username) validationErrors.username = "Username is required";
    if (!formData.email) validationErrors.email = "Email is required";

    if (!formData.password) {
      validationErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      validationErrors.password =
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.";
    }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      alert('Registration successful! Please check your email for verification.');
      navigate('/login');
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'An error occurred during registration.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-screen relative">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-5 left-5 flex items-center text-gray-700 hover:text-blue-500 transition cursor-pointer"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      {/* Left Side - Input Fields */}
      <div className="w-1/2 flex flex-col justify-center items-center p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-700">Register</h2>

        {serverError && <p className="text-red-500 mb-4">{serverError}</p>}

        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2 font-bold">User Name</label>
            <input
              type="text"
              name="username"
              className="w-full border-b-2 border-gray-300 focus:border-blue-400 outline-none py-2"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2 font-bold">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border-b-2 border-gray-300 focus:border-blue-400 outline-none py-2"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-gray-600 mb-2 font-bold">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full border-b-2 border-gray-300 focus:border-blue-400 outline-none py-2 pr-10"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-2 top-14 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20}/>}
            </button>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-6 relative">
            <label className="block text-gray-600 mb-2 font-bold">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="w-full border-b-2 border-gray-300 focus:border-blue-400 outline-none py-2 pr-10"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-2 top-14 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20}/>}
            </button>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          {/* Sign In Link */}
          <div className="mb-4 text-gray-600">
            Already have an account? <Link to={'/login'} className="text-blue-400">Sign in</Link>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-[#0DBFFF] text-white py-3 rounded-full hover:bg-[#0BB0E0] transition cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>

      {/* Right Side - Image */}
      <div className="w-1/2 flex items-center justify-center">
        <img src={register} alt="Register Illustration" className="w-full h-auto object-cover" />
      </div>
    </div>
  );
}
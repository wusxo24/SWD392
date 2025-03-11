import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { resetPassword } from '@/services/authService'; // Import service

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL
  const token = new URLSearchParams(location.search).get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword(token, newPassword);
      setMessage(response.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 to-blue-200">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full transform transition-all hover:shadow-2xl">
        <h2 className="text-3xl font-semibold text-gray-700 text-center mb-2">Reset Your Password</h2>
        <p className="text-gray-500 text-center mb-6">Create a new password for your account.</p>

        {message && (
          <p className="flex items-center text-green-600 bg-green-100 p-3 rounded text-center mb-4">
            <FaCheckCircle className="mr-2" /> {message}
          </p>
        )}
        {error && (
          <p className="flex items-center text-red-600 bg-red-100 p-3 rounded text-center mb-4">
            <FaTimesCircle className="mr-2" /> {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              className="w-full pl-10 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              className="w-full pl-10 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-3 rounded-lg font-semibold transition ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

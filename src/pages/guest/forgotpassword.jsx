import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full transform transition-all hover:shadow-2xl">
        {/* Back Button */}
        <Link to="/" className="flex items-center text-gray-600 hover:text-blue-500 mb-4">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-700 text-center mb-4">Forgot Password?</h2>
        <p className="text-gray-500 text-center mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {/* Success or Error Messages */}
        {message && <p className="text-green-600 bg-green-100 p-3 rounded text-center">{message}</p>}
        {error && <p className="text-red-600 bg-red-100 p-3 rounded text-center">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
            <input 
              type="email" 
              className="w-full pl-10 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className={`w-full bg-blue-500 text-white py-3 rounded-lg font-semibold transition ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Bottom Link */}
        <p className="text-center text-gray-600 mt-4">
          Remembered your password? <Link to="/login" className="text-blue-500 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

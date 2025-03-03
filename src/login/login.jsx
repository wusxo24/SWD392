import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import login from '../assets/Login_image.png';
import { FaArrowLeft } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.get('/api/auth/login');
      const users = response.data;
      const user = users.find(u => u.username === username && u.email === email && u.password === password);

      if (user) {
        setUser(user); // Update AuthContext state
        localStorage.setItem('user', JSON.stringify(user)); // Store in localStorage

        // Redirect based on role
        switch (user.role) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'doctor':
            navigate('/doctor-dashboard');
            break;
          case 'manager':
            navigate('/manager-dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-screen">
      <button 
        onClick={() => navigate('/')} 
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
          <div className="mb-8">
            <label className="block text-gray-600 mb-2 font-bold">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:border-blue-400 outline-none py-2"
              placeholder="Enter your password" 
              required 
            />
          </div>
          <div className="mb-6"> Don't have an account? <a href='/register' className='text-blue-400'>Register</a></div>
          <button className="w-1/2 bg-[#0DBFFF] text-white py-3 rounded-full hover:bg-[#0BB0E0] transition cursor-pointer">
            Login
          </button>
        </form>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <img src={login} alt="Login Illustration" className="w-full h-auto object-cover" />
      </div>
    </div>
  );
}

import React from 'react';
import register from '../assets/Login_image.png';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="flex items-center justify-center bg-gray-100">
        {/* Left Side - Input Fields */}
        <div className="w-1/2 flex flex-col justify-center items-center p-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-700">Register</h2>

          <form className="w-full max-w-sm">
            {/* User Name */}
            <div className="mb-6">
              <label htmlFor="UserName" className="block text-gray-600 mb-2 font-bold">User Name</label>
              <input 
                type="text" 
                id="UserName" 
                className="w-full border-b-2 border-gray-300 focus:border-blue-400 outline-none py-2" 
                placeholder="Enter your username" 
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label htmlFor="Email" className="block text-gray-600 mb-2 font-bold">Email</label>
              <input 
                type="email" 
                id="Email" 
                className="w-full border-b-2 border-gray-300 focus:border-blue-400 outline-none py-2" 
                placeholder="Enter your email" 
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="Password" className="block text-gray-600 mb-2 font-bold">Password</label>
              <input 
                type="password" 
                id="Password" 
                className="w-full border-b-2 border-gray-300 focus:border-blue-400 outline-none py-2" 
                placeholder="Enter your password" 
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-8">
              <label htmlFor="ConfirmPassword" className="block text-gray-600 mb-2 font-bold">Confirm Password</label>
              <input 
                type="password" 
                id="ConfirmPassword" 
                className="w-full border-b-2 border-gray-300 focus:border-blue-400 outline-none py-2" 
                placeholder="Confirm your password" 
              />
              
            </div>
            
            <div style={{marginBottom:'30px'}} > Don't have account yet ? <Link to={'/login'} className='text-blue-400'>Sign in</Link></div>

            {/* Register Button */}
            <button className="w-1/2 h-auto bg-[#0DBFFF] text-white py-3 rounded-full hover:bg-[#0BB0E0] transition">
              Register
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

import React from 'react';
import aboutus from '../assets/AboutUS.png';
import au1 from '../assets/au1.png'
import au2 from '../assets/au2.png'
import au3 from '../assets/au3.png'
import au4 from '../assets/au4.png'
import { Link } from 'react-router-dom';
export const AboutUs = () => {
  return (
    <div id="about" className="hero pt-15">
      <div className="flex justify-center mb-20">
        <p className="text-5xl">About Us</p>
      </div>
      {/* Use 'gap-x-10' for horizontal spacing */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start bg-[#2BC6FF26] pb-70 px-10 lg:gap-x-10 mt-10">
        
        {/* Left Section */}
        <div className="flex-[0.8] mt-10">
          <p className="text-xl font-semibold">Monitor Your Child's Growth</p>
          <p className="text-5xl font-bold mt-2">Stay informed about your child's growth with our easy-to-use tracking tools.</p>
          <button className='bg-white mt-10 rounded-2xl p-2 outline outline-1 outline-gray-400 hover:bg-gray-100 '><Link to={'/blog'}> Explore Growth Insights</Link></button>
        </div>

        {/* Middle Section */}
        <div className="flex-[1.5] grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
          <div className="text-center bg-white p-5 rounded-lg shadow-md">
            <img src={au1} className='mx-auto mb-4'></img>
            <p>Over 3 million parents trust our growth tracking features.</p>
            <p className="text-5xl font-bold">5.5 million</p>
          </div>
          <div className="text-center bg-white p-5 rounded-lg shadow-md">
            <img src={au2} className='mx-auto mb-4'></img>
            <p>We have analyzed over 2 billion data points to ensure accurate growth tracking.</p>
            <p className="text-5xl font-bold">24 billion</p>
          </div>
          <div className="text-center bg-white p-5 rounded-lg shadow-md">
            <img src={au3} className='mx-auto mb-4'></img>
            <p>95% of parents report peace of mind using our tracking system.</p>
            <p className="text-5xl font-bold">99%</p>
          </div>
          <div className="text-center bg-white p-5 rounded-lg shadow-md">
            <img src={au4} className='mx-auto mb-4'></img>
            <p>We have helped track the growth of thousands of children worldwide.</p>
            <p className="text-5xl font-bold">78,513</p>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="flex-1 flex justify-center mt-10">
          <img src={aboutus} className="max-w-full h-[500px] object-cover" alt="About Us" />
        </div>
      </div>
    </div>
  );
};

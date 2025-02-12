import React from 'react';
import blue from '../assets/Blue_screen.png';
import kid from '../assets/baby_background.png';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
export const Hero = () => {
  return (
    <div id="hero" className="hero mb-32 relative w-full h-screen">
      {/* Blue Background */}
      <img src={blue} alt="Blue Background" className="w-full h-[500px] object-cover" />

      {/* Text and Buttons Positioned Inside the Blue Background */}
      <div className="absolute top-[20px] left-[200px] w-[700px] h-[730px]">
        <h1 className="text-6xl font-bold text-black" style={{ fontFamily: 'Itim' }}>Welcome to</h1>
        <h1 className="text-8xl font-bold text-[#0DBFFF] mt-[30px]" style={{ fontFamily: 'Itim' }}>CareF</h1>
        <h1 className="text-4xl italic text-black mt-[20px]">
          We work everyday to build the foundations for amazing futures both
        </h1>

        {/* Buttons */}
        <div className="mt-8 flex space-x-4 mt-[80px]">
          <button className="bg-white text-black px-6 py-3 rounded-full border border-black hover:bg-gray-100 transition duration-300">
             <ScrollLink to="pricing" smooth={true} duration={500}>
                 Discover More
             </ScrollLink>
          </button>

          <button className="bg-[#0DBFFF] text-white px-6 py-3 rounded-full hover:bg-[#0BB0E0] transition duration-300">
            <Link to={"/login"}>Join Us Today</Link>
          </button>
        </div>
      </div>

      {/* Kid Image Positioned on the Right */}
      <img 
        src={kid} 
        alt="Kid" 
        className="absolute top-[0px] right-10 w-[400px] h-[500px]" 
      />
    </div>
  );
};

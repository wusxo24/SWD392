import React from 'react'
import ractangle from '../assets/Rectangle.png'
import ourb1 from '../assets/ourb1.png'
import ourb2 from '../assets/ourb2.png'
import ourb3 from '../assets/ourb3.png'
import ourb4 from '../assets/ourb4.png'
import ourb5 from '../assets/ourb5.png'
import ourb6 from '../assets/ourb6.png'

export const OurBest = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Title Section */}
      <div className="flex justify-center items-center pt-10">
        <h1 className="text-4xl md:text-5xl font-bold text-center">
          Our <span className="text-[#0DBFFF] underline">Best</span>
        </h1>
      </div>
      <p className="text-center pt-5 max-w-2xl mx-auto">
        We are the best in the world at tracking your child's growth using professional methods.
      </p>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-10 px-5">
        <div className="text-center">
          <img src={ourb1} alt="" className="object-cover mx-auto w-28 h-28" />
          <p className="mt-5 text-lg max-w-[240px] mx-auto">
            We work with world-class doctors dedicated to exceptional care.
          </p>
        </div>
        <div className="text-center">
          <img src={ourb2} alt="" className="object-cover mx-auto w-28 h-28" />
          <p className="mt-5 text-lg max-w-[240px] mx-auto">
            Our platform ensures your child's growth is always on track.
          </p>
        </div>
        <div className="text-center">
          <img src={ourb3} alt="" className="object-cover mx-auto w-28 h-28" />
          <p className="mt-5 text-lg max-w-[240px] mx-auto">
            We offer affordable subscription plans to suit every family.
          </p>
        </div>
        <div className="text-center">
          <img src={ourb4} alt="" className="object-cover mx-auto w-28 h-28" />
          <p className="mt-5 text-lg max-w-[240px] mx-auto">
            Our platform integrates seamlessly for a great user experience.
          </p>
        </div>
      </div>

      {/* Background Banner with Images and Text */}
      <div className="relative mt-20 w-full mx-auto z-0 ">
        <img src={ractangle} className="object-cover w-full rounded-lg z-0" alt="Background" />
        <div className="absolute inset-0 flex flex-col  items-center text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-[#0DBFFF] mt-10">
            Track, Nurture, Grow - Every Step of the Way!
          </h1>
          <h2 className="text-lg md:text-2xl font-bold text-[#7B6F6F] mt-3 max-w-2xl">
            Every parent deserves a simple and reliable way to track their child’s growth with care!
          </h2>
        </div>

        {/* Two Images Inside the Banner */}
        <div className="absolute inset-0 flex flex-col md:flex-row justify-center items-center gap-10 md:gap-20 mt-20 px-4">
          <img src={ourb5} className="w-[80%] md:w-[45%] max-w-[500px] h-[240px] object-cover rounded-lg" alt="Best Feature 1" />
          <img src={ourb6} className="w-[80%] md:w-[45%] max-w-[500px] object-cover rounded-lg" alt="Best Feature 2" />
        </div>
      </div>
    </div>
  )
}

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
    <div className='container'>
    <div className='flex justify-center items-center pt-15'>
        <h1 className="text-5xl font-soild">
            Our <span className='text-[#0DBFFF] underline'>Best</span></h1>
    </div>
    <div>
    <p className='flex justify-center pt-5'>We are the best in the world page to tracking your kid growth with professtional method </p>
    </div>
    <div className='ourbSection flex place-content-between flex-warp mt-25 pl-10 pr-10'>
    <div className='section1 text-center ' >
      <img src={ourb1} alt="" className="object-cover mx-auto"/>
      <p className="mt-10 text-lg max-w-[240px] mx-auto">We work with world-class doctors dedicated to exceptional care. Carefully selected for their expertise </p>
    </div>
    <div className='section2 text-center'>
    <img src={ourb2} alt="" className="object-cover mx-auto"/>
    <p className="mt-10 text-lg max-w-[240px] mx-auto">Our platform offers the world’s best child growth ess is always on track!</p>
    </div>
    <div className='section3 text-center'>
    <img src={ourb3} alt="" className="object-cover mx-auto"/>
    <p className="mt-10 text-lg max-w-[240px] mx-auto">We offer a variety of subscription plans to fit every eaking the bank!</p>
    </div>
    <div className='section4 text-center'>
    <img src={ourb4} alt="" className="object-cover mx-auto"/>
    <p className="mt-10 text-lg max-w-[240px] mx-auto">Our platform integrates a e for every user!</p>
    </div>
    </div>
    <div className='relative mt-50'>
      <img src={ractangle} className='object-cover'/>
      <div className='absolute inset-0 flex flex-col items-center mt-10'>
        <h1 className='text-4xl font-bold text-[#0DBFFF]'>Track, Nurture, Grow - Every Step of the Way!</h1>
        <h1 className='text-2xl font-bold text-[#7B6F6F] mt-7'>every parent deserves a simple and reliable way to track their child’s growth with care!</h1>
      </div>
      <div className='absolute inset-0 flex justify-center items-center gap-40 mt-50'>
         <img src={ourb5} className="w-[600px] h-[240px] object-cover" alt="Best Feature 1" />
          <img src={ourb6} className="w-[500px] object-cover" alt="Best Feature 2" />
      </div> 
    </div>
    </div>

  )
}

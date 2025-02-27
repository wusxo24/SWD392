import React from 'react'
import NavLinkWithScroll from './NavLinkWithScroll'

export const Footer = () => {
  return (
    <div className='bg-[#0DBFFF] p-5'>
     <div className="flex justify-between">
       <div className='flex gap-10'>
        <div>
            <ul className='text-white pl-30'>
                <li className='font-bold'>Company</li>
                <NavLinkWithScroll to="hero" label="Home"/>
                <NavLinkWithScroll to="about" label="About Us" />
                <NavLinkWithScroll to="team" label="Our Team" />
            </ul>
        </div>
        <div>
            <ul className='text-white'>
                <li className='font-bold'>Resources</li>
                <NavLinkWithScroll to="pricing" label="Pricing" />
                <NavLinkWithScroll to="blog" label="Our Blog" />
            </ul>
        </div>
        <div>
            <ul className='text-white'>
                <li className='font-bold'>Contact</li>
                <li className='px-3 py-4'>Contact Us</li>
            </ul>
        </div> 
        </div>
        <div>
            <ul className='text-white py-4 pr-30'>
                <li>© 2025, Thế Thiện</li>
                <li>Made in VietNam</li>
            </ul>
        </div> 
     </div> 
     <div className='text-white flex justify-center items-center'>
        <p>We've currently tracking <span className='text-black font-bold'>100.000.000</span> children around the world with a total of <span className='text-black font-bold'>80.000.000</span> parents entrusted us</p>
     </div>
    </div>
  )
}

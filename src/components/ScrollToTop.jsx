import React, { useState, useEffect } from 'react';
import { animateScroll as scroll } from 'react-scroll';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setShowButton(window.scrollY > heroBottom);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    showButton && (
      <button
        onClick={() => scroll.scrollToTop({ duration: 500 })}
        className="fixed bottom-10 right-10 bg-[#0DBFFF] text-white p-4 rounded-full shadow-lg hover:bg-[#0BB0E0] transition duration-300"
      >
        <FaArrowUp size={24} />
      </button>
    )
  );
};

export default ScrollToTop;

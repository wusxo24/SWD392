import { useLocation, useNavigate } from 'react-router-dom';
import { scroller } from 'react-scroll';

const NavLinkWithScroll = ({ to, label, offset = 0 }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (location.pathname === '/Home') {
      // If on the homepage, scroll to the section
      scroller.scrollTo(to, {
        duration: 500,
        smooth: true,
        offset: offset,  // Adjust if you have a fixed navbar
      });
    } else {
      // If on a different page, navigate to the homepage and scroll after loading
      navigate('/');
      setTimeout(() => {
        scroller.scrollTo(to, {
          duration: 500,
          smooth: true,
          offset: offset,
        });
      }, 100);  // Delay ensures the homepage loads before scrolling
    }
  };

  return (
    <li className="px-3 py-4 hover:text-blue-500 cursor-pointer" onClick={handleClick}>
      {label}
    </li>
  );
};

export default NavLinkWithScroll;

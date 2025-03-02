import React, { useState } from 'react';
import { Pagination } from '@mui/material';
import founder from '../assets/founder.png';
import cofounder from '../assets/cofounder.png';
import goat from '../assets/goat.png';
import Sgoat from '../assets/secondary-goat.jpg';

const teamMembers = [
  { img: founder, name: 'Lâm Nguyễn Huy Khôi', desc: 'Một trong những nhà sáng lập giàu nhất lịch sử Việt Nam sỡ hữu vạn anh em cùng sinh ra tử' },
  { img: cofounder, name: 'Trịnh Trần Thế Thiện', desc: 'Cánh tay phải của boss HK nhưng fan 10 gió' },
  { img: goat, name: 'Cristiano Ronaldo', desc: 'Goat' },
  { img: Sgoat, name: 'Lionel Messi', desc: 'Child of FIFA' },
];

export const OurTeam = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  const totalPages = Math.ceil(teamMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedMembers = teamMembers.slice(startIndex, startIndex + itemsPerPage);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div id="team" className="team pt-10 text-center">
      <p className="text-5xl font-bold mb-5">Our Team</p>

      {/* Team Members */}
      <div className="flex justify-center gap-40 pt-5">
        {displayedMembers.map((member, index) => (
          <div key={index} className="flex flex-col items-center">
            <img src={member.img} className="rounded-2xl w-[280px] h-[400px] shadow-lg" alt={member.name} />
            <p className="font-semibold mt-4 text-2xl text-gray-800">{member.name}</p>
            <p className="w-[250px] h-[50px] text-gray-600">{member.desc}</p>
          </div>
        ))}
      </div>

      {/* MUI Pagination */}
      <div className="flex justify-center items-center my-10 space-x-4">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChange}
          color="primary"
        />
      </div>
    </div>
  );
};

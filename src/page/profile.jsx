import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Ensure you're using React Router

const Profile = () => {
  const { id } = useParams(); // Get the 'id' from the URL
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateNumber) => {
    if (!dateNumber) return "N/A";
  
    const dateString = dateNumber.toString(); // Convert number to string
    if (dateString.length !== 8) return "N/A"; // Check for valid length
  
    const day = dateString.substring(0, 2);
    const month = dateString.substring(2, 4);
    const year = dateString.substring(4, 8);
  
    const date = new Date(year, month - 1, day); // Create Date object
  
    const formattedDay = date.getDate().toString().padStart(2, '0');
    const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const formattedYear = date.getFullYear();
  
    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  };

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await fetch(
          `https://66722715e083e62ee43e2228.mockapi.io/members/${id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setMember(data);
      } catch (err) {
        setError("Failed to fetch member.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMember();
    }
  }, [id]);

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500 text-lg font-semibold">{error}</p>;
  if (!member) return <p className="text-center text-gray-500">No member found.</p>;

  return (
    <div className="p-10 shadow-lg bg-[#f9f9f9]">
      <div className="bg-gradient-to-r from-[#b8d3f1] to-[#fcf5e2] h-[100px] rounded-t-[20px] p-2 "/>
      <div className="p-6 rounded-lg bg-white">
        <div className="flex gap-4 items-center mb-4">
          {/* Avatar */}
          <img
            src={member.avatar || "https://via.placeholder.com/100"}
            alt="Avatar"
            className="rounded-full w-30 h-30 object-cover bg-[#f9f9f9] shadow-md"
          />
          {/* Name & Email */}
          <div>
            <h3 className="text-xl font-semibold">{member.fullname || "No Name"}</h3>
            <p className="text-gray-600">{member.email || "No Email Provided"}</p>
          </div>
          <div  style={{ marginLeft: 'auto' }}>
          <Button variant="contained" className="">Edit</Button>
          </div>
        </div>

        {/* Other Info - Styled like the image */}
        <div className="grid grid-cols-2 gap-4"> 
          <div>
            <div className="mb-2">
              <label className=" block text-gray-700 text-sm font-bold mb-4">Birth Day</label>
              <div className="bg-[#f9f9f9] p-3 rounded p-2 text-gray-600">{formatDate(member.birthDay) || "N/A"}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-4">Phone</label>
              <div className="bg-[#f9f9f9] p-3 rounded p-2 text-gray-600">{member.phone || "N/A"}</div>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-4">Gender</label>
              <div className="bg-[#f9f9f9] p-3 rounded p-2 text-gray-600">{member.gender || "N/A"}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-4">Address</label>
              <div className="bg-[#f9f9f9] p-3 rounded p-2 text-gray-600">{member.address || "N/A"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
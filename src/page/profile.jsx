import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Ensure you're using React Router

const Profile = () => {
  const { id } = useParams(); // Get the 'id' from the URL
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!member) return <p className="text-gray-500">No member found.</p>;

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-center mb-8">Member Profile</h2>
      <div className="p-6 border rounded-lg shadow-md max-w-lg mx-auto">
        <h3 className="text-xl font-semibold">{member.fullname}</h3>
        
        <p className="text-gray-600">Nickname: {member.nickname}</p>
        <p className="text-gray-600">Email: {member.email}</p>
        <p className="text-gray-600">Phone: {member.phone}</p>
        <p className="text-gray-600">Gender: {member.gender}</p>
        <p className="text-gray-600">Address: {member.address}</p>
      </div>
    </div>
  );
};

export default Profile;

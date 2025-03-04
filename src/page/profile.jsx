import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

const Profile = () => {
  const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`api/members/${userId}`);
        setMember(response.data);
        setFormData(response.data);
      } catch (err) {
        setError("Failed to fetch member.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMember();
    }
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.fullname || formData.fullname.length < 3) {
      alert("Full name must be at least 3 characters long.");
      return;
    }
    if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      alert("Phone number must be 10-15 digits.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Invalid email format.");
      return;
    }
    
    try {
      await axios.put(`api/members/${userId}`, formData);
      setMember(formData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500 text-lg font-semibold">{error}</p>;
  if (!member) return <p className="text-center text-gray-500">No member found.</p>;

  return (
    <div className="p-10 shadow-lg bg-[#f9f9f9]">
      <div className="bg-gradient-to-r from-[#b8d3f1] to-[#fcf5e2] h-[100px] rounded-t-[20px] p-2 " />
      <div className="p-6 rounded-lg bg-white">
        <div className="flex gap-4 items-center mb-4">
          <img
            src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ3aF4GtX_wOJ75UD0DAwM2yjUmzRIOO6ssA&s"}
            alt="Avatar"
            className="rounded-full w-30 h-30 object-cover bg-[#f9f9f9] shadow-md"
          />
          <div>
            <h3 className="text-xl font-semibold">{member.fullname || "No Name"}</h3>
            <p className="text-gray-600">{member.email || "No Email Provided"}</p>
          </div>
          <div style={{ marginLeft: "auto" }}>
            {isEditing ? (
              <Button variant="contained" color="success" onClick={handleSave}>
                Save
              </Button>
            ) : (
              <Button variant="contained" onClick={handleEditClick}>
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <TextField
              label="Full Name"
              name="fullname"
              value={formData.fullname || ""}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditing}
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditing}
              className="mt-4"
            />
          </div>
          <div>
            <TextField
              label="Email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditing}
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address || ""}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditing}
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

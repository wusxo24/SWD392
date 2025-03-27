import {
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Avatar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, convertFileToBase64 } from "@/services/userService";
import { SideBarProfile } from "@/components/SideBarProfile";
import EmailIcon from '@mui/icons-material/Email';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { LoadingScreen } from "@/components/loadingScreen";
export const UserProfile = () => {
  const userId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (userId) {
      getUserProfile(userId)
        .then((data) => {
          setMember(data);
          setFormData(data);
        })
        .catch(() => setError("Failed to fetch member."))
        .finally(() => setLoading(false));
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
      toast.error("Full name must be at least 3 characters long.");
      return;
    }
    if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      toast.error("Phone number must be 10-15 digits.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Invalid email format.");
      return;
    }

    try {
      await updateUserProfile(userId, { ...formData});
      setMember({ ...formData});
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  if (loading) return <LoadingScreen/>;
  if (error) return <p className="text-center text-red-500 text-lg font-semibold">{error}</p>;
  if (!member) return <p className="text-center text-gray-500">No member found.</p>;

  return (
    <div className="flex">
      <ToastContainer />
      <SideBarProfile />
      <div className="p-10 shadow-lg bg-[#f9f9f9] w-full">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#b8d3f1] to-[#fcf5e2] h-[100px] rounded-t-[20px] p-2 " />
        <div className="p-6 rounded-lg bg-white">
          {/* Profile Header */}
          <div className="flex gap-4 items-center mb-4">
          <Avatar
            src={formData.picture}  // Now uses a direct URL
            alt="Avatar"
            sx={{ width: 80, height: 80 }}
          />
            {isEditing && (
              <TextField
              label="Profile Picture URL"
              name="picture"
              value={formData.picture || ""}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditing}
              sx={{ mb: 2 }}
            />
            
            )}
            <div>
              <h3 className="text-xl font-semibold">
                {member.fullname || "No Name"}
              </h3>
              <p className="text-gray-600">
                {member.email || "No Email Provided"}
              </p>
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

          {/* Form Fields - 2 Column Layout */}
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              {/* Column 1 */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  name="fullname"
                  value={formData.fullname || ""}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={!isEditing}
                  sx={{ mb: 2, backgroundColor: "#f9f9f9" }}
                />
                <TextField
                  label="Nickname"
                  name="nickname"
                  value={formData.nickname || ""}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={!isEditing}
                  sx={{ mb: 2, backgroundColor: "#f9f9f9" }}
                />
                <p className="font-bold">My email Address</p>

                <TextField
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={!isEditing}
                  variant="standard" // Removes the outlined box
                  InputProps={{
                    disableUnderline: true, // Removes the underline
                    startAdornment: (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          backgroundColor: "#b3e5fc", // Standard muted color
                          marginRight: 1,
                        }}
                      >
                        <EmailIcon sx={{ color: "#0091ea", width:"30px"}} />
                      </Box>
                    ),
                  }}
                  sx={{ mt: 2 }}
                  />
              </Grid>

              {/* Column 2 */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Gender"
                  name="gender"
                  select
                  value={formData.gender || ""}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={!isEditing}
                  sx={{ mb: 2, backgroundColor: "#f9f9f9" }}
                />
                
                <TextField
                  label="Birthdate"
                  type="date"
                  name="birthdate"
                  value={formData.birthdate ? formData.birthdate.split("T")[0] : "" || ""}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>
    </div>
  );
};
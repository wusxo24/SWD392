  import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import axios from "../utils/axiosInstance";
  import { SideBarProfile } from "@/components/SideBarProfile";

  const Profile = () => {
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [image, setImage] = useState(""); 
    const [file, setFile] = useState(null);
    
    // Add Child state variables
    const [showChildrenPopup, setShowChildrenPopup] = useState(false);
    const [childFname, setChildFname] = useState("");
    const [childLname, setChildLname] = useState("");
    const [childBirthdate, setChildBirthdate] = useState("");
    const [childGender, setChildGender] = useState("Male");
    const [childPicture, setChildPicture] = useState("");
    const [childBloodType, setChildBloodType] = useState("");
    const [childAllergy, setChildAllergy] = useState("");
    const [childNotes, setChildNotes] = useState("");

    useEffect(() => {
      const fetchMember = async () => {
        try {
          const response = await axios.get(`api/members/${userId}`);
          setMember(response.data);
          setFormData(response.data);
          setImage(response.data.picture);
          console.log(userId);
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
    const handleFileChange = async (e) => {
      const selectedFile = e.target.files[0];
      setFile(selectedFile); // Store file in state

      if (!selectedFile) return;

      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result); // Convert file to Base64 string
          reader.onerror = (error) => reject(error);
        });

      try {
        const base64String = await toBase64(selectedFile);
        setFile(base64String); // Save Base64 string instead of the file
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
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
        // Assuming your backend updates the avatar URL as well
        await axios.put(`api/members/${userId}`, {
          ...formData,
          picture: file, // Save Base64 image to backend
        });
        setMember({ ...formData, picture: file });
        setIsEditing(false);
        alert("Profile updated successfully!");
      } catch (err) {
        alert("Failed to update profile.");
      }
    };

    const handleAddChildClick = () => {
      setShowChildrenPopup(true);
    };

    const handleCloseChildPopup = () => {
      setShowChildrenPopup(false);
      setChildFname("");
      setChildLname("");
      setChildBirthdate("");
      setChildGender("Male");
      setChildPicture("");
      setChildBloodType("");
      setChildAllergy("");
      setChildNotes("");
    };

    const handleSaveChild = async () => {
      try {
        await axios.post(`api/children/${userId}`, {
          fname: childFname,
          lname: childLname,
          birthdate: childBirthdate,
          gender: childGender,
          picture: childPicture,
          blood_type: childBloodType,
          allergy: childAllergy,
          notes: childNotes,
        });
        console.log(childFname,childLname,childBirthdate,childGender,childPicture,childBloodType,childAllergy,childNotes);
        handleCloseChildPopup();
        alert("Child added successfully!");

        // Refresh member data after adding a child (optional)
        const response = await axios.get(`api/members/${userId}`);
        setMember(response.data);
        setFormData(response.data);
      } catch (error) {
        console.log(childFname,childLname,childBirthdate,childGender,childPicture,childBloodType,childAllergy,childNotes);
        console.error("Failed to add child:", error);
        alert("Failed to add child.");
      }
    };

    if (loading)
      return <p className="text-center text-lg font-semibold">Loading...</p>;
    if (error)
      return (
        <p className="text-center text-red-500 text-lg font-semibold">{error}</p>
      );
    if (!member)
      return <p className="text-center text-gray-500">No member found.</p>;

    return (
      <div className="flex">
        <SideBarProfile/>
      <div className="p-10 shadow-lg bg-[#f9f9f9]">
        <div className="bg-gradient-to-r from-[#b8d3f1] to-[#fcf5e2] h-[100px] rounded-t-[20px] p-2 " />
        <div className="p-6 rounded-lg bg-white">
          <div className="flex gap-4 items-center mb-4">
            {/* Display the Base64 Image */}
            {member.picture || image ? (
              <img
                src={
                  member.picture
                    ? `data:image/png;base64,${member.picture}`
                    : image
                }
                alt="Avatar"
                className="rounded-full w-30 h-30 object-cover bg-[#f9f9f9] shadow-md"
              />
            ) : (
              <p>No Image</p>
            )}

            {/* Image Upload Input */}
            {isEditing && (
              <input type="file" accept="image/*" onChange={handleFileChange} />
            )}
            <div>
              <h3 className="text-xl font-semibold">
                {member.fullname || "No Name"}
              </h3>
              <p className="text-gray-600">
                {member.email || "No Email Provided"}
              </p>
            </div>
            <TextField
              className="top-3.5"
              size="medium"
              sx={{ width: "150px", height: "40px" }}
              label="Nickname"
              name="nickname"
              value={formData.nickname || ""}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditing}
              style={{ marginBottom: "30px", backgroundColor: "#f9f9f9" }}
            />
            <TextField
              size="medium"
              sx={{ width: "150px", height: "40px" }}
              variant="outlined"
              label="Gender"
              name="gender"
              select
              value={formData.gender || ""}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditing}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
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
              <Button
                variant="contained"
                onClick={handleAddChildClick}
                style={{ marginLeft: "10px" }}
              >
                Add Child
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10">
            <div>
              <TextField
                label="Full Name"
                name="fullname"
                value={formData.fullname || ""}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
                style={{ marginBottom: "30px", backgroundColor: "#f9f9f9" }}
              />
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
                className="mt-4"
                style={{ backgroundColor: "#f9f9f9" }}
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
                style={{ marginBottom: "30px", backgroundColor: "#f9f9f9" }}
              />
              <TextField
                label="Address"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
                className="mt-4"
                style={{ backgroundColor: "#f9f9f9" }}
              />
            </div>
            <div>
              <TextField
                label="Birthdate"
                type="date"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate || ""}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
                className="mt-4"
                max={new Date().toISOString().split("T")[0]} // Limits selection to today or earlier
              />
            </div>
          </div>
        </div>

        {/* Add Child Popup */}
        <Dialog open={showChildrenPopup} onClose={handleCloseChildPopup}>
          <DialogTitle>Add Child</DialogTitle>
          <DialogContent>
            {/* Input fields for child information */}
            <TextField
              label="Child's First Name"
              value={childFname}
              onChange={(e) => setChildFname(e.target.value)}
              fullWidth
              style={{ marginBottom: "30px", backgroundColor: "#f9f9f9" }}
            />
            <TextField
              label="Child's Last Name"
              value={childLname}
              onChange={(e) => setChildLname(e.target.value)}
              fullWidth
              style={{ marginBottom: "30px", backgroundColor: "#f9f9f9" }}
            />
            <TextField
              label="Child's Birthdate"
              type="date"
              value={childBirthdate}
              onChange={(e) => setChildBirthdate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginBottom: "30px", backgroundColor: "#f9f9f9" }}
            />
            <TextField
              label="Child's Gender"
              select
              value={childGender}
              onChange={(e) => setChildGender(e.target.value)}
              fullWidth
              style={{ marginBottom: "20px" }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              label="Child's Picture URL"
              value={childPicture}
              onChange={(e) => setChildPicture(e.target.value)}
              fullWidth
              style={{ marginBottom: "30px", backgroundColor: "#f9f9f9" }}
            />
            <TextField
              label="Child's Blood Type"
              value={childBloodType}
              onChange={(e) => setChildBloodType(e.target.value)}
              fullWidth
              style={{ marginBottom: "30px", backgroundColor: "#f9f9f9" }}
            />
            <TextField
              label="Child's Allergy"
              value={childAllergy}
              onChange={(e) => setChildAllergy(e.target.value)}
              fullWidth
              style={{ marginBottom: "30px", backgroundColor: "#f9f9f9" }}
            />
            <TextField
              label="Child's Notes"
              value={childNotes}
              onChange={(e) => setChildNotes(e.target.value)}
              fullWidth
              style={{ backgroundColor: "#f9f9f9" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseChildPopup}>Cancel</Button>
            <Button onClick={handleSaveChild} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      </div>
    );
  };

  export default Profile;

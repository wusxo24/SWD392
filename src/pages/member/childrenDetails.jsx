import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchChildDetails, updateChildDetails } from "@/services/childService";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  TextField,
  IconButton,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { SideBarProfile } from "@/components/SideBarProfile";
import { ToastContainer } from "react-toastify";
import { LoadingScreen } from "@/components/loadingScreen";


export const ChildrenDetails = () => {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchChildDetails(id)
      .then((data) => {
        setChild(data);
        setFormData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updatedChild = await updateChildDetails(id, formData);
      setChild(updatedChild);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!child) return <Typography>No child found</Typography>;

  return (
    <div className="flex h-screen">
      <ToastContainer />
      <SideBarProfile />
      <div className="p-4 w-full bg-[#f9f9f9] flex justify-center items-center">
        <Card sx={{ maxWidth: 1000, padding: 3, boxShadow: 3 }}>
          <div className="flex justify-between items-center">
            <Typography variant="h6">Child's Details</Typography>
            <IconButton
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              color="primary"
            >
              {isEditing ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
          <CardContent>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Avatar
                  src={formData.picture}
                  alt={formData.fname}
                  sx={{ width: 100, height: 100 }}
                />
                {isEditing && (
                  <TextField
                    fullWidth
                    label="Profile Image URL"
                    name="picture"
                    value={formData.picture}
                    onChange={handleChange}
                    sx={{
                      boxShadow: 3,
                      backgroundColor: "white",
                      marginTop: "10px",
                    }}
                  />
                )}
              </Grid>

              {/* First Name and Last Name in the same row */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  disabled={!isEditing}
                  sx={{
                    borderRadius: "200px",
                    boxShadow: 5,
                    backgroundColor: "white",
                    "& fieldset": { borderRadius: "200px" }, // Ensure the fieldset is also rounded
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  disabled={!isEditing}
                  sx={{
                    borderRadius: "200px",
                    boxShadow: 5,
                    backgroundColor: "white",
                    "& fieldset": { borderRadius: "200px" }, // Ensure the fieldset is also rounded
                  }}
                />
              </Grid>

              <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                SelectProps={{ native: true }}
                sx={{
                  borderRadius: "200px",
                  boxShadow: 5,
                  backgroundColor: "white",
                  "& fieldset": { borderRadius: "200px" },
                }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="Birthdate"
                    name="birthdate"
                    type="date"
                    value={new Date(formData.birthdate).toISOString().split("T")[0]}
                    onChange={handleChange}
                    disabled={!isEditing}
                    inputProps={{
                      max: new Date().toISOString().split("T")[0], // Prevents future dates
                      min: new Date(new Date().setFullYear(new Date().getFullYear() - 20))
                        .toISOString()
                        .split("T")[0], // Prevents selecting age > 20
                    }}
                    sx={{
                      borderRadius: "200px",
                      boxShadow: 5,
                      backgroundColor: "white",
                      "& fieldset": { borderRadius: "200px" },
                    }}
                  />
              </Grid>

              <Grid item xs={6}>
              <TextField
                  select
                  fullWidth
                  label="Blood Type"
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleChange}
                  disabled={!isEditing}
                  SelectProps={{ native: true }}
                  sx={{
                    borderRadius: "200px",
                    boxShadow: 5,
                    backgroundColor: "white",
                    "& fieldset": { borderRadius: "200px" },
                  }}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Allergy"
                  name="allergy"
                  value={formData.allergy}
                  onChange={handleChange}
                  disabled={!isEditing}
                  sx={{
                    borderRadius: "200px",
                    boxShadow: 5,
                    backgroundColor: "white",
                    "& fieldset": { borderRadius: "200px" }, // Ensure the fieldset is also rounded
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={!isEditing}
                  sx={{
                    boxShadow: 5,
                    backgroundColor: "white",
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
import React, { useEffect, useState } from "react";
import { getChildren, addChild } from "@/services/childService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  Button, Card, CardContent, Typography, Avatar, Pagination, Stack, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select,
  InputLabel, FormControl
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { SideBarProfile } from "@/components/SideBarProfile";

export const ChildrenProfile = () => {
  const [children, setChildren] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [childData, setChildData] = useState({
    fname: "", lname: "", birthdate: "", gender: "",
    picture: "", blood_type: "", allergy: "", notes: ""
  });

  useEffect(() => {
    getChildren()
      .then((data) => setChildren(data))
      .catch(() => toast.error("Failed to fetch children"));

  }, []);

  const handleAddChildren = () => {
    addChild(childData)
      .then((newChild) => {
        setChildren([...children, newChild]);
        setOpenModal(false);
        setChildData({ fname: "", lname: "", birthdate: "", gender: "", picture: "", blood_type: "", allergy: "", notes: "" });
        toast.success("Child added successfully");
      })
      .catch(() => toast.error("Failed to add child"));
  };

  const totalPages = Math.ceil(children.length / itemsPerPage);
  const currentChildren = children.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex">
      <ToastContainer />
      <SideBarProfile />
      <div className="p-4 w-full bg-[#f9f9f9]">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5" fontWeight="bold">Children List</Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>Add Child</Button>
        </div>

        <Stack spacing={2}>
          {currentChildren.map((child) => (
            <Card key={child._id} sx={{ display: "flex", alignItems: "center", padding: 2, boxShadow: 3 }}>
              <Avatar src={child.picture} alt={child.fname} sx={{ width: 56, height: 56, marginRight: 2 }} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{child.fname} {child.lname}</Typography>
              </CardContent>
              <Button onClick={() => navigate(`/childrenDetails/${child._id}`)}>Show Details <NavigateNextIcon /></Button>
            </Card>
          ))}
        </Stack>

        <Stack direction="row" justifyContent="center" alignItems="center" mt={3}>
          <Pagination count={totalPages} page={currentPage} onChange={(event, value) => setCurrentPage(value)} color="primary" />
        </Stack>

        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Add a New Child</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="First Name" fullWidth value={childData.fname} onChange={(e) => setChildData({ ...childData, fname: e.target.value })} />
            <TextField margin="dense" label="Last Name" fullWidth value={childData.lname} onChange={(e) => setChildData({ ...childData, lname: e.target.value })} />
            <TextField margin="dense" label="Birthdate" type="date" fullWidth InputLabelProps={{ shrink: true }} value={childData.birthdate} onChange={(e) => setChildData({ ...childData, birthdate: e.target.value })} />
            <FormControl fullWidth margin="dense">
              <InputLabel>Gender</InputLabel>
              <Select value={childData.gender} onChange={(e) => setChildData({ ...childData, gender: e.target.value })}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField margin="dense" label="Profile Picture URL" fullWidth value={childData.picture} onChange={(e) => setChildData({ ...childData, picture: e.target.value })} />
            <FormControl fullWidth margin="dense">
              <InputLabel>Blood Type</InputLabel>
              <Select value={childData.blood_type} onChange={(e) => setChildData({ ...childData, blood_type: e.target.value })}>
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
              </Select>
            </FormControl>
            <TextField margin="dense" label="Allergy" fullWidth value={childData.allergy} onChange={(e) => setChildData({ ...childData, allergy: e.target.value })} />
            <TextField margin="dense" label="Notes" fullWidth multiline rows={3} value={childData.notes} onChange={(e) => setChildData({ ...childData, notes: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="secondary">Cancel</Button>
            <Button onClick={handleAddChildren} color="primary">Add Child</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  TextField,
  Stack,
  Tabs,
  Tab,
  Container,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "@/utils/axiosInstance";
import HeightChart from "./heightChart";
import WeightChart from "./weightChart";
import { ChildGrowth } from "./childGrowth";
import { MedicalRequest } from "@/services/medicalRequest";
import { Tracking } from "@/services/tracking"; // Import Tracking function
import { useLocation, useParams } from "react-router-dom";

const GrowthChartContainer = () => {
  const  { recordId }   = useParams();
  const [gender, setGender] = useState("girls");
  const [tabIndex, setTabIndex] = useState(0);
  const [childData, setChildData] = useState({
    name: "John Doe",
    birthday: "Jan 1, 2020",
    height: "",
    weight: "",
    head: "",
    waist: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [requestData, setRequestData] = useState({ Reason: "", Notes: "" });
  const [trackingData, setTrackingData] = useState([]);

  const checkRecordId = () => {
    if (recordId) {
      console.log("RecordId exists:", recordId);
    } else {
      console.log("No RecordId found");
    }
  };
  useEffect(() => {
    checkRecordId();
    setChildData({ ...childData, [e.target.name]: e.target.value });
  };
  }, [recordId]);
  

  const handleChange = (e) => {

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setRequestData({ Reason: "", Notes: "" }); // Reset form fields
  };

  const handleRequestChange = (e) => {
    setRequestData({ ...requestData, [e.target.name]: e.target.value });
  };

  const handleSubmitRequest = async () => {
    try {
      console.log("Submitting request..."); // Check if function is being called
      console.log("RecordId:", recordId);
      console.log("Request Data:", requestData);

      if (!recordId) {
        toast.error("Child Record ID is missing!");
        return;
      }
      
      if (!requestData.Reason.trim()) {
        toast.error("Reason is required.");
        return;
      }
  
      const response = await MedicalRequest(recordId, requestData);
      handleModalClose();
    } catch (error) {
      console.error("Error sending medical request:", error);
      toast.error("Failed to send request. Please try again.");
    }
  };

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const data = await Tracking();
        if (data) {
          setTrackingData(data);
          console.log("Tracking data fetched:", data);
        }
      } catch (error) {
        console.error("Error fetching tracking data:", error);
      }
    };
    fetchTrackingData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <ToastContainer/>
      {/* Title */}
      <Typography variant="h3" align="center" fontWeight={600} gutterBottom>
        Your Child's{" "}
        <span style={{ color: "#0DBFFF", textDecoration: "underline" }}>
          Growth
        </span>
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* Child Profile */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center", p: 3, boxShadow: 3 }}>
            <Avatar
              src="https://plus.unsplash.com/premium_photo-1687203673190-d39c3719123a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGVsbG98ZW58MHx8MHx8fDA%3D"
              alt="Child Avatar"
              sx={{ width: 100, height: 100, mx: "auto" }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              {childData.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Birthday: {childData.birthday}
            </Typography>
            <Button
              style={{ marginTop: "10px" }}
              variant="contained"
              onClick={handleModalOpen}
            >
              Send to Doctor
            </Button>
          </Card>
        </Grid>

        {/* Growth Input Form */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, boxShadow: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="Height (cm)"
                  name="height"
                  value={childData.height}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Weight (kg)"
                  name="weight"
                  value={childData.weight}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Head Circumference (cm)"
                  name="head"
                  value={childData.head}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Waist Circumference (cm)"
                  name="waist"
                  value={childData.waist}
                  onChange={handleChange}
                  fullWidth
                />
                <Button variant="contained" color="primary">
                  Update Growth
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gender Selection */}
      <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 4 }}>
        <Button
          variant={gender === "girls" ? "contained" : "outlined"}
          color="secondary"
          onClick={() => setGender("girls")}
        >
          Girls Chart
        </Button>
        <Button
          variant={gender === "boys" ? "contained" : "outlined"}
          color="secondary"
          onClick={() => setGender("boys")}
        >
          Boys Chart
        </Button>
      </Stack>

      {/* Chart Tabs */}
      <Card sx={{ mt: 6, p: 3, boxShadow: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(event, newIndex) => setTabIndex(newIndex)}
          centered
        >
          <Tab label="Height Chart" />
          <Tab label="Weight Chart" />
          <Tab label="BMI Chart" />
        </Tabs>

        <CardContent>
          {tabIndex === 0 && <HeightChart gender={gender} />}
          {tabIndex === 1 && <WeightChart gender={gender} />}
          {tabIndex === 2 && <ChildGrowth gender={gender} />}
        </CardContent>
      </Card>

      {/* Medical Request Modal */}
      <Dialog open={openModal} onClose={handleModalClose} fullWidth>
        <DialogTitle>Send Medical Request</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Reason"
              name="Reason"
              value={requestData.Reason}
              onChange={handleRequestChange}
              fullWidth
              required
            />
            <TextField
              label="Notes"
              name="Notes"
              value={requestData.Notes}
              onChange={handleRequestChange}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitRequest} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GrowthChartContainer;

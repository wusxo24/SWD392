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
  MenuItem,
} from "@mui/material";
import HeightChart from "./heightChart";
import WeightChart from "./weightChart";
import { ChildGrowth } from "./childGrowth";
import { MedicalRequest } from "@/services/medicalRequest";
import { Tracking, getChildByRecordId } from "@/services/tracking";
import { useParams } from "react-router-dom";

const GrowthChartContainer = () => {
  const { recordId } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [childData, setChildData] = useState([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [requestData, setRequestData] = useState({ Reason: "", Notes: "" });
  const [trackingData, setTrackingData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const data = await getChildByRecordId(recordId);
        if (data) {
          setChildData(data);
          setSelectedChildIndex(0);
        }
        toast.success("already get child");
        console.log(data)
      } catch (error) {
        console.error("Error fetching child data:", error);
      }
    };
    fetchChildData();
  }, [recordId]);

  useEffect(() => {
    console.log(recordId)
    const fetchTrackingData = async () => {
      try {
        const data = await Tracking(recordId);
        if (data) {
          setTrackingData(data);
        }
        toast.success("NICESU.");
      } catch (error) {
        console.error("Error fetching tracking data:", error);
      }
    };
    fetchTrackingData();
  }, [recordId]);

  const handleChildChange = (event) => {
    setSelectedChildIndex(event.target.value);
  };

  const handleChange = (e) => {
    const updatedChildren = [...childData];
    updatedChildren[selectedChildIndex] = {
      ...updatedChildren[selectedChildIndex],
      [e.target.name]: e.target.value,
    };
    setChildData(updatedChildren);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setIsSubmitting(false);
    setRequestData({ Reason: "", Notes: "" });
  };

  const handleRequestChange = (e) => {
    setRequestData({ ...requestData, [e.target.name]: e.target.value });
  };

  const handleSubmitRequest = async () => {
    if (isSubmitting) return; // Prevent multiple clicks
    setIsSubmitting(true);

    try {
      if (!requestData.Reason.trim()) {
        toast.error("Reason is required.");
        return;
      }

      await MedicalRequest(recordId, requestData);
      handleModalClose();
    } catch (error) {
      console.error("Error sending medical request:", error);
      toast.error("Failed to send request. Please try again.");
    }
  };

  const displayedChild = childData[selectedChildIndex] || {};

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <ToastContainer />
      <Typography variant="h3" align="center" fontWeight={600} gutterBottom>
        Your Child's <span style={{ color: "#0DBFFF", textDecoration: "underline" }}>Growth</span>
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center", p: 3, boxShadow: 3 }}>
            <Avatar
              src="https://plus.unsplash.com/premium_photo-1687203673190-d39c3719123a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGVsbG98ZW58MHx8MHx8fDA%3D"
              alt="Child Avatar"
              sx={{ width: 100, height: 100, mx: "auto" }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>{childData.fname} {childData.lname}</Typography>
            <Typography variant="body2" color="text.secondary">Gender: {childData.gender}</Typography>
            <Button style={{ marginTop: "10px" }} variant="contained" onClick={handleModalOpen}>
              Send to Doctor
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, boxShadow: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <TextField label="Height (cm)" name="height" value={displayedChild.height || ""} onChange={handleChange} fullWidth />
                <TextField label="Weight (kg)" name="weight" value={displayedChild.weight || ""} onChange={handleChange} fullWidth />
                <TextField label="Head Circumference (cm)" name="head" value={displayedChild.head || ""} onChange={handleChange} fullWidth />
                <TextField label="Waist Circumference (cm)" name="waist" value={displayedChild.waist || ""} onChange={handleChange} fullWidth />
                <Button variant="contained" color="primary">Update Growth</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 6, p: 3, boxShadow: 3 }}>
        <Tabs value={tabIndex} onChange={(event, newIndex) => setTabIndex(newIndex)} centered>
          <Tab label="Height Chart" />
          <Tab label="Weight Chart" />
          <Tab label="BMI Chart" />
        </Tabs>

        <CardContent>
          {tabIndex === 0 && <HeightChart gender={displayedChild.gender} />}
          {tabIndex === 1 && <WeightChart gender={displayedChild.gender} />}
          {tabIndex === 2 && <ChildGrowth gender={displayedChild.gender} />}
        </CardContent>
      </Card>

      <Dialog open={openModal} onClose={handleModalClose} fullWidth>
        <DialogTitle>Send Medical Request</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField label="Reason" name="Reason" value={requestData.Reason} onChange={handleRequestChange} fullWidth required />
            <TextField label="Notes" name="Notes" value={requestData.Notes} onChange={handleRequestChange} fullWidth multiline rows={3} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmitRequest} color="primary" variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GrowthChartContainer;

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Grid,
} from "@mui/material";
import WeightForAgeChart from "./WeightForAgeChart";
import LengthForAgeChart from "./LengthForAgeChart";
import WeightForLengthChart from "./WeightForLengthChart";
import HeadCircumferenceChart from "./HeadCircumferenceChart.jsx";
import WeightForStatureChart from "./WeightForStatureChart";
import { getChildByRecordId } from "@/services/tracking";
import { useParams } from "react-router-dom";
import ChildHealth from "./childHeath";

const GrowthChartContainer = () => {
  const { recordId } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [childData, setChildData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [requestData, setRequestData] = useState({ Reason: "", Notes: "" });
  const [trackingData, setTrackingData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ageData, setAgeData] = useState([]);
  const [isChildHealthOpen, setIsChildHealthOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const data = await getChildByRecordId(recordId);
        if (data) {
          setChildData(data);
        }
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
            const processedData = processTrackingData(data, childData.birthdate);
            setAgeData(processedData);
            
          }
          
        } catch (error) {
          console.error("Error fetching tracking data:", error);
        }
      };
      fetchTrackingData();
  
    }, [childData]);
  
  
    const handleChange = (e) => {
      setTrackingData({ ...trackingData, [e.target.name]: e.target.value });
    };
  
    const handleUpdateGrowth = async () => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]; // Use the current date
  
        await postTracking(recordId, currentDate, trackingData);
        toast.success("Growth data updated successfully.");
      } catch (error) {
        console.error("Error updating tracking data:", error);
        toast.error("Failed to update growth data.");
      }
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
  
    const processTrackingData = (trackingData, yearOfBirth) => {
      if (!yearOfBirth) {
          console.error("Error: yearOfBirth is missing");
          return [];
      }
  
      const birthYear = new Date(yearOfBirth).getFullYear();
  
      return trackingData.flatMap(entry => {
  
          if (!entry.MonthYear || !entry.MonthYear.includes("-")) {
              console.warn("Invalid MonthYear format:", entry.MonthYear);
              return [];
          }
  
          const year = parseInt(entry.MonthYear.split("-")[0]);
          if (isNaN(year)) {
              console.warn("Invalid year extracted:", entry.MonthYear);
              return [];
          }
  
          const age = year - birthYear;
  
          // 🔹 Iterate over ALL tracking entries in this MonthYear
          return Object.entries(entry.Trackings).map(([trackingDate, trackingValues]) => {
              return {
                  age,
                  BMI: trackingValues.BMI || null,
                  Height: trackingValues.Height || null,
                  Weight: trackingValues.Weight || null,
                  trackingDate, // 🔍 Include for debugging
              };
          });
      });
  };
  
    

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-200"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Back</span>
    </button>
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
                <Card sx={{ textAlign: "center", p: 3, boxShadow: 3, marginTop: "20px" }}>
                <Button style={{ marginTop: "10px" }}  onClick={() => setIsChildHealthOpen(true)}>
                    View Child Health
                  </Button>
                </Card>
      
              </Grid>
      
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <TextField label="Height (cm)" name="Height" value={trackingData.Height || ""} onChange={handleChange} fullWidth />
                      <TextField label="Weight (kg)" name="Weight" value={trackingData.Weight || ""} onChange={handleChange} fullWidth />
                      <TextField label="Head Circumference (cm)" name="HeadCircumference" value={trackingData.HeadCircumference || ""} onChange={handleChange} fullWidth />
                      <TextField label="Waist Circumference (cm)" name="WaistCircumference" value={trackingData.WaistCircumference || ""} onChange={handleChange} fullWidth />
                      <Button variant="contained" color="primary" onClick={handleUpdateGrowth}>Update Growth</Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
      <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
        <Tab label="Weight for Age" />
        <Tab label="Length for Age" />
        <Tab label="Weight for Length" />
        <Tab label="Head Circumference" />
        <Tab label="Weight for Stature" />
      </Tabs>

      <Card sx={{ mt: 6, p: 3, boxShadow: 3 }}>
        <CardContent>
          {tabIndex === 0 && <WeightForAgeChart childData={childData} />}
          {tabIndex === 1 && <LengthForAgeChart childData={childData} />}
          {tabIndex === 2 && <WeightForLengthChart childData={childData} />}
          {tabIndex === 3 && <HeadCircumferenceChart childData={childData} />}
          {tabIndex === 4 && <WeightForStatureChart childData={childData} />}
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
            <ChildHealth 
        isOpen={isChildHealthOpen} 
        onClose={() => setIsChildHealthOpen(false)}
        trackingData={trackingData}
        setTrackingData={setTrackingData}  // ✅ Pass setTrackingData
      />
    </Container>
  );
};

export default GrowthChartContainer;

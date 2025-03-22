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
  Modal,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  MenuItem,
} from "@mui/material";
import HeightChart from "./heightChart";
import WeightChart from "./weightChart";
import { ChildGrowth } from "./childGrowth";

import { getMedicalRequest, MedicalRequest } from "@/services/medicalRequest";
import { Tracking, getChildByRecordId, postTracking } from "@/services/tracking";
import { useParams } from "react-router-dom";
import ChildHealth from "./childHeath";
const GrowthChartContainer = () => {
  const { recordId } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [childData, setChildData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [requestData, setRequestData] = useState({ Reason: "", Notes: "" });
  const [trackingData, setTrackingData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ageData, setAgeData] = useState([]);
  const [isChildHealthOpen, setIsChildHealthOpen] = useState(false);
  const [medicalRequests, setMedicalRequests] = useState([]);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const birthDate = new Date(childData?.birthdate);
  const today = new Date();
  const diffInMilliseconds = today - birthDate;
  const ageInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // 365.25 to account for leap years
  const ageYears = ageInYears.toFixed(1); // Keep one decimal place
  const ageInMonths = today.getMonth() - birthDate.getMonth() + ageYears * 12;
  const ageMonths = ageInMonths.toFixed(1);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


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
  }, []);

  useEffect(() => {
    const fetchMedicalRequests = async () => {
      try {
        const data = await getMedicalRequest(recordId);
        if (data) {
          setMedicalRequests(data);
          
        }
      } catch (error) {
        console.error("Error fetching medical requests:", error);
      }
    };
    fetchMedicalRequests();
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

  useEffect(() => {
    if (trackingData.length > 0) {
      const latestRecord = trackingData[trackingData.length - 1]; 
      const trackingsEntries = Object.entries(latestRecord.Trackings); // Convert to array [date, data]
      if (trackingsEntries.length === 0) return;
      const latestTracking = trackingsEntries[trackingsEntries.length - 1]; // Get last [date, data] pair
      const latestDate = latestTracking[0]; // Extract date
      const latestEntry = latestTracking[1]; // Extract data object
      if (latestEntry.BMIResult && latestEntry.BMIResult !== "Normal Weight") {
        toast.warning(`⚠️ Warning (${latestDate}): Child's BMI is in the '${latestEntry.BMIResult}' category. Use our "SEND TO DOCTOR" function to get help from a professional doctor.`
          ,{ autoClose: 10000, // 10 seconds (default is 5000ms or 5s)
            closeOnClick: true, // Allows closing on click
            pauseOnHover: true, // Keeps it visible when hovering
            draggable: true // Allows dragging the toast
          });
      }
    }
  }, [trackingData]);

  const handleChange = (e) => {
    setTrackingData({ ...trackingData, [e.target.name]: e.target.value });
  };

  const handleUpdateGrowth = async () => {
    try {
      const currentDate = new Date().toISOString().split("T")[0]; // Use the current date

      await postTracking(recordId, currentDate, trackingData);
      toast.success("Growth data updated successfully.");
      const updatedData = await Tracking(recordId);
    if (updatedData) {
      setTrackingData(updatedData);

      // 🔹 Extract latest BMI entry after update
      const latestRecord = updatedData[updatedData.length - 1];
      const trackingsEntries = Object.entries(latestRecord.Trackings);
      if (trackingsEntries.length === 0) return;

      const latestTracking = trackingsEntries[trackingsEntries.length - 1]; 
      const latestDate = latestTracking[0]; 
      const latestEntry = latestTracking[1]; 

      // 🔥 Show warning if BMI is not normal
      if (latestEntry.BMIResult && latestEntry.BMIResult !== "Normal Weight") {
        toast.warning(`⚠️ Warning (${latestDate}): Child's BMI is in the '${latestEntry.BMIResult}' category. Use our "SEND TO DOCTOR" function to get help from a professional doctor.`, {
          autoClose: 10000, // 10 seconds
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }
    }
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

    return trackingData.flatMap((entry) => {
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
      return Object.entries(entry.Trackings).map(
        ([trackingDate, trackingValues]) => {
          return {
            age,
            BMI: trackingValues.BMI || null,
            Height: trackingValues.Height || null,
            Weight: trackingValues.Weight || null,
            trackingDate, // 🔍 Include for debugging
          };
        }
      );
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <ToastContainer />
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>
      <Typography variant="h3" align="center" fontWeight={600} gutterBottom>
        Your Child's{" "}
        <span style={{ color: "#0DBFFF", textDecoration: "underline" }}>
          Growth
        </span>
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center", p: 3, boxShadow: 3 }}>
            <Avatar
              src={childData.picture}
              alt="Child Avatar"
              sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
            />

            <Typography variant="h5" fontWeight="bold">
              {childData.fname} {childData.lname}
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Birthdate:{" "}
              {childData.birthdate
                ? childData.birthdate.split("T")[0]
                : "Unknown"}
            </Typography>

            <Box
              sx={{ my: 2, borderBottom: "1px solid #ddd", width: "100%" }}
            />
            <div className="flex gap-4">
              <Button
                variant="outlined"
                className="flex-1 py-3 rounded-lg shadow-md"
                onClick={handleOpen}
              >
                View Child Details
              </Button>

              <Button
                variant="outlined"
                className="flex-1 py-3 rounded-lg shadow-md"
                onClick={() => setIsChildHealthOpen(true)}
              >
                View Child Health
              </Button>
            </div>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3, width: "100%", fontWeight: "bold" }}
              onClick={handleModalOpen}
            >
              Send to Doctor
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, boxShadow: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="Height (cm)"
                  name="Height"
                  value={trackingData.Height || ""}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Weight (kg)"
                  name="Weight"
                  value={trackingData.Weight || ""}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Head Circumference (cm)"
                  name="HeadCircumference"
                  value={trackingData.HeadCircumference || ""}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Waist Circumference (cm)"
                  name="WaistCircumference"
                  value={trackingData.WaistCircumference || ""}
                  onChange={handleChange}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateGrowth}
                >
                  Update Growth
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          {tabIndex === 0 && (
            <HeightChart
              gender={childData.gender}
              data={ageData.map(({ age, Height }) => ({ x: age, y: Height }))}
            />
          )}
          {tabIndex === 1 && (
            <WeightChart
              gender={childData.gender}
              data={ageData.map(({ age, Weight }) => ({ x: age, y: Weight }))}
            />
          )}
          {tabIndex === 2 && (
            <ChildGrowth
              gender={childData.gender}
              data={ageData.map(({ age, BMI }) => ({ x: age, y: BMI }))}
            />
          )}
        </CardContent>
      </Card>

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
          <Button
            onClick={handleSubmitRequest}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <ChildHealth 
  isOpen={isChildHealthOpen} 
  onClose={() => setIsChildHealthOpen(false)}
  trackingData={trackingData}
  setTrackingData={setTrackingData}  // ✅ Pass setTrackingData
  medicalRequests={medicalRequests}
/>
      {/* Modal Component */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-info-title"
        className="backdrop-blur-sm"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="child-info-title"
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Child Information
          </Typography>

          {/* Child Details */}
          <Stack spacing={1} alignItems="left">
            <Typography variant="body2" sx={{ textAlign: "left" }}>
              <strong>Blood Type:</strong> {childData.blood_type}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "left" }}>
              <strong>Allergy:</strong> {childData.allergy || "None"}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "left" }}>
              <strong>Gender:</strong> {childData.gender}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "left" }}>
              <strong>Age:</strong> {ageYears}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "left" }}>
              <strong>Month Age:</strong> {ageMonths}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "left" }}>
              <strong>Notes:</strong> {childData.notes || "No additional notes"}
            </Typography>
          </Stack>
          {/* Close Button */}
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{ mt: 3, width: "100%" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default GrowthChartContainer;

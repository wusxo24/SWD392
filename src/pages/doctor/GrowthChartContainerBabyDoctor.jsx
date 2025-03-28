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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Box,
  Grid,
} from "@mui/material";
import WeightForAgeChart from "@/pages/member/WeightForAgeChart";
import LengthForAgeChart from "@/pages/member/LengthForAgeChart";
import WeightForLengthChart from "@/pages/member/WeightForLengthChart";
import HeadCircumferenceChart from "@/pages/member/HeadCircumferenceChart.jsx";
import { Tracking, getChildByRecordId } from "@/services/tracking";
import { useParams } from "react-router-dom";

const GrowthChartContainerBabyDoctor = () => {
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
  }, [recordId]);

  useEffect(() => {
    if (!childData || !childData.birthdate) return;
    console.log(recordId);

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
  }, [recordId, childData?.birthdate]);

  useEffect(() => {
     if (trackingData.length > 0) {
       const latestRecord = trackingData[trackingData.length - 1];
       const trackingsEntries = Object.entries(latestRecord.Trackings);
       if (trackingsEntries.length === 0) return;
   
       const latestTracking = trackingsEntries[trackingsEntries.length - 1];
       const latestDate = latestTracking[0];
       const latestEntry = latestTracking[1];
   
       // ✅ Ensure latestEntry is always defined before using it
       if (!latestEntry) return;
   
       if (latestEntry.BMIResult && latestEntry.BMIResult !== "Normal Weight") {
         toast.warning(
           `⚠️ Warning (${latestDate}): Child's BMI is in the '${latestEntry.BMIResult}' category. Use our "SEND TO DOCTOR" function to get help from a professional doctor.`,
           { autoClose: 10000, closeOnClick: true, pauseOnHover: true, draggable: true }
         );
       }
   
       if (latestEntry.WeightForLengthResult && latestEntry.WeightForLengthResult !== "Normal") {
         toast.warning(
           `⚠️ Warning (${latestDate}): Child's weight-for-length is in the '${latestEntry.WeightForLengthResult}' category. Use our "SEND TO DOCTOR" function to get help from a professional doctor.`,
           { autoClose: 10000, closeOnClick: true, pauseOnHover: true, draggable: true }
         );
       }
   
       if (latestEntry.WeightForAgeResult && latestEntry.WeightForAgeResult !== "Normal Weight") {
         toast.warning(
           `⚠️ Warning (${latestDate}): Child's weight-for-age is in the '${latestEntry.WeightForAgeResult}' category. Use our "SEND TO DOCTOR" function to get help from a professional doctor.`,
           { autoClose: 10000, closeOnClick: true, pauseOnHover: true, draggable: true }
         );
       }
   
       if (latestEntry.HeadCircumferenceResult && latestEntry.HeadCircumferenceResult !== "Normal Head Circumference") {
         toast.warning(
           `⚠️ Warning (${latestDate}): Child's head circumference is in the '${latestEntry.HeadCircumferenceResult}' category. Use our "SEND TO DOCTOR" function to get help from a professional doctor.`,
           { autoClose: 10000, closeOnClick: true, pauseOnHover: true, draggable: true }
         );
       }
   
       if (latestEntry.LengthForAgeResult && latestEntry.LengthForAgeResult !== "Normal") {
         toast.warning(
           `⚠️ Warning (${latestDate}): Child's length-for-age is in the '${latestEntry.LengthForAgeResult}' category. Use our "SEND TO DOCTOR" function to get help from a professional doctor.`,
           { autoClose: 10000, closeOnClick: true, pauseOnHover: true, draggable: true }
         );
       }
     }
   }, [trackingData]);


   const processTrackingData = (trackingData, yearOfBirth) => {
    if (!yearOfBirth) {
      console.error("Error: yearOfBirth is missing");
      return [];
    }
  
    const birthDate = new Date(yearOfBirth);
  
    return trackingData.flatMap((entry) => {
      if (!entry.MonthYear || !entry.MonthYear.includes("-")) {
        console.warn("Invalid MonthYear format:", entry.MonthYear);
        return [];
      }
  
      const [year, month] = entry.MonthYear.split("-").map(Number);
      if (isNaN(year) || isNaN(month)) {
        console.warn("Invalid year or month extracted:", entry.MonthYear);
        return [];
      }
  
      const trackingDate = new Date(year, month);
      const diffInMilliseconds = trackingDate - birthDate;
      const ageInMonths = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 30.44)); // Average month length
  
      return Object.entries(entry.Trackings).map(([trackingDate, trackingValues]) => {
        return {
          age: ageInMonths,
          BMI: trackingValues.BMI || null,
          Height: trackingValues.Height || null,
          Weight: trackingValues.Weight || null,
          HeadCircumference: trackingValues.HeadCircumference || null,
          ChestCircumference: trackingValues.ChestCircumference || null,
          WaistCircumference: trackingValues.WaistCircumference || null,
          HipCircumference: trackingValues.HipCircumference || null,
          BicepsCircumference: trackingValues.BicepsCircumference || null,
          ThighCircumference: trackingValues.ThighCircumference || null,
          CalfCircumference: trackingValues.CalfCircumference || null,
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
        Child's{" "}
        <span style={{ color: "#0DBFFF", textDecoration: "underline" }}>
          Growth
        </span>
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card
            sx={{ textAlign: "center", p: 4, boxShadow: 3, borderRadius: 2 }}
          >
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

            </div>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 6, p: 3, boxShadow: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(e, newIndex) => setTabIndex(newIndex)}
          centered
        >
          <Tab label="Weight for Age" />
          <Tab label="Length for Age" />
          <Tab label="Weight for Length" />
          <Tab label="Head Circumference" />
        </Tabs>

        <CardContent>
          {tabIndex === 0 && (
            <WeightForAgeChart
              gender={childData.gender}
              data={ageData.map(({ age, Weight }) => ({ x: age, y: Weight }))}
            />
          )}
          {tabIndex === 1 && (
            <LengthForAgeChart
              gender={childData.gender}
              data={ageData.map(({ age, Height }) => ({ x: age, y: Height }))}
            />
          )}
          {tabIndex === 2 && (
            <WeightForLengthChart
              gender={childData.gender}
              data={ageData.map(({ Height, Weight }) => ({
                x: Height,
                y: Weight,
              }))}
            />
          )}
          {tabIndex === 3 && (
            <HeadCircumferenceChart
              gender={childData.gender}
              data={ageData.map(({ age, HeadCircumference }) => ({
                x: age,
                y: HeadCircumference,
              }))}
            />
          )}
        </CardContent>
      </Card>
     
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

export default GrowthChartContainerBabyDoctor;

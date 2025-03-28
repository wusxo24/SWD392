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
import WeightForAgeChart from "./WeightForAgeChart";
import LengthForAgeChart from "./LengthForAgeChart";
import WeightForLengthChart from "./WeightForLengthChart";
import HeadCircumferenceChart from "./HeadCircumferenceChart.jsx";
import {
  getMedicalRequest,
  MedicalRequest,
} from "@/services/medicalRequestService";
import {
  Tracking,
  getChildByRecordId,
  postTracking,
} from "@/services/tracking";
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
  const [open, setOpen] = useState(false);
  const [medicalRequests, setMedicalRequests] = useState([]);
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

  useEffect(() => {
    fetchMedicalRequests();
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

  const handleChange = (e) => {
    setTrackingData({ ...trackingData, [e.target.name]: e.target.value });
  };

  const handleUpdateGrowth = async () => {
    try {
        const currentDate = new Date().toISOString().split("T")[0]; // Use the current date
        await postTracking(recordId, currentDate, trackingData);
        toast.success("Growth data updated successfully.");
        
        const updatedData = await Tracking(recordId);
        if (!updatedData || updatedData.length === 0) return; // Ensure data exists
        
        const latestRecord = updatedData[updatedData.length - 1];
        if (!latestRecord?.Trackings) return; // Ensure Trackings exists
        
        const trackingsEntries = Object.entries(latestRecord.Trackings);
        if (trackingsEntries.length === 0) return; // Ensure there are tracking entries

        const latestTracking = trackingsEntries[trackingsEntries.length - 1];
        if (!latestTracking) return;

        const latestDate = latestTracking[0];
        const latestEntry = latestTracking[1];

        if (!latestEntry) return; // Ensure latestEntry exists before proceeding

        // 🚨 Check different growth indicators
        const warnings = [
            { key: "BMIResult", normalValue: "Normal Weight", message: "Child's BMI is in the" },
            { key: "WeightForLengthResult", normalValue: "Normal", message: "Child's weight-for-length is in the" },
            { key: "WeightForAgeResult", normalValue: "Normal Weight", message: "Child's weight-for-age is in the" },
            { key: "HeadCircumferenceResult", normalValue: "Normal Head Circumference", message: "Child's head circumference is in the" },
            { key: "LengthForAgeResult", normalValue: "Normal", message: "Child's length-for-age is in the" },
        ];

        warnings.forEach(({ key, normalValue, message }) => {
            if (latestEntry[key] && latestEntry[key] !== normalValue) {
                toast.warning(
                    `⚠️ Warning (${latestDate}): ${message} '${latestEntry[key]}' category. Use our "SEND TO DOCTOR" function to get help from a professional doctor.`,
                    {
                        autoClose: 10000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    }
                );
            }
        });

        setTrackingData(updatedData); // Update state after validation
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

      // 🔹 Fetch updated requests immediately
      const updatedRequests = await getMedicalRequest(recordId);
      setMedicalRequests(updatedRequests);
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
        Your Child's{" "}
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

        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Card sx={{ p: 3, boxShadow: 3, width: "100%", height: "100%" }}>
            <CardContent>
              <Grid container spacing={2}>
                {/* Left Column (First 5 Fields) */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <TextField
                      label="Height (cm)"
                      name="Height"
                      value={trackingData.Height || ""}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Weight (kg)"
                      name="Weight"
                      value={trackingData.Weight || ""}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Head Circumference (cm)"
                      name="HeadCircumference"
                      value={trackingData.HeadCircumference || ""}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Waist Circumference (cm)"
                      name="WaistCircumference"
                      value={trackingData.WaistCircumference || ""}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Hip Circumference (cm)"
                      name="HipCircumference"
                      value={trackingData.HipCircumference || ""}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                  </Stack>
                </Grid>

                {/* Right Column (Next 5 Fields) */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <TextField
                      label="Biceps Circumference (cm)"
                      name="BicepsCircumference"
                      value={trackingData.BicepsCircumference || ""}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Triceps Circumference (cm)"
                      name="TricepsCircumference"
                      value={trackingData.TricepsCircumference || ""}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Chest Circumference (cm)"
                      name="ChestCircumference"
                      value={trackingData.ChestCircumference || ""}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Thigh Circumference (cm)"
                      name="ThighCircumference"
                      value={trackingData.ThighCircumference || ""}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Calf Circumference (cm)"
                      name="CalfCircumference"
                      value={trackingData.CalfCircumference || ""}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                  </Stack>
                </Grid>
              </Grid>
              {/* Submit Button (Full Width) */}
              <Box mt={3} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateGrowth}
                >
                  Update Growth
                </Button>
              </Box>
            </CardContent>
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
        setTrackingData={setTrackingData}  
        medicalRequests={medicalRequests}
        fetchMedicalRequests={fetchMedicalRequests}  // 🔹 Pass the function
        childAgeInMonths={ageMonths} // Pass ageMonths
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

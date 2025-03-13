import React, { useState } from "react";
import { ChildGrowth } from "./ChildGrowth";
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
} from "@mui/material";
import HeightChart from "./heightChart";
import WeightChart from "./weightChart";

const GrowthChartContainer = () => {
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

  const handleChange = (e) => {
    setChildData({ ...childData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    alert("Updated child growth data!");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Title */}
      <Typography
        variant="h3"
        align="center"
        fontWeight={600}
        gutterBottom
      >
        Your Child's <span style={{ color: "#0DBFFF", textDecoration: "underline" }}>Growth</span>
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* Child Profile */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center", p: 3, boxShadow: 3 }}>
            <Avatar
              src="https://via.placeholder.com/100"
              alt="Child Avatar"
              sx={{ width: 100, height: 100, mx: "auto" }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>{childData.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Birthday: {childData.birthday}
            </Typography>
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
                <Button variant="contained" color="primary" onClick={handleUpdate}>
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
    </Container>
  );
};

export default GrowthChartContainer;

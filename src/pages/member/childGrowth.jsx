import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const percentilesData = {
  girls: {
    "5th": [14.2, 14.5, 14.9, 15.3, 15.7, 16.1, 16.5, 16.9, 17.3, 17.7, 18.1, 18.5, 18.9, 19.3, 19.7, 20.1, 20.5, 20.9, 21.3],
    "25th": [15.8, 16.2, 16.6, 17.0, 17.4, 17.8, 18.2, 18.6, 19.0, 19.4, 19.8, 20.2, 20.6, 21.0, 21.4, 21.8, 22.2, 22.6, 23.0],
    "50th": [17.2, 17.6, 18.0, 18.4, 18.8, 19.2, 19.6, 20.0, 20.4, 20.8, 21.2, 21.6, 22.0, 22.4, 22.8, 23.2, 23.6, 24.0, 24.4],
    "75th": [19.0, 19.4, 19.8, 20.2, 20.6, 21.0, 21.4, 21.8, 22.2, 22.6, 23.0, 23.4, 23.8, 24.2, 24.6, 25.0, 25.4, 25.8, 26.2],
    "85th": [20.0, 20.4, 20.8, 21.2, 21.6, 22.0, 22.4, 22.8, 23.2, 23.6, 24.0, 24.4, 24.8, 25.2, 25.6, 26.0, 26.4, 26.8, 27.2],
    "95th": [22.0, 22.4, 22.8, 23.3, 23.7, 24.2, 24.6, 25.0, 25.5, 25.9, 26.4, 26.8, 27.3, 27.7, 28.2, 28.6, 29.1, 29.5, 30.0]
  },
  boys: {
    "5th": [14.7, 14.3, 14, 13.8, 13.7, 13.7, 13.8, 13.95, 14.2, 14.5, 14.9, 15.4, 16, 16.6, 17.2, 17.7, 18.2, 18.7, 19.1],
    "25th": [15.7, 15.3, 14.9, 14.6, 14.5, 14.6, 14.8, 15.1, 15.5, 15.9, 16.4, 17, 17.6, 18.3, 18.9, 19.5, 20.1, 20.7, 21.2],
    "50th": [16.5, 16.8, 17.1, 17.4, 17.8, 18.2, 18.6, 19.0, 19.4, 19.8, 20.2, 20.6, 21.0, 21.4, 21.8, 22.2, 22.6, 23.0, 23.4],
    "75th": [18.0, 18.3, 18.6, 19.0, 19.4, 19.8, 20.2, 20.6, 21.0, 21.4, 21.9, 22.3, 22.8, 23.2, 23.7, 24.1, 24.6, 25.0, 25.4],
    "85th": [19.0, 19.3, 19.7, 20.1, 20.5, 20.9, 21.3, 21.7, 22.2, 22.6, 23.1, 23.5, 24.0, 24.4, 24.9, 25.3, 25.8, 26.2, 26.6],
    "95th": [21.0, 21.4, 21.8, 22.3, 22.7, 23.2, 23.7, 24.2, 24.7, 25.2, 25.7, 26.2, 26.7, 27.2, 27.7, 28.2, 28.7, 29.2, 29.7]
  }
};

export const ChildGrowth = ({ gender = "girls" }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      const ageValues = Array.from({ length: 19 }, (_, i) => i + 2);
      const percentiles = percentilesData[gender];

      const userData = [
        { x: 5, y: 17.5 },
        { x: 10, y: 19.2 },
        { x: 15, y: 21.8 }
      ];

      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: ageValues,
          datasets: [
            ...Object.entries(percentiles).map(([percentile, values], index) => ({
              label: `${percentile} Percentile`,
              data: values.map((y, i) => ({ x: ageValues[i], y })),
              borderColor: ["#FFAAAA", "#FFD700", "#32CD32", "#FFA500", "#FF4500", "#B22222"][index],
              borderWidth: 2,
              fill: false,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 0,
            })),
            {
              label: "User Data",
              data: userData,
              borderColor: "black",
              backgroundColor: "orange",
              pointRadius: 6,
              type: "scatter",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "linear",
              title: { display: true, text: "Age (Years)" },
              ticks: { stepSize: 1 },
              
            },
            y: {
              title: { display: true, text: "BMI" },
              ticks: { stepSize: 1 },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `Age: ${context.raw.x}, BMI: ${context.raw.y}`;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [gender]);

  return (
    <div style={{ width: "600px", height: "500px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

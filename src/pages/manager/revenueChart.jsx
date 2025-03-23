import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const RevenueChart = ({ orders }) => {
  const [chartData, setChartData] = useState(null);
  const USD_TO_VND = 25604.98; // Exchange rate

  useEffect(() => {
    processRevenueData();
  }, [orders]);

  const processRevenueData = () => {
    const revenueByMonth = Array(12).fill(0); // Initialize all 12 months with 0 VND

    orders.forEach((order) => {
      const month = new Date(order.createdAt).getMonth(); // 0 = Jan, 11 = Dec
      let amountInVND = order.amount;

      if (order.currency == "USD") {
        amountInVND *= USD_TO_VND; // Convert USD to VND
      }

      if (order.currency == "VND" || order.currency == "USD") {
        revenueByMonth[month] += amountInVND; // Add to corresponding month
      }
    });

    // Set data for the chart
    setChartData({
      labels: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      datasets: [
        {
          label: "Revenue (VND)",
          data: revenueByMonth,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    });
  };

  return (
    <div className="w-800px] h-96 p-4 mt-4 bg-white shadow-md rounded-lg ml-10">
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
            scales: {
              y: {
                title: { display: true, text: "Revenue (VND)" },
                ticks: { callback: (value) => value.toLocaleString("vi-VN") }, // Format numbers as VND
              },
              x: { title: { display: true, text: "Month" } },
            },
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

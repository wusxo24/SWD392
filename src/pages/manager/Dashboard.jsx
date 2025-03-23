import { useEffect, useState } from "react";
import SidebarManager from "./SidebarManager";
import { fetchAllOrders } from "@/services/orderService";
import { getPricingPlans } from "@/services/pricingService";
import { LoadingScreen } from "@/components/loadingScreen";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, TablePagination, TextField,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { blue } from "@mui/material/colors";
import { RevenueChart } from "./revenueChart";
const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [topServices, setTopServices] = useState([]);
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const ordersData = await fetchAllOrders();
        const servicesData = await getPricingPlans();
  
        // Convert services array into an object {serviceId: serviceName}
        const serviceMap = {};
        servicesData.forEach((service) => {
          serviceMap[service._id] = service.name;
        });
  
        // Sort orders by date (newest first)
        const sortedOrders = ordersData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
  
        setOrders(sortedOrders);
        setServices(serviceMap);
  
        // ✅ Count purchases for each service in the last 3 months
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
        const serviceCounts = {};
  
        sortedOrders.forEach((order) => {
          const orderDate = new Date(order.createdAt);
          if (orderDate >= threeMonthsAgo) {
            if (order.serviceId in serviceCounts) {
              serviceCounts[order.serviceId]++;
            } else {
              serviceCounts[order.serviceId] = 1;
            }
          }
        });
  
        // ✅ Convert counts to array and sort by most purchased
        const top5 = Object.entries(serviceCounts)
          .map(([serviceId, count]) => ({
            name: serviceMap[serviceId] || "Unknown",
            count,
          }))
          .sort((a, b) => b.count - a.count) // Sort descending
          .slice(0, 5); // Get top 5
  
        setTopServices(top5);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    getData();
  }, []);
  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  // Search filter function
  const filteredOrders = orders.filter((order) => {
    const orderCode = order.orderCode ? order.orderCode.toLowerCase() : "";
    const buyerName = order.buyerName ? order.buyerName.toLowerCase() : "";
    const serviceName = services[order.serviceId] ? services[order.serviceId].toLowerCase() : "";
  
    return (
      orderCode.includes(searchQuery.toLowerCase()) ||
      buyerName.includes(searchQuery.toLowerCase()) ||
      serviceName.includes(searchQuery.toLowerCase())
    );
  });
  

  return (
    <div className="flex bg-gray-100">
      <SidebarManager />
      <div className="p-4 w-full">
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <div className="flex">
          <div className="bg-white h-96 p-4 mt-4 rounded-lg shadow-md w-1/3">
          <Typography variant="h6" gutterBottom>
            Recent Buy - Top Services
          </Typography>
          {topServices.length == 0 ? (
            <Typography variant="body2">No recent purchases.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow style={{ background: "#51a2ff" }}>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>#</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Service Name</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Total Purchases</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topServices.map((service, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
        <div className="w-2/3">
        <RevenueChart orders={orders} />
        </div>
        
        </div>
       
        <div className="bg-white p-4 mt-4 rounded-lg shadow-md">     
           {/* Search Bar */}
        <TextField
          label="Search Orders"
          variant="outlined"
          width="100%"  
          size="small"
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon/>
              </InputAdornment>
            ),
          }}
        />
        {loading ? (
          <LoadingScreen />
        ) : filteredOrders.length === 0 ? (
          <Typography variant="body1">No matching orders found.</Typography>
        ) : (
          <Paper sx={{ width: "100%", overflow: "hidden"}}>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table>
                <TableHead sx={{ background: "#51a2ff" }}>
                  <TableRow>
                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Order Code</TableCell>
                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Buyer</TableCell>
                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Service</TableCell>
                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Payment Method</TableCell>
                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Pagination logic
                    .map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell>{order.orderCode}</TableCell>
                        <TableCell>{order.buyerName}</TableCell>
                        <TableCell>{services[order.serviceId] || "Unknown"}</TableCell>
                        <TableCell>
                          {order.amount} {order.currency}
                        </TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>{order.paymentMethod || "N/A"}</TableCell>
                        <TableCell>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Component */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={filteredOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
        </div> 
      </div>

    </div>
  );
};

export default Dashboard;

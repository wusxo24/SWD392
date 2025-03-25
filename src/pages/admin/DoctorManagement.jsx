import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import Sidebar from "./SidebarAdmin";
import { fetchDoctors, deleteDoctor, saveDoctor, updateDoctor, updateDoctorStatus } from "@/services/doctorService";
import { Button, Table, Modal, Input, Select, Form, Space, Typography, Upload, message, Card, Row, Col, Switch, Image, DatePicker } from "antd";
import { UploadOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title } = Typography;

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchDoctorsData();
  }, []);

  const fetchDoctorsData = async () => {
    try {
      const doctors = await fetchDoctors();
      console.log("Fetched doctors:", doctors); // Debugging
      setDoctors(doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await saveDoctor(values, editId);
      fetchDoctorsData();
      setIsModalOpen(false);
      form.resetFields();
      setEditId(null);
      toast.success("Doctor saved successfully");
    } catch (error) {
      console.error("Error saving doctor:", error);
      toast.error("Failed to save doctor");
    }
  };

  const handleEdit = (doctor) => {
    console.log("Editing doctor:", doctor); // Debugging
    setEditId(doctor._id);
    form.setFieldsValue({
      username: doctor?.user_id?.username || "",
      email: doctor?.user_id?.email || "",
      gender: doctor?.gender || "Male",
      clinic_name: doctor?.clinic_name || "",
      experience: doctor?.experience || 0,
      license_id: doctor?.license_id._id || "",
      certificate: doctor?.certificate || "",
      date: doctor?.date ? moment(doctor.date).format("YYYY-MM-DD") : "",
      picture: doctor?.picture || "",
      status: doctor?.user_id?.status || "Inactive",
    });
    setIsModalOpen(true);
  };
  

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      fetchDoctorsData();
      toast.success("Doctor deleted successfully");
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast.error("Failed to delete doctor");
    }
  };

  const filteredDoctors = doctors.filter(doctor => 
    (doctor.user_id?.username?.toLowerCase().includes(searchText.toLowerCase()) || 
     doctor.user_id?.email?.toLowerCase().includes(searchText.toLowerCase()) || 
     doctor.clinic_name?.toLowerCase().includes(searchText.toLowerCase())) ||
     doctor.gender?.toLowerCase().includes(searchText.toLowerCase()) ||
     doctor.experience?.toString().includes(searchText) ||
     doctor.certificate?.toLowerCase().includes(searchText.toLowerCase()) ||
     doctor.license_id?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
     doctor.status?.toLowerCase().includes(searchText.toLowerCase()) ||
     moment(doctor.date).format("YYYY-MM-DD").includes(searchText)
  );
  const columns = [
    { title: "Username", dataIndex: ["user_id", "username"], key: "username", sorter: (a, b) => a.user_id?.username.localeCompare(b.username), align : "center" },
    { title: "Email", dataIndex: ["user_id", "email"], key: "email" , sorter: (a, b) => a.user_id?.email.localeCompare(b.email), align : "center"},
    { title: "Gender", dataIndex: "gender", key: "gender", sorter: (a, b) => a.gender.localeCompare(b.gender), align : "center", filters: [{ text: "Male", value: "Male" }, { text: "Female", value: "Female" }, { text: "Other", value: "Other" }], onFilter: (value, record) => record.gender === value },
    { title: "Clinic Name", dataIndex: "clinic_name", key: "clinic_name", sorter: (a, b) => a.clinic_name.localeCompare(b.clinic_name), align : "center"},
    { title: "Experience", dataIndex: "experience", key: "experience", sorter: (a, b) => a.experience - b.experience, align : "center"},
    { title: "License", dataIndex: [ "license_id", "license_name"], key: "license_name", sorter: (a, b) => a.license_id.license_name.localeCompare(b.license_id.license_name), align : "center"},
    { title: "Certificate", dataIndex: [ "certificate"], key: "certificate", sorter: (a, b) => a.certificate.localeCompare(b.certificate), align : "center"},
    { 
      title: "Date of Birth",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => date ? new Date(date).toLocaleDateString() : "N/A",
      align : "center"
    },    
    {
      title: "Photo",
      dataIndex: "picture",
      key: "photo",
      render: (photo) => (
        <img src={photo} alt="Doctor" style={{ width: 50, height: 50, borderRadius: "50%" }} />),},    
    { 
      title: "Status", 
      dataIndex: ["user_id", "status"], 
      key: "status",
      sorter: (a, b) => a.user_id?.status.localeCompare(b.user_id?.status),
      align : "center",
      filters: [{ text: "Active", value: "Active" }, { text: "Inactive", value: "Inactive" }],
      render: (_, record) => (
        <Switch 
          checked={record.user_id?.status === "Active"} 
          onChange={(checked) => handleStatusChange(record._id, checked)}
          checkedChildren="Active" 
          unCheckedChildren="Inactive" 
        />
      )
    },
    {
      title: "Actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleStatusChange = async (id, isActive) => {
    try {
        const newStatus = isActive ? "Active" : "Inactive";
        
        // Optimistically update UI
        setDoctors((prevDoctors) =>
            prevDoctors.map((doc) =>
                doc._id === id ? { ...doc, user_id: { ...doc.user_id, status: newStatus } } : doc
            )
        );

        // Call service function
        const updatedDoctor = await updateDoctorStatus(id, newStatus);
        console.log("Updated Doctor:", updatedDoctor);

        fetchDoctorsData(); // Refresh data
        toast.success("Status updated successfully");
    } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status");
    }
};
  

  return (
    <div className="flex">
      <Sidebar/>
    <div className="w-full p-5" style={{ padding: "30px", backgroundColor: "#f8f9fa", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Card style={{ width: "100%", maxWidth: "1500px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
        <Space style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
          <Input placeholder="Search doctors..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 300 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Add Doctor</Button>
        </Space>
        <Table dataSource={filteredDoctors} columns={columns} rowKey="_id" bordered pagination={{ pageSize: 4 }} />
      </Card>
      <Modal
        title={editId ? "Edit Doctor" : "Add Doctor"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText={editId ? "Update" : "Add"}
        cancelText="Cancel"
        centered
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="username" label="Username" rules={[{ required: true, message: "Username is required" }]}>
                <Input placeholder="Enter username" />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
          </Row>

          {!editId && (
             <Col span={16}>
            <Form.Item name="password" label="Password" rules={[{ required: true, message: "Password is required" }]}>
              <Input.Password placeholder="Enter password" />
            </Form.Item>
            </Col>
          )}

          <Row gutter={16}>
            <Col span={5}>
              <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Please select gender" }]}>
                <Select placeholder="Select gender">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="clinic_name" label="Clinic Name" rules={[{ required: true, message: "Clinic name is required" }]}>
                <Input placeholder="Enter clinic name" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="experience" label="Experience" rules={[{ required: true, message: "Experience is required" }]}>
                <Input type="number" placeholder="Enter experience in years" />
              </Form.Item>
            </Col>
            <Col span={13}>
              <Form.Item
                name="license_id"
                label="License ID"
                rules={[{ required: true, message: "License ID is required" }]}
              >
                <Input placeholder="Enter license ID" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="certificate"
                label="Certificate"
                rules={[{ required: true, message: "Certificate is required" }]}
              >
                <Input placeholder="Enter certificate" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
          <Col span={8}>
              <Form.Item name="date" label="Birth Date" rules={[{ required: true, message: "Date is required" }]}>
              <Input type="date" />
              </Form.Item>
          </Col>
          <Col span={8}>
          <Form.Item name="picture" label="Doctor's Photo" rules={[{ required: true, message: "Photo URL is required" }]}>
            <Input placeholder="Enter image URL" />
          </Form.Item>
          </Col>
          <Col span={5}>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Status is required" }]} initialValue="Active">
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
          </Col>
          </Row>
        </Form>
      </Modal>
    </div>
    </div> 
  );
}

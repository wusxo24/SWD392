import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { getAllMembers, deleteMember, updateMemberStatus, saveMember } from "@/services/memberService";
import { Button, Table, Input, Space, Switch, Card, Form, Modal, Row, Col, Select, DatePicker } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import Sidebar from "./SidebarAdmin";

export default function MemberManagement() {
  const [members, setMembers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMembersData();
  }, []);

  const fetchMembersData = async () => {
    try {
      const members = await getAllMembers();
      const formattedMembers = members.map((member) => ({
        ...member,
        username: member.user_id?.username || "N/A",
        email: member.user_id?.email || "N/A",
        status: member.status || "Inactive",
      }));
      setMembers(formattedMembers);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load members");
    }
  };

   const handleSubmit = async () => {
      try {
        const values = await form.validateFields();
        await saveMember(values, editId);
        fetchMembersData();
        setIsModalOpen(false);
        form.resetFields();
        setEditId(null);
        toast.success("Member saved successfully");
      } catch (error) {
        console.error("Error saving doctor:", error);
        toast.error("Failed to save doctor");
      }
    };

  const handleDelete = async (id) => {
    try {
      await deleteMember(id);
      fetchMembersData();
      toast.success("Member deleted successfully");
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to delete member");
    }
  };

  const handleStatusChange = async (id, isActive) => {
    try {
      const newStatus = isActive ? "Active" : "Inactive";
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member._id === id ? { ...member, user_id: { ...member.user_id, status: newStatus } } : member
        )
      );
      await updateMemberStatus(id, newStatus);
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };
  

  const handleEdit = (member) => {
      console.log("Editing member:", member); // Debugging
      setEditId(member._id);
      form.setFieldsValue({
        username: member?.user_id?.username || "",
        email: member?.user_id?.email || "",
        nickname: member?.nickname || "",
        fullname: member?.fullname || "",
        gender: member?.gender || "",
        phone: member?.phone || "",
        address: member?.address || "",
        birthdate: member?.birthdate ? moment(member.birthdate).format("YYYY-MM-DD") : "",
        picture: member?.picture || "",
        status: member?.user_id?.status || "Inactive",
      });
      setIsModalOpen(true);
    };

  const filteredMembers = members.filter((member) =>
    member.user_id?.username?.toLowerCase().includes(searchText.toLowerCase()) ||
    member.user_id?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    member.nickname?.toLowerCase().includes(searchText.toLowerCase()) ||
    member.fullname?.toLowerCase().includes(searchText.toLowerCase()) ||
    member.gender?.toLowerCase().includes(searchText.toLowerCase()) ||
    member.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
    member.address?.toLowerCase().includes(searchText.toLowerCase()) ||
    member.birthdate?.toLocaleDateString().includes(searchText.toLowerCase()) ||
    member.user_id?.status?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { 
        title: "Username", 
        dataIndex: "username", 
        key: "username",
        sorter: (a, b) => (a.user_id?.username || "").localeCompare(b.user_id?.username || ""), 
        align: "center" 
    },
    { 
        title: "Email", 
        dataIndex: "email", 
        key: "email", 
        sorter: (a, b) => (a.user_id?.email || "").localeCompare(b.user_id?.email || ""), 
        align: "center"
    },
    { 
        title: "Nickname", 
        dataIndex: "nickname", 
        key: "nickname", 
        sorter: (a, b) => (a.nickname || "").localeCompare(b.nickname || ""), 
        align: "center"
    },
    { 
        title: "Fullname", 
        dataIndex: "fullname", 
        key: "fullname", 
        sorter: (a, b) => (a.fullname || "").localeCompare(b.fullname || ""), 
        align: "center"
    },
    { 
        title: "Gender", 
        dataIndex: "gender", 
        key: "gender", 
        sorter: (a, b) => (a.gender || "").localeCompare(b.gender || ""), 
        align: "center",
        filters: [{ text: "Male", value: "Male" }, { text: "Female", value: "Female" }], 
        onFilter: (value, record) => record.gender === value 
    },
    { 
        title: "Phone", 
        dataIndex: "phone", 
        key: "phone", 
        sorter: (a, b) => (a.phone || "").localeCompare(b.phone || ""), 
        align: "center"
    },
    { 
        title: "Address", 
        dataIndex: "address", 
        key: "address", 
        sorter: (a, b) => (a.address || "").localeCompare(b.address || ""), 
        align: "center"
    },
    { 
        title: "Date of Birth",
        dataIndex: "birthdate",
        key: "date",
        sorter: (a, b) => new Date(a.birthdate || "1970-01-01") - new Date(b.birthdate || "1970-01-01"),
        render: (date) => date ? new Date(date).toLocaleDateString() : "N/A",
        align: "center",
    },    
    {
        title: "Status",
        dataIndex: ["user_id", "status"],
        key: "status",
        align: "center",
        sorter: (a, b) => (a.user_id?.status || "").localeCompare(b.user_id?.status || ""),
        filters: [{ text: "Active", value: "Active" }, { text: "Inactive", value: "Inactive" }],
        render: (_, record) => (
            <Switch
                checked={record.user_id?.status === "Active"}
                onChange={(checked) => handleStatusChange(record._id, checked)}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
            />
        ),
    },
    {
        title: "Photo",
        dataIndex: "picture",
        key: "photo",
        align: "center",
        render: (photo) => (
            <img src={photo || "default-image-url.jpg"} alt="Member" style={{ width: 50, height: 50, borderRadius: "50%" }} />
        ),
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

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full p-5" style={{ padding: "30px", backgroundColor: "#f8f9fa", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Card style={{ width: "100%", maxWidth: "1500px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
          <Space style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
            <Input
              placeholder="Search members..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </Space>
          <Table dataSource={filteredMembers} columns={columns} rowKey="_id" bordered pagination={{ pageSize: 4 }} />
        </Card>
        <Modal
        title={editId ? "Edit Member" : "Add Member"}
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
              <Form.Item name="nickname" label="Nickname">
              <Input placeholder="Enter nickname" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="fullname" label="Full Name">
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="gender" label="Gender">
                    <Select>
                    <Select.Option value="Male">Male</Select.Option>
                    <Select.Option value="Female">Female</Select.Option>
                    <Select.Option value="Other">Other</Select.Option>
                    </Select>
              </Form.Item>
            </Col>
            <Col span={13}>
              <Form.Item
                name="address"
                label="Address"
              >
                <Input placeholder="Enter address" />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name="phone"
                label="Phone Number"
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
          <Col span={8}>
          <Form.Item name="birthdate" label="Birth Date">
            <Input type="date" />
          </Form.Item>

          </Col>
          <Col span={8}>
          <Form.Item name="picture" label="Member's Photo">
            <Input placeholder="Enter image URL" />
          </Form.Item>
          </Col>
          <Col span={5}>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Status is required" }]} initialValue="Active">
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
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

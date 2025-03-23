import { useEffect, useState } from "react";
import { Button, Table, Input, Space, Card, Col, Row, Switch, Form, Modal, Select, message } from "antd";
import { ToastContainer, toast } from "react-toastify";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Sidebar from "./SidebarAdmin";
import { getAllManagers, updateManager, deleteManager, updateManagerStatus, createManager } from "@/services/managerService";

const { Option } = Select;

const ManagerManagement = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingManager, setEditingManager] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const data = await getAllManagers();
      setManagers(data);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const filteredManagers = managers.filter((manager) =>
    manager.username.toLowerCase().includes(searchText) ||
    manager.email.toLowerCase().includes(searchText) ||
    manager.status.toLowerCase().includes(searchText)
  );

  const handleEdit = (manager) => {
    console.log("Editing manager:", manager); // Debugging
    setEditingManager(manager._id);
    form.setFieldsValue({
      username: manager?.username || "",
      email: manager?.email || "",
      password: manager?.password || "",
      status: manager?.status || "Inactive",
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteManager(id);
      message.success("Manager deleted successfully");
      fetchManagers();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleStatusChange = async (id, isActive) => {
    try {
      const newStatus = isActive ? "Active" : "Inactive";
      setManagers((prevManagers) =>
        prevManagers.map((manager) =>
          manager._id === id ? { ...manager, status: newStatus } : manager
        )
      );
      await updateManagerStatus(id, newStatus);
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingManager) {
        await updateManager(editingManager, values);
        message.success("Manager updated successfully");
      } else {
        await createManager(values);
        message.success("Manager added successfully");
      }
      fetchManagers();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [
        { text: "Active", value: "Active" },
        { text: "Inactive", value: "Inactive" },
      ],
      render: (_, record) => (
        <Switch
          checked={record.status === "Active"}
          onChange={(checked) => handleStatusChange(record._id, checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, manager) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(manager)}>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(manager._id)} danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div
        className="w-full p-5"
        style={{
          padding: "30px",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: "1500px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "10px",
          }}
        >
          <Space style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
            <Input.Search
              placeholder="Search by name or email"
              onSearch={handleSearch}
              style={{ marginBottom: 16, width: 300 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
              Add Manager
            </Button>
          </Space>
          <Table
            dataSource={filteredManagers}
            columns={columns}
            rowKey="_id"
            loading={loading}
            bordered
            pagination={{ pageSize: 5 }}
          />
        </Card>
        <Modal
          open={modalVisible}
          title={editingManager ? "Edit Manager" : "Add Manager"}
          onCancel={() => setModalVisible(false)}
          cancelText="Cancel"
          centered
          width={450}
          okText={editingManager ? "Update" : "Add"}
          onOk={() => form.submit()} // FIXED HERE
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col span={15}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please enter an email" },
                    { type: "email", message: "Enter a valid email" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              {!editingManager && (
                <Col span={15}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: "Please enter a password" }]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Row gutter={16}>
              <Col span={7}>
                <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select a status" }]}>
                  <Select>
                    <Option value="Active">Active</Option>
                    <Option value="Inactive">Inactive</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="username" label="Username" rules={[{ required: true, message: "Please enter a username" }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManagerManagement;

import React, { useState, useEffect } from "react";

const API_URL = "https://67c2b6951851890165ad0915.mockapi.io/account";

const Notification = ({ message, onClose }) =>
  message && (
    <div className="fixed top-5 right-5 bg-green-400 text-white px-4 py-2 rounded shadow-lg">
      {message}
      <button className="ml-4" onClick={onClose}>
        X
      </button>
    </div>
  );

const AccountForm = ({ form, setForm, handleCreateOrUpdate, isEditing }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <form
      className="bg-white p-5 rounded shadow-md"
      onSubmit={handleCreateOrUpdate}
    >
      <p className="text-lg font-medium mb-3">
        {isEditing ? "Edit Account" : "Create Account"}
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <input
          className="border rounded px-3 py-2"
          name="fullname"
          placeholder="Full Name"
          value={form.fullname}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-3 py-2"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-3 py-2"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-3 py-2"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          className="border rounded px-3 py-2"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-400 text-white rounded-full px-10 py-3 mt-4"
      >
        {isEditing ? "Save Changes" : "Create Account"}
      </button>
    </form>
  );
};

const AccountTable = ({ accounts, handleEditClick, handleDelete }) => (
  <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
    <thead className="bg-blue-400 text-white">
      <tr>
        <th className="py-2 px-4">Full Name</th>
        <th className="py-2 px-4">Username</th>
        <th className="py-2 px-4">Email</th>
        <th className="py-2 px-4">Password</th>
        <th className="py-2 px-4">Role</th>
        <th className="py-2 px-4">Actions</th>
      </tr>
    </thead>
    <tbody>
      {accounts && accounts.length > 0 ? (
        accounts.map((account) => (
          <tr key={account.id} className="border-b hover:bg-gray-100">
            <td className="py-2 px-4">{account.fullname}</td>
            <td className="py-2 px-4">{account.username}</td>
            <td className="py-2 px-4">{account.email}</td>
            <td className="py-2 px-4">{account.password}</td>
            <td className="py-2 px-4">{account.role}</td>
            <td className="py-2 px-4 space-x-2">
              <button
                className="bg-yellow-400 text-white rounded px-3 py-1"
                onClick={() => handleEditClick(account)}
              >
                Edit
              </button>
              <button
                className="bg-red-400 text-white rounded px-3 py-1"
                onClick={() => handleDelete(account.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="text-center py-4 text-gray-500">
            No accounts available
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [notification, setNotification] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 10000);
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${API_URL}/${form.id}` : API_URL;
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      fetchAccounts();
      setForm({
        fullname: "",
        username: "",
        email: "",
        password: "",
        role: "user",
      });
      setIsEditing(false);
      showNotification(
        isEditing
          ? "Account updated successfully!"
          : "Account created successfully!"
      );
    } catch (error) {
      console.error("Failed to save account:", error);
      showNotification("Failed to save account.");
    }
  };

  const handleEditClick = (account) => {
    setForm(account);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchAccounts();
      showNotification("Account deleted successfully!");
    } catch (error) {
      console.error("Failed to delete account:", error);
      showNotification("Failed to delete account.");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div>
      <Notification
        message={notification}
        onClose={() => setNotification("")}
      />
      <AccountForm
        form={form}
        setForm={setForm}
        handleCreateOrUpdate={handleCreateOrUpdate}
        isEditing={isEditing}
      />
      <AccountTable
        accounts={accounts}
        handleEditClick={handleEditClick}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default ManageAccounts;

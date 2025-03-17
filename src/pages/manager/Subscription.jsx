import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SidebarManager from "./SidebarManager";
const API_URL = "https://swd-392-api.vercel.app/api/services"; // API endpoint for account management

const Notification = ({ message, onClose }) =>
  message && (
    <div className="fixed top-5 right-5 bg-green-400 text-white px-4 py-2 rounded shadow-lg">
      {message}
      <button className="ml-4" onClick={onClose}>
        X
      </button>
    </div>
  );

const SubscriptionForm = ({
  form,
  setForm,
  handleCreateOrUpdate,
  isEditing,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <form
      className="bg-white p-5 rounded shadow-md"
      onSubmit={handleCreateOrUpdate}
      id="subscription-form"
    >
      <p className="text-lg font-medium mb-3">
        {isEditing ? "Edit Subscription" : "Create Subscription"}
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <input
          className="border rounded px-3 py-2"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-3 py-2"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-3 py-2"
          name="features"
          placeholder="Features"
          value={form.features}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-3 py-2"
          name="image"
          placeholder="Image"
          value={form.image}
          onChange={handleChange}
          required
        />

        <input
          className="border rounded px-3 py-2"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          className="border rounded px-3 py-2"
          name="duration"
          placeholder="Duration"
          value={form.duration}
          onChange={handleChange}
          required
        />

        <input
          className="border rounded px-3 py-2"
          name="plan_code"
          placeholder="Plan code"
          value={form.plan_code}
          onChange={handleChange}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-400 text-white rounded-full px-10 py-3 mt-4"
      >
        {isEditing ? "Save Changes" : "Create Subscription"}
      </button>
    </form>
  );
};

const SubscriptionTable = ({ subscription, handleEditClick, handleDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-blue-400 text-white">
        <tr>
          <th className="py-2 px-4">Name</th>
          <th className="py-2 px-4">Description</th>
          <th className="py-2 px-4">Features</th>
          <th className="py-2 px-4">Image</th>
          <th className="py-2 px-4">Price</th>
          <th className="py-2 px-4">Duration</th>
          <th className="py-2 px-4">Plan_code</th>
          <th className="py-2 px-4">Action</th>
        </tr>
      </thead>
      <tbody>
        {subscription && subscription.length > 0 ? (
          subscription.map((subscription) => (
            <tr
              key={subscription.id || subscription.name}
              className="border-b hover:bg-gray-100"
            >
              <td className="py-2 px-4">{subscription.name}</td>
              <td className="py-2 px-4">{subscription.description}</td>
              <td className="py-2 px-4">{subscription.features}</td>
              <td className="py-2 px-4">{subscription.image}</td>
              <td className="py-2 px-4">{subscription.price}</td>
              <td className="py-2 px-4">{subscription.duration}</td>
              <td className="py-2 px-4">{subscription.plan_code}</td>
              <td className="py-2 px-4 space-x-2">
                <button
                  className="bg-yellow-400 text-white rounded px-3 py-1"
                  onClick={() => handleEditClick(subscription)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-400 text-white rounded px-3 py-1"
                  onClick={() => handleDelete(subscription.id)}
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
  </div>
);

const Subscription = () => {
  const [subscription, setSubscription] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    features: "",
    image: "",
    price: "",
    duration: "",
    plan_code: "",
  });
  const [notification, setNotification] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 10000);
  };

  SubscriptionForm.propTypes = {
    form: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      features: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      plan_code: PropTypes.string.isRequired,
    }).isRequired,
    setForm: PropTypes.func.isRequired,
    handleCreateOrUpdate: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
  };

  Notification.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  SubscriptionTable.propTypes = {
    subscription: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        features: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        plan_code: PropTypes.string.isRequired,
      })
    ).isRequired,
    handleEditClick: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
  };

  const fetchSubscription = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setSubscription(data);
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    // Handles subscription creation and updates

    e.preventDefault();
    const isDuplicate = subscription.some(
      (acc) =>
        (acc.name === form.name || acc.plan_code === form.plan_code) &&
        acc.id !== form.id
    );
    if (isDuplicate) {
      showNotification("Name or plan_code already exists.");
      return;
    }
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${API_URL}/${form.id}` : API_URL; // Use ID for updates

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      console.log("API Response:", result); // Check API response

      if (!response.ok) {
        throw new Error("Failed to save subscription");
      }

      fetchSubscription();
      setForm({
        id: null,
        name: "",
        description: "",
        features: "",
        image: "",
        price: "",
        duration: "",
        plan_code: "",
      });
      setIsEditing(false);
      showNotification(
        // Show notification based on action result
        isEditing
          ? "Subscription updated successfully!"
          : "Subscription created successfully!"
      );
    } catch (error) {
      console.error("Failed to save subscription:", error);
      showNotification("Failed to save subscription.");
    }
  };

  const handleEditClick = (subscription) => {
    setForm(subscription);
    setIsEditing(true);
    const formElement = document.getElementById("subscription-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" }); // Send DELETE request to API

      fetchSubscription();
      showNotification("Subscription deleted successfully!");
    } catch (error) {
      console.error("Failed to delete subscription:", error); // Log error if deletion fails

      showNotification("Failed to delete subscription.");
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return (
    <div className="flex">
      <SidebarManager />
      <div className="w-full p-5">
        <Notification
          message={notification}
          onClose={() => setNotification("")}
        />
        <SubscriptionForm
          form={form}
          setForm={setForm}
          handleCreateOrUpdate={handleCreateOrUpdate}
          isEditing={isEditing}
        />
        <SubscriptionTable
          subscription={subscription}
          handleEditClick={handleEditClick}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Subscription;

import { useState, useEffect } from "react";
import {
  getPricingPlans,
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  updateSubscriptionPlan,
} from "@/services/pricingService";
import SidebarManager from "./SidebarManager";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { LoadingScreen } from "@/components/loadingScreen";
import { Dialog, DialogActions, DialogContent, DialogTitle, Table, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { Button } from "react-scroll";

const Subscription = () => {
  const [subscription, setSubscription] = useState([]);
  const [form, setForm] = useState({
    _id: null,
    name: "",
    description: "",
    features: [],  // Updated to an array
    image: "",
    price: "",
    duration: "",
    plan_code: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [newFeature, setNewFeature] = useState(""); // For feature input
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleUpdatePlan = async () => {
    try {
      await updateSubscriptionPlan(form._id, form);  // Assume updateSubscriptionPlan exists
      toast.success("Subscription plan updated successfully!");
      fetchSubscriptions();
      handleCloseModal();
    } catch (error) {
      toast.error("Error updating subscription plan.");
    }
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-menu")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const data = await getPricingPlans();
      setSubscription(data);
    } catch (error) {
      toast.error("Failed to fetch subscriptions.");
    }
  };

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setForm(plan); // Set form data if updating
    } else {
      setForm({
        _id: null,
        name: "",
        description: "",
        features: [],
        image: "",
        price: "",
        duration: "",
        plan_code: "",
      });
    }
    setIsModalOpen(true);
  };
  
  

  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreatePlan = async () => {
    try {
      await createSubscriptionPlan(form);
      fetchSubscriptions();
      handleCloseModal();
      toast.success("Subscription plan created successfully!");
    } catch (error) {
      toast.error("Error creating subscription plan.");
    }
  };

  const handleDeletePlan = async (_id) => {
    try {
      await deleteSubscriptionPlan(_id);
      toast.success("Subscription plan deleted successfully!");
      setSubscription(subscription.filter((plan) => plan._id !== _id));
    } catch (error) {
      toast.error("Error deleting subscription plan.");
    }
  };

  // Handle adding features
  const handleAddFeature = () => {
    if (newFeature.trim() !== "") {
      setForm({ ...form, features: [...form.features, newFeature] });
      setNewFeature("");
    }
  };

  // Handle removing a feature
  const handleRemoveFeature = (index) => {
    setForm({
      ...form,
      features: form.features.filter((_, i) => i !== index),
    });
  };
  return (
    <div className="flex">
      <SidebarManager />
      <div className="w-full p-5">
      <ToastContainer/>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4 cursor-pointer"
            onClick={() => handleOpenModal()}
          >
            Create Subscription Plan
          </button>
        {/* Subscription Table */}
        <div className="relative overflow-visible">
          <Table className="min-w-full bg-white shadow-md rounded-lg">
            <TableHead className="bg-blue-400 text-white">
              <TableRow>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Features</th>
                <th className="py-2 px-4">Image</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Duration</th>
                <th className="py-2 px-4">Plan Code</th>
                <th className="py-2 px-4">Actions</th>
              </TableRow>
            </TableHead>
            <tbody>
              {subscription.length > 0 ? (
                subscription.map((plan) => (
                  <TableRow key={plan._id} className="border-b hover:bg-gray-100">
                    <TableCell className="py-2 px-4">{plan.name}</TableCell>
                    <TableCell className="py-2 px-4">{plan.description}</TableCell>
                    <TableCell className="py-2 px-4">
                      <ul className="list-disc pl-5">
                        {plan.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="py-2 px-4">
                      <img src={plan.image} alt={plan.name} className="h-10 w-10 object-cover" />
                    </TableCell>
                    <TableCell className="py-2 px-4">{plan.price}</TableCell>
                    <TableCell className="py-2 px-4">{plan.duration} months</TableCell>
                    <TableCell className="py-2 px-4">{plan.plan_code}</TableCell>
                    <TableCell className="py-2 px-4 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === plan._id ? null : plan._id);
                        }}
                        className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                      </button>
                      {openDropdown === plan._id && (
                        <div
                          className="absolute right-0 mt-2 bg-white border rounded shadow-md w-32 z-50 dropdown-menu"
                        >
                          <button
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left cursor-pointer"
                            onClick={() => {
                              handleOpenModal(plan);
                              setOpenDropdown(null);
                            }}
                          >
                            Update
                          </button>
                          <button
                            className="block px-4 py-2 text-red-600 hover:bg-gray-200 w-full text-left cursor-pointer"
                            onClick={() => {
                              handleDeletePlan(plan._id);
                              setOpenDropdown(null);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <TableCell colSpan="8" className="text-center py-4 text-gray-500">
                    No subscriptions available
                  </TableCell>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
         {/* Popup (Modal) for Creating Subscription Plan */}
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>{form._id ? "Update" : "Create"} Subscription Plan</DialogTitle>
          <DialogContent>
            <TextField
              label="Plan Name"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              sx={{marginBottom: 2}}
            />
            <TextField
              label="Description"
              fullWidth
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              sx={{marginBottom: 2}}
            />

            {/* Features Input */}
            <div className="mb-2">
              <TextField
                label="Add Feature"
                fullWidth
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                sx={{marginBottom: 2}}
              />
              <Button
                className="bg-green-500 text-white px-3 py-1 rounded mt-2 cursor-pointer"
                onClick={handleAddFeature}
              >
                Add Feature
              </Button>
            </div>

            <ul className="mb-2">
              {form.features.map((feature, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded mt-1 ">
                  {feature}
                  <button
                    className="text-red-500 ml-2"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <TextField
              label="Image URL"
              fullWidth
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              sx={{marginBottom: 2}}
            />

            <TextField
              label="Price"
              type="number"
              fullWidth
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              sx={{marginBottom: 2}}
            />

            <TextField
              label="Duration (months)"
              type="number"
              fullWidth
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              sx={{marginBottom: 2}}
            />

            <TextField
              label="Plan Code"
              fullWidth
              value={form.plan_code}
              onChange={(e) => setForm({ ...form, plan_code: e.target.value })}
              sx={{marginBottom: 2}}
            />
          </DialogContent>
          <DialogActions>
            <Button
              className="bg-blue-500 text-white px-3 py-1 rounded mt-2 cursor-pointer"
              onClick={form._id ? handleUpdatePlan : handleCreatePlan}
            >
              {form._id ? "Save" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      
    </div>
  );
};

export default Subscription;

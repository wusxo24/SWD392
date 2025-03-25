import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarDoctor from "./SidebarDoctor";
import { getDoctorById, updateDoctor } from "@/services/doctorService";
import uploadImage from "@/assets/upload_area.svg"; // Ensure correct import for default image
import moment from "moment";

const DoctorProfile = () => {
  const [doctorData, setDoctorData] = useState({
    picture: "",
    username: "", // Updated from 'name' to 'username'
    gender: "",
    email: "",
    experience: "",
    certificate: "",
    clinic_name: "",
    degree: "",
    license_id: "",
    date: "",
    _id: "",
  });

  const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  console.log(userId);

  useEffect(() => {
    if (!userId) {
      toast.error("Doctor not logged in");
      return;
    }

    const fetchDoctorInfo = async () => {
      try {
        const data = await getDoctorById(userId); // ✅ Directly gets the object (no .json())
        if (data) {
          setDoctorData({
            picture: data.picture || "",
            username: data.user_id.username || "", // Corrected from 'name'
            gender: data.gender || "",
            email: data.user_id.email || "",
            experience: data.experience || "",
            certificate: data.certificate || "",
            clinic_name: data.clinic_name || "",
            license_id: data.license_id._id || "",
            date: data.date ? moment(data.date).format("YYYY-MM-DD") : "", // ✅ Ensure correct format
            _id: data._id,
          });
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchDoctorInfo();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Ensure date is stored correctly
    if (name === "date") {
      setDoctorData((prev) => ({ ...prev, [name]: moment(value).format("YYYY-MM-DD") }));
    } else {
      setDoctorData((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const handleSave = async () => {
    if (!userId) {
      toast.error("Doctor not logged in");
      return;
    }
  
    try {
      const updatedData = { ...doctorData };
  
      // Ensure date is formatted correctly before sending
      if (updatedData.date) {
        updatedData.date = moment(updatedData.date).format("YYYY-MM-DD");
      }
  
      const responseData = await updateDoctor(doctorData._id, updatedData);
  
      console.log("Update response:", responseData); // Debugging response
  
      if (responseData) { // Since `responseData` is the actual response body, just check if it exists
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // Extracting error message if available
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SidebarDoctor />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4 mb-6">
            Doctor Profile
          </h2>

          {/* Profile Picture Input */}
          <div className="flex flex-col items-center mb-6">
            <img
              className="w-28 h-28 object-cover rounded-full border border-gray-300 shadow-sm"
              src={doctorData.picture || uploadImage}
              alt="Doctor Profile"
            />
            <input
              type="text"
              name="picture"
              value={doctorData.picture}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 mt-2 focus:ring focus:ring-blue-300 outline-none w-full"
              placeholder="Enter image URL"
            />
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Doctor Name", name: "username", type: "text", placeholder: "Enter full name" },
              { label: "Email", name: "email", type: "email", placeholder: "Enter email" },
              { label: "Experience (years)", name: "experience", type: "number", placeholder: "Years of experience" },
              { label: "Certificate", name: "certificate", type: "text", placeholder: "Enter certificate" },
              { label: "Clinic Name", name: "clinic_name", type: "text", placeholder: "Enter clinic name" },
              { label: "Date of Birth", name: "date", type: "date", placeholder: "Enter date of birth" },
              { label: "License ID", name: "license_id", type: "text", placeholder: "Enter license ID" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-gray-700">{field.label}</label>
                <input
                  name={field.name}
                  value={doctorData[field.name]}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 outline-none"
                  type={field.type}
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            {/* Gender Dropdown */}
            <div className="flex flex-col">
              <label className="text-gray-700">Gender</label>
              <select
                name="gender"
                value={doctorData.gender}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 outline-none"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;

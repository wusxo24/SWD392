import { useState, useEffect } from "react";
// import icon from "/src/assets/upload_area.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarDoctor from "./SidebarDoctor";

const API_URL = "";

const AddInfo = () => {
  const [doctorData, setDoctorData] = useState({
    image: "",
    name: "",
    gender: "",
    email: "",
    experience: "",
    fees: "",
    address: "",
    clinicName: "",
    about: "",
    degree: "",
  });

  // Giả sử user đã login và có doctorId lưu trong localStorage
  const doctorId = localStorage.getItem("doctorId");

  // Lấy thông tin bác sĩ từ API
  useEffect(() => {
    if (!doctorId) {
      toast.error("Doctor not logged in");
      return;
    }

    const fetchDoctorInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/doctor/${doctorId}`);
        const data = await response.json();
        setDoctorData(data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchDoctorInfo();
  }, [doctorId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      // Gửi ảnh lên server (giả sử có API endpoint /api/upload)
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();

      // Cập nhật state với URL ảnh từ server
      setDoctorData((prev) => ({ ...prev, image: data.imageUrl }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    }
  };

  // Hàm xử lý cập nhật state khi nhập dữ liệu
  const handleChange = (e) => {
    setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
  };

  // Hàm gửi dữ liệu lên API để cập nhật thông tin bác sĩ
  const handleSave = async () => {
    if (!doctorId) {
      toast.error("Doctor not logged in");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/doctor/${doctorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="flex">
      <SidebarDoctor />
      <div className="m-5 w-full">
        <p className="mb-3 text-lg font-medium">Doctor Profile</p>
        <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl shadow-lg">
          {/* Upload Profile Image */}
          <div className="flex flex-col items-center mb-6">
            <label htmlFor="doc-img">
              <img
                className="w-24 h-24 bg-gray-100 rounded-full cursor-pointer object-cover border"
                src={
                  doctorData.image
                    ? doctorData.image
                    : "/src/assets/upload_area.svg"
                }
                alt="Doctor Profile"
              />
            </label>
            <input
              type="file"
              id="doc-img"
              hidden
              onChange={handleImageUpload}
            />
            <p className="text-gray-500 mt-2 cursor-pointer">
              Upload doctor picture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doctor Name */}
            <div className="flex flex-col">
              <label className="text-gray-600">Doctor Name</label>
              <input
                name="name"
                value={doctorData.name}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                type="text"
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-gray-600">Email</label>
              <input
                name="email"
                value={doctorData.email}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                type="email"
                placeholder="Enter email"
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col">
              <label className="text-gray-600">Gender</label>
              <select
                name="gender"
                value={doctorData.gender}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Experience */}
            <div className="flex flex-col">
              <label className="text-gray-600">Experience (years)</label>
              <input
                name="experience"
                value={doctorData.experience}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                type="number"
                placeholder="Years of experience"
              />
            </div>

            {/* Fees */}
            <div className="flex flex-col">
              <label className="text-gray-600">Consultation Fee ($)</label>
              <input
                name="fees"
                value={doctorData.fees}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                type="number"
                placeholder="Enter fee amount"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="text-gray-600">Address</label>
              <input
                name="address"
                value={doctorData.address}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                type="text"
                placeholder="Enter address"
              />
            </div>

            {/* Clinic Name */}
            <div className="flex flex-col">
              <label className="text-gray-600">Clinic Name</label>
              <input
                name="clinicName"
                value={doctorData.clinicName}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                type="text"
                placeholder="Enter clinic name"
              />
            </div>

            {/* Degree */}
            <div className="flex flex-col">
              <label className="text-gray-600">Degree</label>
              <input
                name="degree"
                value={doctorData.degree}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                type="text"
                placeholder="Enter degree"
              />
            </div>
          </div>

          {/* About */}
          <div className="mt-6">
            <label className="text-gray-600">About</label>
            <textarea
              name="about"
              value={doctorData.about}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
              rows={4}
              placeholder="Write about the doctor"
            />
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInfo;

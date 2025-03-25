import { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance"; // Use a custom Axios instance with auth
import { useForm } from "react-hook-form";
import SidebarManager from "./SidebarManager";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Pagination } from "@mui/material"; // Import Pagination component
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const ITEMS_PER_PAGE = 3; // Number of news per page

const NewsManagement = () => {
  const [news, setnews] = useState([]);
  const [editingnews, setEditingnews] = useState(null);
  const { register, handleSubmit, reset, setValue, getValues } = useForm();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newsToDelete, setnewsToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1); // Add state for current page

  useEffect(() => {
    fetchnews();
  }, []);

  const fetchnews = async () => {
    try {
      const response = await axios.get("/api/news");
      setnews(response.data);
    } catch (error) {
      console.error("Error fetching news", error);
      toast.error("Failed to fetch news!");
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingnews) {
        await axios.put(`/api/news/${editingnews._id}`, data);
        toast.success("news updated successfully!");
      } else {
        await axios.post("/api/news", data);
        toast.success("news created successfully!");
      }
      reset();
      setEditingnews(null);
      fetchnews();
    } catch (error) {
      console.error("Error saving news", error);
      toast.error("Failed to save news!");
    }
  };

  const handleEdit = (news) => {
    setEditingnews(news);
    reset(news);
    setValue("content", news.content || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/news/${newsToDelete._id}`);
      toast.success("news deleted successfully!");
      fetchnews();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting news", error);
      toast.error("Failed to delete news!");
    }
  };

  const openDeleteConfirmation = (news) => {
    setnewsToDelete(news);
    setOpenDeleteDialog(true);
  };

  const closeDeleteConfirmation = () => {
    setOpenDeleteDialog(false);
    setnewsToDelete(null);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredAndSortednews = news
    .filter((news) => news.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });

  const totalPages = Math.ceil(filteredAndSortednews.length / ITEMS_PER_PAGE); // Calculate total pages
  const currentnews = filteredAndSortednews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE); // Get news for current page

  return (
    <div className="flex">
      <SidebarManager />
      <div className="p-6 w-full">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-4">News Management</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-100 p-4 rounded">
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="Title"
            className="w-full p-2 border"
          />
          <input
            {...register("banner", { required: "banner URL is required" })}
            placeholder="banner URL"
            className="w-full p-2 border"
          />
          {editingnews?.banner && (
            <img
              src={editingnews.banner}
              alt="news Preview"
              className="w-32 h-32 object-cover mt-2 rounded-md"
            />
          )}
          <input
            {...register("description", { required: "Description is required" })}
            placeholder="Description"
            className="w-full p-2 border"
          />
          <ReactQuill
            value={getValues("content") || ""}
            onChange={(value) => setValue("content", value, { shouldValidate: true })}
            placeholder="Content"
            className="w-full p-2 border"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {editingnews ? "Update" : "Create"} News
          </button>
        </form>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">News List</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search news"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={toggleSortOrder}
                className="bg-gray-500 text-white px-3 py-2 rounded transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
              >
                Sort {sortOrder === "asc" ? "Z-A" : "A-Z"}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentnews.map((news) => (
              <div key={news._id} className="border p-4 rounded-lg shadow-md">
                {news.banner && (
                  <img
                    src={news.banner}
                    alt="news banner"
                    className="w-full h-48 object-cover rounded-md mb-2"
                  />
                )}
                <h4 className="text-lg font-bold">{news.title}</h4>
                <p>{news.description}</p>
                <div className="flex space-x-2 mt-4">
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(news)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => openDeleteConfirmation(news)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
            />
          </div>
        </div>
      </div>

      <Dialog open={openDeleteDialog} onClose={closeDeleteConfirmation}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this news?</DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewsManagement;

import express from "express";
import {
  getAllBlogs,
  getAllBlogsAdmin,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublish,
  reorderBlogs,
} from "../controllers/blogCntrl.js";
import jwtCheck from "../config/authOConfig.js";

const router = express.Router();

// Public routes
router.get("/all", getAllBlogs);
router.get("/:id", getBlog);

// Admin routes (protected)
router.get("/admin/all", jwtCheck, getAllBlogsAdmin);
router.post("/create", jwtCheck, createBlog);
router.put("/update/:id", jwtCheck, updateBlog);
router.delete("/delete/:id", jwtCheck, deleteBlog);
router.patch("/toggle/:id", jwtCheck, togglePublish);
router.put("/reorder", jwtCheck, reorderBlogs);

export { router as blogRoute };

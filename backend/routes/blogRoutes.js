import express from "express";
import upload from "../middleware/blogUpload.js";

import {
    addBlog,
    getBlogs,
    deleteBlog,
    updateBlog
} from "../controllers/blogController.js";

const router = express.Router();

// ADD BLOG
router.post("/add", upload.single("image"), addBlog);

// GET BLOGS
router.get("/", getBlogs);

// DELETE BLOG
router.delete("/:id", deleteBlog);

// UPDATE BLOG
router.put("/:id", upload.single("image"), updateBlog);

export default router;
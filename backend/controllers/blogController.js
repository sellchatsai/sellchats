import Blog from "../models/Blog.js";

// ADD BLOG
export const addBlog = async (req, res) => {

    try {

        const blog = new Blog({
            label: req.body.label,
            title: req.body.title,
            author: req.body.author,
            date: req.body.date,
            link: req.body.link,
            image: req.file ? req.file.filename : ""
        });

        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog added successfully",
            data: blog
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Error adding blog",
            error: err.message
        });

    }

};


// GET BLOGS
export const getBlogs = async (req, res) => {

    try {

        const blogs = await Blog.find().sort({ _id: -1 });

        res.status(200).json(blogs);

    } catch (err) {

        res.status(500).json({
            message: "Error fetching blogs"
        });

    }

};


// DELETE BLOG
export const deleteBlog = async (req, res) => {

    try {

        await Blog.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Blog deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Error deleting blog"
        });

    }

};


// UPDATE BLOG
export const updateBlog = async (req, res) => {

    try {

        const updateData = {
            label: req.body.label,
            title: req.body.title,
            author: req.body.author,
            date: req.body.date,
            link: req.body.link
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json({
            success: true,
            message: "Blog updated successfully",
            data: blog
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Error updating blog"
        });

    }

};
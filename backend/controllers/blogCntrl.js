import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

// Get all blogs (public)
export const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    res.status(200).send(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).send({ message: "Error fetching blogs" });
  }
});

// Get all blogs for admin (including unpublished)
export const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    res.status(200).send({ totalBlogs: blogs.length, blogs });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).send({ message: "Error fetching blogs" });
  }
});

// Get single blog
export const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    res.status(200).send(blog);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).send({ message: "Error fetching blog" });
  }
});

// Create blog (admin)
export const createBlog = asyncHandler(async (req, res) => {
  const { data } = req.body;

  if (!data.title || !data.content || !data.category) {
    return res.status(400).send({ message: "Title, content and category are required" });
  }

  try {
    // Get the highest order number
    const maxOrder = await prisma.blog.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        category: data.category,
        content: data.content,
        summary: data.summary || "",
        image: data.image || "",
        published: data.published !== undefined ? data.published : true,
        order: (maxOrder?.order || 0) + 1,
      },
    });

    res.status(201).send({ message: "Blog created successfully", blog });
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).send({ message: "Error creating blog" });
  }
});

// Update blog (admin)
export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  try {
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: data.title,
        category: data.category,
        content: data.content,
        summary: data.summary,
        image: data.image,
        published: data.published,
      },
    });

    res.status(200).send({ message: "Blog updated successfully", blog });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).send({ message: "Error updating blog" });
  }
});

// Delete blog (admin)
export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.blog.delete({
      where: { id },
    });

    res.status(200).send({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).send({ message: "Error deleting blog" });
  }
});

// Toggle blog publish status (admin)
export const togglePublish = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: { published: !blog.published },
    });

    res.status(200).send({ message: "Blog status updated", blog: updatedBlog });
  } catch (err) {
    console.error("Error toggling blog status:", err);
    res.status(500).send({ message: "Error toggling blog status" });
  }
});

// Reorder blogs (admin)
export const reorderBlogs = asyncHandler(async (req, res) => {
  const { orderedIds } = req.body;

  try {
    const updatePromises = orderedIds.map((id, index) =>
      prisma.blog.update({
        where: { id },
        data: { order: index },
      })
    );

    await Promise.all(updatePromises);

    res.status(200).send({ message: "Blogs reordered successfully" });
  } catch (err) {
    console.error("Error reordering blogs:", err);
    res.status(500).send({ message: "Error reordering blogs" });
  }
});

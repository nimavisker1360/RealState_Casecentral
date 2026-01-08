import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    city,
    country,
    image,
    images,
    facilities,
    propertyType,
    userEmail,
  } = req.body.data;

  console.log("========================================");
  console.log("🏠 Creating Residency...");
  console.log("Title:", title);
  console.log("Address:", address);
  console.log("City:", city);
  console.log("Price:", price);
  console.log("Property Type:", propertyType);
  console.log("Owner Email:", userEmail);
  console.log("Images count:", images?.length || 1);

  try {
    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        address,
        city,
        country,
        image,
        images: images || [image],
        facilities,
        propertyType: propertyType || "sale",
        owner: {
          connect: {
            email: userEmail,
          },
        },
      },
    });

    console.log("✅ Residency created successfully!");
    console.log("Residency ID:", residency.id);
    console.log("========================================");

    res.status(201).send({
      message: "Residency created successfully",
      residency: residency,
    });
  } catch (error) {
    console.log("❌ Error creating residency!");
    console.error("Error details:", error.message);
    console.error("Error code:", error.code);

    if (error.code === "P2002") {
      console.log("⚠️  Duplicate residency detected");
      console.log("========================================");
      return res.status(409).send({
        message: "A residency with this address already exists for this user",
      });
    }

    if (error.code === "P2025") {
      console.log("⚠️  User not found:", userEmail);
      console.log("========================================");
      return res.status(404).send({
        message: "User not found. Please register the user first.",
      });
    }

    console.log("========================================");
    res.status(500).send({
      message: "Error creating residency",
      error: error.message,
    });
  }
});

export const getAllResidencies = asyncHandler(async (req, res) => {
  const residencies = await prisma.residency.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.send(residencies);
});

//get residency by id

export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const residency = await prisma.residency.findUnique({
      where: { id },
    });
    res.send(residency);
  } catch (err) {
    throw new Error(err.message);
  }
});

// Update residency
export const updateResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    address,
    city,
    country,
    image,
    images,
    facilities,
    propertyType,
  } = req.body.data;

  console.log("========================================");
  console.log("🏠 Updating Residency...");
  console.log("Residency ID:", id);
  console.log("Title:", title);
  console.log("Price:", price);

  try {
    const residency = await prisma.residency.update({
      where: { id },
      data: {
        title,
        description,
        price,
        address,
        city,
        country,
        image,
        images: images || [image],
        facilities,
        propertyType: propertyType || "sale",
      },
    });

    console.log("✅ Residency updated successfully!");
    console.log("========================================");

    res.status(200).send({
      message: "Residency updated successfully",
      residency: residency,
    });
  } catch (error) {
    console.log("❌ Error updating residency!");
    console.error("Error details:", error.message);

    if (error.code === "P2025") {
      console.log("⚠️  Residency not found:", id);
      console.log("========================================");
      return res.status(404).send({
        message: "Residency not found",
      });
    }

    console.log("========================================");
    res.status(500).send({
      message: "Error updating residency",
      error: error.message,
    });
  }
});

// Delete residency
export const deleteResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("========================================");
  console.log("🗑️ Deleting Residency...");
  console.log("Residency ID:", id);

  try {
    // First, get all users who have this residency in favorites
    const usersWithFav = await prisma.user.findMany({
      where: {
        favResidenciesID: {
          has: id,
        },
      },
    });

    // Remove residency from each user's favorites
    for (const user of usersWithFav) {
      const updatedFavs = user.favResidenciesID.filter((favId) => favId !== id);
      await prisma.user.update({
        where: { id: user.id },
        data: { favResidenciesID: updatedFavs },
      });
    }

    // Get all users who have bookings (bookedVisits is not empty)
    const usersWithBookings = await prisma.user.findMany({
      where: {
        bookedVisits: {
          isEmpty: false,
        },
      },
    });

    // Filter and update users who have this residency booked
    for (const user of usersWithBookings) {
      const hasBooking = user.bookedVisits.some((booking) => booking.id === id);
      if (hasBooking) {
        const updatedBookings = user.bookedVisits.filter(
          (booking) => booking.id !== id
        );
        await prisma.user.update({
          where: { id: user.id },
          data: { bookedVisits: updatedBookings },
        });
      }
    }

    // Delete the residency
    const residency = await prisma.residency.delete({
      where: { id },
    });

    console.log("✅ Residency deleted successfully!");
    console.log("========================================");

    res.status(200).send({
      message: "Residency deleted successfully",
      residency: residency,
    });
  } catch (error) {
    console.log("❌ Error deleting residency!");
    console.error("Error details:", error.message);

    if (error.code === "P2025") {
      console.log("⚠️  Residency not found:", id);
      console.log("========================================");
      return res.status(404).send({
        message: "Residency not found",
      });
    }

    console.log("========================================");
    res.status(500).send({
      message: "Error deleting residency",
      error: error.message,
    });
  }
});

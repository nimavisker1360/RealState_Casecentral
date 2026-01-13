import asyncHandler from "express-async-handler";
import { prisma, getMongoDb } from "../config/prismaConfig.js";
import { ObjectId } from "mongodb";

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
    category,
    userEmail,
    consultantId,
  } = req.body.data;

  console.log("========================================");
  console.log("🏠 Creating Residency...");
  console.log("Title:", title);
  console.log("Address:", address);
  console.log("City:", city);
  console.log("Price:", price);
  console.log("Property Type:", propertyType);
  console.log("Category:", category);
  console.log("Owner Email:", userEmail);
  console.log("Consultant ID:", consultantId || "Not assigned");
  console.log("Images count:", images?.length || 1);

  try {
    // Use MongoDB directly to support all fields including category
    const db = await getMongoDb();

    // First check if user exists
    const user = await db.collection("User").findOne({ email: userEmail });
    if (!user) {
      console.log("⚠️  User not found:", userEmail);
      console.log("========================================");
      return res.status(404).send({
        message: "User not found. Please register the user first.",
      });
    }

    const residencyData = {
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
      category: category || "residential",
      userEmail,
      consultantId: consultantId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("Residency").insertOne(residencyData);

    // Get the created residency
    const residency = await db
      .collection("Residency")
      .findOne({ _id: result.insertedId });
    residency.id = residency._id.toString();
    delete residency._id;

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

    if (error.code === 11000) {
      console.log("⚠️  Duplicate residency detected");
      console.log("========================================");
      return res.status(409).send({
        message: "A residency with this address already exists for this user",
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
  try {
    // Use MongoDB directly to get all fields including new ones
    const db = await getMongoDb();
    const residencies = await db
      .collection("Residency")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Transform _id to id for consistency
    const transformed = residencies.map((r) => {
      r.id = r._id.toString();
      delete r._id;
      return r;
    });

    res.send(transformed);
  } catch (err) {
    throw new Error(err.message);
  }
});

//get residency by id

export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // Use MongoDB directly to get all fields including new ones
    const db = await getMongoDb();
    const residency = await db.collection("Residency").findOne({
      _id: new ObjectId(id),
    });

    if (residency) {
      // Transform _id to id for consistency
      residency.id = residency._id.toString();
      delete residency._id;

      // Fetch consultant if consultantId exists
      if (residency.consultantId) {
        try {
          const consultant = await db.collection("Consultant").findOne({
            _id: new ObjectId(residency.consultantId),
          });
          if (consultant) {
            consultant.id = consultant._id.toString();
            delete consultant._id;
            residency.consultant = consultant;
          }
        } catch (e) {
          console.log("Error fetching consultant:", e.message);
        }
      }
    }

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
    category,
    consultantId,
    interiorFeatures,
    exteriorFeatures,
  } = req.body.data;

  console.log("========================================");
  console.log("🏠 Updating Residency...");
  console.log("Residency ID:", id);
  console.log("Title:", title);
  console.log("Price:", price);
  console.log("Category:", category);
  console.log("Interior Features:", interiorFeatures?.length || 0);
  console.log("Exterior Features:", exteriorFeatures?.length || 0);

  try {
    // Use MongoDB directly to update all fields including new ones
    const db = await getMongoDb();
    const updateData = {
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
      category: category || "residential",
      consultantId: consultantId || null,
      interiorFeatures: interiorFeatures || [],
      exteriorFeatures: exteriorFeatures || [],
      updatedAt: new Date(),
    };

    console.log("Consultant ID:", consultantId || "Not assigned");

    const result = await db
      .collection("Residency")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      console.log("⚠️  Residency not found:", id);
      console.log("========================================");
      return res.status(404).send({
        message: "Residency not found",
      });
    }

    console.log("✅ Residency updated successfully!");
    console.log("========================================");

    // Fetch the updated document
    const residency = await db
      .collection("Residency")
      .findOne({ _id: new ObjectId(id) });
    residency.id = residency._id.toString();
    delete residency._id;

    res.status(200).send({
      message: "Residency updated successfully",
      residency: residency,
    });
  } catch (error) {
    console.log("❌ Error updating residency!");
    console.error("Error details:", error.message);

    console.log("========================================");
    res.status(500).send({
      message: "Error updating residency",
      error: error.message,
    });
  }
});

// Get residencies by consultant
export const getResidenciesByConsultant = asyncHandler(async (req, res) => {
  const { consultantId } = req.params;
  try {
    const residencies = await prisma.residency.findMany({
      where: { consultantId },
      orderBy: { createdAt: "desc" },
    });
    res.send(residencies);
  } catch (err) {
    throw new Error(err.message);
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

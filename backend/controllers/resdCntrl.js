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
    facilities,
    userEmail,
  } = req.body.data;

  console.log("========================================");
  console.log("🏠 Creating Residency...");
  console.log("Title:", title);
  console.log("Address:", address);
  console.log("City:", city);
  console.log("Price:", price);
  console.log("Owner Email:", userEmail);

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
        facilities,
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
      where: {id},
    });
    res.send(residency);
  } catch (err) {
    throw new Error(err.message);
  }
});

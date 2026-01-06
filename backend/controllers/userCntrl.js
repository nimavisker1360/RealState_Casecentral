import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createUser = asyncHandler(async (req, res) => {
  console.log("========================================");
  console.log("📝 Creating User...");
  console.log("Received data:", req.body);

  let { email } = req.body;

  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (!userExists) {
    console.log("✅ User does not exist. Creating new user...");
    const user = await prisma.user.create({ data: req.body });
    console.log("✅ User created successfully:", user);

    res.send({
      message: "User registered successfully",
      user: user,
    });
  } else {
    console.log("ℹ️ User already exists in database");
    res.status(201).send({
      message: "User already registered",
    });
  }
});
//book visit

export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      return res.status(400).json({
        message: "This residency visit is already booked",
      });
    }

    await prisma.user.update({
      where: { email: email },
      data: {
        bookedVisits: { push: { id, date } },
      },
    });

    res.send("Visit booked successfully");
  } catch (err) {
    throw new Error(err.message);
  }
});
//all bookings

export const allBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        bookedVisits: true,
      },
    });

    res.status(200).send(bookings);
  } catch (err) {
    throw new Error(err.message);
  }
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });
    const index = user.bookedVisits.findIndex((visit) => visit.id === id);
    if (index === -1) {
      return res.status(400).json({
        message: "Booking not found",
      });
    } else {
      user.bookedVisits.splice(index, 1);
      await prisma.user.update({
        where: { email },
        data: { bookedVisits: user.bookedVisits },
      });
      res.send("Booking cancelled successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// to add fav residencies

export const toFav = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { rid } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (user.favResidenciesID.includes(rid)) {
      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id !== rid),
          },
        },
      });
      res.send({
        message: "Residency removed from favorites successfully",
        user: updatedUser,
      });
    } else {
      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: {
          favResidenciesID: { push: rid },
        },
      });
      res.send({
        message: "Residency added to favorites successfully",
        user: updatedUser,
      });
    }
  } catch (err) {
    throw new Error(err);
  }
});
// to get all fav list
export const getAllFav = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const favResd = await prisma.user.findUnique({
      where: { email: email },
      select: { favResidenciesID: true },
    });
    res.status(200).send(favResd);
  } catch (err) {
    throw new Error(err.message);
  }
});

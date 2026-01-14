import express from "express";
import { sendEmail } from "../controllers/emailCntrl.js";

const router = express.Router();

// POST /api/email/send
router.post("/send", sendEmail);

export { router as emailRoute };

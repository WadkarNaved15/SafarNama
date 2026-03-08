import express from "express";
import { createChat } from "../functions/chat.js";
import {authenticateToken} from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", authenticateToken, createChat);

export default router;
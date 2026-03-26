import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ethers } from "ethers";
import { PinataSDK } from "pinata";
import crypto from "crypto";
import fs from "fs";
import { File } from "node:buffer";
import mongoose from "mongoose";
import { contractABI } from "./contractABI.js";
import AuthRouter from "./routes/auth.js";
import AdminRouter from "./routes/admin.js";
import DestinationRouter from "./routes/Destination.js";
import PackageRouter from "./routes/Package.js";
import TestimonialRouter from "./routes/Testimonial.js";
import AgentRouter from "./routes/Agent.js";
import TranslationRouter from "./routes/translation.js";
import BookingRouter from "./routes/Booking.js";
import SafeRouteRouter from "./routes/safeRoute.js";
import ChatRouter from "./routes/chat.js";
import uploadRoutes from "./routes/imageUpload.js";



import { Server } from "socket.io";
import { createServer } from "http";
import { initializeSocket } from "./sockets/socket.server.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist_safety');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/admin', AdminRouter);
app.use('/api/v1/destinations', DestinationRouter);
app.use('/api/v1/packages', PackageRouter);
app.use('/api/v1/testimonials', TestimonialRouter);
app.use('/api/v1/agents', AgentRouter);
app.use('/api/v1/translation', TranslationRouter);
app.use('/api/v1/bookings', BookingRouter);
app.use('/api/v1/safe-route', SafeRouteRouter);
app.use('/api/v1/chat', ChatRouter);
app.use("/api/v1/upload", uploadRoutes);



const httpServer = createServer(app);


 initializeSocket(httpServer);



httpServer.listen(4000, () => console.log("✅ Backend running on port 4000"));


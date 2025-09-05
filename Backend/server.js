import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import TranslationRoutes from "./src/routes/Translation.js";
import DestinationRoutes from "./src/routes/Destination.js";
import PackageRoutes from "./src/routes/Package.js";
import AgentRoutes from "./src/routes/Agent.js";
import TestimonialRoutes from "./src/routes/Testimonial.js";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
console.log("🌐 Frontend URL:", FRONTEND_URL);


const app = express();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

app.use(cors(
    { origin: FRONTEND_URL }
));
app.use(express.json());

// Routes
app.use("/api/v1/translate", TranslationRoutes);
app.use("/api/v1/destinations", DestinationRoutes);
app.use("/api/v1/packages", PackageRoutes);
app.use("/api/v1/agents",AgentRoutes);
app.use("/api/v1/testimonials",TestimonialRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

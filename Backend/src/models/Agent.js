// models/Agent.ts
import mongoose, { Schema, Document } from "mongoose";


const AgentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true },
  verified: { type: Boolean, default: false },
  specialties: [{ type: String }],
  languages: [{ type: String }],
  experience: { type: Number, required: true },
  avatar: { type: String },
  packages: [{ type: Schema.Types.ObjectId, ref: "Package" }], // linking packages
});

export default mongoose.model("Agent", AgentSchema);

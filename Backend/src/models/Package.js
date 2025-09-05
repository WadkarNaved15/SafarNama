import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true },
  image: { type: String, required: true },
  highlights: [{ type: String }],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  itinerary: [
    {
      day: { type: Number, required: true },
      title: { type: String, required: true },
      description: { type: String },
      activities: [{ type: String }],
      meals: [{ type: String }],
      accommodation: { type: String },
    },
  ],
  gallery: [{ type: String }],
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  groupSize: { type: String, required: true },
  languages: [{ type: String }],
  cancellation: { type: String, required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
  agentName: { type: String, required: true },
  agentRating: { type: Number, required: true },
  availability: [
    {
      date: { type: String, required: true },
      available: { type: Boolean, required: true },
      price: { type: Number, required: true },
    },
  ],
});

export default mongoose.model("Package", PackageSchema);

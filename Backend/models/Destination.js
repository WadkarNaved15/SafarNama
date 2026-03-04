import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  id: String,
  name: String,
  country: String,
  region: String,
  theme: String,
  season: String,
  image: String,
  rating: Number,
  reviews: Number,
  description: String,
  highlights: [String],
  bestTime: String,
  duration: String,
  price: Number,
  gallery: [String],
  activities: [String],
  localTips: [String],
  weather: {
    temperature: String,
    condition: String,
  },
  safety: {
    level: String,
    alerts: [String],
  },
});

export default mongoose.model("Destination", destinationSchema);

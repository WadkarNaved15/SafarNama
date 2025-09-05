import mongoose from "mongoose";
import Testimonials from "./src/models/Testimonials.js";

const MONGO_URI = "mongodb+srv://navedwadkar:Naved%40123@instagram.cbzhjlt.mongodb.net/SafarNama?retryWrites=true&w=majority&appName=Instagram";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    rating: 5,
    text: "Absolutely incredible experience! The Greek Islands package exceeded all expectations. Every detail was perfectly planned, and our guide was knowledgeable and friendly. The sunset cruise was magical!",
    trip: "Greek Islands Paradise"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Toronto, Canada",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
    rating: 5,
    text: "The Japan Cultural Journey was life-changing. From the bustling streets of Tokyo to the serene temples of Kyoto, every moment was unforgettable. The ryokan experience was authentic and beautiful.",
    trip: "Japan Cultural Journey"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "Madrid, Spain",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    rating: 5,
    text: "The Canadian Rockies adventure was breathtaking! Lake Louise was even more beautiful than the photos. Our guide ensured we saw wildlife and the glacier hike was challenging but rewarding.",
    trip: "Canadian Rockies Adventure"
  }
];

// --- Insert into DB ---
async function seedPackages() {
  try {
    await mongoose.connect(MONGO_URI);
    await Testimonials.deleteMany({});
    await Testimonials.insertMany(testimonials);
    console.log("✅ Packages data inserted successfully");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding packages:", err);
    mongoose.connection.close();
  }
}

seedPackages();
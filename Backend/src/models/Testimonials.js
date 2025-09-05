// models/Testimonial.ts
import mongoose from "mongoose";


const TestimonialSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  trip: { type: String, required: true },
});

export default mongoose.model("Testimonial", TestimonialSchema);

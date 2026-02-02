import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    category: {
      type: String,
      enum: ["Appetizer", "Main Course", "Dessert", "Beverage"],
      required: true,
    },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

menuSchema.index({ name: "text" });

export default mongoose.model("MenuItem", menuSchema);

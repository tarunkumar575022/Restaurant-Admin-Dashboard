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
    ingredients: [{ type: String, trim: true }], 
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

menuSchema.index({ name: "text", ingredients: "text"  });

export default mongoose.model("MenuItem", menuSchema);

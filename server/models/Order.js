import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: String,
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
        quantity: Number,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "delivered", "cancelled"],
      default: "pending",
    },
    totalAmount: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

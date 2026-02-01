import dotenv from "dotenv";
import mongoose from "mongoose";
import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  await MenuItem.deleteMany({});
  await Order.deleteMany({});

  const menu = await MenuItem.insertMany([
    { name: "Paneer Tikka", category: "Appetizer", price: 220, isAvailable: true },
    { name: "Butter Chicken", category: "Main Course", price: 320, isAvailable: true },
    { name: "Gulab Jamun", category: "Dessert", price: 120, isAvailable: true },
    { name: "Cold Coffee", category: "Beverage", price: 150, isAvailable: false }
  ]);

  await Order.insertMany([
    {
      customerName: "Rahul",
      status: "pending",
      items: [{ menuItem: menu[0]._id, quantity: 2 }],
      totalAmount: 440
    },
    {
      customerName: "Aisha",
      status: "preparing",
      items: [{ menuItem: menu[1]._id, quantity: 1 }],
      totalAmount: 320
    }
  ]);

  console.log("✅ Seed completed");
  await mongoose.disconnect();
}

seed().catch(console.error);

import MenuItem from "../models/MenuItem.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const getMenu = async (req, res) => {
  const { q } = req.query;
  const filter = q ? { $text: { $search: q } } : {};
  const data = await MenuItem.find(filter).sort({ createdAt: -1 });
  res.json(data);
};

export const createMenu = async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json(item);
};

export const updateMenu = async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
};

export const deleteMenu = async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

export const toggleAvailability = async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  item.isAvailable = !item.isAvailable;
  await item.save();
  res.json(item);
};

export const generateDescription = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Item name is required" });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API Key is not configured." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `Write a short, appetizing, 1-2 sentence description for a restaurant menu item called "${name}". Make it sound professional and mouth-watering. Do not include quotes around the description.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    res.json({ description: text });
  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({ message: "Failed to generate description" });
  }
};

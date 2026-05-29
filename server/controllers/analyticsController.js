import Order from "../models/Order.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const topSellers = async (req, res) => {
  const data = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.menuItem",
        totalQty: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalQty: -1 } },
    { $limit: 5 },
  ]);
  res.json(data);
};

export const generateAIInsights = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API Key is not configured." });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("items.menuItem", "name price category");

    const summary = {
      totalOrders: orders.length,
      revenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      itemsSold: {},
      orderHours: {}
    };

    orders.forEach(o => {
      const hour = new Date(o.createdAt).getHours();
      summary.orderHours[hour] = (summary.orderHours[hour] || 0) + 1;
      
      o.items.forEach(i => {
        if (i.menuItem) {
          const name = i.menuItem.name;
          summary.itemsSold[name] = (summary.itemsSold[name] || 0) + i.quantity;
        }
      });
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `Act as a restaurant business analyst. I am providing you with a JSON summary of our recent orders. 
Analyze this data and provide exactly 4 concise, punchy bullet points of insights. 
Focus on:
1. Peak hour trends (0 is midnight, 23 is 11 PM)
2. Best seller and its performance
3. Slow mover and a quick suggestion (e.g., consider discount)
4. Revenue insights

Format the response as exactly 4 simple markdown bullet points starting with "- ". Do not include introductory text.

Data: ${JSON.stringify(summary)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    res.json({ insights: text });
  } catch (err) {
    console.error("AI Insights Error:", err);
    res.status(500).json({ message: "Failed to generate insights" });
  }
};

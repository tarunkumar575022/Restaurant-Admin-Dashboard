import Order from "../models/Order.js";

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

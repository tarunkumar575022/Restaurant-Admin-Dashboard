import Order from "../models/Order.js";

export const getOrders = async (req, res) => {
  const orders = await Order.find().populate("items.menuItem");
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(order);
};

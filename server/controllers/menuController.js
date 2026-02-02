import MenuItem from "../models/MenuItem.js";

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

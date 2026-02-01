import { Pencil, Trash2 } from "lucide-react";

export default function MenuCard({ item, onToggle, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{item.name}</h3>
          <span className="text-xs rounded-full px-2 py-1 bg-gray-100 text-gray-700">
            {item.category}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">₹ {item.price}</p>

        <button
          onClick={() => onToggle(item._id, item.isAvailable)}
          className={`mt-3 inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium ${
            item.isAvailable
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          {item.isAvailable ? "Available" : "Unavailable"}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(item)}
          className="p-2 rounded-lg hover:bg-gray-100"
          title="Edit"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="p-2 rounded-lg hover:bg-gray-100"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

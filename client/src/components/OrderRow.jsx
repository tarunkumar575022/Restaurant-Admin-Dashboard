export default function OrderRow({ order, onStatusChange }) {
  return (
    <tr className="border-b">
      <td className="p-3 text-sm">{order.customerName}</td>
      <td className="p-3 text-sm">
        {order.items?.map((it) => (
          <div key={it._id} className="text-gray-700">
            {it.menuItem?.name} × {it.quantity}
          </div>
        ))}
      </td>
      <td className="p-3 text-sm font-medium">₹ {order.totalAmount}</td>
      <td className="p-3 text-sm">
        <select
          className="border rounded-lg px-2 py-1"
          value={order.status}
          onChange={(e) => onStatusChange(order._id, e.target.value)}
        >
          <option value="pending">pending</option>
          <option value="preparing">preparing</option>
          <option value="ready">ready</option>
          <option value="delivered">delivered</option>
          <option value="cancelled">cancelled</option>
        </select>
      </td>
    </tr>
  );
}

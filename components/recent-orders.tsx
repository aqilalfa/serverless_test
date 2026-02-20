export function RecentOrders() {
  const recentOrders = [
    {
      id: "ORD-001",
      customer: "PT Mebel Indah",
      product: "Spring Mattress",
      quantity: 50,
      status: "In Production",
      date: "2025-12-05",
    },
    {
      id: "ORD-002",
      customer: "Toko Furniture",
      product: "Latex Pillow",
      quantity: 100,
      status: "Completed",
      date: "2025-12-04",
    },
    {
      id: "ORD-003",
      customer: "Hotel Bintang 5",
      product: "Bedding Set",
      quantity: 30,
      status: "In Production",
      date: "2025-12-03",
    },
    {
      id: "ORD-004",
      customer: "Distributor Jaya",
      product: "Spring Mattress",
      quantity: 75,
      status: "Pending",
      date: "2025-12-02",
    },
  ]

  const statusColors = {
    Completed: "bg-green-100 text-green-800",
    "In Production": "bg-blue-100 text-blue-800",
    Pending: "bg-yellow-100 text-yellow-800",
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{order.id}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{order.product}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{order.quantity}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

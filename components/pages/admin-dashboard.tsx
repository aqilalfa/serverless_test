"use client"

import { ShoppingCart, Zap, CheckCircle, Package, Boxes } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { RecentOrders } from "@/components/recent-orders"

export function AdminDashboard() {
  const stats = [
    {
      title: "Total Orders",
      value: "48",
      icon: ShoppingCart,
      color: "secondary" as const,
    },
    {
      title: "Orders In Production",
      value: "12",
      icon: Zap,
      color: "accent" as const,
    },
    {
      title: "Completed Orders",
      value: "36",
      icon: CheckCircle,
      color: "secondary" as const,
    },
    {
      title: "Total Raw Materials",
      value: "2,450 kg",
      icon: Package,
      color: "accent" as const,
    },
    {
      title: "Finished Products",
      value: "1,280 units",
      icon: Boxes,
      color: "secondary" as const,
    },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Welcome to SPICE Production System</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <RecentOrders />
    </div>
  )
}

"use client"

import { Package, ShoppingCart, CheckCircle } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { RecentOrders } from "@/components/recent-orders"

export function Dashboard() {
  const stats = [
    {
      title: "Total Orders",
      value: "48",
      icon: ShoppingCart,
      color: "secondary",
    },
    {
      title: "Orders In Production",
      value: "12",
      icon: Zap,
      color: "accent",
    },
    {
      title: "Completed Orders",
      value: "36",
      icon: CheckCircle,
      color: "secondary",
    },
    {
      title: "Total Raw Materials",
      value: "2,450 kg",
      icon: Package,
      color: "accent",
    },
    {
      title: "Finished Products",
      value: "1,280 units",
      icon: Boxes,
      color: "secondary",
    },
  ]

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to SPICE Production System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <RecentOrders />
    </div>
  )
}

const Zap = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z" />
  </svg>
)

const Boxes = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <polyline points="12 22.08 12 12" />
  </svg>
)

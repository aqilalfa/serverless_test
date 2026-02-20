"use client"

import { Zap, CheckCircle, Clock } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface OperatorProduksiDashboardProps {
  onPageChange: (page: string) => void
  currentPage: string
}

export function OperatorProduksiDashboard({ onPageChange, currentPage }: OperatorProduksiDashboardProps) {
  const stats = [
    {
      title: "Orders In Production",
      value: "12",
      icon: Zap,
      color: "accent" as const,
    },
    {
      title: "Completed Today",
      value: "5",
      icon: CheckCircle,
      color: "secondary" as const,
    },
    {
      title: "Tasks Today",
      value: "18",
      icon: Clock,
      color: "secondary" as const,
    },
  ]

  const productionTasks = [
    {
      id: 1,
      orderID: "ORD-001",
      product: "Atasan Wanita",
      quantity: 50,
      stage: "Cutting",
      deadline: "2025-12-08",
    },
    {
      id: 2,
      orderID: "ORD-002",
      product: "Gamis Kerah Motif",
      quantity: 30,
      stage: "Sewing",
      deadline: "2025-12-09",
    },
    {
      id: 3,
      orderID: "ORD-003",
      product: "Set Hem Polos",
      quantity: 75,
      stage: "Finishing",
      deadline: "2025-12-10",
    },
  ]

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Production Dashboard</h1>
        <p className="text-muted-foreground">Track and manage production tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <Card className="rounded-xl border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Orders Requiring Status Update</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Current Stage</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Deadline</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {productionTasks.map((task) => (
                <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{task.orderID}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{task.product}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{task.quantity}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-semibold">
                      {task.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{task.deadline}</td>
                  <td className="px-6 py-4 text-sm">
                    <Button
                      onClick={() => onPageChange("production")}
                      size="sm"
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg"
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

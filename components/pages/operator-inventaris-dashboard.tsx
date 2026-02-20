"use client"

import { Package, AlertCircle, Boxes } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface OperatorInventarisDashboardProps {
  onPageChange: (page: string) => void
  currentPage: string
}

export function OperatorInventarisDashboard({ onPageChange, currentPage }: OperatorInventarisDashboardProps) {
  const stats = [
    {
      title: "Raw Material Stock",
      value: "2,450 kg",
      icon: Package,
      color: "accent" as const,
    },
    {
      title: "Low-Stock Alerts",
      value: "5",
      icon: AlertCircle,
      color: "secondary" as const,
    },
    {
      title: "Finished Product Stock",
      value: "1,280 units",
      icon: Boxes,
      color: "secondary" as const,
    },
  ]

  const lowStockItems = [
    {
      id: 1,
      material: "Cotton Twill",
      stock: 50,
      unit: "kg",
      reorderLevel: 200,
      status: "Critical",
    },
    {
      id: 2,
      material: "Rayon Fabric",
      stock: 120,
      unit: "kg",
      reorderLevel: 300,
      status: "Low",
    },
    {
      id: 3,
      material: "Linen",
      stock: 80,
      unit: "kg",
      reorderLevel: 150,
      status: "Low",
    },
  ]

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Inventory Dashboard</h1>
        <p className="text-muted-foreground">Monitor stock levels and manage inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <Card className="rounded-xl border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Low Stock Alerts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Material Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Current Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Reorder Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lowStockItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{item.material}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {item.stock} {item.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {item.reorderLevel} {item.unit}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "Critical"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-secondary/20 text-secondary"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Button
                      onClick={() => onPageChange("raw-materials")}
                      size="sm"
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg"
                    >
                      Add Stock
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

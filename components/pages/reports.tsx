"use client"

import { useState } from "react"
import { FileDown, BarChart3 } from "lucide-react"

export function Reports() {
  const [reportType, setReportType] = useState("production")

  const productionReport = [
    {
      date: "2025-12-05",
      orders: 12,
      completed: 8,
      inProgress: 4,
      avgTime: "2.5 days",
    },
    {
      date: "2025-12-04",
      orders: 10,
      completed: 10,
      inProgress: 0,
      avgTime: "2.2 days",
    },
    {
      date: "2025-12-03",
      orders: 15,
      completed: 13,
      inProgress: 2,
      avgTime: "2.8 days",
    },
  ]

  const stockReport = [
    {
      material: "Spring Coil",
      beginning: 1400,
      used: 200,
      purchased: 0,
      ending: 1200,
      value: 120000000,
    },
    {
      material: "Latex Foam",
      beginning: 950,
      used: 100,
      purchased: 0,
      ending: 850,
      value: 42500000,
    },
    {
      material: "Cotton Fabric",
      beginning: 500,
      used: 50,
      purchased: 0,
      ending: 450,
      value: 9000000,
    },
  ]

  const usageReport = [
    {
      product: "Spring Mattress",
      produced: 50,
      sold: 45,
      inventory: 35,
      revenue: 112500000,
    },
    {
      product: "Latex Pillow",
      produced: 100,
      sold: 80,
      inventory: 120,
      revenue: 36000000,
    },
    {
      product: "Bedding Set",
      produced: 30,
      sold: 25,
      inventory: 28,
      revenue: 80000000,
    },
    {
      product: "Memory Foam Topper",
      produced: 45,
      sold: 40,
      inventory: 45,
      revenue: 72000000,
    },
  ]

  const handleExportPDF = () => {
    console.log("[v0] Export PDF clicked for report type:", reportType)
    alert(`PDF export for ${reportType} report would be generated`)
  }

  const handleGenerateReport = () => {
    console.log("[v0] Generate report clicked for type:", reportType)
    alert(`${reportType} report has been generated successfully`)
  }

  const renderReport = () => {
    switch (reportType) {
      case "production":
        return (
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Production Report</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Total Orders</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Completed</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">In Progress</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Avg. Production Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {productionReport.map((row) => (
                    <tr key={row.date} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{row.date}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{row.orders}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-green-600 font-medium">{row.completed}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-blue-600 font-medium">{row.inProgress}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{row.avgTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      case "stock":
        return (
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Stock Report</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Material</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Beginning</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Used</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Purchased</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ending</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stockReport.map((row) => (
                    <tr key={row.material} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{row.material}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{row.beginning}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{row.used}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{row.purchased}</td>
                      <td className="px-6 py-4 text-sm font-medium text-secondary">{row.ending}</td>
                      <td className="px-6 py-4 text-sm font-medium">Rp {(row.value / 1000000).toFixed(1)}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      case "usage":
        return (
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Usage Report</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Produced</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Sold</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Inventory</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {usageReport.map((row) => (
                    <tr key={row.product} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{row.product}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{row.produced} units</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{row.sold} units</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{row.inventory} units</td>
                      <td className="px-6 py-4 text-sm font-medium text-secondary">
                        Rp {(row.revenue / 1000000).toFixed(1)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Laporan</h1>
        <p className="text-muted-foreground">View and export production and inventory reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">Select Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="production">Production Report</option>
            <option value="stock">Stock Report</option>
            <option value="usage">Usage Report</option>
          </select>
        </div>
        <button
          onClick={handleExportPDF}
          className="md:col-span-1 bg-secondary text-secondary-foreground px-4 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 mt-6"
        >
          <FileDown size={20} />
          Export PDF
        </button>
        <button
          onClick={handleGenerateReport}
          className="md:col-span-1 bg-primary text-primary-foreground px-4 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-6"
        >
          <BarChart3 size={20} />
          Generate
        </button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border p-6">{renderReport()}</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Production</p>
          <p className="text-3xl font-bold text-foreground">225 units</p>
          <p className="text-xs text-muted-foreground mt-2">This period</p>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">Completion Rate</p>
          <p className="text-3xl font-bold text-secondary">89%</p>
          <p className="text-xs text-muted-foreground mt-2">On-time delivery</p>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">Revenue</p>
          <p className="text-3xl font-bold text-accent">Rp 300.5M</p>
          <p className="text-xs text-muted-foreground mt-2">Total sales</p>
        </div>
      </div>
    </div>
  )
}

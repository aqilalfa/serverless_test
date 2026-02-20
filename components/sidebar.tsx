"use client"

import { LayoutDashboard, ShoppingCart, Zap, Package, Boxes, BarChart3, Settings, Grid3x3 } from "lucide-react"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  userRole?: "admin" | "operator-produksi" | "operator-inventaris" | null
  onLogout?: () => void
}

export function Sidebar({ currentPage, onPageChange, userRole = "admin", onLogout }: SidebarProps) {
  const getMenuItems = () => {
    if (userRole === "operator-produksi") {
      return [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "production", label: "Update Status", icon: Zap },
        { id: "production-tasks", label: "Production Tasks", icon: ShoppingCart },
        { id: "product-catalog-view", label: "Product Catalog", icon: Grid3x3 },
      ]
    }
    if (userRole === "operator-inventaris") {
      return [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "raw-materials", label: "Raw Materials", icon: Package },
        { id: "finished-products", label: "Finished Products", icon: Boxes },
        { id: "material-usage", label: "Material Usage Log", icon: BarChart3 },
      ]
    }
    // Admin menu
    return [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "orders", label: "Orders", icon: ShoppingCart },
      { id: "production", label: "Production Status", icon: Zap },
      { id: "raw-materials", label: "Raw Materials", icon: Package },
      { id: "finished-products", label: "Finished Products", icon: Boxes },
      { id: "product-catalog", label: "Product Catalog", icon: Grid3x3 },
      { id: "reports", label: "Reports", icon: BarChart3 },
      { id: "settings", label: "Settings", icon: Settings },
    ]
  }

  const menuItems = getMenuItems()

  return (
    <aside className="hidden sm:flex w-64 lg:w-72 bg-sidebar text-sidebar-foreground shadow-lg flex-col">
      <div className="p-4 sm:p-6 border-b border-sidebar-border">
        <h1 className="text-xl sm:text-2xl font-bold text-sidebar-primary">SPICE</h1>
        <p className="text-xs text-sidebar-foreground/70 mt-1">Production & Inventory</p>
      </div>

      <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-border"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-3 sm:p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/60">
        <p>© 2025 SPICE</p>
      </div>
    </aside>
  )
}

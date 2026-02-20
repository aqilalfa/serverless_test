"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { AdminDashboard } from "@/components/pages/admin-dashboard"
import { OperatorProduksiDashboard } from "@/components/pages/operator-produksi-dashboard"
import { OperatorInventarisDashboard } from "@/components/pages/operator-inventaris-dashboard"
import { ProductCatalog } from "@/components/pages/product-catalog"
import { OrderInput } from "@/components/pages/order-input"
import { ProductionStatus } from "@/components/pages/production-status"
import { RawMaterialsStock } from "@/components/pages/raw-materials-stock"
import { FinishedGoodsStock } from "@/components/pages/finished-goods-stock"
import { Reports } from "@/components/pages/reports"
import { TopBar } from "@/components/top-bar"
import { Settings } from "@/components/pages/settings"

interface AppLayoutProps {
  userRole: "admin" | "operator-produksi" | "operator-inventaris" | null
  onLogout: () => void
}

export function AppLayout({ userRole, onLogout }: AppLayoutProps) {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderPage = () => {
    if (userRole === "admin") {
      switch (currentPage) {
        case "orders":
          return <OrderInput />
        case "production":
          return <ProductionStatus />
        case "raw-materials":
          return <RawMaterialsStock />
        case "finished-products":
          return <FinishedGoodsStock />
        case "product-catalog":
          return <ProductCatalog />
        case "reports":
          return <Reports />
        case "settings":
          return <Settings userRole={userRole} onLogout={onLogout} />
        default:
          return <AdminDashboard />
      }
    } else if (userRole === "operator-produksi") {
      switch (currentPage) {
        case "production":
          return <ProductionStatus />
        case "production-tasks":
          return <OrderInput />
        case "product-catalog-view":
          return <ProductCatalog />
        default:
          return <OperatorProduksiDashboard onPageChange={setCurrentPage} currentPage={currentPage} />
      }
    } else if (userRole === "operator-inventaris") {
      switch (currentPage) {
        case "raw-materials":
          return <RawMaterialsStock />
        case "finished-products":
          return <FinishedGoodsStock />
        case "material-usage":
          return <Reports />
        default:
          return <OperatorInventarisDashboard onPageChange={setCurrentPage} currentPage={currentPage} />
      }
    }
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} userRole={userRole} onLogout={onLogout} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  )
}

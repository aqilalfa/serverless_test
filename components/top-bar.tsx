"use client"

import { Button } from "@/components/ui/button"

interface TopBarProps {
  userRole: "admin" | "operator-produksi" | "operator-inventaris" | null
  onLogout: () => void
}

export function TopBar({ userRole, onLogout }: TopBarProps) {
  const roleLabel = {
    admin: "Admin / Owner",
    "operator-produksi": "Operator Produksi",
    "operator-inventaris": "Operator Inventaris",
  }

  return (
    <div className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-primary-foreground">S</span>
        </div>
        <span className="text-sm font-medium text-foreground">{roleLabel[userRole || "admin"]}</span>
      </div>
      <Button variant="outline" size="sm" onClick={onLogout} className="rounded-lg bg-transparent">
        Logout
      </Button>
    </div>
  )
}

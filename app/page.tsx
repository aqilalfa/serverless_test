"use client"

import { useState } from "react"
import { LoginPage } from "@/components/pages/login"
import { AppLayout } from "@/components/app-layout"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"admin" | "operator-produksi" | "operator-inventaris" | null>(null)

  const handleLogin = (role: "admin" | "operator-produksi" | "operator-inventaris") => {
    setUserRole(role)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserRole(null)
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <AppLayout userRole={userRole} onLogout={handleLogout} />
}

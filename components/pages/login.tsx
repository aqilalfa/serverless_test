"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface LoginPageProps {
  onLogin: (role: "admin" | "operator-produksi" | "operator-inventaris") => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState("admin")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(selectedRole as "admin" | "operator-produksi" | "operator-inventaris")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 rounded-2xl border-0 shadow-lg">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary-foreground">SPICE</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">SPICE</h1>
            <p className="text-sm text-muted-foreground">Production & Inventory Control Engine</p>
            <p className="text-xs text-muted-foreground mt-2">Sleep.You Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border-border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border-border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Select Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
              >
                <option value="admin">Admin / Owner</option>
                <option value="operator-produksi">Operator Produksi</option>
                <option value="operator-inventaris">Operator Inventaris</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 font-semibold text-base h-auto"
            >
              Login
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l6.894-10.842"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Demo credentials - Use any email/password to login
        </p>
      </div>
    </div>
  )
}

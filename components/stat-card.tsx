import type React from "react"

interface StatCardProps {
  title: string
  value: string
  icon: React.ComponentType<{ size: number }>
  color: "primary" | "secondary" | "accent"
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/20 text-secondary",
  accent: "bg-accent/20 text-accent",
}

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      <p className="text-muted-foreground text-sm font-medium mb-2">{title}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  )
}

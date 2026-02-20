"use client"

import { useState, useEffect } from "react"
import { Edit2, CheckCircle, Wifi, WifiOff } from "lucide-react"
import { supabase, type ProductionOrder } from "@/lib/supabase"

export function ProductionStatus() {
  const [productions, setProductions] = useState<ProductionOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [isRealtime, setIsRealtime] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const statuses = ["Cutting", "Sewing", "Finishing", "Completed"]

  const statusColors: Record<string, string> = {
    Cutting: "bg-yellow-100 text-yellow-800",
    Sewing: "bg-blue-100 text-blue-800",
    Finishing: "bg-purple-100 text-purple-800",
    Completed: "bg-green-100 text-green-800",
  }

  // Fetch awal dari Supabase
  useEffect(() => {
    const fetchProductions = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("productions")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Gagal memuat data:", error.message)
      } else {
        setProductions(data as ProductionOrder[])
      }
      setLoading(false)
    }

    fetchProductions()

    // Subscribes ke Supabase Realtime
    const channel = supabase
      .channel("productions_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "productions" },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload
          if (eventType === "INSERT") {
            setProductions((prev) => [newRow as ProductionOrder, ...prev])
          } else if (eventType === "UPDATE") {
            setProductions((prev) =>
              prev.map((p) => (p.id === (newRow as ProductionOrder).id ? (newRow as ProductionOrder) : p))
            )
          } else if (eventType === "DELETE") {
            setProductions((prev) => prev.filter((p) => p.id !== (oldRow as ProductionOrder).id))
          }
        }
      )
      .subscribe((status) => {
        setIsRealtime(status === "SUBSCRIBED")
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const statusProgressMap = {
      Cutting: 25,
      Sewing: 50,
      Finishing: 85,
      Completed: 100,
    }

    const newProgress = statusProgressMap[newStatus as keyof typeof statusProgressMap] || 0

    const { error } = await supabase
      .from("productions")
      .update({ status: newStatus, progress: newProgress })
      .eq("id", id)

    if (error) {
      console.error("Gagal update status:", error.message)
    }
    setEditingId(null)
  }

  if (loading) {
    return (
      <div className="p-8 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat data dari Supabase...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Status Produksi</h1>
          <p className="text-muted-foreground">Monitor production progress in real-time</p>
        </div>
        {/* Indikator status koneksi Realtime */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isRealtime
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-muted text-muted-foreground"
            }`}
        >
          {isRealtime ? <Wifi size={14} /> : <WifiOff size={14} />}
          {isRealtime ? "Realtime Aktif" : "Menghubungkan..."}
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Production Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Progress</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {productions.map((prod) => (
                <tr key={prod.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{prod.id}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{prod.product}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{prod.quantity} units</td>
                  <td className="px-6 py-4 text-sm">
                    {editingId === prod.id ? (
                      <div className="flex gap-2">
                        <select
                          value={prod.status}
                          onChange={(e) => handleStatusUpdate(prod.id, e.target.value)}
                          className="px-3 py-1 border border-border rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[prod.status] || "bg-gray-100 text-gray-800"}`}
                      >
                        {prod.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full transition-all"
                          style={{ width: `${prod.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{prod.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {editingId === prod.id ? (
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-green-600 hover:bg-green-100 p-2 rounded-lg transition-colors"
                      >
                        <CheckCircle size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingId(prod.id)}
                        className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Trash2, Wifi, WifiOff } from "lucide-react"
import { supabase, type Order } from "@/lib/supabase"

export function OrderInput() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isRealtime, setIsRealtime] = useState(false)

  const [formData, setFormData] = useState({
    customer: "",
    product: "",
    quantity: "",
    deadline: "",
    notes: "",
  })

  const sleepYouProducts = [
    "Atasan Wanita",
    "Gamis Kerah Motif",
    "Set Hem Polos",
    "Atasan Twill",
    "Daster Muslim",
    "Baju Tidur",
    "Rok Panjang",
    "Celana Panjang Wanita",
    "Atasan Kasual",
    "Dress Casual",
    "Blouse Formal",
    "Kemeja Wanita",
  ]

  // Fetch awal dari API route (Serverless Simulation), bukan langsung dari Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/orders')
        if (!response.ok) throw new Error("Gagal mengambil data dari API")

        const data = await response.json()
        setOrders(data as Order[])
      } catch (err: any) {
        console.error("Gagal memuat data:", err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()

    // Subscribes ke Supabase Realtime (Tetap menggunakan SDK client-side untuk UI reactivity)
    const channel = supabase
      .channel("orders_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload
          if (eventType === "INSERT") {
            setOrders((prev) => [newRow as Order, ...prev])
          } else if (eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) => (o.id === (newRow as Order).id ? (newRow as Order) : o))
            )
          } else if (eventType === "DELETE") {
            setOrders((prev) => prev.filter((o) => o.id !== (oldRow as Order).id))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.customer.trim() &&
      formData.product &&
      formData.quantity &&
      Number(formData.quantity) > 0 &&
      formData.deadline
    ) {
      try {
        // Alihkan operasi write ke API Route Serverless kita
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer: formData.customer,
            product: formData.product,
            quantity: Number.parseInt(formData.quantity),
            deadline: formData.deadline,
            notes: formData.notes,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Gagal membuat order")
        }

        // Jika berhasil, Supabase Realtime via WebSocket akan memicu state update secara otomatis
        // Jadi kita hanya perlu mengosongkan form
        setFormData({ customer: "", product: "", quantity: "", deadline: "", notes: "" })
      } catch (err: any) {
        console.error("Gagal memproses order API:", err.message)
      }
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("orders").delete().eq("id", id)
    if (error) {
      console.error("Gagal menghapus order:", error.message)
    }
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Input Pesanan</h1>
          <p className="text-muted-foreground">Create and manage customer orders</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Create Order</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Customer Name</label>
                <input
                  type="text"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Product Type</label>
                <select
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Select product</option>
                  {sleepYouProducts.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Create Order
              </button>
            </form>
          </div>
        </div>

        {/* Orders Table */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Qty</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Deadline</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{order.customer}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{order.product}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{order.quantity}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{order.deadline}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

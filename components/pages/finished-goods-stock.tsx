"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Trash2, TrendingUp, Wifi, WifiOff } from "lucide-react"
import { supabase, type FinishedGood } from "@/lib/supabase"

// Konversi format kolom Supabase (snake_case) ke format komponen (camelCase)
function toProduct(row: FinishedGood) {
  return {
    id: row.id,
    name: row.name,
    stock: row.stock,
    unit: row.unit,
    price: row.price,
    lastRestocked: row.last_restocked,
  }
}

export function FinishedGoodsStock() {
  const [products, setProducts] = useState<ReturnType<typeof toProduct>[]>([])
  const [loading, setLoading] = useState(true)
  const [isRealtime, setIsRealtime] = useState(false)

  const [newProduct, setNewProduct] = useState({
    name: "",
    stock: "",
    price: "",
  })

  const [showAddForm, setShowAddForm] = useState(false)

  // Fetch awal dari Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("finished_goods")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Gagal memuat data:", error.message)
      } else {
        setProducts((data as FinishedGood[]).map(toProduct))
      }
      setLoading(false)
    }

    fetchProducts()

    // Subscribes ke Supabase Realtime - semua perubahan pada tabel finished_goods
    // akan langsung terefleksi di semua tab/perangkat yang membuka halaman ini
    const channel = supabase
      .channel("finished_goods_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "finished_goods" },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload

          if (eventType === "INSERT") {
            setProducts((prev) => [toProduct(newRow as FinishedGood), ...prev])
          } else if (eventType === "UPDATE") {
            setProducts((prev) =>
              prev.map((p) => (p.id === (newRow as FinishedGood).id ? toProduct(newRow as FinishedGood) : p))
            )
          } else if (eventType === "DELETE") {
            setProducts((prev) => prev.filter((p) => p.id !== (oldRow as FinishedGood).id))
          }
        }
      )
      .subscribe((status) => {
        setIsRealtime(status === "SUBSCRIBED")
      })

    // Bersihkan listener saat komponen di-unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      newProduct.name &&
      newProduct.stock &&
      newProduct.price &&
      Number(newProduct.stock) > 0 &&
      Number(newProduct.price) > 0
    ) {
      const product: FinishedGood = {
        id: `FG-${Date.now().toString().slice(-6)}`,
        name: newProduct.name,
        stock: Number.parseInt(newProduct.stock),
        unit: "units",
        price: Number.parseInt(newProduct.price),
        last_restocked: new Date().toISOString().split("T")[0],
      }

      const { error } = await supabase.from("finished_goods").insert(product)
      if (error) {
        console.error("Gagal menambah produk:", error.message)
        return
      }

      // State akan otomatis diperbarui oleh listener Realtime
      setNewProduct({ name: "", stock: "", price: "" })
      setShowAddForm(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("finished_goods").delete().eq("id", id)
    if (error) {
      console.error("Gagal menghapus produk:", error.message)
    }
    // State diperbarui otomatis oleh Realtime listener
  }

  const handleAddStock = async (id: string, amount: number) => {
    const product = products.find((p) => p.id === id)
    if (!product) return

    const newStock = Math.max(0, product.stock + amount)
    const { error } = await supabase
      .from("finished_goods")
      .update({ stock: newStock, last_restocked: new Date().toISOString().split("T")[0] })
      .eq("id", id)

    if (error) {
      console.error("Gagal update stok:", error.message)
    }
    // State diperbarui otomatis oleh Realtime listener
  }

  const totalInventoryValue = products.reduce((sum, prod) => sum + prod.stock * prod.price, 0)

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
          <h1 className="text-4xl font-bold text-foreground mb-2">Stok Produk Jadi</h1>
          <p className="text-muted-foreground">Manage finished goods inventory</p>
        </div>
        {/* Indikator status koneksi Realtime */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            isRealtime
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isRealtime ? <Wifi size={14} /> : <WifiOff size={14} />}
          {isRealtime ? "Realtime Aktif" : "Menghubungkan..."}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Products</p>
          <p className="text-3xl font-bold text-foreground">{products.length}</p>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Units</p>
          <p className="text-3xl font-bold text-secondary">{products.reduce((sum, p) => sum + p.stock, 0)}</p>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Inventory Value</p>
              <p className="text-2xl font-bold text-accent">Rp {(totalInventoryValue / 1000000).toFixed(1)}M</p>
            </div>
            <TrendingUp className="text-secondary" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {showAddForm && (
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Add Finished Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Product name"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  placeholder="Initial stock"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="Unit price (Rp)"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Add Product
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setNewProduct({ name: "", stock: "", price: "" })
                    }}
                    className="flex-1 bg-muted text-muted-foreground py-2 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className={showAddForm ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Products List</h2>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-secondary/90 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Product
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Unit Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Total Value</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Last Restocked</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{product.stock} units</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        Rp {(product.price / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-secondary">
                        Rp {((product.stock * product.price) / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{product.lastRestocked}</td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => handleAddStock(product.id, 10)}
                          className="text-secondary hover:bg-secondary/10 px-3 py-1 rounded-lg transition-colors text-xs font-medium"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleAddStock(product.id, -10)}
                          className="text-muted-foreground hover:bg-muted/30 px-3 py-1 rounded-lg transition-colors text-xs font-medium"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
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

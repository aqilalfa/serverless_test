"use client"

import type React from "react"


import { useState, useEffect } from "react"
import { Plus, Minus, Trash2, Wifi, WifiOff } from "lucide-react"
import { supabase, type RawMaterial } from "@/lib/supabase"


// Konversi format kolom Supabase (snake_case) ke format komponen (camelCase)
function toMaterial(row: RawMaterial) {
  return {
    id: row.id,
    name: row.name,
    current: row.current,
    unit: row.unit,
    reorderLevel: row.reorder_level,
  }
}

export function RawMaterialsStock() {
  const [materials, setMaterials] = useState<ReturnType<typeof toMaterial>[]>([])
  const [loading, setLoading] = useState(true)
  const [isRealtime, setIsRealtime] = useState(false)

  const [newMaterial, setNewMaterial] = useState({
    name: "",
    unit: "kg",
    stock: "",
  })

  const [showAddForm, setShowAddForm] = useState(false)


  // Fetch awal dari Supabase
  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("raw_materials")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Gagal memuat data:", error.message)
      } else {
        setMaterials((data as RawMaterial[]).map(toMaterial))
      }
      setLoading(false)
    }

    fetchMaterials()

    // Subscribes ke Supabase Realtime
    const channel = supabase
      .channel("raw_materials_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "raw_materials" },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload
          if (eventType === "INSERT") {
            setMaterials((prev) => [toMaterial(newRow as RawMaterial), ...prev])
          } else if (eventType === "UPDATE") {
            setMaterials((prev) =>
              prev.map((m) => (m.id === (newRow as RawMaterial).id ? toMaterial(newRow as RawMaterial) : m))
            )
          } else if (eventType === "DELETE") {
            setMaterials((prev) => prev.filter((m) => m.id !== (oldRow as RawMaterial).id))
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

  const handleAddStock = async (id: string, amount: number) => {
    const material = materials.find((m) => m.id === id)
    if (!material) return

    const newCurrent = Math.max(0, material.current + amount)
    const { error } = await supabase
      .from("raw_materials")
      .update({ current: newCurrent })
      .eq("id", id)
    if (error) {
      console.error("Gagal update stok:", error.message)
    }
    // State diperbarui otomatis oleh Realtime listener
  }

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMaterial.name && newMaterial.stock && Number(newMaterial.stock) > 0) {
      const material: RawMaterial = {
        id: `MAT-${Date.now().toString().slice(-6)}`,
        name: newMaterial.name,
        current: Number.parseInt(newMaterial.stock),
        unit: newMaterial.unit,
        reorder_level: Math.round(Number.parseInt(newMaterial.stock) * 0.3),
      }
      const { error } = await supabase.from("raw_materials").insert(material)
      if (error) {
        console.error("Gagal menambah material:", error.message)
        return
      }
      setNewMaterial({ name: "", unit: "kg", stock: "" })
      setShowAddForm(false)
    }
  }

  const handleDeleteMaterial = async (id: string) => {
    const { error } = await supabase.from("raw_materials").delete().eq("id", id)
    if (error) {
      console.error("Gagal menghapus material:", error.message)
    }
    // State diperbarui otomatis oleh Realtime listener
  }

  const isLowStock = (current: number, reorderLevel: number) => current <= reorderLevel

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
          <h1 className="text-4xl font-bold text-foreground mb-2">Stok Bahan Baku</h1>
          <p className="text-muted-foreground">Manage raw materials inventory</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Materials</p>
          <p className="text-3xl font-bold text-foreground">{materials.length}</p>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Stock Value</p>
          <p className="text-3xl font-bold text-foreground">
            {materials.reduce((sum, mat) => sum + mat.current, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Low Stock Items</p>
          <p className="text-3xl font-bold text-destructive">
            {materials.filter((mat) => isLowStock(mat.current, mat.reorderLevel)).length}
          </p>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full bg-secondary text-secondary-foreground py-2 rounded-lg font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Material
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Add New Material</h2>
          <form onSubmit={handleAddMaterial} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              value={newMaterial.name}
              onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
              placeholder="Material name"
              className="px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <input
              type="number"
              value={newMaterial.stock}
              onChange={(e) => setNewMaterial({ ...newMaterial, stock: e.target.value })}
              placeholder="Initial stock"
              className="px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <select
              value={newMaterial.unit}
              onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
              className="px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="kg">kg</option>
              <option value="m">m</option>
              <option value="pieces">pieces</option>
              <option value="liters">liters</option>
            </select>
            <button
              type="submit"
              className="bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Add Material
            </button>
          </form>
        </div>
      )}

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Materials List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Material Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Current Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Unit</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Reorder Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {materials.map((material) => (
                <tr key={material.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{material.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{material.current}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{material.unit}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{Math.round(material.reorderLevel)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isLowStock(material.current, material.reorderLevel)
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {isLowStock(material.current, material.reorderLevel) ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => handleAddStock(material.id, 50)}
                      className="text-secondary hover:bg-secondary/10 p-2 rounded-lg transition-colors"
                      title="Add 50"
                    >
                      <Plus size={18} />
                    </button>
                    <button
                      onClick={() => handleAddStock(material.id, -50)}
                      className="text-muted-foreground hover:bg-muted/30 p-2 rounded-lg transition-colors"
                      title="Remove 50"
                    >
                      <Minus size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(material.id)}
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
  )
}

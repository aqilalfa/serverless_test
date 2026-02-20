"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, Plus, Wifi, WifiOff } from "lucide-react"
import { supabase, type ProductCatalogItem } from "@/lib/supabase"

export function ProductCatalog() {
  const [products, setProducts] = useState<ProductCatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isRealtime, setIsRealtime] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch awal dari Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Gagal memuat data:", error.message)
      } else {
        setProducts(data as ProductCatalogItem[])
      }
      setLoading(false)
    }

    fetchProducts()

    // Subscribes ke Supabase Realtime
    const channel = supabase
      .channel("products_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload
          if (eventType === "INSERT") {
            setProducts((prev) => [newRow as ProductCatalogItem, ...prev])
          } else if (eventType === "UPDATE") {
            setProducts((prev) =>
              prev.map((p) => (p.id === (newRow as ProductCatalogItem).id ? (newRow as ProductCatalogItem) : p))
            )
          } else if (eventType === "DELETE") {
            setProducts((prev) => prev.filter((p) => p.id !== (oldRow as ProductCatalogItem).id))
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

  const categories = [
    { id: "all", label: "All Products" },
    { id: "tops", label: "Tops" },
    { id: "dresses", label: "Dresses" },
    { id: "sets", label: "Sets" },
    { id: "sleepwear", label: "Sleepwear" },
    { id: "bottoms", label: "Bottoms" },
    { id: "packages", label: "Packages" },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // To simulate rendering when there's no data initialized in the db
  // just the regular layout logic is sufficient

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
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Product Catalog</h1>
          <p className="text-muted-foreground">Sleep.You Apparel Collection</p>
        </div>
        <div className="flex gap-4 items-center">
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
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Product
          </Button>
        </div>
      </div>

      <Card className="mb-6 p-6 border-border rounded-xl">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-lg border-border"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm w-full md:w-48"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow rounded-xl border-border">
            <div className="relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover bg-muted"
              />
              {product.badge && (
                <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  {product.badge}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-xl font-bold text-primary mb-4">Rp{product.price?.toLocaleString("id-ID") || 0}</p>
              <Button variant="outline" size="sm" className="w-full rounded-lg border-border bg-transparent">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No products found</p>
        </div>
      )}
    </div>
  )
}

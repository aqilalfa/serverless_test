import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Kita inisialisasi Supabase client khusus untuk API (Server-side)
// Idealnya menggunakan service_role_key jika ingin membypass RLS, tapi untuk pengujian ini 
// kita bisa gunakan anon key karena RLS sudah "Allow all for demo"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) throw error

        return NextResponse.json(data, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validasi data sederhana
        if (!body.customer || !body.product || !body.quantity || !body.deadline) {
            return NextResponse.json(
                { error: "Missing required fields (customer, product, quantity, deadline)" },
                { status: 400 }
            )
        }

        const { data: newOrder, error } = await supabase
            .from("orders")
            .insert({
                id: `ORD-${String(Math.random()).slice(2, 5).padEnd(3, "0")}`,
                customer: body.customer,
                product: body.product,
                quantity: typeof body.quantity === "string" ? parseInt(body.quantity) : body.quantity,
                deadline: body.deadline,
                notes: body.notes || "",
            })
            .select()
            .single()

        if (error) throw error

        // Saat return order baru ini berhasil, berarti Supabase/SQL Trigger di DB 
        // juga sudah atau sedang mengeksekusi otomatis pemotongan raw_materials
        return NextResponse.json(newOrder, { status: 201 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

-- ============================================================
-- SPICE - Setup Tabel Supabase
-- Jalankan skrip ini di Supabase SQL Editor
-- (Dashboard > SQL Editor > New query)
-- ============================================================

-- 1. Buat tabel finished_goods
CREATE TABLE IF NOT EXISTS finished_goods (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  stock         INTEGER NOT NULL DEFAULT 0,
  unit          TEXT NOT NULL DEFAULT 'units',
  price         BIGINT NOT NULL DEFAULT 0,
  last_restocked DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Isi data awal (seed)
INSERT INTO finished_goods (id, name, stock, unit, price, last_restocked) VALUES
  ('FG-001', 'Spring Mattress Queen',  35,  'units', 2500000, '2025-12-04'),
  ('FG-002', 'Latex Pillow Standard',  120, 'units', 450000,  '2025-12-03'),
  ('FG-003', 'Bedding Set Premium',    28,  'units', 3200000, '2025-12-02'),
  ('FG-004', 'Memory Foam Topper',     45,  'units', 1800000, '2025-12-01')
ON CONFLICT (id) DO NOTHING;

-- 3. Aktifkan Realtime untuk tabel ini
-- (Juga harus diaktifkan di Dashboard > Database > Replication > supabase_realtime)
ALTER PUBLICATION supabase_realtime ADD TABLE finished_goods;

-- 4. Row Level Security (RLS) - izinkan semua operasi untuk demo
-- Untuk produksi, sesuaikan dengan autentikasi pengguna
ALTER TABLE finished_goods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for demo" ON finished_goods;
CREATE POLICY "Allow all for demo"
  ON finished_goods
  FOR ALL
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- 5. Buat tabel raw_materials
CREATE TABLE IF NOT EXISTS raw_materials (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  current       INTEGER NOT NULL DEFAULT 0,
  unit          TEXT NOT NULL DEFAULT 'kg',
  reorder_level INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Isi data awal (seed)
INSERT INTO raw_materials (id, name, current, unit, reorder_level) VALUES
  ('MAT-001', 'Spring Coil',        1200, 'kg', 500),
  ('MAT-002', 'Latex Foam',         850,  'kg', 400),
  ('MAT-003', 'Cotton Fabric',      450,  'm',  300),
  ('MAT-004', 'Polyester Filling',  280,  'kg', 200)
ON CONFLICT (id) DO NOTHING;

-- 7. Aktifkan Realtime untuk tabel ini
-- Uncomment if not added to publication yet
-- ALTER PUBLICATION supabase_realtime ADD TABLE raw_materials;

-- 8. RLS untuk raw_materials
ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for demo (raw_materials)" ON raw_materials;
CREATE POLICY "Allow all for demo (raw_materials)"
  ON raw_materials
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 9. Buat tabel productions
CREATE TABLE IF NOT EXISTS productions (
  id            TEXT PRIMARY KEY,
  product       TEXT NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL,
  progress      INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Isi data awal (seed)
INSERT INTO productions (id, product, quantity, status, progress) VALUES
  ('ORD-001', 'Spring Mattress', 50,  'Sewing',    60),
  ('ORD-002', 'Latex Pillow',    100, 'Completed', 100),
  ('ORD-003', 'Bedding Set',     30,  'Cutting',   30),
  ('ORD-004', 'Spring Mattress', 75,  'Finishing', 85)
ON CONFLICT (id) DO NOTHING;

-- 11. Aktifkan Realtime
-- Uncomment if not added to publication yet
-- ALTER PUBLICATION supabase_realtime ADD TABLE productions;

-- 12. RLS untuk productions
ALTER TABLE productions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for demo (productions)" ON productions;
CREATE POLICY "Allow all for demo (productions)"
  ON productions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 13. Buat tabel orders
CREATE TABLE IF NOT EXISTS orders (
  id            TEXT PRIMARY KEY,
  customer      TEXT NOT NULL,
  product       TEXT NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 0,
  deadline      DATE NOT NULL,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Isi data awal (seed)
INSERT INTO orders (id, customer, product, quantity, deadline, notes) VALUES
  ('ORD-001', 'PT Mebel Indah', 'Atasan Wanita',      50,  '2025-12-10', 'Urgent'),
  ('ORD-002', 'Toko Furniture', 'Gamis Kerah Motif', 100, '2025-12-15', '')
ON CONFLICT (id) DO NOTHING;

-- 15. Aktifkan Realtime
-- Uncomment if not added to publication yet
-- ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- 16. RLS untuk orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for demo (orders)" ON orders;
CREATE POLICY "Allow all for demo (orders)"
  ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 17. Buat tabel products (Katalog)
CREATE TABLE IF NOT EXISTS products (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  price         BIGINT NOT NULL DEFAULT 0,
  category      TEXT NOT NULL,
  image         TEXT NOT NULL,
  badge         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Isi data awal (seed)
INSERT INTO products (id, name, price, category, image, badge) VALUES
  ('1', 'Atasan Wanita / Blouse Wanita', 57000, 'tops', '/womens-blouse.jpg', NULL),
  ('2', 'Daster Muslim Polos Twill', 78000, 'dresses', '/muslim-daster.jpg', NULL),
  ('3', 'Gamis Kerah Motif', 95000, 'dresses', '/gamis-motif.jpg', NULL),
  ('12', 'Paket Reseller By Sleep.You', 174000, 'packages', '/reseller-package.jpg', 'Grosir')
ON CONFLICT (id) DO NOTHING;

-- 19. Aktifkan Realtime
-- Uncomment if not added to publication yet
-- ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- 20. RLS untuk products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for demo (products)" ON products;
CREATE POLICY "Allow all for demo (products)"
  ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);

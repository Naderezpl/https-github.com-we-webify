CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  pricing JSONB NOT NULL DEFAULT '{"tiers": []}'::jsonb,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  next_order_seq INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_orders (
  id TEXT PRIMARY KEY,
  sequence_number INTEGER NOT NULL,
  order_code TEXT NOT NULL UNIQUE,
  bundle_id TEXT NOT NULL,
  bundle_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  site_name TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  bundle_features TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_orders_created_at ON site_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_orders_order_code ON site_orders (order_code);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_read_all" ON site_settings;
CREATE POLICY "site_settings_read_all"
  ON site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "site_settings_insert_admin" ON site_settings;
CREATE POLICY "site_settings_insert_admin"
  ON site_settings FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "site_settings_update_admin" ON site_settings;
CREATE POLICY "site_settings_update_admin"
  ON site_settings FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "site_orders_read_all" ON site_orders;
CREATE POLICY "site_orders_read_all"
  ON site_orders FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "site_orders_insert_all" ON site_orders;
CREATE POLICY "site_orders_insert_all"
  ON site_orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "site_orders_update_admin" ON site_orders;
CREATE POLICY "site_orders_update_admin"
  ON site_orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "site_orders_delete_admin" ON site_orders;
CREATE POLICY "site_orders_delete_admin"
  ON site_orders FOR DELETE
  USING (true);

INSERT INTO site_settings (id, pricing, content, next_order_seq, updated_at)
VALUES (
  'main',
  '{"tiers": []}'::jsonb,
  '{}'::jsonb,
  1,
  NOW()
)
ON CONFLICT (id) DO NOTHING;

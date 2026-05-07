-- Executar uma vez no Postgres (Railway: Query no plugin PostgreSQL, ou psql).
CREATE TABLE IF NOT EXISTS propostas (
  slug TEXT PRIMARY KEY,
  body JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS propostas_updated_at_idx ON propostas (updated_at DESC);

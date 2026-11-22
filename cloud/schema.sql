-- Jayed Jaman Seen Portfolio — Cloudflare D1 SQL Schema
CREATE TABLE IF NOT EXISTS portfolio_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_auth (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  pass_hash TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

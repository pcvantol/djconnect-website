CREATE TABLE IF NOT EXISTS click_counters (
  day TEXT NOT NULL,
  target TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'website',
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (day, target, source)
);

CREATE INDEX IF NOT EXISTS idx_click_counters_target
  ON click_counters (target, day);

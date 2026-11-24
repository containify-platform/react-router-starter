CREATE TABLE visits (
  id bigserial PRIMARY KEY,
  visited_at timestamptz NOT NULL DEFAULT now()
);

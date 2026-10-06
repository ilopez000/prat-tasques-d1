-- Migració 0001: crea la taula de tasques i hi posa tres tasques d'exemple
CREATE TABLE IF NOT EXISTS tasques (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  titol   TEXT    NOT NULL,
  feta    INTEGER NOT NULL DEFAULT 0,          -- 0 = pendent, 1 = feta
  creada  TEXT    NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO tasques (titol, feta) VALUES
  ('Crear el repositori a GitHub', 1),
  ('Crear la base de dades D1', 0),
  ('Connectar el Worker amb GitHub', 0);

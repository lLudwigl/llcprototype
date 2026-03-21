-- ============================================================
-- 002_seed_lines.sql
-- Seed data: all active Wiener Linien lines + their stops.
-- U-Bahn: full stop sequences (used for direction matching).
-- Tram / Bus: terminus stops only (sufficient for MVP parser).
-- ============================================================

-- ── Lines ────────────────────────────────────────────────────

INSERT INTO lines (id, name, type) VALUES
  -- U-Bahn
  ('U1', 'U1', 'ubahn'),
  ('U2', 'U2', 'ubahn'),
  ('U3', 'U3', 'ubahn'),
  ('U4', 'U4', 'ubahn'),
  ('U6', 'U6', 'ubahn'),

  -- Tram (Straßenbahn)
  ('1',  'Linie 1',  'tram'),
  ('2',  'Linie 2',  'tram'),
  ('5',  'Linie 5',  'tram'),
  ('6',  'Linie 6',  'tram'),
  ('9',  'Linie 9',  'tram'),
  ('10', 'Linie 10', 'tram'),
  ('11', 'Linie 11', 'tram'),
  ('18', 'Linie 18', 'tram'),
  ('25', 'Linie 25', 'tram'),
  ('26', 'Linie 26', 'tram'),
  ('30', 'Linie 30', 'tram'),
  ('31', 'Linie 31', 'tram'),
  ('33', 'Linie 33', 'tram'),
  ('37', 'Linie 37', 'tram'),
  ('38', 'Linie 38', 'tram'),
  ('40', 'Linie 40', 'tram'),
  ('41', 'Linie 41', 'tram'),
  ('42', 'Linie 42', 'tram'),
  ('43', 'Linie 43', 'tram'),
  ('44', 'Linie 44', 'tram'),
  ('46', 'Linie 46', 'tram'),
  ('49', 'Linie 49', 'tram'),
  ('52', 'Linie 52', 'tram'),
  ('60', 'Linie 60', 'tram'),
  ('62', 'Linie 62', 'tram'),
  ('71', 'Linie 71', 'tram'),

  -- Bus
  ('13A', 'Linie 13A', 'bus'),
  ('14A', 'Linie 14A', 'bus');


-- ── U-Bahn stations (full sequences) ─────────────────────────
-- stop_order 1 = first terminus, increasing toward the other terminus.

-- U1: Oberlaa ↔ Leopoldau
INSERT INTO stations (name, line_id, stop_order) VALUES
  ('Oberlaa',                    'U1',  1),
  ('Troststraße',                'U1',  2),
  ('Altes Landgut',              'U1',  3),
  ('Alaudagasse',                'U1',  4),
  ('Reumannplatz',               'U1',  5),
  ('Keplerplatz',                'U1',  6),
  ('Südtiroler Platz-Hauptbahnhof', 'U1', 7),
  ('Taubstummengasse',           'U1',  8),
  ('Karlsplatz',                 'U1',  9),
  ('Stephansplatz',              'U1', 10),
  ('Schwedenplatz',              'U1', 11),
  ('Nestroyplatz',               'U1', 12),
  ('Praterstern',                'U1', 13),
  ('Vorgartenstraße',            'U1', 14),
  ('Kagran',                     'U1', 15),
  ('Kagraner Platz',             'U1', 16),
  ('Leopoldau',                  'U1', 17);

-- U2: Karlsplatz ↔ Seestadt
INSERT INTO stations (name, line_id, stop_order) VALUES
  ('Karlsplatz',           'U2',  1),
  ('Museumsquartier',      'U2',  2),
  ('Volkstheater',         'U2',  3),
  ('Rathaus',              'U2',  4),
  ('Schottentor',          'U2',  5),
  ('Schottenring',         'U2',  6),
  ('Taborstraße',          'U2',  7),
  ('Praterstern',          'U2',  8),
  ('Messe-Prater',         'U2',  9),
  ('Krieau',               'U2', 10),
  ('Stadion',              'U2', 11),
  ('Donaustadtbrücke',     'U2', 12),
  ('Hardeggasse',          'U2', 13),
  ('Aspernstraße',         'U2', 14),
  ('Hausfeldstraße',       'U2', 15),
  ('Aspern Nord',          'U2', 16),
  ('Seestadt',             'U2', 17);

-- U3: Ottakring ↔ Simmering
INSERT INTO stations (name, line_id, stop_order) VALUES
  ('Ottakring',            'U3',  1),
  ('Kendlerstraße',        'U3',  2),
  ('Hütteldorfer Straße',  'U3',  3),
  ('Johnstraße',           'U3',  4),
  ('Schweglerstraße',      'U3',  5),
  ('Westbahnhof',          'U3',  6),
  ('Zieglergasse',         'U3',  7),
  ('Neubaugasse',          'U3',  8),
  ('Volkstheater',         'U3',  9),
  ('Herrengasse',          'U3', 10),
  ('Stephansplatz',        'U3', 11),
  ('Stubentor',            'U3', 12),
  ('Landstraße',           'U3', 13),
  ('Rochusgasse',          'U3', 14),
  ('Erdberg',              'U3', 15),
  ('Gasometer',            'U3', 16),
  ('Zippererstraße',       'U3', 17),
  ('Enkplatz',             'U3', 18),
  ('Simmering',            'U3', 19);

-- U4: Hütteldorf ↔ Heiligenstadt
INSERT INTO stations (name, line_id, stop_order) VALUES
  ('Hütteldorf',           'U4',  1),
  ('Ober-St.-Veit',        'U4',  2),
  ('Unter-St.-Veit',       'U4',  3),
  ('Braunschweiggasse',    'U4',  4),
  ('Hietzing',             'U4',  5),
  ('Schönbrunn',           'U4',  6),
  ('Meidling Hauptstraße', 'U4',  7),
  ('Längenfeldgasse',      'U4',  8),
  ('Margaretengürtel',     'U4',  9),
  ('Pilgramgasse',         'U4', 10),
  ('Kettenbrückengasse',   'U4', 11),
  ('Karlsplatz',           'U4', 12),
  ('Stadtpark',            'U4', 13),
  ('Landstraße',           'U4', 14),
  ('Schwedenplatz',        'U4', 15),
  ('Schottenring',         'U4', 16),
  ('Rossauer Lände',       'U4', 17),
  ('Friedensbrücke',       'U4', 18),
  ('Spittelau',            'U4', 19),
  ('Nußdorfer Straße',     'U4', 20),
  ('Währinger Straße',     'U4', 21),
  ('Heiligenstadt',        'U4', 22);

-- U6: Siebenhirten ↔ Floridsdorf
INSERT INTO stations (name, line_id, stop_order) VALUES
  ('Siebenhirten',               'U6',  1),
  ('Perfektastraße',             'U6',  2),
  ('Erlaaer Straße',             'U6',  3),
  ('Alterlaa',                   'U6',  4),
  ('Am Schöpfwerk',              'U6',  5),
  ('Tscherttegasse',             'U6',  6),
  ('Bahnhof Meidling',           'U6',  7),
  ('Niederhofstraße',            'U6',  8),
  ('Gutheil-Schoder-Gasse',      'U6',  9),
  ('Philadelphiabrücke',         'U6', 10),
  ('Margaretengürtel',           'U6', 11),
  ('Längenfeldgasse',            'U6', 12),
  ('Westbahnhof',                'U6', 13),
  ('Burggasse-Stadthalle',       'U6', 14),
  ('Thaliastraße',               'U6', 15),
  ('Josefstädter Straße',        'U6', 16),
  ('Alser Straße',               'U6', 17),
  ('Michelbeuern-AKH',           'U6', 18),
  ('Währinger Straße-Volksoper', 'U6', 19),
  ('Dresdner Straße',            'U6', 20),
  ('Jägerstraße',                'U6', 21),
  ('Handelskai',                 'U6', 22),
  ('Neue Donau',                 'U6', 23),
  ('Floridsdorf',                'U6', 24);


-- ── Tram terminus stops ───────────────────────────────────────
-- Only the two end-stations per line are seeded here.
-- Full stop lists can be added later without breaking anything.

INSERT INTO stations (name, line_id, stop_order) VALUES
  -- 1: Stefan-Fadinger-Platz ↔ Prater Hauptallee
  ('Stefan-Fadinger-Platz', '1', 1),
  ('Prater Hauptallee',     '1', 2),

  -- 2: Dornbach ↔ Friedrich-Engels-Platz
  ('Dornbach',               '2', 1),
  ('Friedrich-Engels-Platz', '2', 2),

  -- 5: Westbahnhof ↔ Praterstern
  ('Westbahnhof', '5', 1),
  ('Praterstern',  '5', 2),

  -- 6: Burggasse-Stadthalle ↔ Geiereckstraße
  ('Burggasse-Stadthalle', '6', 1),
  ('Geiereckstraße',       '6', 2),

  -- 9: Gersthof ↔ Westbahnhof
  ('Gersthof',    '9', 1),
  ('Westbahnhof', '9', 2),

  -- 10: Dornbach ↔ Unter-St.-Veit, Wolflaastraße
  ('Dornbach',                      '10', 1),
  ('Unter-St.-Veit, Wolflaastraße', '10', 2),

  -- 11: Otto-Probst-Platz ↔ Kaiserebersdorf
  ('Otto-Probst-Platz', '11', 1),
  ('Kaiserebersdorf',   '11', 2),

  -- 18: Burggasse-Stadthalle ↔ Schlachthausgasse
  ('Burggasse-Stadthalle', '18', 1),
  ('Schlachthausgasse',    '18', 2),

  -- 25: Floridsdorf ↔ Strebersdorf
  ('Floridsdorf',  '25', 1),
  ('Strebersdorf', '25', 2),

  -- 26: Strebersdorf ↔ Hausfeldstraße
  ('Strebersdorf',  '26', 1),
  ('Hausfeldstraße','26', 2),

  -- 30: Floridsdorf ↔ Stammersdorf
  ('Floridsdorf', '30', 1),
  ('Stammersdorf', '30', 2),

  -- 31: Schottenring ↔ Stammersdorf
  ('Schottenring', '31', 1),
  ('Stammersdorf', '31', 2),

  -- 33: Friedrich-Engels-Platz ↔ Rußbergstraße
  ('Friedrich-Engels-Platz', '33', 1),
  ('Rußbergstraße',          '33', 2),

  -- 37: Schottentor ↔ Hohe Warte
  ('Schottentor', '37', 1),
  ('Hohe Warte',  '37', 2),

  -- 38: Schottentor ↔ Grinzing
  ('Schottentor', '38', 1),
  ('Grinzing',    '38', 2),

  -- 40: Schottentor ↔ Herbeckstraße
  ('Schottentor',  '40', 1),
  ('Herbeckstraße','40', 2),

  -- 41: Schottentor ↔ Pötzleinsdorf
  ('Schottentor',   '41', 1),
  ('Pötzleinsdorf', '41', 2),

  -- 42: Schottentor ↔ Antonigasse
  ('Schottentor', '42', 1),
  ('Antonigasse', '42', 2),

  -- 43: Schottentor ↔ Neuwaldegg
  ('Schottentor', '43', 1),
  ('Neuwaldegg',  '43', 2),

  -- 44: Schottentor ↔ Maroltingergasse
  ('Schottentor',      '44', 1),
  ('Maroltingergasse', '44', 2),

  -- 46: Ring/Volkstheater ↔ Joachimsthalerplatz
  ('Ring/Volkstheater',    '46', 1),
  ('Joachimsthalerplatz',  '46', 2),

  -- 49: Ring/Volkstheater ↔ Hütteldorf
  ('Ring/Volkstheater', '49', 1),
  ('Hütteldorf',        '49', 2),

  -- 52: Westbahnhof ↔ Baumgarten
  ('Westbahnhof', '52', 1),
  ('Baumgarten',  '52', 2),

  -- 60: Westbahnhof ↔ Rodaun
  ('Westbahnhof', '60', 1),
  ('Rodaun',      '60', 2),

  -- 62: Oper/Karlsplatz ↔ Lainz/Speising
  ('Oper/Karlsplatz',  '62', 1),
  ('Lainz/Speising',   '62', 2),

  -- 71: Börse ↔ Kaiserebersdorf
  ('Börse',           '71', 1),
  ('Kaiserebersdorf', '71', 2);


-- ── Bus terminus stops ────────────────────────────────────────

INSERT INTO stations (name, line_id, stop_order) VALUES
  -- 13A: Skodagasse ↔ Meidling Hauptstraße
  ('Skodagasse',          '13A', 1),
  ('Meidling Hauptstraße','13A', 2),

  -- 14A: Hietzing ↔ Oberlaa
  ('Hietzing', '14A', 1),
  ('Oberlaa',  '14A', 2);

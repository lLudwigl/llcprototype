-- ============================================================
-- 004_seed_directions.sql
-- Creates the line_directions table and seeds terminus stations.
-- terminus_first = first stop in direction 1 (canonical forward)
-- terminus_last  = last stop in direction 1
-- Used to populate the "Richtung" dropdown in the report form.
-- ============================================================

CREATE TABLE IF NOT EXISTS line_directions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_id        TEXT NOT NULL REFERENCES lines (id) ON DELETE CASCADE,
  terminus_first TEXT NOT NULL,
  terminus_last  TEXT NOT NULL,
  CONSTRAINT line_directions_line_unique UNIQUE (line_id)
);

-- ── U-Bahn ──────────────────────────────────
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('U1', 'Oberlaa', 'Leopoldau') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('U2', 'Seestadt', 'Karlsplatz') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('U3', 'Ottakring', 'Simmering') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('U4', 'Hütteldorf', 'Heiligenstadt') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('U6', 'Siebenhirten', 'Floridsdorf') ON CONFLICT (line_id) DO NOTHING;

-- ── S-Bahn ──────────────────────────────────

-- ── Tram (Straßenbahn) ──────────────────────
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('1', 'Prater Hauptallee', 'Stefan-Fadinger-Platz') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('2', 'Dornbach', 'Kagran U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('5', 'Praterstern S U', 'Joachimsthalerplatz') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('6', 'Burggasse, Stadthalle U', 'Zentralfriedhof 3.Tor') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('9', 'Wallrißstraße', 'Wattmanngasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('10', 'Dornbach', 'Unter St. Veit, Hummelgasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('11', 'Otto-Probst-Platz', 'Kaiserebersdorf, Zinnergasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('12', 'Hillerstraße', 'Dornbach') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('E4', 'Hernals, Wattgasse', 'Beethovengang') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('18', 'Bhf.Rdh. / Halle III - A', 'Schlachthausgasse U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('25', 'Oberdorfstraße', 'Hausfeldstraße U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('26', 'Aspern Nord S U', 'Strebersdorf, Meriangasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('27', 'Aspern Nord S U', 'Strebersdorf, Meriangasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('30', 'Wexstraße (Bedarf)', 'Stammersdorf') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('31', 'Schottenring U', 'Stammersdorf') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('37', 'Antonigasse', 'Grinzing') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('38', 'Antonigasse', 'Grinzing') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('40', 'Schottentor U', 'Herbeckstraße') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('41', 'Schottentor U', 'Pötzleinsdorf') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('42', 'Schottentor U', 'Antonigasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('43', 'Schottentor U', 'Neuwaldegg (Anfang-Hst.)') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('44', 'Schottentor U', 'Bhf Hernals Kurzführung') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('46', 'Ring, Volkstheater U', 'Hütteldorf, Bujattigasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('49', 'Ring, Volkstheater U', 'Hütteldorf, Bujattigasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('52', 'Ring, Volkstheater U', 'Hütteldorf, Bujattigasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('60', 'Baumgarten', 'Rodaun') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('62', 'Matthäusgasse', 'Wolkersbergenstraße') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('71', 'Schottenring U', 'Kaiserebersdorf, Zinnergasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('D', 'Absberggasse', 'Beethovengang') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('O', 'Raxstraße', 'Bruno-Marek-Allee') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('WLB', 'Karlsplatz', 'Baden Josefsplatz') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('71E', 'Simmering SU', 'Kaiserebersdorf, Zinnergasse') ON CONFLICT (line_id) DO NOTHING;

-- ── Bus (inkl. Nachtbus) ────────────────────
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('1A', 'Stephansplatz U', 'Schottentor U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('2A', 'Schwedenplatz U', 'Schwarzenbergplatz') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('3A', 'Schottenring U', 'Stubentor U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('4A', 'Karlsplatz U', 'Wittelsbachstraße') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('5A', 'Nestroyplatz U', 'Griegstraße') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('7A', 'Meidling Hauptstraße U', 'Reumannplatz U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('8A', 'Bhf. Meidling S U, Eichenstraße', 'Küniglberg, ORF-Zentrum') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('9A', 'Meidling Hauptstraße U', 'Bhf. Meidling S U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('10A', 'Bahnhof Heiligenstadt S U', 'Niederhofstraße U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('11A', 'Stadion U', 'Bahnhof Heiligenstadt S U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('12A', 'Pfenninggeldgasse', 'Eichenstraße') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('13A', 'Alser Straße, Skodagasse', 'Hauptbahnhof S U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('14A', 'Neubaugasse U', 'Reumannplatz U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('15A', 'Bhf. Meidling <>, Schedifkaplatz', 'Enkplatz U, Grillgasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('16A', 'Südwestfriedhof, 2. und 8. Tor', 'Alaudagasse U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('17A', 'Inzersdorf, Birostraße', 'Oberlaa U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('19A', 'Alaudagasse U', 'Ada-Christen-Gasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('20A', 'Alte Donau U', 'Neue Donau U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('22A', 'Kagran U', 'Aspernstraße U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('24A', 'Kagraner Platz U', 'Neueßling') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('25A', 'Rennbahnweg U', 'Süßenbrunn, Sportpark') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('26A', 'Kagran U 26A', 'Groß-Enzersdorf') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('27A', 'Kagran U', 'Hermann-Gebauer-Straße') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('28A', 'Leopoldauer Platz', 'Breitenlee, Schule') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('29A', 'Floridsdorf S U', 'Großfeldsiedlung U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('30A', 'Neu Leopoldau', 'Stammersdorf, Freiheitsplatz') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('31A', 'Kagraner Platz U', 'Strebersdorf, Meriangasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('32A', 'Leopoldau S U', 'Bhf. Strebersdorf S') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('33A', 'Floridsdorf S U', 'Mühlschüttel') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('34A', 'Floridsdorf S U', 'Bhf. Strebersdorf S') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('35A', 'Spittelau S U', 'Salmannsdorf Dummy') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('36A', 'Jedlesee, Bellgasse', 'Carabelligasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('37A', 'Brigittenauer Brücke', 'Dänenstraße') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('38A', 'Bahnhof Heiligenstadt S U', 'Leopoldsberg') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('39A', 'Bahnhof Heiligenstadt S U', 'Neustift, Agnesgasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('40A', 'Schottentor U', 'Döblinger Friedhof') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('41A', 'Pötzleinsdorf', 'Neustifter Friedhof 3.Tor') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('42A', 'Hernals S', 'Schafberghöhe') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('43A', 'Dornbach', 'Cobenzl-Parkplatz') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('44A', 'Hernals S', 'Mitterberg') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('45A', 'Ottakring SU', 'Liebhartstal') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('46A', 'Ottakring SU', 'Wilhelminenberg') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('47A', 'Unter St. Veit U', 'Klinik Penzing') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('48A', 'Volkstheater U', 'Klinik Penzing') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('49A', 'Bhf. Hütteldorf S U', 'Wolfersberg, Schöffelplatz') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('50A', 'Bhf. Hütteldorf S U', 'Auhof') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('51A', 'Hietzing U', 'Ottakringer Bad') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('52A', 'Bhf. Hütteldorf S U', 'Jägerwaldsiedlung') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('53A', 'Bhf. Hütteldorf SU', 'Stock im Weg') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('54A', 'Ober St. Veit U', 'Hörndlwald') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('56A', 'Hietzing U', 'Bhf. Atzgersdorf S') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('57A', 'Burgring', 'Rudolfsheim, Anschützgasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('58A', 'Hietzing U', 'Bhf. Atzgersdorf S') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('59A', 'Oper, Karlsplatz >', 'Bhf. Meidling S U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('60A', 'Alterlaa U', 'Liesing S') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('61A', 'Liesing S', 'Vösendorf-Siebenhirten') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('62A', 'Meidling Hauptstraße U', 'Liesing S') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('63A', 'Gesundheitszentrum Süd', 'Am Rosenhügel') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('64A', 'Atzgersdorf, Ziedlergasse', 'Liesing S') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('65A', 'Reumannplatz U', 'Inzersdorf, Zetschegasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('66A', 'Raxstraße, Betriebsgarage', 'Liesing') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('67A', 'Alaudagasse U', 'Inzersdorf, Slamastraße') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('68A', 'Reumannplatz U', 'Laaer Berg, Kurpark Nordosteingang') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('69A', 'Hauptbahnhof S U', 'Simmering S U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('70A', 'Oberlaa U', 'Kledering, Bhf. S') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('71A', 'Zentralfriedhof 3. Tor', 'Schwechat, BHF S') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('72A', 'Gasometer U', 'Hasenleitengasse, Schemmerlstraße') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('73A', 'Simmering S U', 'Landwehrstraße') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('74A', 'Stubentor U', 'St. Marx S, Leberstraße') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('76A', 'Enkplatz U, Grillgasse', 'Alberner Hafen') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('77A', 'Rennweg S', 'Lusthaus') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('79A', 'Donaumarina, Chrastekgasse', 'Freudenauer Hafenstraße') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('80A', 'Praterstern SU', 'Neu Marx') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('82A', 'Praterstern S U', 'Krieau U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('84A', 'Aspernstraße U', 'Aspern Nord SU') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('85A', 'Hausfeldstraße U', 'Breitenlee, Rautenweg') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('86A', 'Stadlau S U', 'Breitenlee, Arnikaweg') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('87A', 'Stadlau S U', 'Hermann-Gebauer-Straße') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('88A', 'Seestadt >', 'Eßling, Stadtgrenze') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('89A', 'Aspern Nord SU', 'Invalidensiedlung') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('92A', 'Kaisermühlen-VIC U', 'Aspern, Zachgasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('93A', 'Kagran U', 'Aspernstraße U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('94A', 'Kagran >', 'Stadlau < >') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('95A', 'Großer Biberhaufen', 'Aspern Nord S U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('96A', 'Schillwasserweg', 'Erzherzog-Karl-Straße S') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('97A', 'Aspernstraße U', 'Breitenlee, Schule') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('98A', 'Hirschstetten, Ort', 'Eßling, Schippanisiedlung') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('99A', 'Aspern Nord  S U', 'Eßling, Schule') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('5B', 'Praterstern S U', 'Bhf. Heiligenstadt S U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('7B', 'Bhf. Meidling S U, Schedifkaplatz', 'Wienerberg City') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('20B', 'Alte Donau U', 'Neue Donau U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('27B', 'Kagran U 26A', 'Satzingerweg') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('29B', 'Floridsdorf S U', 'Großfeldsiedlung U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('36B', 'Jedlesee, Bellgasse', 'Leopoldau S U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('38B', 'Bahnhof Heiligenstadt S U', 'Heiligenstädter Friedhof') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('39B', 'Karthäuserstraße', 'Sieveringer Friedhof') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('43B', 'Bahnhof Hütteldorf SU', 'Neustift, Agnesgasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('46B', 'Ottakring SU', 'Wilhelminenberg') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('47B', 'Bahnhof Hütteldorf SU', 'Hüttelberg') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('50B', 'Bhf. Hütteldorf S U', 'Auhof') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('52B', 'Bhf. Hütteldorf S U', 'Feuerwache Am Steinhof') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('54B', 'Ober St. Veit U', 'St. Veiter Tor') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('56B', 'Hietzing U', 'Lainzer Tor') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('58B', 'Hietzing U', 'Bhf. Atzgersdorf S') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('61B', 'Liesing S', 'Vösendorf-Siebenhirten') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('64B', 'Hetzendorf S', 'Alterlaa U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('67B', 'Alaudagasse U', 'Alterlaa U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('68B', 'Reumannplatz U', 'Oberlaa U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('71B', 'Zentralfriedhof 3. Tor', 'Bhf. Zentralfriedhof S') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('73B', 'Zentralfriedhof 3. Tor', 'Bhf. Kaiserebersdorf S') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('76B', 'Enkplatz U, Grillgasse', 'Alberner Hafen') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('79B', 'Donaumarina, Chrastekgasse', 'Kaiserebersdorf, Münnichplatz') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('88B', 'Seestadt >', 'Eßling, Wegmayersiedlung') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('92B', 'Kaisermühlen-VIC U', 'Ölhafen') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('95B', 'Hirschstetten Ort', 'Hausfeldstraße U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('99B', 'Aspern Nord  S U', 'Eßling, Schule') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N6', 'Westbahnhof', 'Enkplatz U, Grillgasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N8', 'Handelskai S U', 'Alterlaa U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N20', 'Eßling, Stadtgrenze', 'Strebersdorf, Meriangasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N23', 'Kagraner Platz U', 'Hausfeldstraße U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N25', 'Stubentor U', 'Großfeldsiedlung U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N29', 'Wittelsbachstraße', 'Floridsdorf S U') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N31', 'Schwedenplatz', 'Stammersdorf B7') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N35', 'Spittelau S U', 'Salmannsdorf') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N38', 'Schottentor U (Bedarf)', 'Grinzing') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N41', 'Schottentor U', 'Pötzleinsdorf') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N43', 'Schottentor U', 'Neuwaldegg') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N46', 'Oper, Karlsplatz >', 'Otto Wagner Areal') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N49', 'Oper, Karlsplatz >', 'Hütteldorf, Bujattigasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N60', 'Burgring', 'Maurer Hauptplatz') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N62', 'Oper, Karlsplatz >', 'Lainzer Tor') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N65', 'Quellenplatz', 'Liesing S') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N66', 'Burgring', 'Liesing') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N67', 'Quellenplatz', 'Inzersdorf, Großmarkt') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N71', 'Alser Straße, Skodagasse', 'Kaiserebersdorf, Zinnergasse') ON CONFLICT (line_id) DO NOTHING;
INSERT INTO line_directions (line_id, terminus_first, terminus_last) VALUES ('N75', 'Oper, Karlsplatz >', 'Gasometer U') ON CONFLICT (line_id) DO NOTHING;

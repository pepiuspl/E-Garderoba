require("dotenv").config({ path: "/home/tom/E-Garderoba/pass.env" });
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("Loaded env:", process.env);
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 🔹 Połączenie z bazą PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
const multer = require("multer");
const path = require("path");

// folder na zdjęcia
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
// 🔹 Endpointy CRUD tutaj 👇

// GET /clothes → pobiera wszystkie ubrania
app.get("/clothes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clothes ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd pobierania ubrań" });
  }
});

// GET /clothes/:id → pobiera jedno ubranie
app.get("/clothes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clothes ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Błąd pobierania:", err);
    res.status(500).json({ error: "Błąd pobierania ubrań" });
  }
});

// POST /clothes → dodaje nowe ubranie
app.post("/clothes", upload.single("image"), async (req, res) => {
  const { category, color, material, kroj, season, favorite } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      `INSERT INTO clothes 
      (category, color, material, kroj, season, favorite, image_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [category, color, material, kroj, season, favorite === "true", imageUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Błąd SQL:", err);
    res.status(500).json({ error: "Błąd dodawania ubrania" });
  }
});

// udostępnij folder ze zdjęciami
app.use("/uploads", express.static("uploads"));

// PUT /clothes/:id → edytuje ubranie
app.put("/clothes/:id", async (req, res) => {
  const { id } = req.params;
  const { type, color, material, kroj, season, favorite} = req.body;
  try {
    const result = await pool.query(
      "UPDATE clothes SET type = $1, color = $2, material = $3, kroj = $4, season = $5, favorite = $6 WHERE id = $7 RETURNING *",
      [type, color, material, kroj, season, favorite, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nie znaleziono ubrania" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd aktualizacji ubrania" });
  }
});

// DELETE /clothes/:id → usuwa ubranie
app.delete("/clothes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM clothes WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nie znaleziono ubrania" });
    }
    res.json({ message: "Ubranie usunięte", item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd usuwania ubrania" });
  }
});

// 🔹 Start serwera
app.listen(port, () => {
  console.log(`🚀 API działa na http://localhost:${port}`);
});

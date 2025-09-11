require("dotenv").config({ path: '../pass.env' }); // Need to install dotenv !! IMPORTANT
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Konfiguracja bazy PostgreSQL z env
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Sprawdzenie połączenia
pool.connect()
  .then(() => console.log("✅ Połączono z PostgreSQL"))
  .catch(err => console.error("❌ Błąd połączenia:", err));

// Endpoint: lista ubrań
app.get("/clothes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clothes ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// Endpoint: dodanie ubrania
app.post("/clothes", async (req, res) => {
  const { type, color, size, brand } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO clothes (type, color, size, brand) VALUES ($1, $2, $3, $4) RETURNING *",
      [type, color, size, brand]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd dodawania ubrania" });
  }
});

app.listen(port, () => {
  console.log(`🚀 API działa na http://localhost:${port}`);
});

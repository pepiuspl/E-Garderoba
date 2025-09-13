import React, { useState, useEffect } from "react";

function App() {
  const [clothes, setClothes] = useState([]);
  const [form, setForm] = useState({
    type: "",
    color: "",
    size: "",
    brand: "",
    manufaktura: ""
  });
  const [favorites, setFavorites] = useState([]);

  // Pobieranie ubrań z API
  useEffect(() => {
    fetch("http://192.168.0.50:3000/clothes")
      .then(res => res.json())
      .then(data => setClothes(data))
      .catch(err => console.error("Błąd pobierania:", err));
  }, []);

  // Obsługa formularza
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://192.168.0.50:3000/clothes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(newItem => {
        setClothes([...clothes, newItem]);
        setForm({ type: "", color: "", size: "", brand: "", manufaktura: "" });
      })
      .catch(err => console.error("Błąd dodawania:", err));
  };

  // Obsługa ulubionych
  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  // Obsługa akcji na kartach
  const ubierz = (item) => {
    alert(`Dobieram look do: ${item.type} (${item.color})`);
  };

  const pranie = (item) => {
    alert(`Dodano do prania: ${item.type} (${item.color})`);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Dashboard - E-Garderoba</h1>

      {/* Formularz dodawania */}
      <h2>Dodaj ubranie</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input name="type" placeholder="Type" value={form.type} onChange={handleChange} />
        <input name="color" placeholder="Color" value={form.color} onChange={handleChange} />
        <input name="size" placeholder="Size" value={form.size} onChange={handleChange} />
        <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
        <input name="manufaktura" placeholder="Manufaktura" value={form.manufaktura} onChange={handleChange} />
        <button type="submit">Dodaj</button>
      </form>

      {/* Siatka ubrań */}
      <h2>Lista ubrań</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px"
      }}>
        {clothes.map(item => (
          <div key={item.id} style={{
            position: "relative",
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: "12px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}>
            {/* Serduszko */}
            <div
              onClick={() => toggleFavorite(item.id)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                fontSize: "20px",
                color: favorites.includes(item.id) ? "red" : "#aaa"
              }}
            >
              {favorites.includes(item.id) ? "❤️" : "🤍"}
            </div>

            {/* Zdjęcie */}
            <img
              src="https://via.placeholder.com/150"
              alt={item.type}
              style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
            />

            {/* Opis */}
            <h3>{item.type}</h3>
            <p>Kolor: {item.color}</p>
            <p>Rozmiar: {item.size}</p>
            <p>Marka: {item.brand}</p>
            <p>Manufaktura: {item.manufaktura}</p>

            {/* Przyciski */}
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button style={{ flex: 1 }} onClick={() => ubierz(item)}>Ubierz <br> Dobierz look</button>
              <button style={{ flex: 1 }} onClick={() => pranie(item)}>Rzecz w praniu</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;

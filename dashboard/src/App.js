import React, { useState, useEffect } from "react";

function App() {
  const [clothes, setClothes] = useState([]);
  const [form, setForm] = useState({
  category: "",
  color: "",
  material: "",
  kroj: "",
  season: "",
  favorite: false,
  image: null
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

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  <select name="category" value={form.category} onChange={handleChange}>
    <option value="">-- wybierz typ --</option>
    <option value="kurtka">Kurtka</option>
    <option value="trench">Trencze</option>
    <option value="marynarka">Marynarka</option>
    <option value="jeans">Jeansy</option>
    <option value="spodnie">Spodnie</option>
    <option value="spodnica">Spódnica</option>
    <option value="koszulkaram">Koszulki na ramiączkach</option>
    <option value="tshirt">Tshirt</option>
    <option value="koszulkarekaw">Koszulka z długim rękawem</option>
    <option value="sweter">Sweter</option>
    <option value="sukienki">Sukienki</option>
    <option value="spodenki">Spodenki</option>
    <option value="bluza">Bluza</option>
  </select>
  formData.append("color", form.color);
  formData.append("material", form.material);
  formData.append("kroj", form.kroj);
  formData.append("season", form.season);
  formData.append("favorite", form.favorite);
  if (form.image) {
    formData.append("image", form.image);
  }

  try {
    const res = await fetch("http://192.168.0.50:3000/clothes", {
      method: "POST",
      body: formData
    });
    const newItem = await res.json();
    setClothes([...clothes, newItem]);
    setForm({ category: "", color: "", material: "", kroj: "", season: "", favorite:"", image: null });
  } catch (err) {
    console.error("Błąd dodawania:", err);
  }
};
  // Obsługa akcji na kartach
  const ubierz = (item) => {
    alert(`Dobieram look do: ${item.category} (${item.color})`);
  };

  const pranie = (item) => {
    alert(`Dodano do prania: ${item.category} (${item.color})`);
  };

  const toggleFavorite = (id) => {
  setFavorites(prev =>
    prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
  );
};

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Dashboard - E-Garderoba</h1>

      {/* Formularz dodawania */}
      <h2>Dodaj ubranie</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">-- wybierz typ --</option>
        <option value="kurtka">Kurtka</option>
        <option value="trench">Trencze</option>
        <option value="marynarka">Marynarka</option>
        <option value="jeans">Jeansy</option>
        <option value="spodnie">Spodnie</option>
        <option value="spodnica">Spódnica</option>
        <option value="koszulkaram">Koszulki na ramiączkach</option>
        <option value="tshirt">Tshirt</option>
        <option value="koszulkarekaw">Koszulka z długim rękawem</option>
        <option value="sweter">Sweter</option>
        <option value="sukienki">Sukienki</option>
        <option value="spodenki">Spodenki</option>
        <option value="bluza">Bluza</option>
      </select>
        <input name="color" placeholder="Color" value={form.color} onChange={handleChange} />
        <input name="material" placeholder="Material" value={form.material} onChange={handleChange} />
        <input name="kroj" placeholder="Kroj" value={form.kroj} onChange={handleChange} />
        <input name="season" placeholder="Season" value={form.season} onChange={handleChange} />
        <input name="favorite" placeholder="Favorite (true/false)" value={form.favorite} onChange={handleChange} />
        <input type="file" accept="image/*" capture="environment" onChange={(e) => setForm({ ...form, image: e.target.files[0] })}/>
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
              src={item.image_url ? `http://192.168.0.50:3000${item.image_url}` : "https://via.placeholder.com/150"}
              alt={item.category}
              style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
            />

            {/* Opis */}
            <h3>{item.category}</h3>
            <p>Kolor: {item.color}</p>
            <p>Materiał: {item.material}</p>
            <p>Krój: {item.kroj}</p>
            <p>Sezon: {item.season}</p>
            <p>Ulubione: {item.favorite ? "Tak" : "Nie"}</p>
            
            {/* Przyciski */}
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button style={{ flex: 1 }} onClick={() => ubierz(item)}>Ubierz || Dobierz look</button>
              <button style={{ flex: 1 }} onClick={() => pranie(item)}>Rzecz w praniu</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;

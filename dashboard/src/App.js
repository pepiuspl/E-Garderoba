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

  // Pobieranie ubrań z API
  useEffect(() => {
    fetch("/clothes")
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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Dashboard - E-Garderoba</h1>

      <h2>Dodaj ubranie</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input name="type" placeholder="Type" value={form.type} onChange={handleChange} />
        <input name="color" placeholder="Color" value={form.color} onChange={handleChange} />
        <input name="size" placeholder="Size" value={form.size} onChange={handleChange} />
        <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
        <input name="manufaktura" placeholder="Manufaktura" value={form.manufaktura} onChange={handleChange} />
        <button type="submit">Dodaj</button>
      </form>

      <h2>Lista ubrań</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Color</th>
            <th>Size</th>
            <th>Brand</th>
            <th>Manufaktura</th>
          </tr>
        </thead>
        <tbody>
          {clothes.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.type}</td>
              <td>{item.color}</td>
              <td>{item.size}</td>
              <td>{item.brand}</td>
              <td>{item.manufaktura}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

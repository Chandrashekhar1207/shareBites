import { useState } from "react";
import axios from "axios";

export default function Donate() {
  const [form, setForm] = useState({ donorName: "", foodItem: "", quantity: "", location: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/donate", form);
      alert("Donation submitted!");
      setForm({ donorName: "", foodItem: "", quantity: "", location: "" });
    } catch {
      alert("Error submitting donation");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Donate Food</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="donorName"
          value={form.donorName}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full border p-2"
        />
        <input
          name="foodItem"
          value={form.foodItem}
          onChange={handleChange}
          placeholder="Food Item"
          className="w-full border p-2"
        />
        <input
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity (e.g., 2 boxes, a lot)"
          className="w-full border p-2"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}

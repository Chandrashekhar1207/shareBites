import { useState, useEffect } from "react";
import axios from "axios";
export default function Claim() {
  const [form, setForm] = useState({ claimantName: "", foodItem: "", quantity: "" });
  const [foodList, setFoodList] = useState([]);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/claim", form);
      alert("Claim submitted!");
      setForm({ claimantName: "", foodItem: "", quantity: "" });
    } catch {
      alert("Error submitting claim");
    }
  };
  useEffect(() => {
    axios.get("http://localhost:5000/api/food").then(res => setFoodList(res.data));
  }, []);
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Claim Food</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="claimantName" value={form.claimantName} onChange={handleChange} placeholder="Your Name" className="w-full border p-2" />
        <input name="foodItem" value={form.foodItem} onChange={handleChange} placeholder="Food Item" className="w-full border p-2" />
        <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="w-full border p-2" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
      <h3 className="text-lg font-bold mt-6">Available Food</h3>
      <ul className="mt-2 space-y-2">
        {foodList.map(item => (
          <li key={item.id} className="border p-2 rounded">
            {item.foodItem} ({item.quantity}) from {item.donorName}
          </li>
        ))}
      </ul>
    </div>
  );
}
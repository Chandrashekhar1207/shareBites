import { useState, useEffect } from "react";
import axios from "axios";

export default function Donate() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [images, setImages] = useState([]);

  // ✅ NEW FIELDS
  const [donorName, setDonorName] = useState("");
  const [contactNo, setContactNo] = useState("");

  const [donorId, setDonorId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setDonorId(id);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      () => console.warn("Location access denied")
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!donorId) return alert("You must be logged in to donate");

    const form = new FormData();
    form.append("title", title);
    form.append("message", message);
    form.append("expiryTime", expiryTime);
    form.append("latitude", latitude);
    form.append("longitude", longitude);
    form.append("donorId", donorId);
    form.append("donorName", donorName);
    form.append("contactNo", contactNo);

    images.forEach((file) => form.append("images", file));

    try {
      await axios.post("http://localhost:5000/api/donate", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Donation submitted!");

      setTitle("");
      setMessage("");
      setExpiryTime("");
      setImages([]);
      setDonorName("");
      setContactNo("");
    } catch (err) {
      console.error(err);
      alert("Error submitting donation");
    }
  };

  if (donorId === null) {
    return <div className="p-6">Checking login status…</div>;
  }

  if (!donorId) {
    return (
      <div className="p-6 text-red-600 font-bold">
        You must be logged in to donate.
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Donate Food</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          placeholder="Your Name"
          className="w-full border p-2"
          required
        />

        <input
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value)}
          placeholder="Contact Number"
          className="w-full border p-2"
          required
        />

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Food Title"
          className="w-full border p-2"
          required
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Additional message (optional)"
          className="w-full border p-2"
        />

        <label className="block font-medium">Expiry Time</label>
        <input
          type="datetime-local"
          value={expiryTime}
          onChange={(e) => setExpiryTime(e.target.value)}
          className="w-full border p-2"
          required
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
          className="w-full border p-2"
        />

        {images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Submit Donation
        </button>
      </form>
    </div>
  );
}

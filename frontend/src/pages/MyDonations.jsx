import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyDonations() {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();
  const donorId = localStorage.getItem("userId");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/donate/my?donorId=${donorId}`)
      .then(res => setDonations(res.data))
      .catch(console.error);
  }, [donorId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Donations</h2>

      {donations.map(d => (
        <div
          key={d.id}
          className="border p-4 rounded mb-4 bg-white shadow"
        >
          <h3 className="font-semibold">{d.title}</h3>
          <p>Status: <b>{d.status}</b></p>

          {d.status === "claimed" && (
            <button
              onClick={() => navigate(`/chat/${d.id}`)}
              className="mt-2 bg-green-600 text-white px-4 py-1 rounded"
            >
              Open Chat
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

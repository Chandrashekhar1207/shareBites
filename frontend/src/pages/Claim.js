import { useState, useEffect } from "react";
import axios from "axios";

export default function Claim() {
  const [foodList, setFoodList] = useState([]);

  // Fetch available food
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/donate")
      .then((res) => {
        console.log("Donations fetched:", res.data);
        const available = res.data.filter(
          (d) => d.status === "available"
        );
        setFoodList(available);
      })
      .catch((err) => console.error("Error fetching donations:", err));
  }, []);

  const handleClaim = async (donationId) => {
    try {
      await axios.post("http://localhost:5000/api/donate/claim", {
        donationId,
        claimantId: localStorage.getItem("userId"),
      });

      alert("Food claimed successfully!");

      // Refresh list
      setFoodList((prev) =>
        prev.filter((item) => item.id !== donationId)
      );
    } catch (err) {
      console.error(err);
      alert("Error claiming food");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Available Food</h2>

      {foodList.length === 0 && (
        <p className="text-gray-500">No available food right now.</p>
      )}

      <ul className="mt-2 space-y-3">
        {foodList.map((item) => (
          <li key={item.id} className="border p-3 rounded shadow-sm">
            <h3 className="font-semibold text-lg">{item.title}</h3>

            <p className="text-sm text-gray-600">{item.message}</p>

            {/* Show Image */}
            {item.images && (
              <img
                src={JSON.parse(item.images)[0]}
                alt="food"
                className="w-32 h-32 object-cover rounded mt-2"
              />
            )}

            <p className="text-sm mt-2">
              📍 Location: ({item.latitude}, {item.longitude})
            </p>

            <button
              onClick={() => handleClaim(item.id)}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
            >
              Claim Food
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DonationDetailsModal from "../components/DonationDetailsModal";

export default function Claim() {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const navigate = useNavigate();

  // Load available donations
  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/donate");
      const available = res.data.filter(
        (d) => d.status === "available"
      );
      setDonations(available);
    } catch (err) {
      console.error("Fetch donations failed", err);
    }
  };

  // 🟢 CLAIM FOOD → REDIRECT TO PRIVATE CHAT
  const handleClaim = async (donationId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login to claim food");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/donate/claim", {
        donationId,
        claimantId: userId,
      });

      alert("Food claimed successfully!");

      // remove from UI
      setDonations((prev) =>
        prev.filter((d) => d.id !== donationId)
      );

      // 🔥 REDIRECT CLAIMER TO CHAT
      navigate(`/chat/${donationId}`);
    } catch (err) {
      console.error(err);
      alert("Error claiming food");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        Available Food for Claim
      </h2>

      {donations.length === 0 && (
        <p className="text-gray-500">
          No food available right now.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {donations.map((item) => {
          const images = item.images
            ? JSON.parse(item.images)
            : [];

          return (
            <div
              key={item.id}
              className="border rounded-xl shadow p-4 bg-white"
            >
              {/* IMAGE */}
              {images.length > 0 && (
                <img
                  src={`http://localhost:5000${images[0]}`}
                  alt="food"
                  className="h-48 w-full object-cover rounded"
                />
              )}

              <h3 className="text-lg font-semibold mt-2">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600">
                {item.message}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap gap-3 mt-4">
                {/* VIEW DETAILS */}
                <button
                  onClick={() => setSelectedDonation(item)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  View Details
                </button>

                {/* VIEW LOCATION */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  View in Map
                </a>

                {/* CLAIM */}
                <button
                  onClick={() => handleClaim(item.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Claim Food
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILS MODAL */}
      {selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
        />
      )}
    </div>
  );
}
